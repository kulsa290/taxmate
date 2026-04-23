# DevOps Implementation Guide - TaxMate Backend

This document outlines the complete DevOps infrastructure for TaxMate Backend, including CI/CD pipelines, automated testing, database backups, and multi-environment deployments.

## 📋 Table of Contents

1. [Overview](#overview)
2. [CI/CD Pipelines](#cicd-pipelines)
3. [Database Backup & Recovery](#database-backup--recovery)
4. [Multi-Environment Deployment](#multi-environment-deployment)
5. [Performance Testing](#performance-testing)
6. [Security & Code Quality](#security--code-quality)
7. [Monitoring & Alerting](#monitoring--alerting)
8. [Disaster Recovery](#disaster-recovery)

---

## 📊 Overview

The DevOps infrastructure provides:

✅ **Automated Testing** - Unit, integration, and end-to-end tests  
✅ **Continuous Deployment** - Blue-green, canary, and rolling deployments  
✅ **Database Management** - Automated backups with S3 storage  
✅ **Performance Monitoring** - Load testing and stress testing  
✅ **Security Scanning** - SAST, DAST, dependency, and container scanning  
✅ **Multi-Environment Support** - Development, staging, and production  

---

## 🔄 CI/CD Pipelines

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

Triggered on:
- Pull requests to `main` or `develop`
- Push to `develop` branch

**Stages:**

1. **Backend Tests & Coverage**
   - Install dependencies
   - Run linting (ESLint)
   - Verify app boots
   - Execute unit tests
   - Execute integration tests
   - Upload coverage to Codecov
   - Comment on PR with coverage %

2. **Frontend Tests & Build**
   - Install dependencies
   - Run frontend tests
   - Build React app
   - Upload build artifacts

3. **Security Scanning**
   - Npm audit
   - Snyk vulnerability scanning
   - OWASP Dependency Check

4. **Docker Build**
   - Build Docker image
   - Cache layers for faster builds
   - Verify image compiles

**Usage:**
```bash
# Automatically runs on PR/push
# Check status in GitHub Actions > CI/CD Pipeline
```

### 2. Deployment Pipeline (`.github/workflows/deploy-multi-env.yml`)

Triggered on:
- Push to `develop` → deploys to **development**
- Push to `staging` → deploys to **staging**
- Push to `main` → deploys to **production**
- Manual trigger via workflow dispatch

**Deployment Strategies:**
- **Blue-Green**: Run two identical production environments
- **Canary**: Gradually roll out to subset of users
- **Rolling**: Update instances one at a time

**Stages:**

1. **Pre-deployment Checks**
   - Security audit
   - Run full test suite
   - Build verification
   - Environment variable validation

2. **Build & Push**
   - Build Docker image
   - Push to container registry

3. **Kubernetes Deployment** (Staging/Production)
   - Update kubeconfig
   - Deploy via Helm
   - Wait for rollout completion

4. **Docker Compose Deployment** (Development)
   - Pull latest image
   - Start services
   - Verify containers running

5. **Health Checks**
   - Check API endpoint
   - Run smoke tests
   - Verify database connectivity

**Usage:**
```bash
# Manual deployment
# Go to Actions > Multi-Environment Deployment > Run workflow
# Select environment, strategy, and options

# Automatic deployment
# Merge PR to main/staging/develop
```

### 3. Performance Testing (`.github/workflows/performance.yml`)

Scheduled: Weekly (Sunday 2 AM UTC)  
Manual trigger available

**Tests:**

1. **Load Testing**
   - 10-30 concurrent users
   - Tax calculation endpoint
   - Response time < 500ms (95th percentile)

2. **Stress Testing**
   - 100-200 concurrent users
   - Error rate < 0.5%
   - Measures breaking point

3. **Lighthouse CI**
   - Frontend performance metrics
   - SEO audit
   - Accessibility checks

**Reports:**
- Artifacts stored for 30 days
- Performance trends tracked
- Baseline comparisons

**Usage:**
```bash
# View performance reports
# Actions > Performance Testing > [Run] > Artifacts
```

---

## 💾 Database Backup & Recovery

### Automated Backup System

**Location:** `scripts/backup-database.sh`

**Features:**
- Daily full backups at 2 AM UTC
- Weekly incremental backups
- S3 storage with Glacier archive
- 30-day retention policy
- Metadata tracking
- Compression (tar.gz)

**Backup Workflow:** `.github/workflows/backup.yml`

Scheduled: Daily (2 AM UTC) + Weekly (3 AM UTC)

**Automated Verification:**
- Extract and validate backup
- Test restore capability
- Health check on test database
- Cleanup after verification

### Manual Backup

```bash
# Create full backup
./scripts/backup-database.sh full 30

# Arguments:
# - Backup type: full, incremental, daily
# - Retention days: 30, 60, 90, etc.

# Upload to S3 (if configured)
# Environment variables required:
export AWS_ACCESS_KEY_ID=xxxxx
export AWS_SECRET_ACCESS_KEY=xxxxx
export AWS_BACKUP_BUCKET=taxmate-backups
```

### Database Restore

**Location:** `scripts/restore-database.sh`

```bash
# Restore from local file
./scripts/restore-database.sh -f backups/backup_20240101_120000.tar.gz

# Restore from S3
./scripts/restore-database.sh -s taxmate-backups -f backups/backup_20240101_120000.tar.gz

# Restore to different database
./scripts/restore-database.sh -f backups/backup.tar.gz -d taxmate_restored

# Restore with custom MongoDB host
./scripts/restore-database.sh -f backup.tar.gz -h mongo.example.com -p 27017
```

**Restore Process:**
1. Creates pre-restore backup of current database
2. Extracts backup file
3. Verifies integrity
4. Performs restore
5. Validates data
6. Generates rollback instructions

**Example Output:**
```
✓ Pre-restore backup created: ./backups/pre_restore_20240115_143022
✓ Database restore completed successfully
ℹ Databases in MongoDB: 3
ℹ Collections in taxmate: 12
✓ Restore verification completed
```

### Backup Storage

**Local:**
- Location: `./backups/`
- Format: `{type}_{timestamp}.tar.gz`
- Metadata: `{filename}.metadata.json`

**S3:**
- Bucket: `taxmate-backups-{environment}`
- Path: `backups/{filename}`
- Storage Class: GLACIER (cost-effective)
- Retention: 30-90 days

**Backup Contents:**
```
backup_20240115_143022.tar.gz
├── dump/
│   └── taxmate/
│       ├── users.bson
│       ├── taxCalculations.bson
│       ├── clients.bson
│       └── ...
└── metadata.json
```

---

## 🌐 Multi-Environment Deployment

### Environment Configurations

**Directory:** `env/`

#### Development (`env/development.env`)
- **Database**: Local MongoDB
- **Port**: 5000
- **Features**: All enabled, debug mode on
- **Logging**: Console output, colored
- **Deployment**: Docker Compose
- **Domain**: localhost:5000

#### Staging (`env/staging.env`)
- **Database**: MongoDB Atlas (staging)
- **Port**: 5000
- **Features**: Production-like, test data
- **Logging**: JSON to file
- **Deployment**: Kubernetes
- **Domain**: api-staging.taxmate.in
- **Monitoring**: Enabled

#### Production (`env/production.env`)
- **Database**: MongoDB Atlas (production)
- **Port**: 5000
- **Features**: Only stable features
- **Logging**: Structured JSON, aggregated
- **Deployment**: Kubernetes with auto-scaling
- **Domain**: api.taxmate.in
- **Monitoring**: Full stack (Datadog, Sentry, New Relic)

### Deployment Commands

**Development:**
```bash
# Using Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d

# Or npm
npm run dev
```

**Staging:**
```bash
# Via GitHub Actions
# Go to Actions > Multi-Environment Deployment > Run workflow
# Select: environment=staging, strategy=blue-green

# Or manually with Helm
helm upgrade --install taxmate-api ./k8s/chart \
  -f k8s/values-staging.yaml \
  --namespace staging \
  --create-namespace
```

**Production:**
```bash
# Via GitHub Actions (recommended)
# Merge PR to main branch

# Manual production deployment (if needed)
helm upgrade --install taxmate-api ./k8s/chart \
  -f k8s/values-production.yaml \
  --namespace production \
  --create-namespace
```

### Environment Variables

All environments require specific variables. See `ENV_CONFIGURATION.md` for complete list.

**Key Secrets (stored in GitHub Secrets):**
- `JWT_SECRET_PROD` - JWT signing key
- `MONGODB_PROD_URI` - Database connection string
- `OPENAI_API_KEY_PROD` - OpenAI API key
- `SENTRY_DSN_PROD` - Error tracking
- `DATADOG_API_KEY` - APM monitoring

---

## 📊 Performance Testing

### Automated Performance Workflows

**Schedule:** Weekly (Sunday 2 AM UTC)

### Load Testing

```javascript
// Simulates 10-30 concurrent users
// Tax calculation endpoint
// Measures response times and error rates

Test Phases:
1. Ramp-up (2 min): 0 → 10 users
2. Steady (3 min): 10 users
3. Ramp-up (2 min): 10 → 30 users
4. Steady (3 min): 30 users
5. Ramp-down (2 min): 30 → 0 users

Success Criteria:
- p95 response time < 500ms
- p99 response time < 1000ms
- Error rate < 0.1%
```

### Stress Testing

```javascript
// Simulates 100-200 concurrent users
// Measures breaking point
// Identifies bottlenecks

Test Phases:
1. Ramp-up (5 min): 0 → 100 users
2. Steady (5 min): 100 users
3. Ramp-up (5 min): 100 → 200 users
4. Steady (5 min): 200 users
5. Ramp-down (2 min): 200 → 0 users

Success Criteria:
- Error rate < 0.5% (under load)
- System recovers after load
- No cascading failures
```

### Lighthouse Performance

- Frontend build performance
- SEO metrics
- Accessibility score
- Best practices

**Reports:** Stored as artifacts for 30 days

---

## 🔒 Security & Code Quality

### Scanning Tools

**Dependency Scanning:**
- npm audit (built-in)
- Snyk (vulnerability detection)
- OWASP Dependency Check

**Static Analysis:**
- ESLint + Security plugin
- SonarQube (code quality)
- CodeQL (advanced analysis)
- Semgrep (security patterns)

**Secret Scanning:**
- TruffleHog (hard-coded secrets)
- GitHub native scanning

**Container Scanning:**
- Trivy (vulnerability scanner)
- Grype (artifact analysis)
- DockerHub scan

**Infrastructure as Code:**
- Checkov (IaC security)
- Terraform linting (if applicable)

**Dynamic Testing:**
- OWASP ZAP (web app scanning)
- Runs against live server

### Security Reports

**Location:** Actions > Security & Code Quality > Artifacts

**Reports Generated:**
- npm audit report (JSON)
- OWASP Dependency Check
- SonarQube analysis
- CodeQL results
- Container scan results
- IaC security findings
- ZAP scan report

**Pull Request Comments:**
- Security summary
- Link to full report
- High-priority issues highlighted

---

## 📈 Monitoring & Alerting

### Application Monitoring

**Production Stack:**

1. **Datadog**
   - APM (Application Performance Monitoring)
   - Infrastructure metrics
   - Log aggregation
   - Real-time dashboards

2. **Sentry**
   - Error tracking
   - Performance monitoring
   - Release tracking
   - Alerts on errors

3. **New Relic**
   - Full-stack monitoring
   - Real-time insights
   - Custom dashboards
   - Infrastructure monitoring

### Logging

**Development:**
- Console output
- Colored text
- Development format

**Staging/Production:**
- JSON structured logging
- Centralized aggregation
- Long-term retention
- Searchable logs

**Log Levels:**
- `error` - Production issues
- `warn` - Warnings
- `info` - General information
- `debug` - Detailed debugging

---

## 🆘 Disaster Recovery

### Backup Restoration Procedure

**Step 1: Verify Current Database**
```bash
mongosh taxmate
db.stats()
```

**Step 2: Create Pre-restore Backup**
```bash
./scripts/backup-database.sh full 90
```

**Step 3: Restore from Backup**
```bash
# From local file
./scripts/restore-database.sh -f backups/backup_20240101.tar.gz

# From S3
./scripts/restore-database.sh -s taxmate-backups-production \
  -f backups/backup_20240101.tar.gz
```

**Step 4: Verify Restored Data**
```bash
mongosh taxmate
db.getCollectionNames()
db.users.count()
```

**Step 5: Perform Application Health Checks**
```bash
# Test API endpoints
curl http://localhost:5000/health
npm test
```

**Step 6: Monitor After Restore**
- Watch error rates in Sentry
- Monitor performance in Datadog
- Check application logs
- Validate data integrity

### Rollback Procedure

**Automatic Rollback:**
```bash
# If deployment fails, automatic rollback triggered:
kubectl rollout undo deployment/taxmate-api -n production
```

**Manual Rollback:**
```bash
# Rollback to previous Helm release
helm rollback taxmate-api -n production

# Verify rollback
kubectl get pods -n production
kubectl logs -n production deployment/taxmate-api
```

---

## 📚 Additional Resources

### Configuration Files
- [ENV_CONFIGURATION.md](./ENV_CONFIGURATION.md) - Environment variables guide
- [docker-compose.yml](./docker-compose.yml) - Local development setup
- [Dockerfile](./Dockerfile) - Container image definition
- [render.yaml](./render.yaml) - Render.com deployment config
- [railway.yaml](./railway.yaml) - Railway deployment config

### Scripts
- `scripts/backup-database.sh` - Database backup
- `scripts/restore-database.sh` - Database restore
- `scripts/deploy.sh` - Deployment helper
- `scripts/health-check.sh` - Service health validation

### Workflows
- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/deploy-multi-env.yml` - Multi-environment deployment
- `.github/workflows/performance.yml` - Performance testing
- `.github/workflows/backup.yml` - Database backups
- `.github/workflows/security.yml` - Security scanning

### Documentation
- [PROFESSIONAL_README.md](./PROFESSIONAL_README.md) - Project overview
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) - Build summary

---

## 🚀 Getting Started

### First-Time Setup

1. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/taxmate-backend.git
   cd taxmate-backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env/development.env .env
   # Edit .env with local settings
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

### Deploy to Staging

1. Push code to `staging` branch
2. GitHub Actions automatically deploys
3. Monitor deployment in Actions tab
4. Check staging API at https://api-staging.taxmate.in

### Deploy to Production

1. Create PR to `main`
2. All tests must pass
3. Security scans must clear
4. Merge to `main`
5. GitHub Actions deploys to production
6. Monitor in Datadog/Sentry

---

## 📞 Support & Troubleshooting

### Common Issues

**Deployment fails:**
- Check GitHub Actions logs
- Verify environment variables
- Run pre-deployment checks locally

**Backup fails:**
- Verify MongoDB connectivity
- Check S3 credentials
- Ensure disk space available

**Performance degradation:**
- Check Datadog dashboards
- Review recent deployments
- Analyze database queries

---

**Last Updated:** 2024  
**Version:** 2.0.0-devops  
**Maintained by:** TaxMate DevOps Team
