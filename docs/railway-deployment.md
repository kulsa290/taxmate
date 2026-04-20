# Railway Configuration for TaxMate

This guide covers deploying TaxMate to Railway.app using Docker.

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository connected to Railway
- MongoDB Atlas database (or Railway's built-in database)

## Quick Setup

### 1. Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your TaxMate repository
5. Railway will automatically detect your Dockerfile

### 2. Configure Environment Variables

In your Railway project dashboard:

1. Go to **Variables** tab
2. Add these environment variables:

```env
NODE_ENV=production
PORT=8080
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secure-jwt-secret
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGINS=https://your-frontend-domain.com
```

### 3. Deploy

Railway will automatically deploy when you push to your main branch.

## Detailed Setup Guide

### Step 1: Railway Project Setup

1. **Create New Project:**
   - Visit https://railway.app/new
   - Choose "Deploy from GitHub repo"
   - Connect your GitHub account and select repository

2. **Project Configuration:**
   - Railway automatically detects your Dockerfile
   - Build context: `/` (root directory)
   - Build command: Uses Dockerfile

### Step 2: Database Setup

**Option A: MongoDB Atlas (Recommended)**
1. Create MongoDB Atlas cluster
2. Get connection string
3. Add to Railway environment variables

**Option B: Railway Database**
1. Add MongoDB plugin in Railway dashboard
2. Use Railway's internal database URL
3. Update MONGO_URI accordingly

### Step 3: Environment Variables

Set these in Railway > Variables:

```env
# Application
NODE_ENV=production
PORT=8080

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taxmate-prod

# Security
JWT_SECRET=your-64-character-secret-key-here
OPENAI_API_KEY=your-openai-api-key

# CORS (update with your frontend URL)
CORS_ORIGINS=https://your-frontend-domain.com
```

### Step 4: Domain Configuration

1. Go to Railway > Settings > Domains
2. Add custom domain or use Railway's generated domain
3. Update CORS_ORIGINS if using custom domain

## Deployment Process

### Automatic Deployment

Railway automatically deploys on every push to main branch:

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### Manual Deployment

Use Railway dashboard or CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway deploy
```

## Monitoring & Logs

### View Logs

```bash
# Railway CLI
railway logs

# Or use Railway dashboard > Deployments > View Logs
```

### Health Checks

Railway automatically monitors your app. Check:
- Railway dashboard > Deployments
- Application health at `https://your-app.railway.app/health`

## Scaling

### Horizontal Scaling

1. Go to Railway > Settings > Scaling
2. Increase instance count
3. Railway handles load balancing automatically

### Vertical Scaling

1. Upgrade Railway plan for more resources
2. Increase RAM/CPU in service settings

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json
   - Check build logs in Railway dashboard

2. **Runtime Errors:**
   - Check environment variables
   - Verify database connectivity
   - Check application logs

3. **Port Issues:**
   - Railway uses PORT environment variable
   - Default Railway port is 8080

### Debug Commands

```bash
# Check Railway project
railway status

# View environment variables
railway variables

# Connect to database (if using Railway DB)
railway connect
```

## Cost Optimization

### Free Tier Limits
- 512MB RAM
- 1GB disk
- Limited bandwidth

### Upgrade Considerations
- Start with Hobby plan ($5/month)
- Upgrade to Pro ($10/month) for more resources
- Monitor usage in Railway dashboard

## Security Best Practices

1. **Environment Variables:**
   - Never commit secrets to Git
   - Use Railway's variable system
   - Rotate secrets regularly

2. **Database Security:**
   - Use MongoDB Atlas with IP whitelisting
   - Enable database authentication
   - Use strong passwords

3. **Application Security:**
   - Keep dependencies updated
   - Use HTTPS (Railway provides SSL)
   - Implement proper CORS settings

## Integration with CI/CD

### GitHub Actions

Railway works seamlessly with GitHub. No additional CI/CD needed:

```yaml
# .github/workflows/deploy.yml (optional)
name: Deploy to Railway
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: echo "Railway handles deployment automatically"
```

## Migration from Other Platforms

### From Render

1. Export data from Render database
2. Import to MongoDB Atlas or Railway DB
3. Update environment variables
4. Deploy to Railway
5. Update DNS if using custom domain

### From Heroku

1. Export Heroku database
2. Import to new database
3. Set environment variables in Railway
4. Deploy and test
5. Update domain DNS

## Support

- **Railway Docs:** https://docs.railway.app/
- **Community:** https://discord.gg/railway
- **Status:** https://railway.app/status

## Railway vs Other Platforms

| Feature | Railway | Render | Heroku |
|---------|---------|--------|--------|
| Docker Support | ✅ Excellent | ✅ Good | ⚠️ Limited |
| Pricing | 💰 Competitive | 💰 Good | 💰 Expensive |
| Scaling | ✅ Easy | ✅ Good | ✅ Good |
| Database | 🗄️ Built-in | ❌ External | 🗄️ Add-ons |
| GitHub Integration | ✅ Seamless | ✅ Good | ✅ Good |
| Free Tier | ✅ Generous | ✅ Good | ⚠️ Limited |

Railway is excellent for Docker-based applications and provides great GitHub integration with automatic deployments.