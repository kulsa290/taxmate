# ✅ KARSATHI PRODUCTION DEPLOYMENT CHECKLIST

**Project:** Karsathi (Rebranded from TaxMate)  
**Domain:** karsathi.co.in  
**API Domain:** api.karsathi.co.in  
**Date:** April 23, 2026  

---

## 📋 PRE-DEPLOYMENT (PREPARATION)

### Repository & Code
- [ ] All TaxMate references replaced with Karsathi
- [ ] Frontend API URL updated to `https://api.karsathi.co.in`
- [ ] Backend CORS updated with new domains
- [ ] All environment variables updated
- [ ] Code pushed to GitHub/repository

### Credentials & Secrets
- [ ] MongoDB connection string ready
- [ ] JWT secrets generated (min 32 chars)
- [ ] OpenAI API key ready
- [ ] SendGrid API key ready
- [ ] AWS credentials (if using S3)
- [ ] Sentry DSN ready (if using error tracking)

### Domain Setup (GoDaddy)
- [ ] karsathi.co.in domain purchased
- [ ] Domain transferred to correct account (if needed)
- [ ] DNS management accessible
- [ ] Old taxmate.in records removed

---

## 🔧 STEP 1: DNS CONFIGURATION (GoDaddy)

### DNS Records Setup

**A Record (Root Domain)**
- [ ] Type: A
- [ ] Name: @ (or blank)
- [ ] Value: `76.76.19.112` (Vercel IP - verify in Vercel dashboard)
- [ ] TTL: 3600
- [ ] Status: Active ✓

**CNAME Record (WWW)**
- [ ] Type: CNAME
- [ ] Name: www
- [ ] Value: `cname.vercel-dns.com`
- [ ] TTL: 3600
- [ ] Status: Active ✓

**CNAME Record (API)**
- [ ] Type: CNAME
- [ ] Name: api
- [ ] Value: `[Railway provided CNAME]` (e.g., `karsathi-api.railway.app`)
- [ ] TTL: 3600
- [ ] Status: Active ✓

### DNS Verification

```bash
# After adding DNS records, wait 5-10 minutes for propagation

# Test A record
nslookup karsathi.co.in
# Expected: Should resolve to Vercel IP

# Test WWW CNAME
nslookup www.karsathi.co.in
# Expected: Should resolve to cname.vercel-dns.com

# Test API CNAME
nslookup api.karsathi.co.in
# Expected: Should resolve to Railway domain
```

