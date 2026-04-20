# Environment Configuration Guide

This document outlines all environment variables used by the TaxMate Backend application.

## Overview

The TaxMate Backend uses environment variables for configuration management across different deployment environments (development, staging, production).

## Required Variables

### Application Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Runtime environment | `development`, `staging`, `production` | Yes |
| `PORT` | Server port | `5000` | No (default: 5000) |

### Database Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://user:pass@host:27017/dbname` | Yes |

### JWT Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-min-32-chars` | Yes |

### CORS Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:3000,https://app.taxmate.in` | No (defaults provided) |

### Rate Limiting Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 min) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `300` | No |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | Max auth attempts per window | `5` | No |

### Security Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `TRUST_PROXY` | Trust proxy headers | `true`, `false`, or number | No (default: 1) |
| `FORCE_HTTPS` | Redirect HTTP to HTTPS in production | `true`, `false` | No |

### Body Size Limits

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `JSON_BODY_LIMIT` | Max JSON body size | `10kb`, `1mb` | No (default: 10kb) |

### Documentation

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `ENABLE_SWAGGER` | Enable Swagger UI in production | `true`, `false` | No |

## Development Setup

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/taxmate-dev

# JWT
JWT_SECRET=dev-secret-key-minimum-32-characters-long

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
DEBUG=true
```

## Staging Setup

```env
# Application
NODE_ENV=staging
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taxmate-staging

# JWT
JWT_SECRET=staging-secret-key-very-secure-random-string

# CORS
CORS_ORIGINS=https://staging-app.taxmate.in

# Security
TRUST_PROXY=true
FORCE_HTTPS=true
```

## Production Setup

```env
# Application
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taxmate-prod

# JWT
JWT_SECRET=production-secret-key-very-very-secure-random-string

# CORS
CORS_ORIGINS=https://app.taxmate.in,https://www.taxmate.in

# Security
TRUST_PROXY=true
FORCE_HTTPS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Documentation
ENABLE_SWAGGER=false
```

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters, random string
3. **Enable HTTPS in production** - Set `FORCE_HTTPS=true`
4. **Rotate secrets regularly** - Change JWT_SECRET periodically
5. **Use environment-specific configurations** - Different values per environment
6. **Secure database credentials** - Use managed MongoDB Atlas or similar
7. **Monitor rate limits** - Adjust based on actual usage patterns

## Validation

All environment variables are validated on application startup. The app will exit if required variables are missing.

## Examples

### Local Development

```bash
NODE_ENV=development \
PORT=5000 \
MONGODB_URI=mongodb://localhost:27017/taxmate-dev \
JWT_SECRET=dev-secret-123-456-789-abc-def-ghi \
npm run dev
```

### Docker Deployment

```bash
docker run \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db \
  -e JWT_SECRET=your-secure-secret \
  -p 5000:5000 \
  taxmate-backend:latest
```

## Troubleshooting

- **"JWT secret is not configured"** - Set `JWT_SECRET` environment variable
- **"Cannot connect to MongoDB"** - Check `MONGODB_URI` and network connectivity
- **"CORS error"** - Verify frontend URL is in `CORS_ORIGINS`
- **"Too many requests"** - Adjust `RATE_LIMIT_MAX_REQUESTS` or `RATE_LIMIT_WINDOW_MS`
