#!/bin/bash

# TaxMate Automated Deployment Script
# This script handles the complete deployment process

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
RENDER_SERVICE_NAME="taxmate-api"
VERCEL_PROJECT_NAME="taxmate-frontend"
DOMAIN_NAME="taxmate.in"

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        TaxMate Automated Deployment          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect deployment platform
detect_platform() {
    if [ -n "$RENDER_API_KEY" ] && [ -n "$RENDER_SERVICE_ID" ]; then
        echo "render"
    elif [ -n "$VERCEL_TOKEN" ] && [ -n "$VERCEL_ORG_ID" ]; then
        echo "vercel"
    else
        # Default to Railway if no specific platform detected
        echo "railway"
    fi
}

# Function to check environment variables
check_env_vars() {
    local platform=$(detect_platform)
    local missing_vars=()

    # Common required variables
    if [ -z "$MONGO_URI" ]; then missing_vars+=("MONGO_URI"); fi
    if [ -z "$JWT_SECRET" ]; then missing_vars+=("JWT_SECRET"); fi
    if [ -z "$OPENAI_API_KEY" ]; then missing_vars+=("OPENAI_API_KEY"); fi

    # Platform-specific variables
    case $platform in
        "render")
            if [ -z "$RENDER_API_KEY" ]; then missing_vars+=("RENDER_API_KEY"); fi
            if [ -z "$RENDER_SERVICE_ID" ]; then missing_vars+=("RENDER_SERVICE_ID"); fi
            ;;
        "vercel")
            if [ -z "$VERCEL_TOKEN" ]; then missing_vars+=("VERCEL_TOKEN"); fi
            if [ -z "$VERCEL_ORG_ID" ]; then missing_vars+=("VERCEL_ORG_ID"); fi
            if [ -z "$VERCEL_PROJECT_ID" ]; then missing_vars+=("VERCEL_PROJECT_ID"); fi
            ;;
        "railway")
            # Railway doesn't require API keys, variables are set in dashboard
            ;;
    esac

    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required environment variables for ${platform}:${NC}"
        printf '  - %s\n' "${missing_vars[@]}"
        echo -e "${YELLOW}Please set these environment variables or create a .env.deploy file${NC}"
        exit 1
    fi
}

# Function to deploy backend to Render
# Function to deploy backend to Render
deploy_backend_render() {
    echo -e "\n${BLUE}🚀 Deploying backend to Render...${NC}"

    # Trigger Render deployment
    local response=$(curl --fail-with-body --silent --show-error \
        -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer ${RENDER_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '{}')

    local deploy_id=$(echo "$response" | jq -r '.id')

    if [ "$deploy_id" != "null" ] && [ -n "$deploy_id" ]; then
        echo -e "${GREEN}✅ Backend deployment triggered. Deploy ID: ${deploy_id}${NC}"

        # Wait for deployment to complete
        echo -e "${BLUE}⏳ Waiting for deployment to complete...${NC}"
        local max_attempts=30
        local attempt=1

        while [ $attempt -le $max_attempts ]; do
            local status_response=$(curl --silent --show-error \
                -H "Authorization: Bearer ${RENDER_API_KEY}" \
                "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys/${deploy_id}")

            local status=$(echo "$status_response" | jq -r '.status')

            case $status in
                "live")
                    echo -e "${GREEN}✅ Backend deployment completed successfully!${NC}"
                    return 0
                    ;;
                "build_failed"|"failed")
                    echo -e "${RED}❌ Backend deployment failed!${NC}"
                    echo "$status_response" | jq '.'
                    return 1
                    ;;
                "building"|"in_progress")
                    echo -e "${BLUE}⏳ Deployment in progress... (attempt ${attempt}/${max_attempts})${NC}"
                    sleep 10
                    ;;
                *)
                    echo -e "${YELLOW}⚠️  Unknown deployment status: ${status}${NC}"
                    sleep 5
                    ;;
            esac

            ((attempt++))
        done

        echo -e "${RED}❌ Deployment timeout after ${max_attempts} attempts${NC}"
        return 1
    else
        echo -e "${RED}❌ Failed to trigger backend deployment${NC}"
        echo "$response"
        return 1
    fi
}

