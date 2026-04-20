const AppError = require("../utils/appError");
const logger = require("../utils/logger");

/**
 * 404 Not Found middleware
 * Called when no route matches the request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFoundHandler = (req, res, next) => {
  const message = `Cannot find ${req.originalUrl} on this server!`;
  logger.warn("Route not found", {
    method: req.method,
    path: req.originalUrl,
    requestId: req.id,
  });
  next(new AppError(404, message));
};

/**
 * Global error handler middleware
 * Must be the last middleware in the stack
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  const statusCode = err.statusCode || err.status || 500;
  const isOperationalError = err instanceof AppError;

  // Log error details
  logger.error("Request failed", {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: err.message,
    errorType: err.constructor.name,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    isOperational: isOperationalError,
  });

  // Handle SyntaxError from JSON parsing
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
      requestId: req.id,
      data: null,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: messages || "Validation failed",
      requestId: req.id,
      data: null,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      requestId: req.id,
      data: null,
    });
  }

  // Determine error message for client
  let message = err.message || "Internal server error";
  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  // Send error response
  return res.status(statusCode).json({
    success: false,
    message,
    requestId: req.id,
    data: null,
    ...(process.env.NODE_ENV !== "production" && { error: err.message }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};