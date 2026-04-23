# 🚀 KARSATHI PRODUCTION DEPLOYMENT GUIDE

**Rebranding:** TaxMate → Karsathi  
**Domain:** karsathi.co.in  
**API Domain:** api.karsathi.co.in  
**Status:** Ready for Production Deployment  

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [DNS Configuration (GoDaddy)](#dns-configuration)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Backend Deployment (Railway)](#backend-deployment-railway)
5. [Environment Variables Setup](#environment-variables-setup)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Rollback Procedures](#rollback-procedures)

---

## ✅ PREREQUISITES

Before you begin, ensure you have:

- [ ] GoDaddy account with karsathi.co.in domain
- [ ] Vercel account (with frontend repository)
- [ ] Railway account (with backend repository)
- [ ] MongoDB Atlas production cluster (or backup URI)
- [ ] Git access to both repositories
- [ ] All production secrets/API keys ready

---

## 🌍 DNS CONFIGURATION (GoDaddy)

### Step 1: Access GoDaddy DNS Settings

1. Log in to GoDaddy account
2. Go to "My Products" → "Domains"
3. Click on **karsathi.co.in** → "Manage DNS"

### Step 2: Add DNS Records

**Remove old records:**
- Delete all records pointing to `taxmate.in`

**Add new records for Karsathi:**

#### Record 1: Root A Record (for Vercel)
```
TYPE: A
NAME: @ (or blank)
VALUE: 76.76.19.112 (or latest Vercel IP)
TTL: 3600
```

**How to find Vercel IP:**
- Go to Vercel project settings
- Custom domains section will show the A record value

#### Record 2: WWW CNAME (for Vercel)
```
TYPE: CNAME
NAME: www
VALUE: cname.vercel-dns.com
TTL: 3600
```

#### Record 3: API CNAME (for Railway)
```
TYPE: CNAME
NAME: api
VALUE: (Railway will provide this in custom domain settings)
TTL: 3600
```

**How to get Railway CNAME:**
- Go to Railway project
- Settings → Custom Domain
- It will show the CNAME value

#### Record 4: MX Records (for Email - Optional)
```
TYPE: MX
NAME: @
VALUE: 10 aspmx.l.google.com
TTL: 3600

(Add secondary MX records if using Google Workspace)
```

### Step 3: Verify DNS Records

Wait 5-10 minutes for DNS propagation, then test:

```bash
# Check A record
nslookup karsathi.co.in

# Check CNAME records
nslookup www.karsathi.co.in
nslookup api.karsathi.co.in

# Or use dig command
dig karsathi.co.in
dig www.karsathi.co.in
dig api.karsathi.co.in
```

---

## 🎨 FRONTEND DEPLOYMENT (VERCEL)

### Step 1: Configure Environment Variables in Vercel

1. Go to Vercel project dashboard
2. Settings → Environment Variables
3. Add the following:

```
NEXT_PUBLIC_API_URL = https://api.karsathi.co.in
NEXT_PUBLIC_APP_URL = https://karsathi.co.in
NEXT_PUBLIC_APP_NAME = Karsathi
NEXT_PUBLIC_ENABLE_AI_RECOMMENDATIONS = true
NEXT_PUBLIC_ENABLE_PDF_EXPORT = true
NEXT_PUBLIC_ENABLE_BULK_OPERATIONS = true
NEXT_PUBLIC_ENABLE_ANALYTICS = true
```

**Important:** Make sure these are set for the Production environment

### Step 2: Add Custom Domains in Vercel

1. Go to project → Settings → Domains
2. Click "Add" → "Add Domain"
3. Enter: **karsathi.co.in**
4. Vercel will show you the DNS records to add to GoDaddy
5. Click "Add" again for **www.karsathi.co.in**

**Important:** Set `karsathi.co.in` as Primary Domain

### Step 3: Configure Domain Settings

1. Click on the domain → Settings
2. Enable:
   - [x] Redirect to www
   - [x] Redirect to primary domain (karsathi.co.in)
   - [x] HTTPS (auto-enabled)

### Step 4: Redeploy Frontend

**Option A: Automatic Redeploy**
- Merge PR to main branch
- Vercel automatically redeploys

**Option B: Manual Redeploy**
1. Go to Vercel project
2. Deployments → Select latest
3. Click "Redeploy"

**Option C: Via Git**
```bash
# Push to main branch
git push origin main

# Vercel listens to main and auto-deploys
```

### Step 5: Verify Frontend Deployment

```bash
# Test frontend URL
curl -I https://karsathi.co.in
# Should return 200 OK with no redirects

curl -I https://www.karsathi.co.in
# Should redirect to https://karsathi.co.in

# Check headers
curl -I https://karsathi.co.in | grep -E "X-Powered-By|Cache-Control"
```

---

## 🚂 BACKEND DEPLOYMENT (RAILWAY)

### Step 1: Update Backend Environment Variables

1. Go to Railway project dashboard
2. Variables → Select Production Environment
3. Update these variables:

```
NODE_ENV=production
CLIENT_URL=https://karsathi.co.in
API_BASE_URL=https://api.karsathi.co.in
CORS_ORIGINS=https://karsathi.co.in,https://www.karsathi.co.in
APP_NAME=Karsathi
APP_URL=https://karsathi.co.in
API_URL=https://api.karsathi.co.in
SMTP_FROM=noreply@karsathi.co.in
SMTP_FROM_NAME=Karsathi
```

### Step 2: Add Custom Domain to Railway

1. Go to Railway project
2. Settings → Custom Domain
3. Enter: **api.karsathi.co.in**
4. Railway will show you the CNAME value
5. Copy this CNAME and add it to GoDaddy DNS

### Step 3: Deploy Backend

**Option A: Automatic Deployment**
```bash
# Push changes to main/production branch
git push origin main

# Railway auto-deploys on push
```

**Option B: Manual Deployment**
1. Go to Railway project
2. Deployments → Select latest
3. Click "Redeploy"

### Step 4: Verify Backend Deployment

```bash
# Test health endpoint
curl -I https://api.karsathi.co.in/health
# Should return 200 OK

# Test API connectivity (with auth header if required)
curl https://api.karsathi.co.in/health

# Check CORS headers
curl -H "Origin: https://karsathi.co.in" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.karsathi.co.in/api/auth/login \
     -v
```

---

## 🔐 ENVIRONMENT VARIABLES SETUP

### Backend Environment Variables

Create `.env.production` with:

```bash
# Copy from env/karsathi.production.env
cp env/karsathi.production.env .env.production

# Or manually update these in Railway:
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CORS_ORIGINS=https://karsathi.co.in,https://www.karsathi.co.in
CLIENT_URL=https://karsathi.co.in
API_BASE_URL=https://api.karsathi.co.in
APP_NAME=Karsathi
APP_URL=https://karsathi.co.in
```

### Frontend Environment Variables

In Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://api.karsathi.co.in
NEXT_PUBLIC_APP_URL=https://karsathi.co.in
NEXT_PUBLIC_APP_NAME=Karsathi
```

---

## 🧪 POST-DEPLOYMENT VERIFICATION

### Checklist 1: Domain & HTTPS

- [ ] `https://karsathi.co.in` loads without SSL errors
- [ ] `https://www.karsathi.co.in` redirects to `https://karsathi.co.in`
- [ ] SSL certificate is valid (check browser lock icon)
- [ ] No mixed content warnings (HTTPS + HTTP mix)

### Checklist 2: Frontend

- [ ] Frontend loads at https://karsathi.co.in
- [ ] Page title shows "Karsathi"
- [ ] Navigation works
- [ ] No console errors
- [ ] Responsive design works on mobile

### Checklist 3: API Connectivity

- [ ] `https://api.karsathi.co.in/health` returns 200 OK
- [ ] API is accessible from frontend
- [ ] No CORS errors in browser console
- [ ] Login/signup form works

### Checklist 4: CORS Configuration

Test CORS headers:

```bash
# Should allow requests from karsathi.co.in
curl -H "Origin: https://karsathi.co.in" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.karsathi.co.in/api/auth/login \
     -v

# Should show:
# Access-Control-Allow-Origin: https://karsathi.co.in
# Access-Control-Allow-Credentials: true
```

### Checklist 5: Features

- [ ] Login/Signup works
- [ ] Tax calculation works
- [ ] PDF download works (if enabled)
- [ ] User profile works
- [ ] Data persistence (reload page, data still there)

### Checklist 6: Performance

```bash
# Check page load time
curl -w "@curl-format.txt" -o /dev/null -s https://karsathi.co.in

# Expected: < 3 seconds for initial load
# API response: < 500ms
```

### Checklist 7: Security

- [ ] HTTPS enforced (no HTTP access)
- [ ] Security headers present
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
- [ ] No sensitive data in logs
- [ ] Rate limiting works

---

## 🔄 ROLLBACK PROCEDURES

### If Frontend Deployment Fails

**Option 1: Revert to Previous Deployment**
1. Go to Vercel → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

**Option 2: Revert Git Commit**
```bash
git log --oneline
git revert <commit-hash>
git push origin main
# Vercel auto-deploys reverted code
```

### If Backend Deployment Fails

**Option 1: Revert in Railway**
1. Go to Railway → Deployments
2. Find last working deployment
3. Click "Redeploy"

**Option 2: Revert Git Commit**
```bash
git log --oneline
git revert <commit-hash>
git push origin main
# Railway auto-deploys reverted code
```

### If DNS Issues

**Problem:** Domain not resolving  
**Solution:**
```bash
# Flush DNS cache
ipconfig /flushdns  # Windows
sudo dscacheutil -flushcache  # Mac
sudo systemctl restart systemd-resolved  # Linux

# Wait 5-10 minutes for DNS propagation
# Verify with: nslookup karsathi.co.in
```

---

## 📞 TROUBLESHOOTING

### Issue: "Cannot POST /api/..."

**Cause:** CORS issue or API not accessible  
**Solution:**
```bash
# Check CORS headers
curl -H "Origin: https://karsathi.co.in" \
     -X OPTIONS https://api.karsathi.co.in/api/auth/login -v

# Check if API is running
curl https://api.karsathi.co.in/health

# Check backend logs
# Go to Railway → Logs
```

### Issue: "Mixed Content" Error

**Cause:** Page loads over HTTPS but requests API over HTTP  
**Solution:**
```bash
# Verify API_URL in frontend is HTTPS
NEXT_PUBLIC_API_URL=https://api.karsathi.co.in  # Must be HTTPS

# Redeploy frontend
# Go to Vercel → Deployments → Redeploy
```

### Issue: "Cannot connect to MongoDB"

**Cause:** Connection string invalid or IP not whitelisted  
**Solution:**
1. Go to MongoDB Atlas
2. Network Access → Add IP address
3. Add `0.0.0.0/0` for Railway (or specific Railway IP)
4. Verify connection string in Railway variables

### Issue: "Domain not found"

**Cause:** DNS not propagated or DNS records incorrect  
**Solution:**
```bash
# Check DNS propagation
nslookup karsathi.co.in
nslookup api.karsathi.co.in

# If not propagated, wait 5-30 minutes
# If propagated but wrong, check GoDaddy DNS settings
# Verify Vercel IP and Railway CNAME are correct
```

---

## 🎉 DEPLOYMENT COMPLETE!

After all verifications pass, you're LIVE! 🚀

**Next Steps:**
1. Monitor uptime and error tracking (Sentry)
2. Set up automated backups
3. Configure email notifications
4. Plan monitoring dashboards

**Documentation:**
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- GoDaddy DNS: https://www.godaddy.com

---

**Date:** April 23, 2026  
**Status:** Production Ready  
**Brand:** Karsathi  
**Domains:**
- Frontend: https://karsathi.co.in
- API: https://api.karsathi.co.in
