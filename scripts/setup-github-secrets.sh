#!/bin/bash

# GitHub Secrets Setup Helper
# This script helps you set GitHub Secrets from environment variables
# Usage: ./scripts/setup-github-secrets.sh [options]

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logs
log() {
    echo -e "${BLUE}ℹ${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    if ! command -v gh &> /dev/null; then
        error "GitHub CLI (gh) is not installed"
        echo "Install from: https://cli.github.com"
        exit 1
    fi

    if ! gh auth status &> /dev/null; then
        error "Not authenticated with GitHub CLI"
        echo "Run: gh auth login"
        exit 1
    fi

    success "GitHub CLI authenticated"
}

# Set individual secret
set_secret() {
    local name="$1"
    local value="$2"
    local repo="${3:-.}"

    if [ -z "$value" ]; then
        warning "Skipping $name - empty value"
        return
    fi

    if gh secret set "$name" -b "$value" --repo "$repo" 2>/dev/null; then
        success "Set secret: $name"
    else
        error "Failed to set secret: $name"
    fi
}

# Load from .env file
load_from_env_file() {
    local env_file="$1"

    if [ ! -f "$env_file" ]; then
        error "File not found: $env_file"
        exit 1
    fi

    log "Loading secrets from $env_file..."

    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [ -z "$key" ] && continue

        # Remove quotes if present
        value="${value%\"}"
        value="${value#\"}"

        set_secret "$key" "$value"
    done < <(grep -v '^#' "$env_file" | grep '=')

    success "Loaded all secrets from $env_file"
}

# Interactive setup wizard
interactive_setup() {
    log "GitHub Secrets Setup Wizard"
    echo ""

    # Database
    read -p "MongoDB Production URI: " MONGODB_PROD_URI
    read -p "MongoDB Replica Set (optional): " MONGODB_REPLICA_SET

    # JWT
    read -p "JWT Secret (Production): " JWT_SECRET_PROD
    read -p "JWT Secret (Staging): " JWT_SECRET_STAGING
    read -p "Refresh Token Secret (Production): " REFRESH_TOKEN_SECRET_PROD
    read -p "Refresh Token Secret (Staging): " REFRESH_TOKEN_SECRET_STAGING

    # OpenAI
    read -p "OpenAI API Key (Production): " OPENAI_API_KEY_PROD
    read -p "OpenAI API Key (Staging): " OPENAI_API_KEY_STAGING

    # AWS
    read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
    read -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
    read -p "AWS Region (default: us-east-1): " AWS_REGION
    AWS_REGION="${AWS_REGION:-us-east-1}"
    read -p "AWS Backup Bucket: " AWS_BACKUP_BUCKET

    # Monitoring
    read -p "Sentry DSN (Production, optional): " SENTRY_DSN_PROD
    read -p "Sentry DSN (Staging, optional): " SENTRY_DSN_STAGING
    read -p "Datadog API Key (optional): " DATADOG_API_KEY

    # Codecov & Scanning
    read -p "Codecov Token: " CODECOV_TOKEN
    read -p "Snyk Token: " SNYK_TOKEN

    echo ""
    log "Setting secrets..."

    set_secret "MONGODB_PROD_URI" "$MONGODB_PROD_URI"
    [ -n "$MONGODB_REPLICA_SET" ] && set_secret "MONGODB_REPLICA_SET" "$MONGODB_REPLICA_SET"
    set_secret "JWT_SECRET_PROD" "$JWT_SECRET_PROD"
    set_secret "JWT_SECRET_STAGING" "$JWT_SECRET_STAGING"
    set_secret "REFRESH_TOKEN_SECRET_PROD" "$REFRESH_TOKEN_SECRET_PROD"
    set_secret "REFRESH_TOKEN_SECRET_STAGING" "$REFRESH_TOKEN_SECRET_STAGING"
    set_secret "OPENAI_API_KEY_PROD" "$OPENAI_API_KEY_PROD"
    set_secret "OPENAI_API_KEY_STAGING" "$OPENAI_API_KEY_STAGING"
    set_secret "AWS_ACCESS_KEY_ID" "$AWS_ACCESS_KEY_ID"
    set_secret "AWS_SECRET_ACCESS_KEY" "$AWS_SECRET_ACCESS_KEY"
    set_secret "AWS_REGION" "$AWS_REGION"
    set_secret "AWS_BACKUP_BUCKET" "$AWS_BACKUP_BUCKET"
    [ -n "$SENTRY_DSN_PROD" ] && set_secret "SENTRY_DSN_PROD" "$SENTRY_DSN_PROD"
    [ -n "$SENTRY_DSN_STAGING" ] && set_secret "SENTRY_DSN_STAGING" "$SENTRY_DSN_STAGING"
    [ -n "$DATADOG_API_KEY" ] && set_secret "DATADOG_API_KEY" "$DATADOG_API_KEY"
    set_secret "CODECOV_TOKEN" "$CODECOV_TOKEN"
    set_secret "SNYK_TOKEN" "$SNYK_TOKEN"

    success "All secrets configured!"
}