# Function to deploy backend to Railway
deploy_backend_railway() {
    echo -e "\n${BLUE}🚂 Deploying backend to Railway...${NC}"

    # Railway deployments are triggered by GitHub pushes
    # We'll simulate this by checking if we're in a git repository and can push
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Not in a git repository. Railway requires GitHub integration.${NC}"
        echo -e "${YELLOW}Make sure this is a git repository connected to GitHub.${NC}"
        return 1
    fi

    # Check if there are uncommitted changes
    if ! git diff --quiet || ! git diff --staged --quiet; then
        echo -e "${YELLOW}⚠️  You have uncommitted changes. Committing and pushing...${NC}"

        # Add all changes
        git add .

        # Commit changes
        git commit -m "Deploy: $(date)" || {
            echo -e "${RED}❌ Failed to commit changes${NC}"
            return 1
        }

        echo -e "${GREEN}✅ Changes committed${NC}"
    fi

    # Push to trigger Railway deployment
    echo -e "${BLUE}Pushing to GitHub to trigger Railway deployment...${NC}"
    if git push origin main 2>/dev/null || git push origin master 2>/dev/null; then
        echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
        echo -e "${BLUE}⏳ Railway deployment triggered. Check your Railway dashboard for status.${NC}"
        echo -e "${YELLOW}Note: Railway deployments may take several minutes.${NC}"

        # Wait a bit and check if we can access the health endpoint
        echo -e "${BLUE}Waiting for Railway deployment to be ready...${NC}"
        local max_attempts=20
        local attempt=1

        while [ $attempt -le $max_attempts ]; do
            # Try to get Railway URL from environment or ask user
            if [ -z "$RAILWAY_STATIC_URL" ]; then
                echo -e "${YELLOW}Please provide your Railway app URL (from Railway dashboard > Settings > Domains)${NC}"
                read -p "Railway URL (e.g., https://taxmate-production.up.railway.app): " RAILWAY_URL
            else
                RAILWAY_URL="$RAILWAY_STATIC_URL"
            fi

            if curl --silent --fail --max-time 10 "${RAILWAY_URL}/health" > /dev/null; then
                echo -e "${GREEN}✅ Railway deployment completed successfully!${NC}"
                echo -e "${GREEN}🌐 App URL: ${RAILWAY_URL}${NC}"
                return 0
            else
                echo -e "${BLUE}⏳ Waiting for Railway deployment... (attempt ${attempt}/${max_attempts})${NC}"
                sleep 15
            fi

            ((attempt++))
        done

        echo -e "${YELLOW}⚠️  Railway deployment may still be in progress.${NC}"
        echo -e "${YELLOW}Check your Railway dashboard for the current status.${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to push to GitHub${NC}"
        echo -e "${YELLOW}Make sure you have push access to the repository.${NC}"
        return 1
    fi
}

# Function to deploy backend (platform-agnostic)
deploy_backend() {
    local platform=$(detect_platform)

    case $platform in
        "render")
            deploy_backend_render
            ;;
        "railway")
            deploy_backend_railway
            ;;
        *)
            echo -e "${RED}❌ Unsupported deployment platform: ${platform}${NC}"
            return 1
            ;;
    esac
}

# Function to deploy frontend to Vercel
deploy_frontend() {
    echo -e "\n${BLUE}🚀 Deploying frontend to Vercel...${NC}"

    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        echo -e "${BLUE}Installing Vercel CLI...${NC}"
        npm install --global vercel@latest
    fi

    cd frontend

    # Deploy to Vercel
    if vercel --prod --yes --token="$VERCEL_TOKEN"; then
        echo -e "${GREEN}✅ Frontend deployment completed successfully!${NC}"
        cd ..
        return 0
    else
        echo -e "${RED}❌ Frontend deployment failed!${NC}"
        cd ..
        return 1
    fi
}

# Function to run health checks
run_health_checks() {
    echo -e "\n${BLUE}🔍 Running health checks...${NC}"

    local backend_url="https://api.${DOMAIN_NAME}"
    local frontend_url="https://${DOMAIN_NAME}"

    # Check backend health
    echo -e "${BLUE}Checking backend health at ${backend_url}/health${NC}"
    if curl --silent --fail --max-time 30 "${backend_url}/health" > /dev/null; then
        echo -e "${GREEN}✅ Backend health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend health check failed (may still be deploying)${NC}"
    fi

    # Check frontend
    echo -e "${BLUE}Checking frontend at ${frontend_url}${NC}"
    if curl --silent --fail --max-time 30 "${frontend_url}" > /dev/null; then
        echo -e "${GREEN}✅ Frontend check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend check failed (may still be deploying)${NC}"
    fi
}

