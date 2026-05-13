#!/bin/bash
# Vercel Deployment Setup Script
# This script prepares your TaxMate application for Vercel deployment

set -e

echo "🚀 TaxMate Vercel Deployment Setup"
echo "=================================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ required. Current: $(node -v)"
    exit 1
fi
echo "✓ Node.js version: $(node -v)"

# Check git
echo ""
echo "✓ Checking Git..."
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed"
    exit 1
fi
echo "✓ Git version: $(git --version)"

# Verify repository structure
echo ""
echo "✓ Verifying project structure..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in root"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "❌ frontend directory not found"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found"
    exit 1
fi

if [ ! -d "src" ]; then
    echo "❌ src directory (backend) not found"
    exit 1
fi
echo "✓ Project structure verified"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# Build backend verification
echo ""
echo "🔨 Verifying backend..."
npm run verify:backend

# Build frontend
echo ""
echo "🔨 Building frontend..."
npm --prefix frontend run build

# Check environment template
echo ""
echo "📋 Environment variables check..."
if [ ! -f ".env.example" ]; then
    echo "⚠️  .env.example not found - creating template..."
    cat > .env.example << 'EOF'
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
EOF
    echo "✓ .env.example created"
else
    echo "✓ .env.example exists"
fi

# Check .gitignore
echo ""
echo "🔒 Verifying .gitignore..."
if ! grep -q "\.env" .gitignore 2>/dev/null; then
    echo "⚠️  .env not in .gitignore - adding..."
    echo ".env" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.*.local" >> .gitignore
fi
echo "✓ .gitignore configured"

# Git status
echo ""
echo "📊 Git status..."
git add .
if git diff --cached --quiet; then
    echo "✓ No changes to commit"
else
    echo "⚠️  Uncommitted changes detected"
    echo ""
    echo "Stage changes with: git add ."
    echo "Commit with: git commit -m 'Vercel deployment setup'"
    echo "Push with: git push origin main"
fi

# Summary
echo ""
echo "✅ Vercel Deployment Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Commit and push to GitHub:"
echo "   git commit -m 'Prepare for Vercel deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://vercel.com/new"
echo "3. Import your GitHub repository"
echo "4. Add environment variables in Vercel dashboard"
echo "5. Click Deploy"
echo ""
echo "📖 Documentation:"
echo "   - Deployment Guide: VERCEL_DEPLOYMENT_GUIDE.md"
echo "   - Checklist: VERCEL_DEPLOYMENT_CHECKLIST.md"
echo ""
echo "🔗 Required Environment Variables:"
echo "   - MONGO_URI (MongoDB connection string)"
echo "   - JWT_SECRET (32+ character random string)"
echo "   - OPENAI_API_KEY (from OpenAI)"
echo "   - CORS_ORIGINS (your Vercel domain)"
echo ""
echo "Deploying to Vercel with these settings:"
cat vercel.json | grep -E '"buildCommand"|"outputDirectory"|"framework"'
echo ""
echo "Happy deploying! 🚀"
