# Simple Vercel Deployment Setup for TaxMate
Write-Host "TaxMate Vercel Deployment Setup" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Step 1: Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node -v
Write-Host "Node version: $nodeVersion" -ForegroundColor Green

# Step 2: Install dependencies
Write-Host ""
Write-Host "[2/5] Installing dependencies..." -ForegroundColor Cyan
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm ci failed" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed" -ForegroundColor Green

# Step 3: Build frontend
Write-Host ""
Write-Host "[3/5] Building frontend..." -ForegroundColor Cyan
npm --prefix frontend run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend built successfully" -ForegroundColor Green

# Step 4: Verify backend
Write-Host ""
Write-Host "[4/5] Verifying backend..." -ForegroundColor Cyan
npm run verify:backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend verification failed" -ForegroundColor Red
    exit 1
}
Write-Host "Backend verified" -ForegroundColor Green

# Step 5: Check git status
Write-Host ""
Write-Host "[5/5] Git status..." -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "SETUP COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Commit changes: git add . && git commit -m 'Prepare for Vercel deployment'"
Write-Host "2. Push to GitHub: git push origin main"
Write-Host "3. Go to https://vercel.com/new"
Write-Host "4. Import your GitHub repository"
Write-Host "5. Add these environment variables in Vercel dashboard:"
Write-Host ""
Write-Host "   Required:"
Write-Host "   - NODE_ENV: production"
Write-Host "   - MONGO_URI: mongodb+srv://user:password@cluster.mongodb.net/dbname"
Write-Host "   - JWT_SECRET: (generate a secure 32+ character string)"
Write-Host "   - OPENAI_API_KEY: sk-..."
Write-Host ""
Write-Host "   CORS:"
Write-Host "   - CORS_ORIGINS: https://yourdomain.vercel.app"
Write-Host ""
Write-Host "6. Click Deploy!"
Write-Host ""
Write-Host "Documentation: VERCEL_DEPLOYMENT_GUIDE.md"
