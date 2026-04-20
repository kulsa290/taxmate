/**
 * Logger utility for structured logging
 * Outputs JSON in production, pretty-printed in development
 * @module utils/logger
 */

const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * ANSI color codes for development logging
 * @type {Object}
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
};

/**
 * Serialize metadata object to JSON string
 * @param {Object} meta - Metadata object to serialize
 * @returns {string} Serialized JSON string or empty string
 */
const serializeMeta = (meta = {}) => {
  if (!meta || Object.keys(meta).length === 0) {
    return "";
  }

  try {
    return JSON.stringify(meta, null, isDevelopment ? 2 : undefined);
  } catch (error) {
    return JSON.stringify({ error: "Failed to serialize log metadata" });
  }
};

/**
 * Get color code based on log level
 * @param {string} level - Log level (info, warn, error)
 * @returns {string} ANSI color code
 */
const getColorForLevel = (level) => {
  switch (level) {
    case "error":
      return colors.red;
    case "warn":
      return colors.yellow;
    case "info":
      return colors.blue;
    case "debug":
      return colors.cyan;
    case "success":
      return colors.green;
    default:
      return colors.reset;
  }
};

/**
 * Format timestamp
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => new Date().toISOString();

/**
 * Write log entry
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Metadata object
 */
const writeLog = (level, message, meta = {}) => {
  const timestamp = getTimestamp();

  if (isDevelopment) {
    const color = getColorForLevel(level);
    const resetColor = colors.reset;
    const levelUpperCase = level.toUpperCase().padEnd(7);
    const serializedMeta = serializeMeta(meta);

    if (serializedMeta) {
      console.log(
        `${color}[${timestamp}] ${levelUpperCase}${resetColor} ${message}\n${color}${serializedMeta}${resetColor}\n`
      );
    } else {
      console.log(`${color}[${timestamp}] ${levelUpperCase}${resetColor} ${message}`);
    }
  } else {
    // Production: structured JSON logging
    const payload = {
      timestamp,
      level,
      message,
      ...meta,
    };
    console.log(JSON.stringify(payload));
  }
};

/**
 * Logger object with methods for different log levels
 * @type {Object}
 */
module.exports = {
  /**
   * Log info level message
   * @param {string} message - Log message
   * @param {Object} meta - Optional metadata
   */
  info: (message, meta) => writeLog("info", message, meta),

  /**
   * Log warning level message
   * @param {string} message - Log message
   * @param {Object} meta - Optional metadata
   */
  warn: (message, meta) => writeLog("warn", message, meta),

  /**
   * Log error level message
   * @param {string} message - Log message
   * @param {Object} meta - Optional metadata
   */
  error: (message, meta) => writeLog("error", message, meta),

  /**
   * Log debug level message (dev only)
   * @param {string} message - Log message
   * @param {Object} meta - Optional metadata
   */
  debug: (message, meta) => {
    if (isDevelopment) {
      writeLog("debug", message, meta);
    }
  },

  /**
   * Log success level message
   * @param {string} message - Log message
   * @param {Object} meta - Optional metadata
   */
  success: (message, meta) => writeLog("success", message, meta),

  /**
   * Log request information
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @param {number} statusCode - HTTP status code
   * @param {Object} meta - Additional metadata
   */
  logRequest: (method, path, statusCode, meta) => {
    const level = statusCode >= 400 ? "warn" : "info";
    writeLog(level, `${method} ${path} ${statusCode}`, meta);
  },
};