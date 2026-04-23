const mongoose = require('mongoose');

/**
 * Tax Calculation Schema
 * @typedef {Object} TaxCalculation
 * @property {mongoose.ObjectId} userId - Reference to the user who owns the calculation
 * @property {string} name - Name/title of the calculation (e.g., '2023 Tax Calculation')
 * @property {Object} inputData - Input data used for calculation
 * @property {Object} result - Calculated tax result
 * @property {string} taxYear - Tax year (e.g., '2023')
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const taxCalculationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Calculation name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Input data is required'],
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Result is required'],
    },
    taxYear: {
      type: String,
      required: [true, 'Tax year is required'],
      match: [/^\d{4}$/, 'Tax year must be a 4-digit year'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
taxCalculationSchema.index({ userId: 1, taxYear: -1 });
taxCalculationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TaxCalculation', taxCalculationSchema);
