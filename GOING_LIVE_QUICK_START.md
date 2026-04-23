# 🚀 GOING LIVE - 5-MINUTE QUICK START

## ⚡ TL;DR - Make It Live Now

### For Windows (PowerShell)
```powershell
# 1. Generate secrets template
.\scripts\setup-github-secrets.ps1 -Mode Generate

# 2. Edit .env.secrets.template with your actual values
notepad .env.secrets.template

# 3. Load secrets to GitHub
.\scripts\setup-github-secrets.ps1 -Mode FromFile -FilePath .env.secrets.template

# 4. Push to GitHub
git add .
git commit -m "chore: add DevOps infrastructure live"
git push origin main
```

### For macOS/Linux (Bash)
```bash
# 1. Install GitHub CLI if needed
brew install gh

# 2. Authenticate
gh auth login

# 3. Generate secrets template
./scripts/setup-github-secrets.sh -g

# 4. Edit .env.secrets.template with your actual values
nano .env.secrets.template

# 5. Load secrets to GitHub
./scripts/setup-github-secrets.sh -f .env.secrets.template

# 6. Push to GitHub
git add .
git commit -m "chore: add DevOps infrastructure live"
git push origin main
```

---

## ✅ What Gets Deployed

After you push, these workflows become LIVE:

| Workflow | Trigger | What It Does |
|----------|---------|------------|
| **CI** | Every PR | Tests, security scan, builds |
| **Performance** | Weekly Sun 2AM UTC | Load & stress testing |
| **Backup** | Daily 2AM UTC | Database backups to S3 |
| **Deploy** | Push to main | Auto-deploy to production |
| **Security** | Weekly + on PR | 6+ security scanners |

---

## 🔑 Required Secrets (Minimum)

You MUST set these in GitHub Settings > Secrets:

```
MONGODB_PROD_URI          - Your MongoDB connection string
JWT_SECRET_PROD           - Random 32+ character string
OPENAI_API_KEY_PROD       - Your OpenAI API key
AWS_ACCESS_KEY_ID         - AWS IAM access key
AWS_SECRET_ACCESS_KEY     - AWS IAM secret key
AWS_BACKUP_BUCKET         - S3 bucket name
CODECOV_TOKEN             - From codecov.io
```

**To set these:**

**Option A: Interactive (Recommended)**
```bash
# Unix/Mac
./scripts/setup-github-secrets.sh -i

# Windows
.\scripts\setup-github-secrets.ps1 -Mode Interactive
```

**Option B: Web UI**
1. Go to: Repository > Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add each secret one by one

---

## 📋 Step-by-Step (Fastest Way)

### Step 1: Clone & Navigate
```bash
cd e:\taxmate-backend
# or: cd ~/taxmate-backend
```

### Step 2: Setup Secrets (Choose One)

**A. If you have GitHub CLI installed:**
```bash
# Windows
.\scripts\setup-github-secrets.ps1 -Mode Interactive

# Mac/Linux
./scripts/setup-github-secrets.sh -i
```

**B. If you don't have GitHub CLI:**
- Go to GitHub.com > Your Repository
- Settings > Secrets and variables > Actions
- Add secrets manually from `GOING_LIVE_CHECKLIST.md`

### Step 3: Push Code
```bash
git add .
git commit -m "chore: deploy DevOps infrastructure"
git push origin main
```

### Step 4: Watch It Deploy
- Go to GitHub > Actions tab
- See workflows running automatically
- 🎉 You're live!

---

## ✨ What Happens Next (Automatically)

✅ GitHub runs tests on every PR  
✅ GitHub deploys code to staging on push to `develop`  
✅ GitHub deploys code to production on push to `main`  
✅ Database backups run daily at 2 AM UTC  
✅ Performance tests run weekly  
✅ Security scans run before every merge  

---

## 🚨 Troubleshooting Quick Fixes

**"Workflow not running?"**
- Workflows must be in `.github/workflows/` folder ✅ (they are)
- May need to enable Actions in Settings

**"Deployment failed?"**
- Check GitHub Secrets are set
- Review Actions logs for error

**"Tests failing?"**
- Run locally first: `npm test`
- Fix locally, then push

**"Can't set secrets?"**
- Verify GitHub CLI is installed: `gh --version`
- Login: `gh auth login`
- Or use web UI instead

---

## 📞 Need Help?

- **Full Guide**: Read [GOING_LIVE_CHECKLIST.md](./GOING_LIVE_CHECKLIST.md)
- **DevOps Docs**: Read [DEVOPS_GUIDE.md](./DEVOPS_GUIDE.md)
- **Environment Setup**: Read [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md)

---

## 🎯 Success Indicators

After 5-10 minutes, you should see:

✅ GitHub Actions > CI/CD Pipeline showing green checkmark  
✅ Security scan completed without errors  
✅ Docker build successful  
✅ All tests passing  

That's it! You're LIVE! 🚀

---

**Status:** ✅ Production Ready  
**Time to Deploy:** 5 minutes  
**Effort Level:** Minimal  
**Automation:** Maximum  
