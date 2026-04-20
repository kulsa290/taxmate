/**
 * Swagger API Documentation Configuration
 * @module config/swagger
 */

const swaggerJsdoc = require("swagger-jsdoc");

/**
 * Swagger API definition
 * @type {Object}
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaxMate AI Backend API",
      description:
        "Professional backend API for TaxMate - an AI-powered tax calculation and management platform",
      version: "1.0.0",
      contact: {
        name: "TaxMate Support",
        email: "support@taxmate.in",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
      {
        url: "https://api.taxmate.in",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Bearer token for authentication",
        },
      },
      schemas: {
        /**
         * User object
         */
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID (MongoDB ObjectId)",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "User's full name",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              example: "john@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },

        /**
         * Auth response with token
         */
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  description: "JWT token for authentication",
                  example: "eyJhbGciOiJIUzI1NiIs...",
                },
                user: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
            requestId: {
              type: "string",
              description: "Unique request ID for tracing",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
          },
        },

        /**
         * Error response
         */
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Invalid credentials",
            },
            requestId: {
              type: "string",
              description: "Unique request ID for tracing",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            data: {
              type: "null",
              example: null,
            },
          },
        },

        /**
         * Health check response
         */
        HealthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Service healthy",
            },
            data: {
              type: "object",
              properties: {
                uptime: {
                  type: "number",
                  description: "Server uptime in seconds",
                  example: 3600,
                },
                environment: {
                  type: "string",
                  example: "production",
                },
                timestamp: {
                  type: "string",
                  format: "date-time",
                },
                database: {
                  type: "string",
                  example: "connected",
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Profile",
        description: "User profile management endpoints",
      },
      {
        name: "Chat",
        description: "Chat/conversation endpoints",
      },
    ],
  },
  apis: [],
};

/**
 * Generate Swagger spec
 * @returns {Object} Swagger specification
 */
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
