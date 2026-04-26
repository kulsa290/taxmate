# TaxMate Backend - Agent Guidelines

TaxMate is a **full-stack tax management platform** for Indian users combining React frontend + Node.js/Express backend with MongoDB, OpenAI AI assistance, JWT authentication, and comprehensive DevOps infrastructure.

## Architecture

The backend follows a **three-tier MVC pattern with middleware layers**:

- **Controllers** ([`src/controllers/`](src/controllers/)) contain business logic; receive requests, validate via Zod schemas, execute logic, return standardized responses
- **Routes** ([`src/routes/`](src/routes/)) map HTTP endpoints to controllers with middleware chains (auth, validation)
- **Models** ([`src/models/`](src/models/)) define MongoDB/Mongoose schemas (User, TaxCalculation, Chat, Profile, Client)
- **Middleware Stack**: Request ID → Compression → CORS → Security (Helmet, rate limiting) → Logging → Route middleware → Error handling
- **Utilities**: `AppError` (custom errors), `apiResponse` (response formatter), `logger` (structured logging)
- **Validation**: Zod schemas ([`src/schemas/validationSchemas.js`](src/schemas/validationSchemas.js)) validate input before reaching controllers
- **Constants**: [`src/constants/config.js`](src/constants/config.js) centralizes HTTP status codes, JWT settings, validation rules

**Entry Point**: [`src/server.js`](src/server.js) → [`src/app.js`](src/app.js). Server starts with graceful shutdown and connects to MongoDB asynchronously.

Frontend code is in [`frontend/`](frontend/) (React with Tailwind CSS). Repository uses Git Flow branches: `main`, `develop`, `feature/*`, `bugfix/*`, `hotfix/*`.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js ≥ 20.19.0 (CommonJS) |
| **Framework** | Express.js 5.2.1 |
| **Database** | MongoDB 9.4.1 (Mongoose ODM) with connection pooling |
| **Auth** | JWT (jsonwebtoken 9.0.3) + bcryptjs password hashing |
| **Validation** | Zod 4.3.6 with detailed error messages |
| **Security** | Helmet 8.1.0, rate-limiting, mongo-sanitize, XSS prevention |
| **API Docs** | Swagger/OpenAPI via swagger-jsdoc and swagger-ui-express |
| **Testing** | Jest 30.3.0 + Supertest 7.2.2 |
| **Logging** | morgan (HTTP) + custom structured logger |
| **Dev** | nodemon for hot reload; ESLint for linting |

Access live Swagger docs at `http://localhost:5000/api-docs` when server is running.

## Build, Test, Run

### Essential Commands

```bash
# Development with auto-reload
npm run dev                    # Port 5000

# Production
npm start                      # Requires NODE_ENV=production

# Testing
npm test                       # Full suite + coverage
npm run test:watch            # Watch mode
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests only

# Verification
npm run verify:backend        # Verify app loads

# Docker
npm run docker:dev            # Dev Docker environment
npm run docker:prod           # Production Docker deployment
```

**Note**: Tests are located in [`src/__tests__/`](src/__tests__/); health check test is in [`src/__tests__/health.test.js`](src/__tests__/health.test.js).

### CI/CD Workflows

Five GitHub workflows in [`.github/workflows/`](.github/workflows/):
1. **ci.yml** - Tests, coverage, linting on every PR
2. **performance.yml** - Load & stress testing
3. **backup.yml** - Automated database backups
4. **deploy-multi-env.yml** - Multi-environment deployment (dev/staging/prod)
5. **security.yml** - SAST, DAST, dependency scanning

## Code Style & Key Patterns

### Response Format
All successful responses use standardized format:
```javascript
// Good: Use sendSuccess utility
res.status(200).json({
  success: true,
  message: "Operation successful",
  data: { /* payload */ }
});

// Errors use AppError
throw new AppError("Invalid input", 400);
```

### Error Handling
- **Custom `AppError` class** with statusCode; global error middleware catches all errors
- **MongoDB-specific errors** (validation, duplicate keys) handled specially with descriptive messages
- **Request IDs**: UUID on every request for tracing through logs (middleware in [src/middleware/requestIdMiddleware.js](src/middleware/requestIdMiddleware.js))

### Input Validation
- **Route-level validation middleware** validates against Zod schemas
- **Validation failures** automatically return 400 with structured errors
- **Schema definitions**: [src/schemas/validationSchemas.js](src/schemas/validationSchemas.js) has all validation rules

### Authentication
- **JWT in Authorization header**: `Bearer <token>`
- **Auth middleware** ([src/middleware/authMiddleware.js](src/middleware/authMiddleware.js)) provides `req.user` with decoded payload
- **Separate middleware**: `required` (rejects unauthenticated) vs `optional` (allows anonymous)

### Logging
- **Structured JSON logging** in production; colored output in development
- **All operations logged** with userId, requestId, error details
- **Logger utility**: [src/utils/logger.js](src/utils/logger.js)

