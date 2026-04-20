# Docker Deployment Guide for TaxMate Backend

This guide covers containerized deployment options for the TaxMate backend using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- At least 5GB free disk space

## Quick Start

### Development Environment

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd taxmate-backend
   ```

2. **Start the development environment:**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - TaxMate API on `http://localhost:5000`
   - MongoDB on `localhost:27017`
   - Frontend (optional) on `http://localhost:3000`

3. **View logs:**
   ```bash
   docker-compose logs -f taxmate-api
   ```

4. **Stop the environment:**
   ```bash
   docker-compose down
   ```

### Production Environment

1. **Create environment file:**
   ```bash
   cp .env.deploy.example .env
   # Edit .env with your production values
   ```

2. **Start production environment:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
   ```

3. **Check health:**
   ```bash
   docker-compose ps
   curl http://localhost:5000/health
   ```

## Docker Commands

### Development

```bash
# Start development environment
docker-compose up --build

# Start in background
docker-compose up -d --build

# Run tests in container
docker-compose -f docker-compose.test.yml up --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Production

```bash
# Start production stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Scale services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale taxmate-api=3

# Update services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View production logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

## Environment Configuration

### Development (.env)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://mongodb:27017/taxmate-dev
JWT_SECRET=dev-jwt-secret-key-for-docker-compose
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Production (.env)

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taxmate-prod
JWT_SECRET=your-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure-password
```

## Service Architecture

### Development Stack
- **taxmate-api**: Node.js API server with hot reload
- **mongodb**: MongoDB database for development
- **taxmate-frontend**: React frontend (optional, via profile)
- **redis**: Redis cache (optional, via profile)

### Production Stack
- **taxmate-api**: Optimized Node.js production build
- **mongodb**: MongoDB with authentication
- **taxmate-frontend**: Nginx serving built React app

## Docker Images

### Multi-stage Builds

The Dockerfile uses multi-stage builds for optimization:

1. **base**: Common setup with Node.js and dumb-init
2. **development**: Full development environment with all dependencies
3. **build**: Intermediate stage for building the application
4. **production**: Minimal production image with only runtime dependencies

### Image Optimization

- Uses Alpine Linux for smaller images
- Multi-stage builds reduce final image size
- Non-root user for security
- Proper signal handling with dumb-init
- Health checks for container orchestration

## Volumes and Data Persistence

### Named Volumes
- `mongodb_data`: MongoDB data persistence
- `redis_data`: Redis data persistence (optional)

### Bind Mounts (Development)
- `./:/app`: Source code for hot reload
- `/app/node_modules`: Node modules cache

## Networking

All services communicate through the `taxmate-network` bridge network.

- API accessible on host port 5000
- MongoDB accessible on host port 27017
- Frontend accessible on host port 80 (production) or 3000 (development)

## Health Checks

All services include health checks:

- **API**: HTTP GET to `/health` endpoint
- **MongoDB**: MongoDB ping command
- **Redis**: Redis PING command
- **Frontend**: HTTP GET to `/health` endpoint

## Security Considerations

### Production Security
- Non-root user execution
- Minimal base images (Alpine Linux)
- No development dependencies in production
- Environment variable secrets
- Proper signal handling

### Development Security
- Isolated network
- Development secrets (not for production)
- Volume mounts for development convenience

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using ports
   netstat -tulpn | grep :5000
   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Memory issues:**
   ```bash
   # Check Docker memory settings
   docker system info
   # Increase Docker memory allocation in Docker Desktop
   ```

4. **Build failures:**
   ```bash
   # Clear Docker cache
   docker system prune -a
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs taxmate-api

# Follow logs in real-time
docker-compose logs -f taxmate-api

# View container resource usage
docker stats

# Access container shell
docker-compose exec taxmate-api sh
```

### Database Issues

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Reset database
docker-compose down -v
docker-compose up -d mongodb
```

## Performance Optimization

### Production Optimizations
- Minimal production image
- Proper health checks
- Resource limits (add to docker-compose.prod.yml)
- Connection pooling
- Caching layers

### Development Optimizations
- Volume mounts for hot reload
- Dependency caching
- Parallel service startup

## Deployment Strategies

### Local Development
```bash
docker-compose up --build
```

### CI/CD Integration
```yaml
# .github/workflows/docker.yml
name: Docker Build and Push
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        run: |
          docker build -t taxmate-backend .
          docker tag taxmate-backend ghcr.io/${{ github.repository }}/taxmate-backend:latest
          docker push ghcr.io/${{ github.repository }}/taxmate-backend:latest
```

### Cloud Deployment

#### Docker Compose on VPS
```bash
# On your VPS
git clone https://github.com/yourusername/taxmate-backend.git
cd taxmate-backend
cp .env.deploy.example .env
# Edit .env with production values
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

#### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml taxmate
```

#### Kubernetes
Use the provided `k8s/` directory manifests for Kubernetes deployment.

## Monitoring and Maintenance

### Health Monitoring
```bash
# Check all services
docker-compose ps

# Health check API
curl http://localhost:5000/health

# Resource usage
docker stats
```

### Updates
```bash
# Update images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# Zero-downtime updates
docker-compose up -d --build --scale taxmate-api=2
docker-compose up -d --build --scale taxmate-api=1
```

### Backups
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Copy backup to host
docker cp $(docker-compose ps -q mongodb):/backup ./backup
```

## Support

For issues specific to Docker deployment:
1. Check the troubleshooting section above
2. Review Docker and Docker Compose logs
3. Ensure all prerequisites are met
4. Verify environment configuration
5. Check network connectivity between services