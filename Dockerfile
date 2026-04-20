# TaxMate Backend Dockerfile
FROM node:22.22.2-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ===========================================
# Development Stage
# ===========================================
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start in development mode
CMD ["npm", "run", "dev"]

# ===========================================
# Build Stage
# ===========================================
FROM base AS build

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application (if needed)
RUN npm run build 2>/dev/null || echo "No build script found"

# Ensure docs directory exists (Swagger is served dynamically at runtime,
# but the directory must be present for any COPY --from=build steps)
RUN mkdir -p /app/docs

# ===========================================
# Production Stage
# ===========================================
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S taxmate -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/src ./src

# Change ownership to non-root user
RUN chown -R taxmate:nodejs /app
USER taxmate

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (res) => { \
        process.exit(res.statusCode === 200 ? 0 : 1) \
    }).on('error', () => process.exit(1))"

# Expose port
EXPOSE 5000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]
