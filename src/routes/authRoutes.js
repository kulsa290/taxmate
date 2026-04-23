/**
 * Authentication Routes
 * @module routes/authRoutes
 * @requires express
 * @requires ../controllers/authController
 * @requires ../middleware/authMiddleware
 * @requires ../middleware/schemaValidationMiddleware
 * @requires ../schemas/validationSchemas
 */

const router = require("express").Router();
const { register, login, getProfile, logout, upgradeToPro } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/schemaValidationMiddleware");
const { registerSchema, loginSchema } = require("../schemas/validationSchemas");

/**
 * POST /api/auth/register
 * Register a new user
 * @async
 * @param {string} name - User's full name (2-100 characters)
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 8 chars, must include uppercase, lowercase, numbers)
 * @returns {Object} User data and success message
 */
router.post("/register", validateRequest(registerSchema), register);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * @async
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} JWT token, user data, and success message
 */
router.post("/login", validateRequest(loginSchema), login);

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal required)
 * @async
 * @requires Authorization header with JWT token
 * @returns {Object} Success message
 */
router.post("/logout", authMiddleware.required, logout);

/**
 * GET /api/auth/me
 * Get current user's profile
 * @async
 * @requires Authorization header with JWT token
 * @returns {Object} User profile data (without password)
 */
router.get("/me", authMiddleware.required, getProfile);

/**
 * POST /api/auth/upgrade
 * Upgrade user plan to Pro
 * @async
 * @requires Authorization header with JWT token
 * @returns {Object} Updated user data with new plan
 */
router.post("/upgrade", authMiddleware.required, upgradeToPro);

module.exports = router;