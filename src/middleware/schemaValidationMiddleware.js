const AppError = require("../utils/appError");

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
        return next(new AppError(400, messages));
      }
      return next(new AppError(400, "Validation failed"));
    }
  };
};

module.exports = {
  validateRequest,
};
