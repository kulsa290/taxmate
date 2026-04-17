const AppError = require("../utils/appError");

const notFoundHandler = (req, res, next) => {
  next(new AppError(404, "Route not found"));
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
      data: null,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};