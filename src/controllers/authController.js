const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");
const logger = require("../utils/logger");

/**
 * Get user profile
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} User profile data
 * @throws {AppError} 404 if user not found
 * @throws {AppError} 500 if fetch fails
 * @example
 * // GET /api/auth/me
 * // Headers: Authorization: Bearer <token>
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      logger.warn("User profile fetch - user not found", { userId: req.user.id, requestId: req.id });
      return next(new AppError(404, "User not found"));
    }

    logger.info("User profile fetched successfully", { userId: req.user.id, requestId: req.id });
    return sendSuccess(res, 200, "Profile fetched successfully", { user });
  } catch (err) {
    logger.error("Failed to fetch profile", {
      userId: req.user.id,
      error: err.message,
      requestId: req.id,
    });
    return next(new AppError(500, "Failed to fetch profile"));
  }
};

/**
 * Logout user
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 * @example
 * // POST /api/auth/logout
 * // Headers: Authorization: Bearer <token>
 */
exports.logout = async (req, res) => {
  logger.info("User logged out", { userId: req.user.id, requestId: req.id });
  return sendSuccess(res, 200, "Logout successful. Remove the token on the client side.", null);
};

/**
 * Upgrade user plan to Pro
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Updated user data with new plan
 * @throws {AppError} 400 if already on pro plan
 * @throws {AppError} 404 if user not found
 * @throws {AppError} 500 if upgrade fails
 * @example
 * // POST /api/auth/upgrade
 * // Headers: Authorization: Bearer <token>
 */
exports.upgradeToPro = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn("Upgrade attempt - user not found", { userId: req.user.id, requestId: req.id });
      return next(new AppError(404, "User not found"));
    }

    if (user.plan === "pro") {
      logger.warn("Upgrade attempt - already pro", { userId: req.user.id, requestId: req.id });
      return next(new AppError(400, "Already on Pro plan"));
    }

    user.plan = "pro";
    await user.save();

    logger.info("User upgraded to Pro", { userId: req.user.id, requestId: req.id });
    return sendSuccess(res, 200, "Upgrade successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (err) {
    logger.error("Upgrade failed", {
      userId: req.user.id,
      error: err.message,
      requestId: req.id,
    });
    return next(new AppError(500, "Upgrade failed"));
  }
};
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Newly created user data (without password)
 * @throws {AppError} 400 if validation fails
 * @throws {AppError} 409 if user already exists
 * @throws {AppError} 500 if registration fails
 * @example
 * // POST /api/auth/register
 * // Body: { name: "John Doe", email: "john@example.com", password: "SecurePass123" }
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log('Starting registration for:', { name, email, requestId: req.id });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      logger.warn("Registration attempt with existing email", { email, requestId: req.id });
      return next(new AppError(409, "User already exists with this email"));
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log('User created successfully:', user._id);
    logger.info("New user registered", { userId: user._id, email, requestId: req.id });

    return sendSuccess(res, 201, "User created successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    logger.error("Registration failed", {
      error: err.message,
      stack: err.stack,
      requestId: req.id,
    });
    // Send error response directly
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      requestId: req.id,
      data: null,
    });
  }
};

/**
 * Login user
 * @async
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JWT token and user data
 * @throws {AppError} 400 if validation fails
 * @throws {AppError} 401 if credentials are invalid
 * @throws {AppError} 500 if JWT secret not configured
 * @throws {AppError} 500 if login fails
 * @example
 * // POST /api/auth/login
 * // Body: { email: "john@example.com", password: "SecurePass123" }
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login attempt with non-existent email", { email, requestId: req.id });
      return next(new AppError(401, "Invalid credentials"));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn("Login attempt with wrong password", { email, userId: user._id, requestId: req.id });
      return next(new AppError(401, "Invalid credentials"));
    }

    if (!process.env.JWT_SECRET) {
      logger.error("JWT secret not configured", { requestId: req.id });
      return next(new AppError(500, "JWT secret is not configured"));
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info("User logged in successfully", { userId: user._id, email, requestId: req.id });

    return sendSuccess(res, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (err) {
    logger.error("Login failed", {
      error: err.message,
      requestId: req.id,
    });
    return next(new AppError(500, "Login failed"));
  }
};