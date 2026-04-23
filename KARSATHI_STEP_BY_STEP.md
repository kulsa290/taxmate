# 📖 KARSATHI STEP-BY-STEP DEPLOYMENT GUIDE

**Complete walkthrough to deploy Karsathi to production**

Estimated Time: 30-45 minutes  
Difficulty: Low  
Status: Production Ready

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before starting, ensure:

- [ ] GoDaddy account access (or domain registrar)
- [ ] Vercel account with frontend repository access
- [ ] Railway account with backend repository access
- [ ] MongoDB Atlas URI ready
- [ ] All required API keys gathered
- [ ] GitHub repository updated with all code
- [ ] No uncommitted changes in Git

---

## PHASE 1: PREPARE (5 minutes)

### Step 1: Gather Required Information

**You'll need these - collect them now:**

```
GoDaddy:
- [ ] Domain: karsathi.co.in
- [ ] GoDaddy login credentials

Vercel:
- [ ] Vercel login credentials
- [ ] Frontend project URL

Railway:
- [ ] Railway login credentials
- [ ] Backend project URL

APIs & Keys:
- [ ] MongoDB URI: _______________
- [ ] OpenAI API Key: _______________
- [ ] SendGrid API Key: _______________
- [ ] JWT Secret (generate 32-char random): _______________
```

### Step 2: Generate Secrets

**Generate strong random strings:**

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))

# Online tool
https://www.uuidgenerator.net/ (copy 2-3 times, concatenate)
```

Save these securely.

---

## PHASE 2: DNS SETUP (5 minutes)

### Step 1: Log in to GoDaddy

1. Go to https://www.godaddy.com
2. Click "Sign In" (top right)
3. Enter email and password
4. Log in

### Step 2: Access DNS Settings

1. Click "My Products" (top left)
2. Find "karsathi.co.in" in Domains list
3. Click on domain name
4. Click "Manage DNS" button

### Step 3: Remove Old Records (if any)

1. Look for any records pointing to "taxmate.in"
2. Click the trash/delete icon
3. Confirm deletion

### Step 4: Add A Record (for Frontend)

1. Click "Add" button
2. Select Type: **A**
3. Enter:
   - Name: `@` (or leave blank)
   - Value: `76.76.19.112` (Vercel IP - we'll verify this)
   - TTL: `3600`
4. Click "Save"

### Step 5: Add First CNAME Record (for WWW)

1. Click "Add" button
2. Select Type: **CNAME**
3. Enter:
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `3600`
4. Click "Save"

### Step 6: Add Second CNAME Record (for API)

We'll come back to this after setting up Railway. For now, note:
- Name: `api`
- Value: `[Get from Railway later]`

### Step 7: Verify DNS (Wait 5-10 minutes)

After DNS is saved, wait and verify:

```bash
# In terminal/PowerShell
nslookup karsathi.co.in
nslookup www.karsathi.co.in

# Should resolve to the Vercel IP
```

✅ **DNS Update Complete**

---

## PHASE 3: VERCEL SETUP (10 minutes)

### Step 1: Log in to Vercel

1. Go to https://vercel.com
2. Click "Log In" (top right)
3. Sign in with GitHub account
4. Select your project (karsathi)

### Step 2: Add Environment Variables

1. Click "Settings" (top menu)
2. Click "Environment Variables" (left sidebar)
3. Add each variable:

**Variable 1:**
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://api.karsathi.co.in`
- Environment: Select **Production**
- Click "Save"

**Variable 2:**
- Name: `NEXT_PUBLIC_APP_URL`
- Value: `https://karsathi.co.in`
- Environment: **Production**
- Click "Save"

**Variable 3:**
- Name: `NEXT_PUBLIC_APP_NAME`
- Value: `Karsathi`
- Environment: **Production**
- Click "Save"

**Variable 4 (Optional):**
- Name: `NEXT_PUBLIC_ENABLE_AI_RECOMMENDATIONS`
- Value: `true`
- Environment: **Production**
- Click "Save"

### Step 3: Add Custom Domains

1. Click "Settings" (top menu)
2. Click "Domains" (left sidebar)
3. Click "Add" → "Add Domain"
4. Enter: `karsathi.co.in`
5. Click "Add"

