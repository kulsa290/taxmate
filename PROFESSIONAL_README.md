# TaxMate Backend API - Professional Edition

A production-grade backend API for TaxMate, an AI-powered tax calculation and management platform. Built with Express.js, MongoDB, and modern best practices.

## 🚀 Features

- **Authentication & Authorization**: JWT-based secure authentication
- **Input Validation**: Zod schema validation with comprehensive error handling
- **Security**: Helmet headers, CORS protection, rate limiting, NoSQL injection prevention
- **API Documentation**: Swagger/OpenAPI documentation with interactive UI
- **Logging**: Structured logging with request tracing
- **Error Handling**: Comprehensive global error handling with request IDs
- **Database**: MongoDB with indexes and optimized queries
- **Testing**: Jest test suite with Supertest integration
- **Code Quality**: JSDoc documentation throughout
- **Environment Management**: Flexible configuration system

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm or yarn

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd taxmate-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Configuration

See [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md) for detailed environment setup.

Create a `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taxmate-dev
JWT_SECRET=your-secure-jwt-secret-key-here
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🚀 Getting Started

### Development

```bash
# Start development server with auto-reload
npm run dev

# Server runs on http://localhost:5000
```

### Production

```bash
# Build (verify backend loads)
npm run verify:backend

# Start production server
npm start
```

### Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at: `http://localhost:5000/api-docs`

### Endpoints

#### Health Check

```bash
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Service healthy",
  "data": {
    "uptime": 3600,
    "environment": "development",
    "timestamp": "2024-04-20T10:30:00Z",
    "database": "connected"
  }
}
```

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile (requires auth)

#### Profile

- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

#### Chat

- `POST /api/chat` - Send chat message (requires auth)
- `GET /api/chat/history` - Get chat history (requires auth)

## 🔐 Security

### Best Practices Implemented

1. **HTTPS Enforcement** - Redirects HTTP to HTTPS in production
2. **Rate Limiting** - Global and endpoint-specific limits
3. **CORS Protection** - Whitelist-based origin validation
4. **Input Validation** - Zod schema validation on all inputs
5. **Data Sanitization** - XSS and NoSQL injection prevention
6. **Password Hashing** - Bcrypt with secure salt rounds
7. **JWT Tokens** - 7-day expiration with secure signing
8. **Request ID Tracing** - Unique ID for each request for debugging
9. **Helmet Headers** - Security HTTP headers

## 📊 Architecture

```
src/
├── controllers/       # Request handlers
├── middleware/        # Express middleware
├── models/           # MongoDB schemas
├── routes/           # API routes
├── schemas/          # Zod validation schemas
├── utils/            # Utility functions
├── constants/        # App constants
├── config/           # Configuration
├── __tests__/        # Test files
├── app.js            # Express app setup
└── server.js         # Server entry point
```

## 🧪 Testing

### Test Structure

```bash
src/__tests__/
├── setup.js              # Jest configuration
├── health.test.js        # Health endpoint tests
├── auth.test.js          # Auth endpoint tests
├── integration/          # Integration tests
└── unit/                 # Unit tests
```

### Running Tests

```bash
# Full test suite with coverage report
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Specific test file
npm test health.test.js
```

## 🔍 Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "requestId": "uuid-for-tracing",
  "data": null
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 📝 Logging

### Development Logging

Colored console output with request details:

```
[INFO] User logged in successfully {"userId":"...","email":"..."}
[WARN] Login attempt with wrong password {"email":"..."}
[ERROR] Database connection failed {"error":"Connection timeout"}
```

### Production Logging

Structured JSON logging for log aggregation:

```json
{
  "timestamp": "2024-04-20T10:30:00Z",
  "level": "info",
  "message": "User logged in successfully",
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com"
}
```

## 📦 Dependencies

### Production

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **zod** - Schema validation
- **joi** - Alternative validation
- **mongo-sanitize** - NoSQL injection prevention
- **xss** - XSS prevention
- **swagger-jsdoc** - API documentation
- **swagger-ui-express** - Swagger UI

### Development

- **nodemon** - Auto-reload on file changes
- **jest** - Testing framework
- **supertest** - HTTP assertion library

## 🚀 Deployment

### Render.yaml

Pre-configured deployment configuration available in [render.yaml](./render.yaml)

```bash
# Deploy to Render
git push origin main
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Issues

- Verify connection string in `.env`
- Check MongoDB is running locally or Atlas is accessible
- Ensure firewall allows connection

### Rate Limiting Issues

Adjust in `.env`:

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

## 📖 Documentation

- [Environment Configuration](./ENV_CONFIGURATION.md) - Detailed env var documentation
- [API Documentation](http://localhost:5000/api-docs) - Swagger UI (when running)
- [Production Deployment](./docs/production-deployment.md) - Production guide

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit pull request

## 📄 License

ISC License - See LICENSE file for details

## 👥 Support

For support, email support@taxmate.in or create an issue in the repository.

## 🔄 Version History

### v2.0.0 (Current)

- ✨ Production-grade code quality
- 🔒 Enhanced security with input sanitization
- 📚 Comprehensive API documentation with Swagger
- 🧪 Full test suite with Jest
- 📝 Structured logging with request tracing
- 🚀 Performance optimizations with database indexes
- 📋 JSDoc documentation throughout codebase

### v1.0.0

- Initial release
- Basic CRUD operations
- Authentication and authorization
- Chat and tax calculation endpoints

---

**Built with ❤️ by the TaxMate Team**
