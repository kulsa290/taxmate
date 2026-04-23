# 📊 KARSATHI POST-DEPLOYMENT MONITORING & MAINTENANCE

Production support guide for Karsathi deployment

---

## 📋 TABLE OF CONTENTS

1. [Daily Monitoring Tasks](#daily-monitoring-tasks)
2. [Uptime Monitoring Setup](#uptime-monitoring-setup)
3. [Error Tracking Setup](#error-tracking-setup)
4. [Performance Monitoring](#performance-monitoring)
5. [Backup Verification](#backup-verification)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Maintenance Schedule](#maintenance-schedule)

---

## 🔍 DAILY MONITORING TASKS

### Morning Check (5 minutes)

Every morning, verify:

```bash
# 1. Frontend Accessibility
curl -I https://karsathi.co.in
# Expected: HTTP/2 200

# 2. API Health
curl https://api.karsathi.co.in/health
# Expected: {"status":"ok"}

# 3. CORS Configuration
curl -H "Origin: https://karsathi.co.in" \
     -X OPTIONS https://api.karsathi.co.in/api/auth/login -v
# Expected: Access-Control-Allow-Origin header present

# 4. Response Time
curl -w "Frontend: %{time_total}s\n" -o /dev/null -s https://karsathi.co.in
curl -w "API: %{time_total}s\n" -o /dev/null -s https://api.karsathi.co.in/health
# Expected: < 3s for frontend, < 500ms for API
```

### Afternoon Check (5 minutes)

**In Vercel Dashboard:**
- [ ] No failed deployments
- [ ] All domains showing green status
- [ ] No build errors

**In Railway Dashboard:**
- [ ] Backend running (green status)
- [ ] No recent errors in logs
- [ ] Custom domain active

**In Error Tracking (Sentry):**
- [ ] No new critical errors
- [ ] Error rate < 0.1%

### Weekly Check (15 minutes)

**Backup Verification:**
- [ ] Latest MongoDB backup completed
- [ ] Backup size reasonable (> 1MB)
- [ ] Restore test passed (or plan restore test)

**Performance Review:**
- [ ] Average response time acceptable
- [ ] No slowdown trends
- [ ] Error rate stable

**Security Review:**
- [ ] No unauthorized access attempts
- [ ] SSL certificate valid
- [ ] Rate limiting working

---

## 🚀 UPTIME MONITORING SETUP

### Option 1: UptimeRobot (Recommended)

**Setup (5 minutes):**

1. Go to https://uptimerobot.com
2. Sign up or log in
3. Click "Add New Monitor"
4. Configure:
   - Monitor Type: HTTP(s)
   - Friendly Name: Karsathi Frontend
   - URL: `https://karsathi.co.in`
   - Check interval: 5 minutes
   - Alert contacts: Your email
5. Click "Create Monitor"
6. Repeat for API: `https://api.karsathi.co.in/health`

**Alerts:**
- You'll receive email if service down
- Gets notified when service back up

### Option 2: Pingdom

1. Go to https://www.pingdom.com
2. Sign up
3. Add Monitor
4. Enter URL: `https://karsathi.co.in`
5. Set check interval
6. Add alert email

### Option 3: Better Uptime

1. Go to https://betteruptime.com
2. Sign up
3. Add Monitor
4. Configure endpoints
5. Set up status page (optional)

---

## 🔴 ERROR TRACKING SETUP (Sentry)

### Configure Sentry for Frontend

**1. Create Project**
- Go to https://sentry.io
- Sign up / Log in
- Create new project
- Select Platform: React

**2. Get DSN**
- Copy provided DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

**3. Add to Vercel**
- Go to Vercel Settings → Environment Variables
- Add: `NEXT_PUBLIC_SENTRY_DSN` = `[copied DSN]`
- Redeploy frontend

**4. Verify**
- Open frontend in browser
- Check browser console
- Trigger test error to verify tracking

### Configure Sentry for Backend

**1. In Railway Environment Variables**
- Add: `SENTRY_DSN` = `[Your Sentry DSN]`

**2. In Backend Code**
Already configured if you have this in `server.js`:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

**3. Verify**
- Check Sentry dashboard for events
- Should see test events from frontend/backend

### Sentry Alert Configuration

1. Go to Project Settings → Alerts
2. Create Alert Rule:
   - Trigger: Error rate > 1% in 5 minutes
   - Action: Send email to team
3. Create Alert Rule:
   - Trigger: New error event
   - Action: Send Slack notification

---

## 📈 PERFORMANCE MONITORING

### Check Response Times

```bash
# Frontend Performance
curl -w "\nFrontend Performance:\n" https://karsathi.co.in | tail -1
# Track: Time to first byte (TTFB)

# API Performance
curl -w "\nAPI Performance:\n" https://api.karsathi.co.in/health | tail -1
# Track: API response time

# Database Performance
curl -w "\n" https://api.karsathi.co.in/api/users/profile | tail -1
# Track: Complex query response time
```

### Set Performance Thresholds

**Good Performance:**
- Frontend page load: 0-3 seconds
- API response: 0-500ms
- Database query: 0-200ms

**Acceptable Performance:**
- Frontend page load: 3-5 seconds
- API response: 500-1000ms
- Database query: 200-500ms

**Performance Issue:**
- Frontend page load: > 5 seconds
- API response: > 1000ms
- Database query: > 500ms

### Vercel Performance Analytics

1. Go to Vercel Dashboard
2. Analytics (if on Pro plan)
3. Check:
   - Page load times
   - Core Web Vitals (LCP, CLS, FID)
   - Traffic distribution

---

## 💾 BACKUP VERIFICATION

### Daily Check (Morning)

```bash
# Check if backup was created today
ls -lah backups/

# Expected: Recent backup file (within last 24 hours)
# Format: karsathi-backup-2026-04-23.tar.gz
```

### Weekly Restore Test (Saturday Morning)

**Purpose:** Ensure backups are restorable

```bash
# 1. List available backups
ls backups/

# 2. Test restore (to temporary database)
# Run restore script with test flag
./scripts/restore-database.sh --backup backups/karsathi-backup-2026-04-23.tar.gz --test

# Expected: Script verifies backup integrity
```

### Monthly Full Backup

```bash
# Create full backup manually
./scripts/backup-database.sh --full

# Verify backup
file backups/karsathi-backup-full-*.tar.gz
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: High Error Rate

**Symptom:** Sentry shows > 1% error rate

**Diagnosis:**
```bash
# Check API logs
# In Railway: Logs tab

# Check most common error
curl https://api.karsathi.co.in/health

# Check database connection
# Verify MONGODB_URI in Railway variables
```

**Solution:**
1. Check error type in Sentry
2. View error stack trace
3. Fix in code
4. Commit to Git
5. Wait for automatic redeploy

### Issue 2: Slow Response Times

**Symptom:** API taking > 2 seconds to respond

**Diagnosis:**
```bash
# Test API response time
curl -w "Time: %{time_total}s\n" https://api.karsathi.co.in/api/users/profile

# Check database query time
# Check for slow queries in MongoDB Atlas
```

**Solution:**
1. Optimize database queries
2. Add indexes if needed
3. Consider caching
4. Upgrade Railway plan if CPU/memory bottleneck

### Issue 3: Domain Not Resolving

**Symptom:** Browser shows "DNS_PROBE_FINISHED_NXDOMAIN"

**Diagnosis:**
```bash
nslookup karsathi.co.in
# Should return IP address
```

**Solution:**
1. Check GoDaddy DNS settings
2. Verify A and CNAME records
3. Wait 5-30 minutes for propagation
4. Flush DNS cache: `ipconfig /flushdns`

### Issue 4: CORS Errors

**Symptom:** Browser console: "CORS policy: Cross-Origin Request Blocked"

**Diagnosis:**
```bash
curl -H "Origin: https://karsathi.co.in" -X OPTIONS https://api.karsathi.co.in/api/auth/login -v
# Check response headers
```

**Solution:**
1. Verify CORS_ORIGINS in Railway
2. Ensure it includes: `https://karsathi.co.in`
3. Redeploy backend
4. Check that API URL in frontend is HTTPS

### Issue 5: SSL Certificate Error

**Symptom:** Browser shows security warning

**Solution:**
1. Wait 5-10 minutes for certificate generation
2. Hard refresh: Ctrl+F5
3. Clear browser cache
4. Try different browser
5. Contact support if persists

---

## 🔧 MAINTENANCE SCHEDULE

### Daily (Automated)

- ✅ Uptime monitoring (UptimeRobot)
- ✅ Error tracking (Sentry)
- ✅ Database backup (GitHub Actions)

### Weekly (Manual Check)

**Monday Morning:**
- [ ] Review uptime report
- [ ] Check error trends
- [ ] Verify backup integrity
- [ ] Review performance metrics

**Thursday:**
- [ ] Test backup restore
- [ ] Update security patches (if any)
- [ ] Review user reports/feedback

### Monthly

**First of Month:**
- [ ] Full system health check
- [ ] Review capacity utilization
- [ ] Plan upgrades if needed
- [ ] Rotate secrets/API keys
- [ ] Update documentation

**Last Friday of Month:**
- [ ] Performance review
- [ ] Optimization planning
- [ ] Plan next month improvements

---

## 📞 INCIDENT RESPONSE

### Severity Levels

**🔴 Critical (0-30 minutes)**
- Service completely down
- Data loss detected
- Security breach detected
- All users affected

**🟠 High (30 minutes - 4 hours)**
- Service intermittently unavailable
- Major feature broken
- Significant performance degradation
- Group of users affected

**🟡 Medium (4-24 hours)**
- Minor feature broken
- Slow performance
- Small user group affected

**🟢 Low (No urgency)**
- Cosmetic issue
- Minor bug
- Single user affected

### Critical Issue Response

**Step 1 (Immediately):**
1. Alert team in Slack/Email
2. Create incident ticket
3. Start status page (if applicable)

**Step 2 (Within 5 minutes):**
1. Check uptime monitoring
2. Check error tracking
3. Check application logs
4. Identify root cause

**Step 3 (Fix):**
1. Implement fix
2. Test locally
3. Deploy to production
4. Verify issue resolved

**Step 4 (Communication):**
1. Update status page
2. Notify users
3. Document incident
4. Conduct post-mortem

---

## 🚨 EMERGENCY ROLLBACK

**If deployment causes issues:**

### Frontend Rollback (Vercel)
```
1. Go to Vercel → Deployments
2. Find last working deployment
3. Click "Promote to Production"
4. Wait for deployment complete
```

### Backend Rollback (Railway)
```
1. Go to Railway → Deployments
2. Find last working deployment
3. Click "Redeploy"
4. Wait for deployment complete
```

### Git Rollback
```bash
git log --oneline
git revert <commit-hash>
git push origin main
# Auto redeploy in 5 minutes
```

---

## 📊 MONITORING DASHBOARD

### Create Monitoring Dashboard

**Spreadsheet Template:**
```
Date | Frontend (ms) | API (ms) | Error Rate | Uptime | Notes
-----|--------------|---------|-----------|--------|-------
4/23 |     1200     |   250   |   0.02%   |  100%  | All good
4/24 |     1150     |   245   |   0.01%   |  100%  | All good
```

### Metrics to Track

- Frontend response time
- API response time
- Error rate
- Uptime percentage
- User count (daily active)
- Database size growth
- Backup success rate

---

## 📞 CONTACTS & RESOURCES

**When Issues Occur:**

1. **Vercel Support:** https://vercel.com/help
2. **Railway Support:** https://docs.railway.app/support
3. **GoDaddy Support:** https://www.godaddy.com/help
4. **MongoDB Support:** https://www.mongodb.com/support
5. **Sentry Documentation:** https://docs.sentry.io

**Internal Contacts:**
- Backend Lead: _____________
- Frontend Lead: _____________
- DevOps Engineer: _____________
- On-Call Engineer: _____________

---

## ✅ MAINTENANCE CHECKLIST

**Weekly Checklist:**

- [ ] Uptime report reviewed
- [ ] Error rate acceptable
- [ ] Performance metrics good
- [ ] Backup completed successfully
- [ ] No security incidents
- [ ] All systems operational

**Monthly Checklist:**

- [ ] Security patches applied
- [ ] Capacity planning reviewed
- [ ] Documentation updated
- [ ] Team trained on procedures
- [ ] Incident reports reviewed
- [ ] Performance optimized

---

**Status:** ✅ Production Monitoring Active  
**Last Updated:** April 23, 2026  
**Next Review:** April 30, 2026
