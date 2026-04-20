const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

exports.calculateTax = async (req, res, next) => {
  try {
    const {
      income,
      regime,
      deductions = {},
    } = req.body;

    if (!income || income < 0) {
      return next(new AppError(400, "Valid income is required"));
    }

    if (!["old", "new"].includes(regime)) {
      return next(new AppError(400, "Regime must be 'old' or 'new'"));
    }

    // ✅ Deduction breakdown
    const deductionLimits = {
      section80C: 150000,
      section80D: 25000,
      hra: 200000,
    };

    let totalDeductions = 0;

    Object.keys(deductions).forEach((key) => {
      const value = Number(deductions[key] || 0);
      const limit = deductionLimits[key] || 0;

      totalDeductions += Math.min(value, limit);
    });

    // 👉 Old regime me hi deductions apply honge
    let taxableIncome =
      regime === 'old' ? income - totalDeductions : income;

    if (taxableIncome < 0) taxableIncome = 0;

    let tax = 0;

    // ✅ New Regime
    if (regime === 'new') {
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000)
        tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000)
        tax = 15000 + (taxableIncome - 600000) * 0.1;
      else if (taxableIncome <= 1200000)
        tax = 45000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000)
        tax = 90000 + (taxableIncome - 1200000) * 0.2;
      else
        tax = 150000 + (taxableIncome - 1500000) * 0.3;

      if (taxableIncome <= 700000) tax = 0;
    }

    // ✅ Old Regime
    if (regime === 'old') {
      if (taxableIncome <= 250000) tax = 0;
      else if (taxableIncome <= 500000)
        tax = (taxableIncome - 250000) * 0.05;
      else if (taxableIncome <= 1000000)
        tax =
          12500 + (taxableIncome - 500000) * 0.2;
      else
        tax =
          112500 + (taxableIncome - 1000000) * 0.3;
    }

    // 🧠 Smart Suggestions Engine
    const suggestions = [];

    if (regime === 'old') {
      if ((deductions.section80C || 0) < 150000) {
        suggestions.push(
          `You can invest ₹${150000 - (deductions.section80C || 0)} more under 80C (ELSS, PPF) to save tax.`
        );
      }

      if ((deductions.section80D || 0) < 25000) {
        suggestions.push(
          `Health insurance (80D) can save additional tax up to ₹25,000.`
        );
      }

      if (totalDeductions < 200000) {
        suggestions.push(
          `Consider maximizing deductions to reduce taxable income significantly.`
        );
      }
    } else {
      suggestions.push(
        `You are using new regime. Deductions like 80C are not applicable.`
      );
    }

    return sendSuccess(res, 200, "Tax calculated successfully", {
      income,
      taxableIncome,
      totalDeductions,
      regime,
      tax: Math.round(tax),
      suggestions,
    });
  } catch (err) {
    return next(new AppError(500, "Tax calculation failed"));
  }
};