# Function to send deployment notification
send_notification() {
    local status=$1
    local message=$2

    echo -e "\n${BLUE}📢 Deployment ${status}: ${message}${NC}"

    # Here you could add Slack, Discord, or email notifications
    # For now, just log to console
}

# Main deployment function
main() {
    echo -e "${BLUE}Starting automated deployment process...${NC}"

    # Load environment variables from .env.deploy if it exists
    if [ -f ".env.deploy" ]; then
        echo -e "${BLUE}Loading environment variables from .env.deploy${NC}"
        set -a
        source .env.deploy
        set +a
    fi

    # Check required tools
    if ! command_exists curl; then
        echo -e "${RED}❌ curl is required but not installed${NC}"
        exit 1
    fi

    if ! command_exists jq; then
        echo -e "${RED}❌ jq is required but not installed${NC}"
        exit 1
    fi

    # Check environment variables
    check_env_vars

    # Run pre-deployment checks
    echo -e "\n${BLUE}🔍 Running pre-deployment checks...${NC}"

    # Verify backend builds
    echo -e "${BLUE}Verifying backend...${NC}"
    if npm run verify:backend; then
        echo -e "${GREEN}✅ Backend verification passed${NC}"
    else
        echo -e "${RED}❌ Backend verification failed${NC}"
        exit 1
    fi

    # Verify frontend builds
    echo -e "${BLUE}Verifying frontend...${NC}"
    cd frontend
    if npm run build; then
        echo -e "${GREEN}✅ Frontend build passed${NC}"
        cd ..
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        cd ..
        exit 1
    fi

    # Deploy backend
    if deploy_backend; then
        send_notification "success" "Backend deployed successfully"
    else
        send_notification "failed" "Backend deployment failed"
        exit 1
    fi

    # Deploy frontend
    if deploy_frontend; then
        send_notification "success" "Frontend deployed successfully"
    else
        send_notification "failed" "Frontend deployment failed"
        exit 1
    fi

    # Run health checks
    run_health_checks

    echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}📱 Frontend: https://${DOMAIN_NAME}${NC}"
    echo -e "${GREEN}🔗 API: https://api.${DOMAIN_NAME}${NC}"
    echo -e "${GREEN}📚 API Docs: https://api.${DOMAIN_NAME}/api-docs${NC}"
}

# Show usage if requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "TaxMate Automated Deployment Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --backend-only       Deploy only backend"
    echo "  --frontend-only      Deploy only frontend"
    echo "  --check-health       Run health checks only"
    echo ""
    echo "Environment Variables:"
    echo "  RENDER_API_KEY       Render API key (for Render deployments)"
    echo "  RENDER_SERVICE_ID    Render service ID (for Render deployments)"
    echo "  VERCEL_TOKEN         Vercel authentication token (for Vercel deployments)"
    echo "  VERCEL_ORG_ID        Vercel organization ID (for Vercel deployments)"
    echo "  VERCEL_PROJECT_ID    Vercel project ID (for Vercel deployments)"
    echo "  RAILWAY_STATIC_URL   Railway app URL (optional, for Railway deployments)"
    echo "  MONGO_URI           MongoDB connection URI"
    echo "  JWT_SECRET          JWT signing secret"
    echo "  OPENAI_API_KEY      OpenAI API key"
    echo ""
    echo "Supported Platforms:"
    echo "  - Render: Set RENDER_API_KEY and RENDER_SERVICE_ID"
    echo "  - Railway: No API keys needed (uses GitHub integration)"
    echo "  - Vercel: Set VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID"
    echo ""
    echo "Or create a .env.deploy file with these variables"
    exit 0
fi

# Handle different deployment modes
case $1 in
    --backend-only)
        check_env_vars
        deploy_backend
        ;;
    --frontend-only)
        check_env_vars
        deploy_frontend
        ;;
    --check-health)
        run_health_checks
        ;;
    *)
        main
        ;;
esac
