# TaxMate Vercel Deployment Guide

This guide provides step-by-step instructions for deploying TaxMate on Vercel with production-ready configuration.

## 📋 Prerequisites

- GitHub account with repository access
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas cluster (free tier available)
- OpenAI API key (for AI tax assistant features)

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Ensure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Using Vercel Web Dashboard

1. Go to https://vercel.com/new
2. Click "Add GitHub Org or Personal Account"
3. Authorize Vercel to access your repositories
4. Select `taxmate-backend` repository
5. Click "Import"

### 3. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
# Required Variables
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/taxmate
JWT_SECRET=<generate-secure-random-32-char-string>
OPENAI_API_KEY=sk-...

# CORS Configuration
CORS_ORIGINS=https://yourdomain.vercel.app,https://www.yourdomain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
AUTH_RATE_LIMIT_MAX_REQUESTS=20

# Database Connection Pool
MONGODB_MAX_POOL_SIZE=50
MONGODB_MIN_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=45000

# Security
FORCE_HTTPS=true
TRUST_PROXY=1

# Features
ENABLE_SWAGGER=true
OPENAI_MODEL=gpt-4o-mini
```

### 4. MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a new cluster (free tier recommended for testing)
3. Create database user with strong password
4. Whitelist Vercel IPs or use "Allow from anywhere" for development
5. Copy connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`

### 5. Deploy to Vercel

#### Automatic Deployment

Vercel automatically deploys on:
- Push to `main` branch → Production
- Push to `develop` branch → Preview
- Pull requests → Preview deployments

#### Manual Deployment

```bash
vercel --prod
```

### 6. Verify Deployment

```bash
# Check API health
curl https://your-app.vercel.app/health

# Check Swagger docs
https://your-app.vercel.app/api-docs

# Test registration endpoint
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "StrongPass1",
    "role": "client"
  }'
```

## 🔐 Security Considerations

### MongoDB IP Whitelist

⚠️ **Important**: For production, add Vercel's IP addresses to MongoDB Atlas whitelist:

1. Go to MongoDB Atlas → Network Access
2. Add IP addresses or use CIDR blocks
3. Or enable "Allow from anywhere" (not recommended for production)

### JWT Secret Generation

Generate a secure JWT secret:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([byte[]]@((1..32 | ForEach-Object {[byte](Get-Random -Max 256)})))
```

### Environment Secrets

Keep sensitive data in Vercel's Environment Variables:
- `MONGO_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`

Never commit these to Git!

## 📊 Vercel Dashboard

### Monitor Deployments

1. Go to https://vercel.com/dashboard
2. Select your project
3. View deployment logs and metrics

### View Logs

```bash
vercel logs https://your-app.vercel.app
```

### Rollback Deployment

```bash
vercel rollback
```

## 🔧 Configuration Files

### `vercel.json`

Main configuration file with:
- Build command
- Output directory
- Environment variables
- Rewrites and headers
- Deployment regions

### `.env.production.example`

Template for production environment variables (never commit secrets!)

## 🐛 Troubleshooting

### Build Fails

1. Check Vercel build logs: Dashboard → Deployments → Click deployment → Logs
2. Ensure `package.json` has all dependencies
3. Verify Node.js version >= 20.19.0

### API Returns 502 Bad Gateway

1. Check MongoDB connection: Is IP whitelisted?
2. Verify `MONGO_URI` environment variable
3. Check function timeout settings

### Cors Errors

1. Add your frontend URL to `CORS_ORIGINS` environment variable
2. Format: `https://frontend-domain.vercel.app`
3. Multiple origins: comma-separated

### Rate Limiting Issues

1. Check `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`
2. For development: increase limits temporarily
3. For production: keep strict limits for security

## 📈 Performance Optimization

### Cache Strategy

- Static assets: 1 year cache (immutable)
- API responses: no-store cache policy
- Health endpoint: no-store (checked frequently)

### Database Optimization

- Connection pooling: `MONGODB_MAX_POOL_SIZE=50`
- Server selection timeout: `MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000`
- Enable indexes in MongoDB

### Functions Configuration

```json
"functions": {
  "src/server.js": {
    "runtime": "nodejs20.x",
    "memory": 1024,
    "maxDuration": 60
  }
}
```

## 🔄 CI/CD Pipeline

### Automatic Testing

Push triggers GitHub Actions:
1. Run tests
2. Check linting
3. Build verification
4. Security scanning

### Deployment Strategy

```
main (production) ← develop (staging) ← feature branches (preview)
```

## 📱 Frontend Deployment

### Vercel Automatic Frontend Deploy

Frontend from `frontend/` directory auto-deploys when:
- `frontend/package.json` changes
- `frontend/src/**` files change
- Root `vercel.json` triggers build

### Environment Variables for Frontend

Add in frontend `vercel.json` or Vercel Dashboard:

```env
REACT_APP_API_URL=https://your-app.vercel.app
REACT_APP_API_BASE_URL=https://your-app.vercel.app
```

## 🎯 Next Steps

1. ✅ Push code to GitHub
2. ✅ Connect Vercel to GitHub repo
3. ✅ Add environment variables
4. ✅ Verify MongoDB IP whitelist
5. ✅ Deploy and test
6. ✅ Monitor logs and metrics
7. ✅ Set up custom domain

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Express.js Guide](https://expressjs.com/)
- [React Deployment](https://create-react-app.dev/deployment/)

## 💡 Pro Tips

- Use Vercel's Preview deployments for staging
- Set up automatic rollbacks on deployment failure
- Monitor API performance with Vercel Analytics
- Enable GitHub branch protection rules
- Use environment-specific configurations
- Implement health checks for monitoring
- Set up Slack/email notifications for deployments

## Support

For deployment issues:
1. Check Vercel build logs
2. Review MongoDB Atlas connection settings
3. Verify all environment variables are set
4. Check GitHub repository settings
5. Contact Vercel support if needed

---

**Last Updated**: May 13, 2026
**Framework**: Node.js + React
**Deployment**: Vercel Pro/Enterprise
