#!/bin/bash

# Railway Quick Setup Script for TaxMate
# This script helps you quickly set up Railway deployment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚂 TaxMate Railway Setup${NC}"
echo -e "${BLUE}═══════════════════════════════${NC}"

echo -e "${YELLOW}This script will help you deploy TaxMate to Railway.app${NC}"
echo ""

# Check if user wants to continue
read -p "Do you have a Railway account and GitHub repo ready? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please create a Railway account at https://railway.app${NC}"
    echo -e "${YELLOW}And connect your GitHub repository.${NC}"
    exit 0
fi

echo -e "\n${BLUE}Step 1: Railway Project Setup${NC}"
echo "1. Go to https://railway.app/new"
echo "2. Click 'Deploy from GitHub repo'"
echo "3. Connect your GitHub account"
echo "4. Select your TaxMate repository"
echo "5. Railway will detect your Dockerfile automatically"
echo ""

read -p "Have you created the Railway project? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please complete the Railway project setup first.${NC}"
    exit 0
fi

echo -e "\n${BLUE}Step 2: Environment Variables${NC}"
echo "In your Railway dashboard:"
echo "1. Go to your project"
echo "2. Click on the 'Variables' tab"
echo "3. Add these environment variables:"
echo ""

echo -e "${GREEN}Required Variables:${NC}"
echo "NODE_ENV=production"
echo "PORT=8080"
echo "MONGO_URI=your-mongodb-connection-string"
echo "JWT_SECRET=your-64-character-jwt-secret"
echo "OPENAI_API_KEY=your-openai-api-key"
echo "CORS_ORIGINS=https://your-railway-app.railway.app"
echo ""

echo -e "${YELLOW}Note: Get your Railway app URL from Railway > Settings > Domains${NC}"
echo ""

read -p "Have you set the environment variables? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please set the environment variables in Railway dashboard.${NC}"
    exit 0
fi

echo -e "\n${BLUE}Step 3: Deploy${NC}"
echo "Railway will automatically deploy when you push to GitHub."
echo ""
echo -e "${GREEN}To deploy now:${NC}"
echo "git add ."
echo "git commit -m 'Deploy to Railway'"
echo "git push origin main"
echo ""

echo -e "\n${BLUE}Step 4: Verify Deployment${NC}"
echo "After deployment:"
echo "1. Check Railway dashboard for deployment status"
echo "2. Visit your app URL"
echo "3. Check /health endpoint"
echo "4. Test API endpoints at /api-docs"
echo ""

echo -e "\n${GREEN}🎉 Railway setup completed!${NC}"
echo -e "${GREEN}Your TaxMate app will be available at your Railway domain.${NC}"
echo ""

echo -e "${BLUE}Useful commands:${NC}"
echo "npm run railway:deploy    # Deploy using our script"
echo "railway logs              # View Railway logs (if CLI installed)"
echo ""

echo -e "${YELLOW}Need help? Check docs/railway-deployment.md${NC}"