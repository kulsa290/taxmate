const mongoose = require('mongoose');

/**
 * Client Schema for CA/Professional use
 * Each user (CA) can manage multiple clients
 */
const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      trim: true,
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    aadharNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: Date,
    // Address
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    // Tax details
    businessType: {
      type: String,
      enum: ['Salaried', 'Self-Employed', 'Business', 'Agricultural', 'Other'],
      default: 'Salaried',
    },
    estimatedIncome: Number,
    // Associated calculations
    calculations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaxCalculation',
      },
    ],
    // Notes
    notes: String,
    // Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
clientSchema.index({ userId: 1, email: 1 });
clientSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Client', clientSchema);
