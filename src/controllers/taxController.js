const TaxCalculation = require('../models/taxCalculation');
const AppError = require('../utils/appError');

/**
 * Indian Tax Calculation Engine (FY 2024-25)
 * Supports: Old Regime & New Regime
 */

// 2024-25 Tax Slabs for Old Regime (Individual)
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: Infinity, rate: 0.3 },
];

// 2024-25 Tax Slabs for New Regime (Individual)
const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 600000, rate: 0.05 },
  { min: 600000, max: 900000, rate: 0.1 },
  { min: 900000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.2 },
  { min: 1500000, max: Infinity, rate: 0.3 },
];

// Standard Deduction for New Regime
const STANDARD_DEDUCTION_NEW = 75000; // FY 2024-25

/**
 * Calculate tax based on slabs
 */
function calculateTaxFromSlabs(taxableIncome, slabs) {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const slab of slabs) {
    if (taxableIncome > slab.min) {
      const incomeInSlab = Math.min(taxableIncome, slab.max) - slab.min;
      tax += incomeInSlab * slab.rate;
    }
  }
  return tax;
}

/**
 * Calculate tax under Old Regime
 */
function calculateOldRegimeTax(grossIncome, deductions) {
  // Gross Total Income
  const grossTotalIncome = grossIncome;

  // Total Deductions
  const totalDeductions =
    (deductions.rent || 0) +
    (deductions.section80C || 0) +
    (deductions.section80D || 0) +
    (deductions.section80E || 0) +
    (deductions.section80G || 0) +
    (deductions.otherDeductions || 0);

  // Taxable Income
  const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions);

  // Tax (without surcharge/cess)
  const baseTax = calculateTaxFromSlabs(taxableIncome, OLD_REGIME_SLABS);

  // Health and Education Cess @ 4%
  const cess = baseTax * 0.04;

  // Surcharge for high income
  let surcharge = 0;
  if (taxableIncome > 50000000) {
    surcharge = baseTax * 0.25;
  } else if (taxableIncome > 10000000) {
    surcharge = baseTax * 0.15;
  } else if (taxableIncome > 5000000) {
    surcharge = baseTax * 0.1;
  }

  const totalTax = baseTax + cess + surcharge;

  return {
    grossTotalIncome,
    totalDeductions,
    taxableIncome,
    baseTax,
    surcharge,
    cess,
    totalTax: Math.round(totalTax),
  };
}

/**
 * Calculate tax under New Regime
 */
function calculateNewRegimeTax(grossIncome) {
  // Gross Total Income
  const grossTotalIncome = grossIncome;

  // Standard Deduction
  const standardDeduction = Math.min(STANDARD_DEDUCTION_NEW, grossTotalIncome);

  // Taxable Income
  const taxableIncome = Math.max(0, grossTotalIncome - standardDeduction);

  // Tax (without surcharge/cess)
  const baseTax = calculateTaxFromSlabs(taxableIncome, NEW_REGIME_SLABS);

  // Health and Education Cess @ 4%
  const cess = baseTax * 0.04;

  // Surcharge for high income
  let surcharge = 0;
  if (taxableIncome > 50000000) {
    surcharge = baseTax * 0.25;
  } else if (taxableIncome > 10000000) {
    surcharge = baseTax * 0.15;
  } else if (taxableIncome > 5000000) {
    surcharge = baseTax * 0.1;
  }

  const totalTax = baseTax + cess + surcharge;

  return {
    grossTotalIncome,
    standardDeduction,
    taxableIncome,
    baseTax,
    surcharge,
    cess,
    totalTax: Math.round(totalTax),
  };
}

/**
 * Generate tax-saving suggestions
 */
