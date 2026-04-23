const { z } = require("zod");

/**
 * Validation schema for user registration
 * @type {z.ZodSchema}
 */
const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and numbers"),
});

/**
 * Validation schema for user login
 * @type {z.ZodSchema}
 */
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

/**
 * Validation schema for profile update
 * @type {z.ZodSchema}
 */
const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .optional(),
});

/**
 * Validation schema for chat messages
 * @type {z.ZodSchema}
 */
const chatMessageSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must not exceed 2000 characters"),
});

/**
 * Validation schema for tax calculation
 * @type {z.ZodSchema}
 */
const taxCalculationSchema = z.object({
  income: z
    .number({ required_error: "Income is required" })
    .positive("Income must be a positive number"),
  deductions: z
    .number()
    .nonnegative("Deductions must be non-negative")
    .optional()
    .default(0),
  investmentInSavingsScheme: z
    .number()
    .nonnegative("Investment must be non-negative")
    .optional()
    .default(0),
});

/**
 * Validation schema for saving tax calculation
 * @type {z.ZodSchema}
 */
const saveTaxCalculationSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(200, "Name must not exceed 200 characters"),
  inputData: z
    .record(z.any(), { required_error: "Input data is required" }),
  result: z
    .record(z.any(), { required_error: "Result is required" }),
  taxYear: z
    .string({ required_error: "Tax year is required" })
    .regex(/^\d{4}$/, "Tax year must be a 4-digit year"),
});

/**
 * Validation schema for getting tax calculations
 * @type {z.ZodSchema}
 */
const getTaxCalculationsSchema = z.object({
  taxYear: z
    .string()
    .regex(/^\d{4}$/, "Tax year must be a 4-digit year")
    .optional(),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(10),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  chatMessageSchema,
  taxCalculationSchema,
  saveTaxCalculationSchema,
  getTaxCalculationsSchema,
};
