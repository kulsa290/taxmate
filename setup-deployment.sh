#!/bin/bash

# TaxMate Deployment Setup Script
# This script helps configure automated deployment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        TaxMate Deployment Setup              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"

# Function to prompt for input
prompt_input() {
    local prompt=$1
    local default=$2
    local response

    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " response
        response=${response:-$default}
    else
        read -p "$prompt: " response
        while [ -z "$response" ]; do
            read -p "$prompt: " response
        done
    fi

    echo "$response"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate URL
validate_url() {
    local url=$1
    if [[ $url =~ ^https?:// ]]; then
        return 0
    else
        return 1
    fi
}

# Function to generate secure secret
generate_secret() {
    openssl rand -base64 32
}

# Setup MongoDB Atlas
setup_mongodb() {
    echo -e "\n${BLUE}🗄️  MongoDB Atlas Setup${NC}"
    echo "1. Go to https://cloud.mongodb.com/"
    echo "2. Create a new project called 'taxmate-prod'"
    echo "3. Create a cluster (free tier is fine)"
    echo "4. Create a database user"
    echo "5. Whitelist your IP (0.0.0.0/0 for testing)"
    echo "6. Get your connection string"

    MONGO_URI=$(prompt_input "Enter your MongoDB connection string")

    if [[ $MONGO_URI == mongodb+srv://* ]]; then
        echo -e "${GREEN}✅ MongoDB URI looks good${NC}"
    else
        echo -e "${YELLOW}⚠️  Make sure to use the SRV connection string (mongodb+srv://)${NC}"
    fi
}

# Setup Render
setup_render() {
    echo -e "\n${BLUE}🚀 Render Setup${NC}"
    echo "1. Go to https://dashboard.render.com/"
    echo "2. Connect your GitHub account"
    echo "3. Create a new Web Service"
    echo "4. Select this repository"
    echo "5. Set root directory to repository root"
    echo "6. Configure build settings:"
    echo "   - Build Command: npm ci"
    echo "   - Start Command: npm start"
    echo "   - Health Check Path: /health"

    RENDER_SERVICE_ID=$(prompt_input "Enter your Render Service ID (from URL)")

    echo "7. Go to Account Settings > API Keys"
    echo "8. Create a new API key"
    RENDER_API_KEY=$(prompt_input "Enter your Render API Key")
}

# Setup Vercel
setup_vercel() {
    echo -e "\n${BLUE}⚡ Vercel Setup${NC}"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Import this GitHub repository"
    echo "3. Set root directory to 'frontend'"
    echo "4. Configure build settings:"
    echo "   - Build Command: npm run build"
    echo "   - Output Directory: build"

    VERCEL_TOKEN=$(prompt_input "Enter your Vercel token (from Account Settings > Tokens)")

    # Get Vercel project info
    if command_exists vercel; then
        echo "Getting Vercel project information..."
        VERCEL_ORG_ID=$(vercel whoami --token="$VERCEL_TOKEN" | grep "Org ID" | cut -d: -f2 | tr -d ' ')
        VERCEL_PROJECT_ID=$(vercel ls --token="$VERCEL_TOKEN" | grep taxmate | head -1 | awk '{print $2}')
    else
        VERCEL_ORG_ID=$(prompt_input "Enter your Vercel Organization ID")
        VERCEL_PROJECT_ID=$(prompt_input "Enter your Vercel Project ID")
    fi
}

# Setup Railway
setup_railway() {
    echo -e "\n${BLUE}🚂 Railway Setup${NC}"
    echo "1. Go to https://railway.app/"
    echo "2. Sign up or log in"
    echo "3. Create a new project called 'taxmate'"
    echo "4. Railway will automatically detect your Dockerfile"
    echo ""

    echo -e "${YELLOW}Railway will use your GitHub repository for deployment.${NC}"
    echo -e "${YELLOW}Make sure your Railway project is connected to this GitHub repo.${NC}"
    echo ""

    # Railway doesn't require API keys for basic deployment
    # Environment variables will be set in Railway dashboard
    echo -e "${GREEN}✅ Railway setup completed${NC}"
    echo -e "${YELLOW}Note: You'll need to set environment variables in Railway dashboard${NC}"
}

# Setup API Keys
setup_api_keys() {
    echo -e "\n${BLUE}🔑 API Keys Setup${NC}"

    echo "Generating JWT secret..."
    JWT_SECRET=$(generate_secret)
    echo -e "${GREEN}✅ JWT Secret generated${NC}"

    echo "Get your OpenAI API key from https://platform.openai.com/api-keys"
    OPENAI_API_KEY=$(prompt_input "Enter your OpenAI API Key")
}

# Create deployment configuration
create_config() {
    echo -e "\n${BLUE}📝 Creating deployment configuration...${NC}"

    cat > .env.deploy << EOF
# TaxMate Deployment Configuration
# Generated on $(date)

# Render Configuration
RENDER_API_KEY=${RENDER_API_KEY}
RENDER_SERVICE_ID=${RENDER_SERVICE_ID}

# Vercel Configuration
VERCEL_TOKEN=${VERCEL_TOKEN}
VERCEL_ORG_ID=${VERCEL_ORG_ID}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID}

# Database & API Keys
MONGO_URI=${MONGO_URI}
JWT_SECRET=${JWT_SECRET}
OPENAI_API_KEY=${OPENAI_API_KEY}

# Domain Configuration
DOMAIN_NAME=taxmate.in
API_DOMAIN=api.taxmate.in
FRONTEND_DOMAIN=app.taxmate.in
EOF

    echo -e "${GREEN}✅ Deployment configuration created: .env.deploy${NC}"
}

# Setup GitHub Secrets
setup_github_secrets() {
    echo -e "\n${BLUE}🔐 GitHub Secrets Setup${NC}"
    echo "Add these secrets to your GitHub repository:"
    echo "Settings > Secrets and variables > Actions > Repository secrets"
    echo ""
    echo "Required secrets:"
    echo "MONGO_URI=${MONGO_URI}"
    echo "JWT_SECRET=${JWT_SECRET}"
    echo "OPENAI_API_KEY=${OPENAI_API_KEY}"

    case $DEPLOYMENT_PLATFORM in
        1)
            echo "RENDER_API_KEY=${RENDER_API_KEY}"
            echo "RENDER_SERVICE_ID=${RENDER_SERVICE_ID}"
            ;;
        2)
            echo "# Railway doesn't require API keys - set variables in Railway dashboard"
            ;;
        3)
            echo "VERCEL_TOKEN=${VERCEL_TOKEN}"
            echo "VERCEL_ORG_ID=${VERCEL_ORG_ID}"
            echo "VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID}"
            ;;
    esac

    echo ""
    echo -e "${YELLOW}⚠️  Keep these secrets secure and never commit them to git!${NC}"
}

# Test deployment
test_deployment() {
    echo -e "\n${BLUE}🧪 Testing deployment configuration...${NC}"

    # Test backend build
    echo "Testing backend build..."
    if npm run verify:backend; then
        echo -e "${GREEN}✅ Backend build test passed${NC}"
    else
        echo -e "${RED}❌ Backend build test failed${NC}"
        return 1
    fi

    # Test frontend build
    echo "Testing frontend build..."
    cd frontend
    if npm run build; then
        echo -e "${GREEN}✅ Frontend build test passed${NC}"
        cd ..
    else
        echo -e "${RED}❌ Frontend build test failed${NC}"
        cd ..
        return 1
    fi

    echo -e "${GREEN}✅ All tests passed!${NC}"
}

# Main setup function
main() {
    echo -e "${BLUE}This script will help you set up automated deployment for TaxMate.${NC}"
    echo -e "${BLUE}You'll need accounts with MongoDB Atlas and one of: Render, Railway, or Vercel.${NC}"
    echo ""

    # Choose deployment platform
    echo -e "${YELLOW}Choose your deployment platform:${NC}"
    echo "1. Render (Recommended for API)"
    echo "2. Railway (Docker-based, great for full-stack)"
    echo "3. Vercel (Frontend only)"
    echo ""

    DEPLOYMENT_PLATFORM=""
    while [[ ! $DEPLOYMENT_PLATFORM =~ ^[1-3]$ ]]; do
        read -p "Enter your choice (1-3): " DEPLOYMENT_PLATFORM
    done

    case $DEPLOYMENT_PLATFORM in
        1) PLATFORM_NAME="Render" ;;
        2) PLATFORM_NAME="Railway" ;;
        3) PLATFORM_NAME="Vercel" ;;
    esac

    echo -e "${GREEN}Selected platform: $PLATFORM_NAME${NC}"
    echo ""

    # Check prerequisites
    if ! command_exists curl; then
        echo -e "${RED}❌ curl is required. Please install it first.${NC}"
        exit 1
    fi

    if ! command_exists jq; then
        echo -e "${RED}❌ jq is required. Please install it first.${NC}"
        exit 1
    fi

    # Setup services
    setup_mongodb

    case $DEPLOYMENT_PLATFORM in
        1) setup_render ;;
        2) setup_railway ;;
        3) setup_vercel ;;
    esac

    setup_api_keys

    # Create configuration
    create_config

    # Setup GitHub secrets
    setup_github_secrets

    # Test deployment
    if test_deployment; then
        echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
        echo -e "${GREEN}You can now run automated deployments with:${NC}"
        echo -e "${GREEN}  ./deploy.sh${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Add the GitHub secrets listed above"
        echo "2. Push to main branch to trigger deployment"
        echo "3. Or run ./deploy.sh locally"
    else
        echo -e "\n${RED}❌ Setup completed with errors. Please fix the issues above.${NC}"
        exit 1
    fi
}

# Show usage
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "TaxMate Deployment Setup Script"
    echo ""
    echo "This script helps you configure automated deployment for TaxMate."
    echo ""
    echo "Prerequisites:"
    echo "  - MongoDB Atlas account"
    echo "  - Render account"
    echo "  - Vercel account"
    echo "  - curl and jq installed"
    echo ""
    echo "Usage: $0"
    exit 0
fi

# Run main setup
main
