#!/bin/bash

# TaxMate Backend - Quick Setup & Start Script
# This script helps set up and start the TaxMate backend

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   TaxMate Backend - Setup & Start      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

# Check Node.js version
echo -e "\n${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "\n${YELLOW}⚠  .env file not found!${NC}"
    echo -e "${BLUE}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created. Please update with your values!${NC}"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "\n${BLUE}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Select mode
echo -e "\n${BLUE}Select startup mode:${NC}"
echo "1) Development (with auto-reload)"
echo "2) Production"
echo "3) Test"
echo "4) Verify Backend"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo -e "\n${GREEN}Starting in development mode...${NC}"
        npm run dev
        ;;
    2)
        echo -e "\n${GREEN}Starting in production mode...${NC}"
        npm start
        ;;
    3)
        echo -e "\n${GREEN}Running tests...${NC}"
        npm test
        ;;
    4)
        echo -e "\n${GREEN}Verifying backend...${NC}"
        npm run verify:backend
        echo -e "${GREEN}✓ Backend verified successfully!${NC}"
        ;;
    *)
        echo -e "${YELLOW}Invalid choice!${NC}"
        exit 1
        ;;
esac