- [ ] `karsathi.co.in` resolves correctly
- [ ] `www.karsathi.co.in` resolves correctly
- [ ] `api.karsathi.co.in` resolves correctly
- [ ] DNS propagated globally (check at https://www.whatsmydns.net/)

---

## 🎨 STEP 2: VERCEL (FRONTEND) DEPLOYMENT

### Environment Variables in Vercel

1. Go to Vercel Project → Settings → Environment Variables

**Add Production Variables:**
- [ ] `NEXT_PUBLIC_API_URL` = `https://api.karsathi.co.in`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://karsathi.co.in`
- [ ] `NEXT_PUBLIC_APP_NAME` = `Karsathi`
- [ ] `NEXT_PUBLIC_ENABLE_AI_RECOMMENDATIONS` = `true`
- [ ] `NEXT_PUBLIC_ENABLE_PDF_EXPORT` = `true`
- [ ] `NEXT_PUBLIC_ENABLE_BULK_OPERATIONS` = `true`
- [ ] `NEXT_PUBLIC_ENABLE_ANALYTICS` = `true`

- [ ] All variables set for `Production` environment
- [ ] Variables saved and active

### Custom Domains in Vercel

1. Go to Settings → Domains

**Add Primary Domain:**
- [ ] Domain: `karsathi.co.in`
- [ ] Status: Verified ✓
- [ ] SSL: Enabled (auto) ✓
- [ ] Primary: Yes

**Add Secondary Domain:**
- [ ] Domain: `www.karsathi.co.in`
- [ ] Status: Verified ✓
- [ ] SSL: Enabled (auto) ✓

**Domain Settings:**
- [ ] Redirect www to primary: Enabled
- [ ] HTTPS: Enforced
- [ ] Auto-renewal: Enabled

### Deployment

- [ ] Latest code pushed to `main` branch
- [ ] Vercel build successful (check Deployments)
- [ ] No build errors or warnings
- [ ] Deployment status: Ready ✓

---

## 🚂 STEP 3: RAILWAY (BACKEND) DEPLOYMENT

### Environment Variables in Railway

1. Go to Railway Project → Variables → Production Environment

**Update Production Variables:**
- [ ] `NODE_ENV` = `production`
- [ ] `CLIENT_URL` = `https://karsathi.co.in`
- [ ] `API_BASE_URL` = `https://api.karsathi.co.in`
- [ ] `CORS_ORIGINS` = `https://karsathi.co.in,https://www.karsathi.co.in`
- [ ] `APP_NAME` = `Karsathi`
- [ ] `APP_URL` = `https://karsathi.co.in`
- [ ] `API_URL` = `https://api.karsathi.co.in`
- [ ] `SMTP_FROM` = `noreply@karsathi.co.in`
- [ ] `SMTP_FROM_NAME` = `Karsathi`
- [ ] `MONGODB_URI` = `[MongoDB production URI]`
- [ ] `JWT_SECRET_PROD` = `[Generated secret]`

- [ ] All variables saved
- [ ] No variable conflicts

### Custom Domain in Railway

1. Go to Settings → Custom Domain

**Add API Domain:**
- [ ] Domain: `api.karsathi.co.in`
- [ ] Status: Assigned ✓
- [ ] CNAME Value: (Copy to GoDaddy)

**In GoDaddy DNS:**
- [ ] CNAME record created for `api`
- [ ] Value: (Railway CNAME from above)

- [ ] Custom domain active in Railway
- [ ] SSL certificate provisioned ✓

### Deployment

- [ ] Latest code pushed to repository
- [ ] Railway build successful
- [ ] Deployment status: Ready ✓
- [ ] No errors in logs

---

## 🧪 STEP 4: TESTING

### Frontend Testing

```bash
# 1. Test Frontend URL
curl -I https://karsathi.co.in
# Expected: HTTP/2 200
```
- [ ] https://karsathi.co.in loads successfully
- [ ] No SSL certificate warnings
- [ ] Page loads in < 3 seconds

```bash
# 2. Test WWW Redirect
curl -I https://www.karsathi.co.in
# Expected: Redirect to https://karsathi.co.in
```
- [ ] www domain redirects correctly
- [ ] No infinite redirect loops

### API Testing

```bash
# 1. Test Health Endpoint
curl https://api.karsathi.co.in/health
# Expected: {"status":"ok"} or similar
```
- [ ] Health endpoint returns 200 OK
- [ ] Response time < 500ms

```bash
# 2. Test CORS Headers
curl -H "Origin: https://karsathi.co.in" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.karsathi.co.in/api/auth/login \
     -v
# Expected: Access-Control-Allow-Origin: https://karsathi.co.in
```
- [ ] CORS headers present
- [ ] Correct Allow-Origin value
- [ ] Credentials allowed

### Browser Testing

**Chrome/Firefox/Safari:**
- [ ] Frontend loads at https://karsathi.co.in
- [ ] No console errors
- [ ] No mixed content warnings
- [ ] Page title shows "Karsathi"
- [ ] Navigation works
- [ ] Responsive design works

### Feature Testing

- [ ] User registration works
- [ ] User login works
- [ ] API calls successful (no CORS errors)
- [ ] Tax calculation works
- [ ] Data persistence works (refresh page, data still there)
- [ ] PDF download works (if enabled)
- [ ] File upload works (if enabled)

### Security Testing

- [ ] No HTTP access (redirects to HTTPS)
- [ ] SSL certificate valid
- [ ] Security headers present:
  - [ ] Strict-Transport-Security
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] Content-Security-Policy

```bash
# Check security headers
curl -I https://karsathi.co.in | grep -i "strict\|x-\|content-security"
```

---

## 📊 STEP 5: MONITORING & VERIFICATION

