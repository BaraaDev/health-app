# Deployment Guide

This guide provides instructions for deploying Health App to various platforms.

## Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** installed
- **MongoDB database** set up and accessible
- **Environment variables** configured
- **Domain name** (optional but recommended)

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file (for local development) or set these in your deployment platform:

```env
# Database
MONGODB_URI=mongodb://your-mongodb-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Application
NODE_ENV=production
```

### Optional Environment Variables

```env
# External Services (if needed)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (if needed)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Import your Health App repository

#### 2. Configure Environment Variables

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all required environment variables
4. Set `NODE_ENV=production`

#### 3. Deploy

1. Vercel will automatically deploy on every push to main branch
2. For manual deployment, push to main or use Vercel CLI

#### 4. Custom Domain (Optional)

1. Go to "Domains" in project settings
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify

#### 1. Build Settings

Configure build settings in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically or manually

### Railway

#### 1. Connect Repository

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will auto-detect Next.js

#### 2. Environment Variables

1. Add environment variables in Railway dashboard
2. Set `NODE_ENV=production`

#### 3. Deploy

Railway will automatically deploy on every push to main branch.

### DigitalOcean App Platform

#### 1. Create App

1. Go to DigitalOcean App Platform
2. Connect your repository
3. Select Node.js as the environment

#### 2. Configure Build

```yaml
# .do/app.yaml
name: health-app
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/health-app
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

#### 3. Environment Variables

Add environment variables in the DigitalOcean dashboard.

### AWS Amplify

#### 1. Connect Repository

1. Go to AWS Amplify Console
2. Connect your repository
3. Configure build settings

#### 2. Build Settings

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free or paid cluster
   - Choose your preferred cloud provider and region

2. **Configure Network Access**
   - Add your deployment platform's IP addresses
   - Or allow access from anywhere (0.0.0.0/0) for development

3. **Create Database User**
   - Create a database user with read/write permissions
   - Use a strong password

4. **Get Connection String**
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Set as `MONGODB_URI` environment variable

### Local MongoDB (Development Only)

```bash
# Install MongoDB locally
# macOS with Homebrew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/health-app
```

## SSL/HTTPS Configuration

### Vercel
- SSL is automatically configured
- Custom domains get SSL certificates automatically

### Other Platforms
- Most platforms provide automatic SSL
- For custom domains, configure SSL certificates in your platform's dashboard

## Performance Optimization

### Build Optimization

1. **Enable Compression**
   ```javascript
   // next.config.js
   const nextConfig = {
     compress: true,
     // ... other config
   };
   ```

2. **Optimize Images**
   ```javascript
   // next.config.js
   const nextConfig = {
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif'],
     },
   };
   ```

### Database Optimization

1. **Create Indexes**
   ```javascript
   // In your models
   userSchema.index({ email: 1 });
   visitSchema.index({ patient: 1, date: 1 });
   ```

2. **Connection Pooling**
   ```javascript
   // lib/db.ts
   const options = {
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
   };
   ```

## Monitoring and Logging

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and errors

### Custom Monitoring
```javascript
// Add to your API routes
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Your API logic
    const result = await yourLogic();
    
    // Log success
    console.log(`API call completed in ${Date.now() - startTime}ms`);
    return NextResponse.json(result);
  } catch (error) {
    // Log error
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

## Backup Strategy

### Database Backups
- MongoDB Atlas provides automatic backups
- For self-hosted MongoDB, set up regular backups

### Code Backups
- Use Git for version control
- Regular commits and pushes
- Consider using GitHub Actions for automated deployments

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database is running

3. **Environment Variables**
   - Verify all required variables are set
   - Check variable names and values
   - Restart deployment after adding variables

### Debug Mode

For debugging, temporarily set:
```env
NODE_ENV=development
DEBUG=*
```

## Security Checklist

- [ ] Environment variables are set and secure
- [ ] HTTPS is enabled
- [ ] Database access is restricted
- [ ] JWT secret is strong and unique
- [ ] Dependencies are up to date
- [ ] Error messages don't expose sensitive information
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (if needed)

## Support

If you encounter issues during deployment:

1. Check the platform's documentation
2. Review error logs
3. Verify environment configuration
4. Contact platform support if needed

For Health App specific issues, create an issue in the GitHub repository. 