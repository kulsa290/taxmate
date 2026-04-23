# 🔐 KARSATHI ENVIRONMENT SETUP GUIDE

Complete guide to configure all environment variables for Karsathi production deployment.

---

## 📋 TABLE OF CONTENTS

1. [Backend Environment Variables](#backend-environment-variables)
2. [Frontend Environment Variables](#frontend-environment-variables)
3. [How to Set Variables in Vercel](#how-to-set-variables-in-vercel)
4. [How to Set Variables in Railway](#how-to-set-variables-in-railway)
5. [Environment Variable Verification](#environment-variable-verification)

---

## 🔧 BACKEND ENVIRONMENT VARIABLES

### Location: Railway Project Settings

**Navigate to:**
1. Railway Dashboard → Your Project
2. Variables → Production Environment
3. Add/Update each variable

### Critical Variables (Must Set)

```
# Application
NODE_ENV=production
APP_NAME=Karsathi
APP_URL=https://karsathi.co.in
API_URL=https://api.karsathi.co.in

# Port
PORT=5000

# Domain Configuration
CLIENT_URL=https://karsathi.co.in
API_BASE_URL=https://api.karsathi.co.in
CORS_ORIGINS=https://karsathi.co.in,https://www.karsathi.co.in

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/karsathi?retryWrites=true&w=majority
MONGODB_POOL_SIZE=50

# Authentication
JWT_SECRET=<generate-32-char-random-string>
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=<generate-32-char-random-string>
JWT_ALGORITHM=HS512

# OpenAI (if using AI features)
OPENAI_API_KEY=sk-xxx...
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1000

# Email (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxx...
SMTP_FROM=noreply@karsathi.co.in
SMTP_FROM_NAME=Karsathi

# Logging
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_TO_FILE=true
```

### Optional Variables

```
# Redis (for session/cache)
REDIS_URL=redis://redis-prod:6379
REDIS_PASSWORD=<your-redis-password>
REDIS_TLS=true

# AWS S3 (if using file upload)
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY=AKIA...
AWS_S3_SECRET_KEY=...
UPLOAD_BUCKET=karsathi-uploads

# Database Backup
BACKUP_ENABLED=true
AWS_BACKUP_BUCKET=karsathi-backups-production
BACKUP_SCHEDULE=0 2 * * *

# Monitoring
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
DATADOG_API_KEY=...
NEW_RELIC_LICENSE_KEY=...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

---

## 🎨 FRONTEND ENVIRONMENT VARIABLES

### Location: Vercel Project Settings

**Navigate to:**
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Make sure scope is set to "Production"
4. Add/Update each variable

### Required Variables

```
NEXT_PUBLIC_API_URL=https://api.karsathi.co.in
NEXT_PUBLIC_APP_URL=https://karsathi.co.in
NEXT_PUBLIC_APP_NAME=Karsathi
```

### Feature Flags (Optional)

```
NEXT_PUBLIC_ENABLE_AI_RECOMMENDATIONS=true
NEXT_PUBLIC_ENABLE_PDF_EXPORT=true
NEXT_PUBLIC_ENABLE_BULK_OPERATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Monitoring (Optional)

```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🛠️ HOW TO SET VARIABLES IN VERCEL

### Method 1: Vercel Web Dashboard (Recommended)

**Step 1: Open Project Settings**
1. Go to https://vercel.com/dashboard
2. Select your project (karsathi)
3. Click "Settings" in the top menu

**Step 2: Go to Environment Variables**
1. Scroll to "Environment Variables" section
2. Or navigate to: Settings → Environment Variables

**Step 3: Add Variables**
1. Click "Add New" button
2. Enter Name (e.g., `NEXT_PUBLIC_API_URL`)
3. Enter Value (e.g., `https://api.karsathi.co.in`)
4. Select Scope: 
   - Make sure it includes "Production" ✓
5. Click "Save"

**Step 4: Verify**
- Variable should appear in list
- Green checkmark = Saved ✓

**Step 5: Redeploy**
1. Go to Deployments
2. Click on latest deployment
3. Click "Redeploy" button
4. Wait for build to complete

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Link to project
vercel link

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL

# You'll be prompted:
# Enter the value: https://api.karsathi.co.in
# Select environment: Production

# Verify
vercel env list
```

### Method 3: Via Vercel.json (Advanced)

Create `vercel.env.production.local` in project root:
```
NEXT_PUBLIC_API_URL=https://api.karsathi.co.in
NEXT_PUBLIC_APP_URL=https://karsathi.co.in
NEXT_PUBLIC_APP_NAME=Karsathi
```

Then push to repository and Vercel auto-syncs.

---

## 🚂 HOW TO SET VARIABLES IN RAILWAY

### Method 1: Railway Web Dashboard (Recommended)

**Step 1: Open Project**
1. Go to https://railway.app
2. Select your project (Karsathi Backend)

**Step 2: Go to Variables**
1. Click on the service (backend)
2. Select "Variables" tab

**Step 3: Create Production Environment (if needed)**
1. Click "New Environment"
2. Name: `production`
3. Create

**Step 4: Add Variables**
1. Click "New Variable" button
2. Name: `NODE_ENV`
3. Value: `production`
4. Click "Add"
5. Repeat for each variable

**Step 5: Redeploy**
1. Go to Deployments
2. Click "Redeploy" on latest deployment
3. Select source: Latest commit
4. Click "Deploy"
5. Wait for completion

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Set environment variable
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="mongodb+srv://..."

# Verify
railway variables list

# Redeploy
railway redeploy
```

### Method 3: via .env file

Create `.env.production` in backend root:
```
NODE_ENV=production
CLIENT_URL=https://karsathi.co.in
API_BASE_URL=https://api.karsathi.co.in
CORS_ORIGINS=https://karsathi.co.in,https://www.karsathi.co.in
...
```

Commit to Git → Railway auto-syncs from repository.

---

## ✅ ENVIRONMENT VARIABLE VERIFICATION

### Check Frontend Variables

**In Vercel:**
1. Settings → Environment Variables
2. Look for:
   - ✓ `NEXT_PUBLIC_API_URL`
   - ✓ `NEXT_PUBLIC_APP_URL`
   - ✓ `NEXT_PUBLIC_APP_NAME`

**In browser (after deploy):**
```javascript
// Open browser console on https://karsathi.co.in
console.log(process.env.REACT_APP_API_URL)
// or for Next.js
console.log(window.__ENV__.NEXT_PUBLIC_API_URL)
```

### Check Backend Variables

**In Railway:**
1. Variables tab
2. Look for:
   - ✓ `NODE_ENV` = `production`
   - ✓ `CORS_ORIGINS` = `https://karsathi.co.in,https://www.karsathi.co.in`
   - ✓ `API_BASE_URL` = `https://api.karsathi.co.in`

**Via API endpoint:**
```bash
# Check if API is using correct config
curl https://api.karsathi.co.in/health

# Should return successfully without CORS errors
```

### Verify CORS Configuration

```bash
# Send request with Origin header
curl -H "Origin: https://karsathi.co.in" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.karsathi.co.in/api/auth/login \
     -v

# Look for response headers:
# Access-Control-Allow-Origin: https://karsathi.co.in
# Access-Control-Allow-Credentials: true
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

## 🔒 SECURITY BEST PRACTICES

### DO:
- ✓ Use strong random strings for JWT secrets (min 32 chars)
- ✓ Store secrets only in platform variables (not Git)
- ✓ Use separate secrets for each environment (dev/staging/prod)
- ✓ Rotate secrets regularly
- ✓ Use HTTPS everywhere
- ✓ Enable CORS credentials for same-domain requests

### DON'T:
- ✗ Commit `.env` files to Git
- ✗ Share secrets in Slack/Email
- ✗ Use simple passwords for JWT
- ✗ Leave debug mode enabled in production
- ✗ Expose API keys in frontend code (use backend proxies)
- ✗ Allow overly broad CORS origins (don't use `*`)

---

## 📝 COPY-PASTE TEMPLATES

### Backend Variables Template

```
NODE_ENV=production
PORT=5000
APP_NAME=Karsathi
APP_URL=https://karsathi.co.in
API_URL=https://api.karsathi.co.in
CLIENT_URL=https://karsathi.co.in
API_BASE_URL=https://api.karsathi.co.in
CORS_ORIGINS=https://karsathi.co.in,https://www.karsathi.co.in
LOG_LEVEL=warn
LOG_FORMAT=json
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/karsathi?retryWrites=true&w=majority
JWT_SECRET=REPLACE_WITH_32_CHAR_RANDOM_STRING
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=REPLACE_WITH_32_CHAR_RANDOM_STRING
JWT_ALGORITHM=HS512
OPENAI_API_KEY=sk-REPLACE_WITH_YOUR_KEY
OPENAI_MODEL=gpt-4
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.REPLACE_WITH_YOUR_KEY
SMTP_FROM=noreply@karsathi.co.in
SMTP_FROM_NAME=Karsathi
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Variables Template

```
NEXT_PUBLIC_API_URL=https://api.karsathi.co.in
NEXT_PUBLIC_APP_URL=https://karsathi.co.in
NEXT_PUBLIC_APP_NAME=Karsathi
NEXT_PUBLIC_ENABLE_AI_RECOMMENDATIONS=true
NEXT_PUBLIC_ENABLE_PDF_EXPORT=true
NEXT_PUBLIC_ENABLE_BULK_OPERATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 🆘 TROUBLESHOOTING

### "Undefined environment variable" Error

**Problem:** Frontend shows error about missing variable  
**Solution:**
1. Verify variable added to Vercel
2. Verify variable name starts with `NEXT_PUBLIC_`
3. Redeploy frontend
4. Clear browser cache

### API Returns CORS Error

**Problem:** Browser shows "CORS policy" error  
**Solution:**
1. Check `CORS_ORIGINS` in Railway
2. Verify it includes `https://karsathi.co.in`
3. Make sure it's NOT using wildcards or localhost in production
4. Redeploy backend

### Backend Can't Connect to MongoDB

**Problem:** API shows "Cannot connect to database"  
**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas → Network Access
3. Add Railway IP or 0.0.0.0/0
4. Redeploy backend

### Secrets Not Visible in Logs

**Problem:** Environment variables not showing in logs  
**Solution:**
1. This is normal for security reasons
2. To debug, add temporary console.log before deployment
3. Remove before final deployment

---

## 📊 VERIFICATION CHECKLIST

After setting all variables, verify:

- [ ] Frontend variables visible in Vercel
- [ ] Backend variables visible in Railway
- [ ] Variables not committed to Git (checked .gitignore)
- [ ] Production environment selected (not preview/dev)
- [ ] Deployments in progress/complete
- [ ] API accessible at `https://api.karsathi.co.in/health`
- [ ] Frontend accessible at `https://karsathi.co.in`
- [ ] CORS headers correct
- [ ] No sensitive data in browser console
- [ ] Monitoring active (Sentry/Datadog)

---

**Status:** ✅ Production Ready  
**Last Updated:** April 23, 2026  
**Domain:** karsathi.co.in
