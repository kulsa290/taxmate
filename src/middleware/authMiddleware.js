const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

/**
 * Required authentication middleware
 * Returns 401 if no valid token is provided
 */
const required = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Authorization token is required", 401));
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authorization header must use Bearer token format", 401));
  }

  // Extract only the raw JWT from: Authorization: Bearer <token>
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Authorization token is missing", 401));
  }

  if (!process.env.JWT_SECRET) {
    return next(new AppError("JWT secret is not configured", 500));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id || decoded._id;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401));
    }

    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }

    return next(new AppError("Authentication failed", 500));
  }
};

/**
 * Optional authentication middleware
 * Validates token if provided, but doesn't require it
 */
const optional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No auth provided, continue without user context
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token || !process.env.JWT_SECRET) {
    // Invalid token format or no secret, continue without user context
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id || decoded._id;
  } catch (err) {
    // Token validation failed, continue without user context
    // (Don't throw error for optional auth)
  }

  return next();
};

/**
 * Check if user has Pro plan
 * Must be used after required authentication middleware
 * Returns 403 if user is on free plan
 */
const checkProPlan = async (req, res, next) => {
  const AppError = require("../utils/appError");
  const User = require("../models/user");

  try {
    if (!req.user || !req.user.id) {
      return next(new AppError("User not authenticated", 401));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.plan !== "pro") {
      return next(new AppError("This feature requires a Pro plan. Please upgrade.", 403));
    }

    req.user.plan = user.plan;
    return next();
  } catch (err) {
    return next(new AppError("Failed to verify plan", 500));
  }
};

/**
 * Backward compatibility - default export is required middleware
 */
const verifyToken = required;

module.exports = {
  required,
  optional,
  checkProPlan,
  verifyToken, // Legacy
  default: required, // Legacy
};

// For direct require('./authMiddleware')
module.exports.default = required;