function generateTaxSavingSuggestions(taxableIncome, deductions, oldRegimeTax, newRegimeTax) {
  const suggestions = [];

  // Section 80C - Investment (up to 1.5L)
  const max80C = 150000;
  const current80C = deductions.section80C || 0;
  const remaining80C = max80C - current80C;

  if (remaining80C > 0 && oldRegimeTax.totalTax > newRegimeTax.totalTax) {
    suggestions.push({
      title: 'Maximize Section 80C Investment',
      description: `Invest up to ₹${remaining80C.toLocaleString('en-IN')} more in LIC, PPF, ELSS, or Sukanya Samriddhi`,
      investmentAmount: remaining80C,
      taxSavings: Math.round(remaining80C * 0.3), // @ 30% marginal rate (approx)
      section: '80C',
      priority: 'high',
    });
  }

  // Section 80D - Health Insurance (up to 1L)
  const max80D = 100000;
  const current80D = deductions.section80D || 0;
  const remaining80D = max80D - current80D;

  if (remaining80D > 0 && oldRegimeTax.totalTax > newRegimeTax.totalTax) {
    suggestions.push({
      title: 'Health Insurance Under Section 80D',
      description: `Purchase health insurance for ₹${remaining80D.toLocaleString('en-IN')} (self + dependents)`,
      investmentAmount: remaining80D,
      taxSavings: Math.round(remaining80D * 0.3),
      section: '80D',
      priority: 'high',
    });
  }

  // Section 80E - Education Loan Interest
  const max80E = 100000; // No max limit, but practical limit
  const current80E = deductions.section80E || 0;
  if (current80E < max80E && oldRegimeTax.totalTax > newRegimeTax.totalTax) {
    suggestions.push({
      title: 'Claim Education Loan Interest',
      description: 'Deduct entire education loan interest under Section 80E (no limit)',
      investmentAmount: 0,
      taxSavings: Math.round(max80E * 0.3),
      section: '80E',
      priority: 'medium',
    });
  }

  // House Rent Allowance (HRA) - if salary earner
  const currentRent = deductions.rent || 0;
  if (currentRent === 0 && oldRegimeTax.totalTax > newRegimeTax.totalTax) {
    suggestions.push({
      title: 'Claim House Rent Exemption',
      description: 'If paying rent, claim HRA exemption under Section 10(13A)',
      investmentAmount: 0,
      taxSavings: 'Varies by location',
      section: 'HRA',
      priority: 'medium',
    });
  }

  // Switch to New Regime if beneficial
  if (newRegimeTax.totalTax < oldRegimeTax.totalTax) {
    const savings = oldRegimeTax.totalTax - newRegimeTax.totalTax;
    suggestions.unshift({
      title: '✨ Switch to New Regime',
      description: 'Based on your income & deductions, New Regime is more beneficial',
      investmentAmount: 0,
      taxSavings: savings,
      section: 'Regime',
      priority: 'high',
    });
  }

  return suggestions.sort((a, b) => {
    const priorityMap = { high: 0, medium: 1, low: 2 };
    return priorityMap[a.priority] - priorityMap[b.priority];
  });
}

/**
 * Calculate tax - POST /api/tax/calculate
 */
exports.calculateTax = async (req, res, next) => {
  try {
    const { income, deductions, clientName } = req.body;

    // Validation
    if (!income || typeof income !== 'object') {
      return next(new AppError(400, 'Invalid income data'));
    }

    // Calculate gross income
    const grossIncome =
      (income.salary || 0) + (income.hra || 0) + (income.otherIncome || 0);

    if (grossIncome < 0) {
      return next(new AppError(400, 'Income cannot be negative'));
    }

    // Calculate Old Regime Tax
    const oldRegimeTax = calculateOldRegimeTax(grossIncome, deductions || {});

    // Calculate New Regime Tax
    const newRegimeTax = calculateNewRegimeTax(grossIncome);

    // Determine recommended regime
    let recommendedRegime = 'old';
    let taxSavings = 0;

    if (newRegimeTax.totalTax < oldRegimeTax.totalTax) {
      recommendedRegime = 'new';
      taxSavings = oldRegimeTax.totalTax - newRegimeTax.totalTax;
    } else if (newRegimeTax.totalTax > oldRegimeTax.totalTax) {
      recommendedRegime = 'old';
      taxSavings = newRegimeTax.totalTax - oldRegimeTax.totalTax;
    } else {
      recommendedRegime = 'equal';
      taxSavings = 0;
    }

    // Generate suggestions
    const suggestions = generateTaxSavingSuggestions(
      oldRegimeTax.taxableIncome,
      deductions || {},
      oldRegimeTax,
      newRegimeTax
    );

    // Save to database (if user is logged in)
    let savedCalculation = null;
    if (req.userId) {
      const calculation = new TaxCalculation({
        userId: req.userId,
        clientName: clientName || null,
        income,
        deductions,
        taxResults: {
          oldRegimeTax: oldRegimeTax.totalTax,
          newRegimeTax: newRegimeTax.totalTax,
          recommendedRegime,
          taxSavings,
        },
        suggestions,
      });

      await calculation.save();
      savedCalculation = calculation._id;
    }

    return res.status(200).json({
      success: true,
      data: {
        calculationId: savedCalculation,
        grossIncome,
        oldRegime: oldRegimeTax,
        newRegime: newRegimeTax,
        comparison: {
          recommendedRegime,
          taxSavings,
          message:
            recommendedRegime === 'new'
              ? `You'll save ₹${taxSavings.toLocaleString('en-IN')} by choosing New Regime`
              : recommendedRegime === 'old'
              ? `You'll save ₹${taxSavings.toLocaleString('en-IN')} by staying with Old Regime`
              : 'Both regimes result in the same tax',
        },
        suggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get calculation history - GET /api/tax/history
 */
exports.getCalculationHistory = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError(401, 'User not authenticated'));
    }

    const calculations = await TaxCalculation.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('clientName income taxResults createdAt _id');

    return res.status(200).json({
      success: true,
      count: calculations.length,
      data: calculations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific calculation - GET /api/tax/:id
 */
exports.getCalculation = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError(401, 'User not authenticated'));
    }

    const calculation = await TaxCalculation.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!calculation) {
      return next(new AppError(404, 'Calculation not found'));
    }

    return res.status(200).json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete calculation - DELETE /api/tax/:id
 */
exports.deleteCalculation = async (req, res, next) => {
  try {
    if (!req.userId) {
      return next(new AppError(401, 'User not authenticated'));
    }

    const calculation = await TaxCalculation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!calculation) {
      return next(new AppError(404, 'Calculation not found'));
    }

    return res.status(200).json({
      success: true,
      message: 'Calculation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