**Note:** Vercel will show verification status

6. Click "Add" again
7. Enter: `www.karsathi.co.in`
8. Click "Add"

### Step 4: Configure Domains

1. Click on `karsathi.co.in` domain
2. Look for settings:
   - [ ] Set as Primary Domain
   - [ ] Redirect www to primary

3. Click on `www.karsathi.co.in` domain
4. Set redirect to primary domain

### Step 5: Verify Vercel IP (Important!)

1. On the `karsathi.co.in` domain settings page
2. Look for "A Record" or verification details
3. Copy the IP address shown (should be `76.76.19.112` or similar)
4. **Go back to GoDaddy and update the A record value if different**

### Step 6: Redeploy Frontend

1. Click "Deployments" (top menu)
2. Find latest deployment
3. Click "..." (three dots)
4. Click "Redeploy"
5. Wait for build to complete (3-5 minutes)

✅ **Vercel Setup Complete**

---

## PHASE 4: RAILWAY SETUP (10 minutes)

### Step 1: Log in to Railway

1. Go to https://railway.app
2. Log in with GitHub account
3. Select your project (Karsathi Backend)

### Step 2: Switch to Production Environment

1. Look for environment selector
2. Select or create "Production" environment
3. All variables go here

### Step 3: Add Environment Variables

1. Click on the backend service
2. Click "Variables" tab
3. Add each variable:

**Variable 1:**
- Name: `NODE_ENV`
- Value: `production`
- Click "Add"

**Variable 2:**
- Name: `CLIENT_URL`
- Value: `https://karsathi.co.in`
- Click "Add"

**Variable 3:**
- Name: `API_BASE_URL`
- Value: `https://api.karsathi.co.in`
- Click "Add"

**Variable 4:**
- Name: `CORS_ORIGINS`
- Value: `https://karsathi.co.in,https://www.karsathi.co.in`
- Click "Add"

**Variable 5:**
- Name: `APP_NAME`
- Value: `Karsathi`
- Click "Add"

**Variable 6:**
- Name: `SMTP_FROM`
- Value: `noreply@karsathi.co.in`
- Click "Add"

**Variable 7:**
- Name: `MONGODB_URI`
- Value: `[Your MongoDB production URI]`
- Click "Add"

**Variable 8:**
- Name: `JWT_SECRET`
- Value: `[Your 32-char secret generated earlier]`
- Click "Add"

**Continue adding:**
- `JWT_EXPIRE` = `24h`
- `REFRESH_TOKEN_SECRET` = `[Your 32-char secret]`
- `OPENAI_API_KEY` = `[Your OpenAI key]`
- `OPENAI_MODEL` = `gpt-4`
- `SMTP_HOST` = `smtp.sendgrid.net`
- `SMTP_PORT` = `587`
- `SMTP_USER` = `apikey`
- `SMTP_PASS` = `[Your SendGrid key]`
- `SMTP_FROM_NAME` = `Karsathi`
- `LOG_LEVEL` = `warn`

### Step 4: Get Custom Domain CNAME

1. Click "Settings" (railway project settings)
2. Click "Custom Domain"
3. Enter: `api.karsathi.co.in`
4. Click "Add"
5. Railway will display a CNAME value
6. **COPY THIS CNAME VALUE** (looks like `karsathi-api.railway.app`)

### Step 5: Add CNAME to GoDaddy

1. Go back to GoDaddy DNS settings
2. Click "Add"
3. Type: **CNAME**
4. Name: `api`
5. Value: `[Paste the Railway CNAME from Step 4]`
6. TTL: `3600`
7. Click "Save"

### Step 6: Redeploy Backend

1. Go to "Deployments" in Railway
2. Click on latest deployment
3. Click "Redeploy"
4. Wait for build to complete (5-10 minutes)

✅ **Railway Setup Complete**

---

## PHASE 5: VERIFICATION (10 minutes)

### Step 1: Wait for DNS Propagation

Wait 10-15 minutes for DNS changes to propagate globally.

### Step 2: Test Frontend

**Open browser and test:**

```
https://karsathi.co.in
```

✅ Should:
- Load without errors
- Show SSL certificate as valid (🔒)
- Display the app interface
- No mixed content warnings

### Step 3: Test WWW Redirect

