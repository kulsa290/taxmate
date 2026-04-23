# ⚡ KARSATHI DEPLOYMENT - QUICK REFERENCE

## 🎯 TL;DR - 10 MINUTE DEPLOYMENT

### 1️⃣ DNS Setup (GoDaddy) - 3 Records
```
A Record:    @ → 76.76.19.112 (Vercel IP)
CNAME:       www → cname.vercel-dns.com
CNAME:       api → [Railway CNAME]
```

### 2️⃣ Vercel - Frontend
```
1. Add Environment Variables:
   - NEXT_PUBLIC_API_URL = https://api.karsathi.co.in
   - NEXT_PUBLIC_APP_URL = https://karsathi.co.in
   - NEXT_PUBLIC_APP_NAME = Karsathi

2. Add Custom Domains:
   - karsathi.co.in (Primary)
   - www.karsathi.co.in

3. Redeploy:
   - git push origin main
   (or Deployments → Redeploy latest)
```

### 3️⃣ Railway - Backend
```
1. Add Environment Variables:
   - CORS_ORIGINS = https://karsathi.co.in,https://www.karsathi.co.in
   - CLIENT_URL = https://karsathi.co.in
   - API_BASE_URL = https://api.karsathi.co.in
   - APP_NAME = Karsathi
   - SMTP_FROM = noreply@karsathi.co.in

2. Add Custom Domain:
   - api.karsathi.co.in

3. Redeploy:
   - git push origin main
```

### 4️⃣ Verify
```bash
# Frontend
curl -I https://karsathi.co.in
# Expected: 200 OK

# API
curl https://api.karsathi.co.in/health
# Expected: {"status":"ok"}

# CORS
curl -H "Origin: https://karsathi.co.in" \
     -X OPTIONS https://api.karsathi.co.in/api/auth/login -v
# Expected: Access-Control-Allow-Origin: https://karsathi.co.in
```

---

## 🔍 VERIFY DNS PROPAGATION

```bash
# Check each record
nslookup karsathi.co.in
nslookup www.karsathi.co.in
nslookup api.karsathi.co.in

# Or use dig
dig karsathi.co.in
dig www.karsathi.co.in +short
dig api.karsathi.co.in +short
```

---

## 📋 REQUIRED ENVIRONMENT VARIABLES

### Backend (Railway)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CORS_ORIGINS=https://karsathi.co.in,https://www.karsathi.co.in
CLIENT_URL=https://karsathi.co.in
API_BASE_URL=https://api.karsathi.co.in
APP_NAME=Karsathi
SMTP_FROM=noreply@karsathi.co.in
OPENAI_API_KEY=<your-openai-key>
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://api.karsathi.co.in
NEXT_PUBLIC_APP_URL=https://karsathi.co.in
NEXT_PUBLIC_APP_NAME=Karsathi
```

---

## 🚨 TROUBLESHOOTING

### Domain shows "GoDaddy" or doesn't load
- [ ] Wait 10-30 minutes for DNS propagation
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Try incognito/private browsing
- [ ] Check DNS with: `nslookup karsathi.co.in`

### "Cannot POST /api/..." (CORS Error)
```bash
# Check CORS headers
curl -H "Origin: https://karsathi.co.in" \
     -X OPTIONS https://api.karsathi.co.in/api/auth/login -v

# Should see:
# Access-Control-Allow-Origin: https://karsathi.co.in
```
- [ ] Verify `CORS_ORIGINS` in Railway
- [ ] Redeploy backend after changing CORS

### "Mixed Content" Error
- [ ] Frontend API URL must be HTTPS
- [ ] Check: `NEXT_PUBLIC_API_URL=https://api.karsathi.co.in`
- [ ] Redeploy frontend

### API doesn't respond
```bash
curl https://api.karsathi.co.in/health
```
- [ ] Check Railway deployment status
- [ ] Check Railway logs for errors
- [ ] Verify custom domain is active in Railway

---

## 📊 PERFORMANCE CHECKS

```bash
# Frontend load time
curl -w "Time: %{time_total}s\n" -o /dev/null -s https://karsathi.co.in
# Target: < 3 seconds

# API response time
curl -w "Time: %{time_total}s\n" -o /dev/null -s https://api.karsathi.co.in/health
# Target: < 500ms
```

---

## 🔄 ROLLBACK

**If deployment fails:**

### Vercel Rollback
1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

### Railway Rollback
1. Go to Deployments
2. Find last working deployment
3. Click "Redeploy"

### Git Rollback
```bash
git log --oneline
git revert <commit-hash>
git push origin main
# Automatic redeploy
```

---

## ✅ FINAL CHECKLIST

- [ ] DNS records added (A + 2 CNAMEs)
- [ ] DNS resolves (nslookup works)
- [ ] Vercel custom domain added
- [ ] Railway custom domain added
- [ ] Environment variables set (both)
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] https://karsathi.co.in loads
- [ ] https://api.karsathi.co.in/health returns 200
- [ ] CORS working (no errors)
- [ ] Features working (login, etc)
- [ ] SSL certificate valid
- [ ] Monitoring active

---

## 📞 QUICK LINKS

- **Vercel:** https://vercel.com/dashboard
- **Railway:** https://railway.app/dashboard
- **GoDaddy DNS:** https://www.godaddy.com/domain/manage
- **DNS Check:** https://www.whatsmydns.net/
- **SSL Check:** https://www.ssllabs.com/ssltest/

---

**Status:** 🚀 Ready to Deploy  
**Time to Deploy:** ~10 minutes  
**Complexity:** Low
