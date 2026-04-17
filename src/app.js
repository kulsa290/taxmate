const express = require("express");
const crypto = require("crypto");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");
const logger = require("./utils/logger");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

const DEFAULT_CORS_ORIGINS = ["http://localhost:3000", "https://app.taxmate.in"];

const parseNumber = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const parseTrustProxy = (value) => {
  if (!value) {
    return 1;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : value;
};

const allowedOrigins = (process.env.CORS_ORIGINS || DEFAULT_CORS_ORIGINS.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const requestLimiter = rateLimit({
  windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  limit: parseNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 300),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again in a few minutes.",
    data: null,
  },
});

const authLimiter = rateLimit({
  windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  limit: parseNumber(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 20),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait before retrying.",
    data: null,
  },
});

app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  return next();
});

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

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "1mb" }));
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(requestLimiter);
app.use("/api/auth", authLimiter);

app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  return next();
});

app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json({
    success: true,
    message: "TaxMate AI Backend Running",
    data: null,
  });
});

app.get("/health", (req, res) => {
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.setHeader("Cache-Control", "no-store");

  return res.status(200).json({
    success: true,
    message: "Service healthy",
    data: {
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      database: dbStates[mongoose.connection.readyState] || "unknown",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;