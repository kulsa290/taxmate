const express = require("express");
const crypto = require("crypto");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("mongo-sanitize");
const xss = require("xss");
const mongoose = require("mongoose");
const morgan = require("morgan");

const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");
const logger = require("./utils/logger");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const profileRoutes = require("./routes/profileRoutes");
const taxRoutes = require("./routes/taxRoutes");
const clientRoutes = require("./routes/clientRoutes");

const app = express();

// ============================================================================
// CONFIGURATION & ENVIRONMENT PARSING
// ============================================================================

const DEFAULT_CORS_ORIGINS = ["http://localhost:3000", "https://karsathi.co.in", "https://www.karsathi.co.in"];
const isProduction = process.env.NODE_ENV === "production";

/**
 * Parse environment number with fallback
 * @param {string} value - Environment variable value
 * @param {number} fallback - Fallback value
 * @returns {number} Parsed or fallback value
 */
const parseNumber = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

/**
 * Parse trust proxy configuration
 * @param {string} value - Environment variable value
 * @returns {number|boolean|string} Parsed trust proxy value
 */
const parseTrustProxy = (value) => {
  if (!value) return 1;
  if (value === "true") return true;
  if (value === "false") return false;
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : value;
};

const allowedOrigins = (process.env.CORS_ORIGINS || DEFAULT_CORS_ORIGINS.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Main request rate limiter
 * @type {express.RequestHandler}
 */
const requestLimiter = rateLimit({
  windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  limit: parseNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 300),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
      requestId: req.id,
      data: null,
    });
  },
});

/**
 * Authentication route rate limiter (stricter)
 * @type {express.RequestHandler}
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: parseNumber(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 5),
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many authentication attempts, please try again later",
      requestId: req.id,
      data: null,
    });
  },
});

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Trust proxy - for accurate client IP in reverse proxy setup
app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

// ============================================================================
// HEALTH CHECK ENDPOINTS (FIRST - before any other middleware)
// ============================================================================

/**
 * Liveness probe - Railway uses this to determine if service is responsive
 * @route GET /health
 * @returns {Object} Server health status (200 OK)
 */
app.get("/health", (req, res) => {
  try {
    const dbStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    // Add CORS headers for health endpoint
    const origin = req.headers.origin;
    if (!origin || !isProduction || allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID");
    }

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({
      ok: true,
      success: true,
      message: "Service healthy",
      data: {
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
        database: dbStates[mongoose.connection.readyState] || "unknown",
      },
    });
  } catch (error) {
    // Even if there's an error, respond with 200 so Railway doesn't kill the service
    logger.error("Health check error (still responding 200)", { error: error.message });
    res.status(200).json({
      success: true,
      message: "Service responding",
    });
  }
});

/**
 * Root endpoint - basic liveness check
 * @route GET /
 * @returns {Object} Success message
 */
app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json({
    success: true,
    message: "Karsathi AI Backend Running",
    data: null,
  });
});

// ============================================================================
// MIDDLEWARE SETUP (After health endpoints)
// ============================================================================

// Request ID middleware - adds unique ID to each request for tracing
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-ID", req.id);
  return next();
});

// Force HTTPS in production
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.FORCE_HTTPS !== "false" &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  return next();
});

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (!isProduction) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    maxAge: 86400,
    optionsSuccessStatus: 200,
  })
);

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));

// Data sanitization - prevent NoSQL injection and XSS
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = mongoSanitize(req.body[key]);
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
});

// Request logging
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Rate limiting
app.use(requestLimiter);

// API cache control
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  return next();
});

// ============================================================================
// API DOCUMENTATION (SWAGGER)
// ============================================================================

if (process.env.NODE_ENV !== "production" || process.env.ENABLE_SWAGGER === "true") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./config/swagger");

  /**
   * Swagger UI endpoint
   * @route GET /api-docs
   * @returns {HTML} Swagger UI interface
   */
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  logger.info("Swagger API documentation available at /api-docs");
}


// ============================================================================
// API ROUTES
// ============================================================================

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/clients", clientRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
