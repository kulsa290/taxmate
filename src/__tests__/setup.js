/**
 * Jest setup and configuration
 * @module __tests__/setup
 */

// Set test environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.MONGODB_URI = "mongodb://test:test@localhost:27017/taxmate-test";

// Suppress logs during tests
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