### Rate Limiting
- **Global**: 300 requests / 15 minutes
- **Auth endpoints**: 5 requests / 15 minutes (stricter)
- Returns 429 with structured error

### JSDoc Documentation
All functions, controllers, and routes have complete JSDoc comments with:
- Parameter types and descriptions
- Return types and examples
- Error codes and conditions
- Use cases

## Configuration & Environment

See detailed docs in [ENV_CONFIGURATION.md](ENV_CONFIGURATION.md) and [env/README.md](env/README.md) for exhaustive variable list.

### Required Variables
```env
NODE_ENV=development                          # development|staging|production
MONGO_URI=mongodb://localhost:27017/taxmate   # Connection string
JWT_SECRET=your-secure-key-here               # ≥32 chars recommended
```

### Optional (with sensible defaults)
```env
PORT=5000                                     # Server port
CORS_ORIGINS=http://localhost:3000           # Comma-separated origins
RATE_LIMIT_WINDOW_MS=900000                  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=300
MONGODB_MAX_POOL_SIZE=20
MONGODB_MIN_POOL_SIZE=5
```

### ⚠️ Windows/DNS Gotcha
**Atlas SRV URIs fail on Windows** with `querySrv ECONNREFUSED` even when PowerShell DNS resolves correctly.

**Workaround**: Use direct replica-set URI instead:
```env
# ❌ Don't use (fails on Windows):
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# ✅ Use direct connection (always works):
MONGO_URI=mongodb://user:pass@host1:27017,host2:27017,host3:27017/db?replicaSet=rs0
```

### Secrets Management
In production, store `JWT_SECRET` and `MONGO_URI` in environment vaults, not `.env` files.

Helper scripts: [scripts/setup-github-secrets.sh](scripts/setup-github-secrets.sh) and [setup-github-secrets.ps1](scripts/setup-github-secrets.ps1) for GitHub Actions.

## Documentation

- **[PROFESSIONAL_README.md](PROFESSIONAL_README.md)** - Complete project overview with API endpoints
- **[ENV_CONFIGURATION.md](ENV_CONFIGURATION.md)** - Environment variables table with examples
- **[DEVOPS_GUIDE.md](DEVOPS_GUIDE.md)** - Infrastructure, deployment, monitoring, security
- **[env/README.md](env/README.md)** - Multi-environment (dev/staging/prod) configuration
- **Swagger API Docs** - Interactive at `/api-docs` endpoint; defined via JSDoc comments in controllers
- **Database Backup/Restore**: [scripts/backup-database.sh](scripts/backup-database.sh), [scripts/restore-database.sh](scripts/restore-database.sh)
- **Deployment Scripts**: [deploy.sh](deploy.sh), [railway-setup.sh](railway-setup.sh), [setup-deployment.sh](setup-deployment.sh)

## Quick File Reference

| File/Folder | Purpose |
|-------------|---------|
| [`src/app.js`](src/app.js) | Express app initialization, middleware stack |
| [`src/server.js`](src/server.js) | Server startup, MongoDB connection, graceful shutdown |
| [`src/config/db.js`](src/config/db.js) | MongoDB connection logic with retry |
| [`src/constants/config.js`](src/constants/config.js) | HTTP status codes, JWT settings, validation rules |
| [`src/schemas/validationSchemas.js`](src/schemas/validationSchemas.js) | All Zod validation schemas |
| [`src/utils/appError.js`](src/utils/appError.js) | Custom error class with statusCode |
| [`src/utils/apiResponse.js`](src/utils/apiResponse.js) | Response formatter utility |
| [`src/utils/logger.js`](src/utils/logger.js) | Structured logging utility |
| [`src/middleware/`](src/middleware/) | Auth, validation, error handling, request ID middleware |
| [`.github/workflows/`](.github/workflows/) | 5 CI/CD workflows for testing, deployment, security |
| [`docker-compose.yml`](docker-compose.yml) | Local Docker dev environment |
| [`Dockerfile`](Dockerfile) | Production backend container |

## When Starting a Task

1. **Understand the request** - Read any related issues or documentation first
2. **Check for existing patterns** - Look at similar controllers/routes before writing new code
3. **Follow validation-first approach** - Add Zod schema before implementing controller logic
4. **Add JSDoc comments** - Document all functions with parameters, return types, error codes
5. **Write tests** - Add unit or integration tests in [`src/__tests__/`](src/__tests__/) following existing patterns
6. **Run the full test suite** - `npm test` before committing
7. **Check logs in structured format** - Development logs are colored; production logs are JSON

## MongoDB Indexes
The User model has optimized indexes:
- `email` (unique)
- `name` (for search performance)
- `createdAt`, `updatedAt` (for filtering by date range)

When adding new models, add appropriate indexes for frequently queried fields.
