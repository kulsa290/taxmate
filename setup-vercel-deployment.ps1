# Vercel Deployment Setup Script for Windows
# This script prepares your TaxMate application for Vercel deployment

Write-Host "🚀 TaxMate Vercel Deployment Setup" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

# Check Node.js version
Write-Host "✓ Checking Node.js version..." -ForegroundColor Cyan
$nodeVersion = (node -v | Select-String -Pattern '\d+' -AllMatches | Select-Object -First 1).Matches[0].Value
if ([int]$nodeVersion -lt 20) {
    Write-Host "❌ Node.js 20+ required. Current: $(node -v)" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js version: $(node -v)" -ForegroundColor Green

# Check git
Write-Host ""
Write-Host "✓ Checking Git..." -ForegroundColor Cyan
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Git version: $(git --version)" -ForegroundColor Green

# Verify repository structure
Write-Host ""
Write-Host "✓ Verifying project structure..." -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found in root" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "frontend" -PathType Container)) {
    Write-Host "❌ frontend directory not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "vercel.json")) {
    Write-Host "❌ vercel.json not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "src" -PathType Container)) {
    Write-Host "❌ src directory (backend) not found" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Project structure verified" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm ci failed" -ForegroundColor Red
    exit 1
}

# Build backend verification
Write-Host ""
Write-Host "🔨 Verifying backend..." -ForegroundColor Cyan
npm run verify:backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend verification failed" -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host ""
Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm --prefix frontend run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

# Check environment template
Write-Host ""
Write-Host "📋 Environment variables check..." -ForegroundColor Cyan

if (-not (Test-Path ".env.example")) {
    Write-Host "⚠️  .env.example not found - creating template..." -ForegroundColor Yellow
    $envTemplate = @"
# Node Environment
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your-secure-jwt-secret-32-characters-minimum

# External APIs
OPENAI_API_KEY=sk-your-openai-api-key

# CORS
CORS_ORIGINS=https://yourdomain.vercel.app,https://www.yourdomain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
AUTH_RATE_LIMIT_MAX_REQUESTS=20

# Database Connection Pool
MONGODB_MAX_POOL_SIZE=50
MONGODB_MIN_POOL_SIZE=10
MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=45000

# Security
FORCE_HTTPS=true
TRUST_PROXY=1

# Features
ENABLE_SWAGGER=true
OPENAI_MODEL=gpt-4o-mini
"@
    $envTemplate | Out-File -FilePath ".env.example" -Encoding UTF8
    Write-Host "✓ .env.example created" -ForegroundColor Green
} else {
    Write-Host "✓ .env.example exists" -ForegroundColor Green
}

# Check .gitignore
Write-Host ""
Write-Host "🔒 Verifying .gitignore..." -ForegroundColor Cyan

if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore"
    if ($gitignoreContent -notmatch "\.env") {
        Write-Host "⚠️  .env not in .gitignore - adding..." -ForegroundColor Yellow
        ".env" | Add-Content ".gitignore"
        ".env.local" | Add-Content ".gitignore"
        ".env.*.local" | Add-Content ".gitignore"
    }
} else {
    @".env
.env.local
.env.*.local
node_modules/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
}
Write-Host "✓ .gitignore configured" -ForegroundColor Green

# Git status
Write-Host ""
Write-Host "📊 Git status..." -ForegroundColor Cyan
git add .
$status = git status --short
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
} else {
    Write-Host "⚠️  Uncommitted changes detected" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Stage changes with: git add ." -ForegroundColor Yellow
    Write-Host "Commit with: git commit -m Vercel deployment setup" -ForegroundColor Yellow
    Write-Host "Push with: git push origin main" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "✅ Vercel Deployment Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push to GitHub:" -ForegroundColor White
Write-Host "   git commit -m Prepare for Vercel deployment" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Go to https://vercel.com/new" -ForegroundColor White
Write-Host "3. Import your GitHub repository" -ForegroundColor White
Write-Host "4. Add environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "5. Click Deploy" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   - Deployment Guide: VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
Write-Host "   - Checklist: VERCEL_DEPLOYMENT_CHECKLIST.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Required Environment Variables:" -ForegroundColor Cyan
Write-Host "   - MONGO_URI (MongoDB connection string)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (32+ character random string)" -ForegroundColor Gray
Write-Host "   - OPENAI_API_KEY (from OpenAI)" -ForegroundColor Gray
Write-Host "   - CORS_ORIGINS (your Vercel domain)" -ForegroundColor Gray
Write-Host ""
Write-Host "Deploying to Vercel with these settings:" -ForegroundColor Cyan
$vercelConfig = Get-Content "vercel.json" | ConvertFrom-Json
Write-Host "   Build Command: $($vercelConfig.buildCommand)" -ForegroundColor Gray
Write-Host "   Output Directory: $($vercelConfig.outputDirectory)" -ForegroundColor Gray
Write-Host "   Framework: $($vercelConfig.framework)" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy deploying! 🚀" -ForegroundColor Green
