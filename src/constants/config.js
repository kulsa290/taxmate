/**
 * Application-wide constants and configuration
 * @module constants/config
 */

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

const VALIDATION = {
  NAME: {
    MIN: 2,
    MAX: 100,
  },
  EMAIL: {
    MAX: 255,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN: 8,
    MAX: 128,
  },
  MESSAGE: {
    MAX: 2000,
  },
};

// ============================================================================
// JWT CONSTANTS
// ============================================================================

const JWT = {
  EXPIRES_IN: "7d",
  EXPIRES_IN_MS: 7 * 24 * 60 * 60 * 1000,
};

// ============================================================================
// RATE LIMITING CONSTANTS
// ============================================================================

const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 300,
  AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_ATTEMPTS: 5,
};

// ============================================================================
// PAGINATION CONSTANTS
// ============================================================================

const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
};

// ============================================================================
// DATABASE CONSTANTS
// ============================================================================

const DATABASE = {
  COLLECTION_NAMES: {
    USERS: "users",
    CHATS: "chats",
    PROFILES: "profiles",
  },
  INDEX_NAMES: {
    EMAIL: "email_1",
    CREATED_AT: "createdAt_1",
  },
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_FOUND: "User not found",
  USER_EXISTS: "User already exists with this email",
  VALIDATION_FAILED: "Validation failed",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  INVALID_JSON: "Invalid JSON payload",
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTRATION_SUCCESS: "User created successfully",
  PROFILE_FETCHED: "Profile fetched successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  OPERATION_SUCCESS: "Operation completed successfully",
};

// ============================================================================
// API ENDPOINTS
// ============================================================================

const API_ENDPOINTS = {
  AUTH: "/api/auth",
  CHAT: "/api/chat",
  PROFILE: "/api/profile",
  TAX: "/api/tax",
  HEALTH: "/health",
};

module.exports = {
  HTTP_STATUS,
  VALIDATION,
  JWT,
  RATE_LIMIT,
  PAGINATION,
  DATABASE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_ENDPOINTS,
};
