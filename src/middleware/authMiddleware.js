const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError(401, "Authorization token is required"));
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Authorization header must use Bearer token format"));
  }

  // Extract only the raw JWT from: Authorization: Bearer <token>
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError(401, "Authorization token is missing"));
  }

  if (!process.env.JWT_SECRET) {
    return next(new AppError(500, "JWT secret is not configured"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError(401, "Token expired"));
    }

    if (err.name === "JsonWebTokenError") {
      return next(new AppError(401, "Invalid token"));
    }

    return next(new AppError(500, "Authentication failed"));
  }
};

module.exports = verifyToken;