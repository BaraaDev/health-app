# Testing Guide

This guide covers testing strategies and best practices for Health App.

## Testing Strategy

Health App uses a comprehensive testing approach:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **End-to-End Tests**: Test complete user workflows
- **Visual Regression Tests**: Test UI consistency

## Test Setup

### Prerequisites

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=User.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create user"
```

## Test Structure

```
tests/
├── __mocks__/           # Mock files
├── components/          # Component tests
├── api/                 # API endpoint tests
├── lib/                 # Utility function tests
├── models/              # Database model tests
└── integration/         # Integration tests
```

## Unit Tests

### Component Testing

Test React components using React Testing Library:

```typescript
// tests/components/LanguageToggle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

describe('LanguageToggle', () => {
  it('should toggle language when clicked', () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('العربية');

    fireEvent.click(button);
    expect(button).toHaveTextContent('English');
  });
});
```

### API Testing

Test API endpoints using Jest and Supertest:

```typescript
// tests/api/auth.test.ts
import request from 'supertest';
import { createServer } from '@/lib/test-server';
import { connectTestDB, clearTestDB, closeTestDB } from '@/lib/test-db';

describe('Auth API', () => {
  let server: any;

  beforeAll(async () => {
    await connectTestDB();
    server = createServer();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        role: 'patient'
      };

      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+1234567890',
        role: 'patient'
      };

      // Create first user
      await request(server)
        .post('/api/auth/register')
        .send(userData);

      // Try to create duplicate
      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe('User already exists');
    });
  });
});
```

### Model Testing

Test database models:

```typescript
// tests/models/User.test.ts
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import { connectTestDB, clearTestDB, closeTestDB } from '@/lib/test-db';

describe('User Model', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create a user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'patient'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).not.toBe(userData.password); // Should be hashed
  });

  it('should validate required fields', async () => {
    const user = new User({});

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
});
```

## Integration Tests

### Database Integration

```typescript
// tests/integration/visit.test.ts
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import Visit from '@/lib/models/Visit';
import { connectTestDB, clearTestDB, closeTestDB } from '@/lib/test-db';

describe('Visit Integration', () => {
  let patient: any;
  let doctor: any;

  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Create test users
    patient = await User.create({
      name: 'John Patient',
      email: 'patient@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'patient'
    });

    doctor = await User.create({
      name: 'Dr. Smith',
      email: 'doctor@example.com',
      password: 'password123',
      phone: '+1234567891',
      role: 'doctor',
      specialization: 'Cardiology'
    });
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should create visit and update total amount', async () => {
    const visit = await Visit.create({
      patient: patient._id,
      doctor: doctor._id,
      date: new Date('2024-01-15'),
      time: '10:00',
      status: 'confirmed'
    });

    expect(visit.patient.toString()).toBe(patient._id.toString());
    expect(visit.doctor.toString()).toBe(doctor._id.toString());
    expect(visit.status).toBe('confirmed');
  });
});
```

## Test Utilities

### Test Database Setup

```typescript
// lib/test-db.ts
import mongoose from 'mongoose';

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/health-app-test';

export async function connectTestDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(TEST_MONGODB_URI);
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

export async function closeTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}
```

### Test Server Setup

```typescript
// lib/test-server.ts
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

export function createServer() {
  return new Promise((resolve) => {
    app.prepare().then(() => {
      const server = createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url!, true);
          await handle(req, res, parsedUrl);
        } catch (err) {
          console.error('Error occurred handling', req.url, err);
          res.statusCode = 500;
          res.end('internal server error');
        }
      });

      server.listen(0, () => {
        resolve(server);
      });
    });
  });
}
```

## Mocking

### API Mocks

```typescript
// __mocks__/fetch.ts
global.fetch = jest.fn();

export const mockFetch = (response: any) => {
  (fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => response,
  });
};

export const mockFetchError = (error: string) => {
  (fetch as jest.Mock).mockRejectedValue(new Error(error));
};
```

### Database Mocks

```typescript
// __mocks__/mongoose.ts
export const mockUser = {
  _id: 'user-id',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  role: 'patient',
  comparePassword: jest.fn().mockResolvedValue(true)
};

export const mockVisit = {
  _id: 'visit-id',
  patient: 'patient-id',
  doctor: 'doctor-id',
  date: new Date('2024-01-15'),
  time: '10:00',
  status: 'confirmed',
  totalAmount: 150
};
```

## Test Coverage

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

## Performance Testing

### Load Testing

```typescript
// tests/performance/load.test.ts
import autocannon from 'autocannon';

describe('Performance Tests', () => {
  it('should handle concurrent requests', async () => {
    const result = await autocannon({
      url: 'http://localhost:3000/api/visits',
      connections: 10,
      duration: 10,
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.latency.p99).toBeLessThan(1000); // 1 second
  });
});
```

## Visual Testing

### Screenshot Testing

```typescript
// tests/visual/screenshots.test.ts
import puppeteer from 'puppeteer';

describe('Visual Tests', () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should match login page screenshot', async () => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('form');
    
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
      
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** and isolated
5. **Clean up after tests** to avoid side effects

### Test Data

1. **Use factories** for creating test data
2. **Avoid hardcoded values** in tests
3. **Use realistic data** that matches production
4. **Clean up test data** after each test

### Assertions

1. **Test one thing at a time**
2. **Use specific assertions** rather than generic ones
3. **Test both success and failure cases**
4. **Verify error messages** and status codes

### Performance

1. **Mock external dependencies** to speed up tests
2. **Use test databases** separate from development
3. **Run tests in parallel** when possible
4. **Monitor test execution time**

## Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug specific test
npm test -- --testNamePattern="should create user" --verbose
```

### Common Issues

1. **Database connection issues**: Ensure test database is running
2. **Async test failures**: Use proper async/await or done callback
3. **Mock issues**: Verify mocks are properly set up
4. **Environment variables**: Set required test environment variables

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Puppeteer](https://pptr.dev/)
- [Autocannon](https://github.com/mcollina/autocannon) 