const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 1000;
const AppError = require("../utils/appError");

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const trimmedName = name?.trim();
  const normalizedEmail = normalizeEmail(email);

  if (!trimmedName || !normalizedEmail || !password) {
    return next(new AppError(400, "Name, email, and password are required"));
  }

  if (trimmedName.length < 2) {
    return next(new AppError(400, "Name must be at least 2 characters long"));
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return next(new AppError(400, "Enter a valid email address"));
  }

  if (password.length < 8) {
    return next(new AppError(400, "Password must be at least 8 characters long"));
  }

  req.body = {
    ...req.body,
    name: trimmedName,
    email: normalizedEmail,
  };

  return next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return next(new AppError(400, "Email and password are required"));
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return next(new AppError(400, "Enter a valid email address"));
  }

  req.body = {
    ...req.body,
    email: normalizedEmail,
  };

  return next();
};

const validateChatMessage = (req, res, next) => {
  const rawQuestion = req.body.question ?? req.body.message;

  if (typeof rawQuestion !== "string") {
    return next(new AppError(400, "Question must be a string"));
  }

  const trimmedQuestion = rawQuestion.trim();

  if (!trimmedQuestion) {
    return next(new AppError(400, "Question is required"));
  }

  if (trimmedQuestion.length > MAX_MESSAGE_LENGTH) {
    return next(new AppError(400, `Question must be ${MAX_MESSAGE_LENGTH} characters or fewer`));
  }

  req.body = {
    ...req.body,
    question: trimmedQuestion,
  };

  return next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateChatMessage,
};