# List all secrets
list_secrets() {
    log "Listing all GitHub Secrets..."
    gh secret list
}

# Generate template .env.secrets file
generate_template() {
    cat > .env.secrets.template << 'EOF'
# GitHub Secrets Template
# Copy this file to .env.secrets and fill in your values
# WARNING: DO NOT COMMIT .env.secrets to Git

# Database Configuration
MONGODB_PROD_URI=mongodb+srv://user:password@cluster.mongodb.net/taxmate?retryWrites=true&w=majority
MONGODB_REPLICA_SET=rs0

# JWT & Authentication
JWT_SECRET_PROD=your-secret-jwt-key-min-32-chars
JWT_SECRET_STAGING=your-staging-jwt-key-min-32-chars
REFRESH_TOKEN_SECRET_PROD=your-refresh-token-secret
REFRESH_TOKEN_SECRET_STAGING=your-staging-refresh-token

# OpenAI
OPENAI_API_KEY_PROD=sk-xxx
OPENAI_API_KEY_STAGING=sk-xxx
OPENAI_ORG_ID=org-xxx

# AWS Configuration
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BACKUP_BUCKET=taxmate-backups
AWS_PROD_ACCESS_KEY=AKIA...
AWS_PROD_SECRET_KEY=...

# Monitoring & Error Tracking
SENTRY_DSN_PROD=https://xxx@o123456.ingest.sentry.io/123456
SENTRY_DSN_STAGING=https://xxx@o123456.ingest.sentry.io/123456
DATADOG_API_KEY=xxx
DATADOG_APP_KEY=xxx
NEW_RELIC_LICENSE_KEY=xxx

# Testing & Quality
CODECOV_TOKEN=xxx
SNYK_TOKEN=xxx
SONAR_TOKEN=xxx

# Email
SENDGRID_API_KEY_PROD=SG.xxx
SENDGRID_API_KEY_STAGING=SG.xxx

# Kubernetes (if applicable)
KUBE_CONFIG=base64-encoded-kubeconfig

# Docker Registry (if using private registry)
DOCKER_USERNAME=xxx
DOCKER_PASSWORD=xxx
EOF

    success "Generated .env.secrets.template"
    warning "Edit .env.secrets.template with your actual values"
    warning "Then run: ./scripts/setup-github-secrets.sh -f .env.secrets.template"
}

# Display usage
usage() {
    cat << EOF
GitHub Secrets Setup Helper

Usage: $0 [OPTIONS]

OPTIONS:
    -h, --help              Show this help message
    -i, --interactive       Interactive setup wizard
    -f, --file FILE         Load secrets from file
    -l, --list              List all configured secrets
    -g, --generate          Generate template .env.secrets file
    -r, --repo REPO         Target repository (default: current)

EXAMPLES:
    # Interactive setup
    $0 -i

    # Load from file
    $0 -f .env.secrets

    # List secrets
    $0 -l

    # Generate template
    $0 -g

EOF
    exit 0
}

# Main
main() {
    check_prerequisites

    case "${1:-}" in
        -h|--help)
            usage
            ;;
        -i|--interactive)
            interactive_setup
            ;;
        -f|--file)
            load_from_env_file "${2:-.env.secrets}"
            ;;
        -l|--list)
            list_secrets
            ;;
        -g|--generate)
            generate_template
            ;;
        *)
            warning "No option specified"
            usage
            ;;
    esac
}

main "$@"