**Open in browser:**

```
https://www.karsathi.co.in
```

✅ Should redirect to `https://karsathi.co.in`

### Step 4: Test API Endpoint

**Open terminal/PowerShell and run:**

```bash
curl https://api.karsathi.co.in/health
```

✅ Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-04-23T10:30:00Z"
}
```

### Step 5: Test CORS

**Run this command:**

```bash
curl -H "Origin: https://karsathi.co.in" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.karsathi.co.in/api/auth/login \
     -v
```

✅ Response headers should include:
```
Access-Control-Allow-Origin: https://karsathi.co.in
Access-Control-Allow-Credentials: true
```

### Step 6: Test Application Features

1. Go to `https://karsathi.co.in`
2. Try to sign up
3. Try to log in
4. Navigate around the app
5. Submit a form

✅ All should work without errors

### Step 7: Check SSL Certificate

**In browser address bar:**
- [ ] Click the lock icon 🔒
- [ ] "Connection is secure"
- [ ] Certificate valid
- [ ] Domain: karsathi.co.in

---

## 🎉 PHASE 6: FINAL CHECKS (5 minutes)

### Critical Verification

- [ ] Frontend loads: https://karsathi.co.in ✓
- [ ] WWW redirects correctly ✓
- [ ] API responds: https://api.karsathi.co.in/health ✓
- [ ] CORS working (no browser errors) ✓
- [ ] Login/signup works ✓
- [ ] SSL certificate valid ✓

### Security Checklist

- [ ] No HTTP access (all redirected to HTTPS)
- [ ] No sensitive data in URL
- [ ] No console errors
- [ ] No mixed content warnings

### Performance Check

```bash
# Terminal: Check response times
curl -w "Total: %{time_total}s\n" -o /dev/null -s https://karsathi.co.in
curl -w "Total: %{time_total}s\n" -o /dev/null -s https://api.karsathi.co.in/health
```

✅ Frontend should load in < 3 seconds  
✅ API should respond in < 500ms

---

## ✅ DEPLOYMENT COMPLETE!

**Congratulations! 🎊**

Your Karsathi application is now live in production!

### What's Live:

| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://karsathi.co.in | ✅ Live |
| WWW | https://www.karsathi.co.in | ✅ Redirecting |
| API | https://api.karsathi.co.in | ✅ Live |
| Health Check | https://api.karsathi.co.in/health | ✅ Healthy |

---

## 📞 NEXT STEPS

### Monitor Production

1. Set up error tracking (Sentry)
2. Set up uptime monitoring (UptimeRobot)
3. Set up performance monitoring (Datadog)

### Daily Tasks

- [ ] Check error logs daily
- [ ] Monitor uptime
- [ ] Review performance metrics

### Planned Tasks

- [ ] Set up automated backups
- [ ] Configure email notifications
- [ ] Create runbooks for common issues
- [ ] Train team on production procedures

---

## 🚨 TROUBLESHOOTING

**If something doesn't work:**

### "Cannot reach karsathi.co.in"
1. Check DNS propagation: `nslookup karsathi.co.in`
2. Wait another 10 minutes
3. Check Vercel deployment status

### "CORS Error in Console"
1. Verify `CORS_ORIGINS` in Railway
2. Check it includes `https://karsathi.co.in`
3. Redeploy backend

### "API Returns 500 Error"
1. Check Railway logs for errors
2. Verify MongoDB URI is correct
3. Check all environment variables set
4. Redeploy backend

### "SSL Certificate Error"
1. Wait 5-10 minutes for certificate generation
2. Hard refresh browser (Ctrl+F5)
3. Try in incognito mode

---

## 📚 ADDITIONAL RESOURCES

- [Environment Setup Guide](./ENVIRONMENT_SETUP_KARSATHI.md)
- [Verification Checklist](./KARSATHI_VERIFICATION_CHECKLIST.md)
- [Quick Reference](./KARSATHI_QUICK_REFERENCE.md)
- [Full Production Guide](./KARSATHI_PRODUCTION_DEPLOYMENT.md)

---

**Status:** ✅ LIVE IN PRODUCTION  
**Date:** April 23, 2026  
**Brand:** Karsathi  
**Domains:** karsathi.co.in | api.karsathi.co.in
