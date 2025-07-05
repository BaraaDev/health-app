# API Documentation

This document provides comprehensive documentation for the Health App API endpoints.

## Base URL

All API endpoints are relative to `/api/`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "message": "Success message",
  "data": { ... },
  "error": "Error message (if applicable)"
}
```

## Error Responses

Standard error responses:

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Authentication Endpoints

### POST /api/auth/login

Authenticate a user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "role": "patient",
    "specialization": "Cardiology"
  }
}
```

### POST /api/auth/register

Register a new user.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "patient",
  "specialization": "Cardiology"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "role": "patient",
    "specialization": "Cardiology"
  }
}
```

---

## Visit Management

### GET /api/visits

Get all visits with optional filtering.

**Query Parameters:**
- `doctorName` (string) - Filter by doctor name
- `patientName` (string) - Filter by patient name
- `visitId` (string) - Get specific visit by ID
- `status` (string) - Filter by status (pending, confirmed, completed, cancelled)

**Response:**
```json
{
  "visits": [
    {
      "_id": "visit-id",
      "patient": {
        "_id": "patient-id",
        "name": "Patient Name",
        "email": "patient@example.com"
      },
      "doctor": {
        "_id": "doctor-id",
        "name": "Doctor Name",
        "email": "doctor@example.com",
        "specialization": "Cardiology"
      },
      "date": "2024-01-15T10:00:00.000Z",
      "time": "10:00",
      "status": "confirmed",
      "notes": "Patient notes",
      "totalAmount": 150.00,
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

### POST /api/visits

Create a new visit/appointment.

**Request Body:**
```json
{
  "patientId": "patient-id",
  "doctorId": "doctor-id",
  "date": "2024-01-15T10:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "visit": {
    "_id": "visit-id",
    "patient": { ... },
    "doctor": { ... },
    "date": "2024-01-15T10:00:00.000Z",
    "status": "scheduled",
    "totalAmount": 0
  }
}
```

### PUT /api/visits/[id]

Update a specific visit.

**Request Body:**
```json
{
  "status": "completed",
  "symptoms": "Patient symptoms",
  "diagnosis": "Medical diagnosis",
  "notes": "Doctor notes"
}
```

**Response:**
```json
{
  "message": "Visit updated successfully",
  "visit": {
    "_id": "visit-id",
    "status": "completed",
    "symptoms": "Patient symptoms",
    "diagnosis": "Medical diagnosis",
    "notes": "Doctor notes",
    "patient": { ... },
    "doctor": { ... }
  }
}
```

### GET /api/visits/[id]

Get a specific visit by ID.

**Response:**
```json
{
  "visit": {
    "_id": "visit-id",
    "patient": { ... },
    "doctor": { ... },
    "date": "2024-01-15T10:00:00.000Z",
    "status": "confirmed",
    "notes": "Visit notes",
    "totalAmount": 150.00
  }
}
```

---

## Treatment Management

### GET /api/treatments

Get treatments for a specific visit.

**Query Parameters:**
- `visitId` (string, required) - Visit ID to get treatments for

**Response:**
```json
{
  "treatments": [
    {
      "_id": "treatment-id",
      "visit": "visit-id",
      "name": "Treatment Name",
      "description": "Treatment description",
      "price": 50.00,
      "quantity": 2,
      "totalPrice": 100.00,
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

### POST /api/treatments

Add a new treatment to a visit.

**Request Body:**
```json
{
  "visitId": "visit-id",
  "name": "Treatment Name",
  "description": "Treatment description",
  "price": 50.00,
  "quantity": 2
}
```

**Response:**
```json
{
  "message": "Treatment added successfully",
  "treatment": {
    "_id": "treatment-id",
    "visit": "visit-id",
    "name": "Treatment Name",
    "description": "Treatment description",
    "price": 50.00,
    "quantity": 2,
    "totalPrice": 100.00
  },
  "totalAmount": 150.00
}
```

### PUT /api/treatments/[id]

Update a specific treatment.

**Request Body:**
```json
{
  "name": "Updated Treatment Name",
  "description": "Updated description",
  "price": 75.00,
  "quantity": 1
}
```

**Response:**
```json
{
  "message": "Treatment updated successfully",
  "treatment": {
    "_id": "treatment-id",
    "name": "Updated Treatment Name",
    "description": "Updated description",
    "price": 75.00,
    "quantity": 1,
    "totalPrice": 75.00
  },
  "totalAmount": 125.00
}
```

### DELETE /api/treatments/[id]

Delete a specific treatment.

**Response:**
```json
{
  "message": "Treatment deleted successfully",
  "totalAmount": 50.00
}
```

### GET /api/treatments/[id]

Get a specific treatment by ID.

**Response:**
```json
{
  "treatment": {
    "_id": "treatment-id",
    "visit": "visit-id",
    "name": "Treatment Name",
    "description": "Treatment description",
    "price": 50.00,
    "quantity": 2,
    "totalPrice": 100.00
  }
}
```

---

## User Management

### GET /api/users

Get all users with optional filtering.

**Query Parameters:**
- `userType` (string) - Filter by user type (patient, doctor, finance)
- `search` (string) - Search by name or email

**Response:**
```json
{
  "users": [
    {
      "_id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "phone": "+1234567890",
      "role": "doctor",
      "specialization": "Cardiology",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/users/[id]

Get a specific user by ID.

**Response:**
```json
{
  "user": {
    "_id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+1234567890",
    "role": "doctor",
    "specialization": "Cardiology",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Data Models

### User Model
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // Hashed
  phone: string;
  role: 'patient' | 'doctor' | 'finance';
  specialization?: string; // For doctors only
  createdAt: Date;
  updatedAt: Date;
}
```

### Visit Model
```typescript
interface Visit {
  _id: string;
  patient: ObjectId | User;
  doctor: ObjectId | User;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Treatment Model
```typescript
interface Treatment {
  _id: string;
  visit: ObjectId | Visit;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  totalPrice: number; // Calculated automatically
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Handling

### Validation Errors
When validation fails, the API returns detailed error messages:

```json
{
  "error": "Validation failed",
  "details": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

### Database Errors
Common database errors and their meanings:

- `11000` - Duplicate key error (e.g., email already exists)
- `ValidationError` - Mongoose validation failed
- `CastError` - Invalid ObjectId format

### Network Errors
For network-related issues:

```json
{
  "error": "Server error",
  "message": "Internal server error occurred"
}
```

---

## Rate Limiting

API endpoints are subject to rate limiting to prevent abuse. Limits are:

- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute

When rate limit is exceeded:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Testing

You can test the API using tools like:

- **Postman** - For manual testing
- **curl** - For command line testing
- **Jest** - For automated testing

Example curl command:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

For more testing examples, see [TESTING.md](./TESTING.md). 