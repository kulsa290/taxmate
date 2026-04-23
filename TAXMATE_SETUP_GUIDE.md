# TaxMate - Complete Setup & Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Database Setup](#database-setup)
6. [API Documentation](#api-documentation)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** (v20.19.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (Local or Atlas Cloud)
- **Git** (for version control)
- **Puppeteer Dependencies** (for PDF generation)

### Install Puppeteer Dependencies (Linux/Mac)

```bash
# macOS
brew install chromium

# Ubuntu/Debian
sudo apt-get install chromium-browser
```

---

## Local Setup

### 1. Clone and Install Backend Dependencies

```bash
# Navigate to backend
cd taxmate-backend

# Install dependencies
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Create Environment Files

Create `.env` file in the root `taxmate-backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/taxmate
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taxmate?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Mail Service (Optional - for email reports)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=noreply@taxmate.in

# OpenAI (for AI features)
OPENAI_API_KEY=sk-xxx...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# File Upload
MAX_FILE_SIZE=10485760

# Trust Proxy (for production)
TRUST_PROXY=1
FORCE_HTTPS=false
```

Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_BASE_URL=/
```

---

## Environment Configuration

### Development Environment

```bash
NODE_ENV=development
```

### Production Environment

```bash
NODE_ENV=production
FORCE_HTTPS=true
ENABLE_SWAGGER=false
# Additional security settings
```

---

## Running the Application

### Option 1: Run Backend & Frontend Separately

**Terminal 1 - Backend:**

```bash
cd taxmate-backend
npm run dev
```

The backend will start at `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd taxmate-backend/frontend
npm start
```

The frontend will start at `http://localhost:3000`

### Option 2: Docker (Full Stack)

```bash
# Development setup
docker-compose up --build

# Production setup
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Option 3: Run Tests

```bash
# Run all tests with coverage
npm test

# Watch mode for development
npm run test:watch

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

---

## Database Setup

### MongoDB Local Setup

#### Install MongoDB Community

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Run installer and follow setup wizard

### MongoDB Cloud Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taxmate?retryWrites=true&w=majority
   ```
5. Add this to `.env` as `MONGODB_URI`

### Initialize Database

```bash
# The database will auto-initialize on first run
# Or manually run:
npm run verify:backend
```

---

## API Documentation

### Key Endpoints

#### Tax Calculation

```bash
POST /api/tax/calculate
Content-Type: application/json

{
  "income": {
    "salary": 1000000,
    "hra": 200000,
    "otherIncome": 50000
  },
  "deductions": {
    "rent": 120000,
    "section80C": 150000,
    "section80D": 50000,
    "section80E": 0,
    "section80G": 0,
    "otherDeductions": 0
  },
  "clientName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "calculationId": "...",
    "grossIncome": 1250000,
    "oldRegime": {
      "taxableIncome": 780000,
      "baseTax": 156000,
      "cess": 6240,
      "surcharge": 0,
      "totalTax": 162240
    },
    "newRegime": {
      "taxableIncome": 1175000,
      "baseTax": 235000,
      "cess": 9400,
      "surcharge": 0,
      "totalTax": 244400
    },
    "comparison": {
      "recommendedRegime": "old",
      "taxSavings": 82160,
      "message": "You'll save ₹82,160 by choosing Old Regime"
    },
    "suggestions": [...]
  }
}
```

#### Client Management

```bash
# Create Client
POST /api/clients
Authorization: Bearer {token}

{
  "clientName": "ABC Enterprises",
  "email": "client@abc.com",
  "phone": "9876543210",
  "panNumber": "AABCU1234A",
  "businessType": "Business",
  "notes": "Preferred client"
}

# Get All Clients
GET /api/clients?status=active&search=ABC
Authorization: Bearer {token}

# Update Client
PUT /api/clients/{id}
Authorization: Bearer {token}

# Delete Client
DELETE /api/clients/{id}
Authorization: Bearer {token}
```

---

## Deployment

### Deploy to Railway

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy backend
npm run railway:deploy

# View logs
railway logs
```

### Deploy Frontend to Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://your-api-domain.com
```

### Docker Deployment

```bash
# Build and push Docker image
docker build -t taxmate-backend .
docker tag taxmate-backend:latest your-registry/taxmate-backend:latest
docker push your-registry/taxmate-backend:latest

# Deploy using docker-compose in production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=generate-strong-random-key
FORCE_HTTPS=true
ENABLE_SWAGGER=false
CORS_ORIGINS=https://yourdomain.com
```

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Error

**Problem:** `MongooseError: Cannot connect to MongoDB`

**Solution:**
```bash
# Check if MongoDB is running
# macOS
brew services list

# Ubuntu
sudo systemctl status mongodb

# Windows
Get-Service MongoDB

# Start MongoDB if not running
brew services start mongodb-community
```

#### Puppeteer Chrome Not Found

**Problem:** `Error: Failed to launch the browser process`

**Solution:**
```bash
# Install Chromium
npm install --save-optional puppeteer

# Or install system Chromium
# macOS
brew install --cask chromium

# Ubuntu
sudo apt-get install chromium-browser
```

#### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Kill process on port 5000 (macOS/Linux)
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### JWT Token Issues

**Problem:** `Invalid token` or `Token expired`

**Solution:**
- Clear browser local storage
- Login again to get new token
- Check JWT_SECRET matches in backend

#### CORS Errors

**Problem:** `Access to XMLHttpRequest... blocked by CORS policy`

**Solution:**
- Update `CORS_ORIGINS` in `.env`
- Include full URL: `http://localhost:3000`
- For production: `https://yourdomain.com`

---

## Performance Optimization

### Backend Optimization

```bash
# Enable compression
# Already configured in app.js

# Use environment variables
NODE_ENV=production npm start

# Scale with PM2
npm install -g pm2
pm2 start src/server.js --name taxmate
pm2 list
```

### Frontend Optimization

```bash
# Build for production
npm run build

# Analyze bundle size
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*'
```

---

## Security Checklist

- ✅ Change JWT_SECRET to strong random value
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated: `npm audit fix`
- ✅ Set FORCE_HTTPS=true in production
- ✅ Use MongoDB Atlas with IP whitelisting
- ✅ Enable rate limiting
- ✅ Use environment variables for sensitive data
- ✅ Set secure CORS origins
- ✅ Enable helmet for security headers

---

## Support & Documentation

- **API Docs:** Visit `http://localhost:5000/api-docs` (Swagger UI)
- **Issues:** Report bugs in GitHub Issues
- **Contact:** support@taxmate.in

---

## License

This project is licensed under ISC License.

---

**Last Updated:** April 2026
**Version:** 2.0.0
