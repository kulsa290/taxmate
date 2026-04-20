const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    dateOfBirth: { type: Date },
    panNumber: { type: String, trim: true, uppercase: true },
    aadhaarNumber: { type: String, trim: true },
    occupation: { type: String, trim: true },
    annualIncome: { type: Number },
    taxRegime: { type: String, enum: ["old", "new"], default: "old" },
    // Additional fields for dashboard analytics
    taxCalculations: [
      {
        date: { type: Date, default: Date.now },
        income: Number,
        tax: Number,
        regime: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);