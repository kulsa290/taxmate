# Environment Configurations for TaxMate

This directory contains environment-specific configuration files for different deployment stages.

## Directory Structure

```
env/
├── development.env      # Development environment (local)
├── staging.env          # Staging environment (pre-production)
├── production.env       # Production environment
└── test.env             # Testing environment
```

## Configuration Profiles

### Development (development.env)
- **Purpose**: Local development with hot reload
- **Database**: Local MongoDB or development instance
- **Features**: Enhanced logging, detailed error messages
- **Security**: Relaxed CORS, debug mode enabled

### Staging (staging.env)
- **Purpose**: Pre-production testing, mirrors production
- **Database**: Staging MongoDB cluster
- **Features**: Production-like configuration with testing capabilities
- **Security**: Production security settings, test data

### Production (production.env)
- **Purpose**: Live production environment
- **Database**: Production MongoDB Atlas cluster
- **Features**: Optimized performance, minimal logging
- **Security**: Strict CORS, helmet enabled, rate limiting

### Test (test.env)
- **Purpose**: Automated testing and CI/CD
- **Database**: In-memory MongoDB or test instance
- **Features**: Mock external services, deterministic outputs
- **Security**: Test credentials, mock authentication

## Usage

### Local Development
```bash
cp env/development.env .env
npm run dev
```

### Deployment to Staging
```bash
export ENV=staging
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

### Deployment to Production
```bash
export ENV=production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Environment Variables

See `ENV_CONFIGURATION.md` for complete variable documentation.

## Security Notes

- ⚠️ Never commit `.env` files with real secrets
- Use GitHub Secrets for CI/CD deployments
- Rotate credentials regularly
- Use separate API keys for each environment
- Enable audit logging in production
