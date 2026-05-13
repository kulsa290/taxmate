# Vercel Deployment Checklist ✅

Use this checklist to ensure your TaxMate application is properly configured and deployed on Vercel Pro/Enterprise.

## Pre-Deployment Setup

- [ ] Code is committed and pushed to GitHub main branch
- [ ] All dependencies are in `package.json`
- [ ] Frontend is in `frontend/` directory
- [ ] Backend `.env.example` file exists with all required variables
- [ ] MongoDB Atlas cluster is created and running
- [ ] OpenAI API key is available

## GitHub Repository Setup

- [ ] Repository is public or private (Vercel has access)
- [ ] Branch protection rules are configured (optional)
- [ ] GitHub Actions workflows are in `.github/workflows/`
- [ ] `.gitignore` excludes `.env` and `node_modules/`

## MongoDB Atlas Configuration

- [ ] MongoDB cluster is created
- [ ] Database user is created with strong password
- [ ] Connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
- [ ] IP Whitelist includes:
  - [ ] Vercel IP addresses (if available)
  - [ ] Local development IP (for testing)
  - [ ] Or "Allow from anywhere" (development only)

## Vercel Project Setup

- [ ] Vercel account created (vercel.com)
- [ ] GitHub repository connected to Vercel
- [ ] Project imported successfully
- [ ] Deployment region set to: `iad1` (US East)
- [ ] Build settings verified:
  - [ ] Build command: `npm --prefix frontend run build`
  - [ ] Output directory: `frontend/build`
  - [ ] Install command: `npm ci`

## Environment Variables Configuration

In Vercel Dashboard → Settings → Environment Variables, add:

### Required Variables

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `MONGO_URI` = `mongodb+srv://...` (from MongoDB Atlas)
- [ ] `JWT_SECRET` = (32+ character random string)
- [ ] `OPENAI_API_KEY` = `sk-...` (from OpenAI)

### CORS & Security

- [ ] `CORS_ORIGINS` = `https://yourdomain.vercel.app,https://www.yourdomain.vercel.app`
- [ ] `FORCE_HTTPS` = `true`
- [ ] `TRUST_PROXY` = `1`

### Database Configuration

- [ ] `MONGODB_MAX_POOL_SIZE` = `50`
- [ ] `MONGODB_MIN_POOL_SIZE` = `10`
- [ ] `MONGODB_SERVER_SELECTION_TIMEOUT_MS` = `10000`
- [ ] `MONGODB_SOCKET_TIMEOUT_MS` = `45000`

### Rate Limiting

- [ ] `RATE_LIMIT_WINDOW_MS` = `900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS` = `300`
- [ ] `AUTH_RATE_LIMIT_MAX_REQUESTS` = `20`

### Features

- [ ] `ENABLE_SWAGGER` = `true`
- [ ] `OPENAI_MODEL` = `gpt-4o-mini`

## Deployment Verification

After deployment, verify:

### Health Endpoints

- [ ] `GET https://your-app.vercel.app/` returns success message
- [ ] `GET https://your-app.vercel.app/health` returns status 200
- [ ] Database connection shows as `connected` in health response

### API Endpoints

- [ ] `POST /api/auth/register` creates new user
- [ ] `POST /api/auth/login` returns JWT token
- [ ] `GET /api/auth/me` requires valid token (401 without token)

### Frontend

- [ ] Frontend loads without errors
- [ ] React app renders at `https://your-app.vercel.app`
- [ ] Frontend can call backend API at `/api/*`
- [ ] Registration form is accessible at `/register`

### API Documentation

- [ ] Swagger UI available at `https://your-app.vercel.app/api-docs`
- [ ] All endpoints documented

## Post-Deployment Configuration

- [ ] Monitor Vercel dashboard for build success
- [ ] Check Vercel logs for any errors
- [ ] Test API endpoints with curl or Postman
- [ ] Verify MongoDB indexes are created
- [ ] Set up Vercel analytics
- [ ] Configure domain if using custom domain:
  - [ ] Add domain in Vercel project settings
  - [ ] Update DNS records
  - [ ] Enable SSL certificate

## Performance & Monitoring

- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry/LogRocket)
- [ ] Configure monitoring alerts
- [ ] Review cold start time
- [ ] Optimize database queries
- [ ] Check API response times

## Security Hardening

- [ ] Verify all environment variables are production-ready
- [ ] Enable GitHub branch protection (main branch)
- [ ] Set up required status checks for PRs
- [ ] Review CORS whitelist is not too permissive
- [ ] Ensure rate limiting is appropriate
- [ ] Enable HTTPS redirect (already in config)
- [ ] Review security headers in `vercel.json`

## Backup & Disaster Recovery

- [ ] MongoDB Atlas automated backups are enabled
- [ ] Backup retention policy is configured
- [ ] Test restore process
- [ ] Document recovery procedure

## CI/CD Pipeline

- [ ] GitHub Actions workflows run on push
- [ ] Tests pass before deployment
- [ ] Linting is enforced
- [ ] Security scanning is enabled
- [ ] Coverage reports are generated

## Documentation

- [ ] Update `README.md` with deployment URL
- [ ] Document all environment variables
- [ ] Create runbook for troubleshooting
- [ ] Document API changes
- [ ] Create deployment procedure document

## Optional Enhancements

- [ ] Set up custom domain with SSL
- [ ] Configure edge functions for optimized routing
- [ ] Enable Vercel Insights for performance monitoring
- [ ] Set up automated daily backups
- [ ] Configure team access in Vercel
- [ ] Enable GitHub integration for PR previews
- [ ] Set up Slack notifications for deployments

## Troubleshooting Checklist

If deployment fails:

- [ ] Check Vercel build logs for errors
- [ ] Verify MongoDB connection string
- [ ] Confirm all environment variables are set
- [ ] Check GitHub repository is accessible
- [ ] Verify Node.js version in `package.json` engines
- [ ] Ensure `frontend/build/` is in `.gitignore` (or remove for production)
- [ ] Test locally with `npm run dev` first

## Rollback Plan

If issues occur in production:

- [ ] Vercel automatically creates previous deployments
- [ ] Navigate to Deployments tab
- [ ] Click on previous successful deployment
- [ ] Click "Promote to Production"
- [ ] Verify rollback succeeded

## Support Resources

- [ ] Vercel docs: https://vercel.com/docs
- [ ] GitHub issues for debugging
- [ ] MongoDB support: https://support.mongodb.com
- [ ] OpenAI support: https://support.openai.com

---

**Status**: Ready for Vercel Pro/Enterprise Deployment
**Last Checked**: May 13, 2026
**Framework**: Node.js 20.19.0+ / React 19.x
**Deployment Target**: Vercel

Once all items are checked, your TaxMate application is ready for production deployment! 🚀
