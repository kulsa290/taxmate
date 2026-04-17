# TaxMate Production Deployment Guide

This guide productionizes TaxMate for:

- Backend on Render
- Frontend on Vercel
- Database on MongoDB Atlas
- CI and CD through GitHub Actions
- Custom domains with HTTPS

## 1. Required GitHub Secrets

Add these repository secrets in GitHub: Settings > Secrets and variables > Actions.

Required secrets:

- `MONGO_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Notes:

- `MONGO_URI` and `OPENAI_API_KEY` are used only in secure environments.
- `RENDER_SERVICE_ID` is required because Render deploys are triggered through its API.
- Vercel deployments from GitHub Actions require both `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` in addition to `VERCEL_TOKEN`.

## 2. GitHub Actions Workflows

Files added:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

Behavior:

- Pull requests to `main` run backend and frontend validation.
- Pushes to `main` run pre-deploy checks, then:
  - trigger a Render backend deployment
  - build and deploy the frontend to Vercel

## 3. Render Backend Setup

### Create the Render service

1. Create a new Web Service in Render.
2. Connect the GitHub repository.
3. Set the root directory to the repository root.
4. Use these values:

- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/health`

### Configure environment variables in Render

Use the values from `.env.production.example`.

Minimum required:

- `NODE_ENV=production`
- `MONGO_URI=<your-mongodb-atlas-uri>`
- `JWT_SECRET=<your-secret>`
- `OPENAI_API_KEY=<your-openai-key>`
- `OPENAI_MODEL=gpt-4o-mini`
- `CORS_ORIGINS=https://app.taxmate.in`
- `FORCE_HTTPS=true`
- `TRUST_PROXY=1`

### Scaling on Render

Render autoscaling depends on your plan.

Recommended setup:

1. Use at least the Starter plan for persistent service behavior.
2. In Render Dashboard, open the service settings.
3. Enable autoscaling if your plan supports it.
4. Start with:
   - 512 MB to 1 GB memory
   - 0.5 to 1 CPU
   - MongoDB pool sizes from `.env.production.example`

## 4. Vercel Frontend Setup

### Create the Vercel project

1. Import the same GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Use these values:

- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `build`

### Configure environment variables in Vercel

Add:

- `REACT_APP_API_BASE_URL=https://api.taxmate.in`

This ensures the production frontend calls the Render backend instead of the local proxy.

## 5. Custom Domain Setup

Target domains:

- Frontend: `app.taxmate.in`
- Backend: `api.taxmate.in`

### Vercel DNS for `app.taxmate.in`

In Vercel:

1. Open the project.
2. Go to Settings > Domains.
3. Add `app.taxmate.in`.
4. Vercel will show the exact record required.

Typical record:

- Type: `CNAME`
- Host: `app`
- Value: `cname.vercel-dns.com`

### Render DNS for `api.taxmate.in`

In Render:

1. Open the backend service.
2. Go to Settings > Custom Domains.
3. Add `api.taxmate.in`.
4. Render will show the exact target hostname.

Typical record:

- Type: `CNAME`
- Host: `api`
- Value: `<your-render-service>.onrender.com`

### DNS Notes

- Use `CNAME` for both `app` and `api` because both are subdomains.
- Do not point `app` to the Render backend.
- Do not point `api` to Vercel.

## 6. HTTPS Setup

HTTPS is automatic on both platforms after the custom domain is verified.

What is already handled in code:

- The backend redirects HTTP requests to HTTPS when `NODE_ENV=production` and `FORCE_HTTPS=true`.
- Helmet is enabled.
- CORS is restricted to approved frontend origins.

What you still need to do:

1. Complete domain verification in Render and Vercel.
2. Wait for SSL certificates to be issued.
3. Test the live endpoints.

## 7. Environment Separation

Development files:

- `.env.example`
- `frontend/.env.example`

Production templates:

- `.env.production.example`
- `frontend/.env.production.example`

Rules:

- Never commit `.env` or `.env.production`.
- Use local `.env` files only for development.
- Use Render and Vercel dashboards for production secrets.

## 8. Logging, Error Handling, and Health Checks

The backend now includes:

- centralized error handling
- structured production logs
- request IDs on responses
- `/health` endpoint for Render health checks
- rate limiting for general and auth routes
- gzip compression

## 9. Deployment Verification Steps

Run these after deployment:

### Backend verification

```bash
curl https://api.taxmate.in/health
```

Expected result:

- HTTP 200
- JSON response with `success: true`
- `database: connected`

### Frontend verification

```bash
curl -I https://app.taxmate.in
```

Expected result:

- `HTTP/1.1 200 OK`
- `server: Vercel`

### DNS verification

```bash
nslookup app.taxmate.in
nslookup api.taxmate.in
```

### GitHub Actions verification

1. Push a commit to `main`.
2. Open the Actions tab in GitHub.
3. Confirm:
   - `TaxMate CI` passes on PRs
   - `TaxMate Deploy` passes on main pushes

## 10. Common Failure Fixes

### CORS errors in browser

Cause:

- `CORS_ORIGINS` does not include `https://app.taxmate.in`

Fix:

- Update Render environment variable `CORS_ORIGINS=https://app.taxmate.in`
- Redeploy the backend

### Frontend calls localhost in production

Cause:

- `REACT_APP_API_BASE_URL` is missing in Vercel

Fix:

- Add `REACT_APP_API_BASE_URL=https://api.taxmate.in`
- Redeploy Vercel

### Render deploys but health check fails

Cause:

- bad start command
- missing environment variables
- MongoDB not reachable

Fix:

- Confirm Render Start Command is `npm start`
- Confirm Health Check Path is `/health`
- Confirm Atlas network access allows Render traffic

### MongoDB Atlas connection fails in production

Cause:

- invalid URI
- Atlas IP or network rules block Render

Fix:

- verify `MONGO_URI`
- allow the Render service through Atlas network access rules
- if SRV lookup issues continue, use the direct replica set URI format shown in `.env.example`

### GitHub Action fails on Render deploy step

Cause:

- `RENDER_API_KEY` or `RENDER_SERVICE_ID` is missing or incorrect

Fix:

- re-copy both secrets into GitHub Actions secrets
- confirm the service id belongs to the correct Render backend service

### GitHub Action fails on Vercel deploy step

Cause:

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID` is wrong

Fix:

- run `vercel link` locally inside `frontend`
- use the resulting `.vercel/project.json` values to populate GitHub secrets

## 11. Copy-Paste Commands

### Local verification before push

```bash
cd E:\taxmate-backend
npm ci
npm --prefix frontend ci
npm run verify:backend
npm run build:frontend
```

### Optional GitHub CLI setup for secrets

```bash
winget install --id GitHub.cli
gh auth login
gh secret set MONGO_URI
gh secret set JWT_SECRET
gh secret set OPENAI_API_KEY
gh secret set RENDER_API_KEY
gh secret set RENDER_SERVICE_ID
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

### Push to trigger production deployment

```bash
git add .
git commit -m "chore: productionize deployment pipeline"
git push origin main
```