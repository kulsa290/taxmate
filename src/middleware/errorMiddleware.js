const AppError = require("../utils/appError");
const logger = require("../utils/logger");

const notFoundHandler = (req, res, next) => {
  next(new AppError(404, "Route not found"));
};

const errorHandler = (err, req, res, next) => {
  logger.error("Request failed", {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    statusCode: err.statusCode || err.status || 500,
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
      requestId: req.id,
      data: null,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode >= 500 && process.env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    requestId: req.id,
    data: null,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};