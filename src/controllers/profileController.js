const Profile = require("../models/profile");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate("userId", "name email");

    if (!profile) {
      return next(new AppError(404, "Profile not found"));
    }

    return sendSuccess(res, 200, "Profile fetched successfully", { profile });
  } catch (err) {
    return next(new AppError(500, "Failed to fetch profile"));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const allowedFields = [
      "phone",
      "address",
      "dateOfBirth",
      "panNumber",
      "aadhaarNumber",
      "occupation",
      "annualIncome",
      "taxRegime",
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = new Profile({ userId: req.user.id, ...filteredUpdates });
    } else {
      Object.assign(profile, filteredUpdates);
    }

    await profile.save();

    return sendSuccess(res, 200, "Profile updated successfully", { profile });
  } catch (err) {
    return next(new AppError(500, "Failed to update profile"));
  }
};

exports.addTaxCalculation = async (req, res, next) => {
  try {
    const { income, tax, regime } = req.body;

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return next(new AppError(404, "Profile not found"));
    }

    profile.taxCalculations.push({ income, tax, regime });
    await profile.save();

    return sendSuccess(res, 200, "Tax calculation added successfully", { profile });
  } catch (err) {
    return next(new AppError(500, "Failed to add tax calculation"));
  }
};

exports.getTaxHistory = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return next(new AppError(404, "Profile not found"));
    }

    return sendSuccess(res, 200, "Tax history fetched successfully", {
      taxCalculations: profile.taxCalculations,
    });
  } catch (err) {
    return next(new AppError(500, "Failed to fetch tax history"));
  }
};