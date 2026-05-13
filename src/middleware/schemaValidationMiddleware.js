const AppError = require("../utils/appError");
const logger = require("../utils/logger");

/**
 * Creates a validation middleware for a given Zod schema
 * @param {z.ZodSchema} schema - The Zod validation schema
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const messages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("; ");
        logger.warn("Validation error", { errors: error.errors, body: req.body, requestId: req.id });
        return next(new AppError(400, messages));
      }
      logger.warn("Validation failed", { error: error.message, body: req.body, requestId: req.id });
      return next(new AppError(400, "Validation failed"));
    }
  };
};

module.exports = {
  validateRequest,
};
