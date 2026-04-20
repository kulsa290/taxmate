require("dotenv").config();

// Add uncaught error handlers FIRST
process.on("uncaughtException", (error) => {
  console.error("❌ UNCAUGHT EXCEPTION:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ UNHANDLED REJECTION:", reason);
  process.exit(1);
});

const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

console.log("✅ Modules loaded successfully");
console.log("📍 NODE_ENV:", process.env.NODE_ENV);
console.log("📍 PORT env:", process.env.PORT);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
let server;
let isShuttingDown = false;

console.log(`🚀 Starting server on ${HOST}:${PORT}`);

const shutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.warn(`Received ${signal}. Shutting down gracefully.`);

  if (!server) {
    logger.info("No server running, exiting immediately.");
    process.exit(0);
  }

  const shutdownTimeout = setTimeout(() => {
    logger.warn("Forced shutdown after 10 second timeout.");
    process.exit(1);
  }, 10000);

  server.close(() => {
    clearTimeout(shutdownTimeout);
    logger.info("HTTP server closed.");
    process.exit(0);
  });
};

const startServer = async () => {
  try {
    // Start server BEFORE database - allows health checks to work immediately
    server = app.listen(PORT, HOST, () => {
      logger.info(`Server running on ${HOST}:${PORT}`);
    });

    // Handle server errors
    server.on("error", (error) => {
      logger.error("Server error", { error: error.message });
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

    // Connect to database asynchronously without blocking server startup
    connectDB().catch((error) => {
      logger.error("Database connection failed", { error: error.message });
      logger.warn("Server continuing without database connection.");
    });
  } catch (error) {
    logger.error("Server startup failed", { error: error.message });
    process.exit(1);
  }
};

startServer();

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal).catch((error) => {
      logger.error("Graceful shutdown failed", { error: error.message });
      process.exit(1);
    });
  });
});