### Performance

```bash
# Measure page load time
curl -w "@curl-format.txt" -o /dev/null -s https://karsathi.co.in
```

- [ ] Frontend initial load: < 3 seconds
- [ ] API response time: < 500ms
- [ ] No timeout errors

### Uptime Monitoring

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Health check endpoint: https://api.karsathi.co.in/health
- [ ] Check interval: 5 minutes
- [ ] Alert on downtime

### Error Tracking

- [ ] Sentry project configured (if using)
- [ ] Sentry DSN added to frontend
- [ ] Errors being tracked and reported
- [ ] No high-priority errors in dashboard

### Logs

- [ ] Check Vercel logs for errors
- [ ] Check Railway logs for errors
- [ ] No application errors
- [ ] All requests successful

---

## 🔐 STEP 6: SECURITY VERIFICATION

### SSL/HTTPS

```bash
# Check SSL certificate
curl -I https://karsathi.co.in | grep -i "x-forwarded-proto\|strict-transport-security"

# Or use SSL checker
# https://www.ssllabs.com/ssltest/analyze.html?d=karsathi.co.in
```

- [ ] SSL certificate valid
- [ ] Certificate not self-signed
- [ ] HTTPS enforced on all pages
- [ ] No SSL/TLS warnings

### API Security

- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] No sensitive data in responses
- [ ] Authentication required for protected endpoints

### Credentials

- [ ] No hardcoded secrets in code
- [ ] All secrets in environment variables
- [ ] Secrets not exposed in logs
- [ ] API keys rotated from development

---

## 📝 STEP 7: POST-DEPLOYMENT

### Cleanup

- [ ] Remove old taxmate.in DNS records (if applicable)
- [ ] Remove old TaxMate deployments from Vercel (if keeping as backup)
- [ ] Archive old Railway deployments (if applicable)
- [ ] Update repository README with new domain
- [ ] Update project documentation

### Communication

- [ ] Team notified of new domain
- [ ] Users notified via email (if existing users)
- [ ] Support team updated with new URLs
- [ ] Documentation updated

### Backups

- [ ] Database backup created
- [ ] Full application backup created
- [ ] Backup stored securely
- [ ] Restore procedure tested

---

## 🎯 FINAL VERIFICATION

### URLs Working

- [ ] https://karsathi.co.in ✓
- [ ] https://www.karsathi.co.in ✓
- [ ] https://api.karsathi.co.in/health ✓

### No Errors

- [ ] Frontend: No console errors
- [ ] API: No error logs
- [ ] Database: Connected
- [ ] All integrations working

### Performance

- [ ] Page load time acceptable
- [ ] API response time < 500ms
- [ ] No timeout issues
- [ ] Uptime monitoring active

### Security

- [ ] HTTPS everywhere
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] SSL certificate valid

---

## ✅ DEPLOYMENT STATUS

**Date Completed:** _______________  
**Completed By:** _______________  
**Status:** 🟢 LIVE IN PRODUCTION

**All Checkpoints Passed:**
- [ ] DNS Configuration: ✓
- [ ] Vercel Deployment: ✓
- [ ] Railway Deployment: ✓
- [ ] Testing Completed: ✓
- [ ] Security Verified: ✓
- [ ] Monitoring Active: ✓

---

## 📞 EMERGENCY CONTACTS

**If something goes wrong:**

1. **Frontend Issue:** Check Vercel Deployments
2. **API Issue:** Check Railway Logs
3. **DNS Issue:** Check GoDaddy DNS Settings
4. **CORS Issue:** Check backend CORS configuration

**Rollback Procedure:**
1. Go to Vercel → Select previous deployment → Promote to Production
2. Or: `git revert <commit-hash> && git push origin main`

---

**Documentation:**
- Full Guide: [KARSATHI_PRODUCTION_DEPLOYMENT.md](./KARSATHI_PRODUCTION_DEPLOYMENT.md)
- Environment Setup: [ENVIRONMENT_SETUP_KARSATHI.md](./ENVIRONMENT_SETUP_KARSATHI.md)

---

**🚀 KARSATHI IS LIVE!**
