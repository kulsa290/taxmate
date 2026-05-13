const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 12;

const ROLE_ENUM = ["ca", "client"];
const PLAN_ENUM = ["free", "pro"];

/**
 * User Schema
 * Production-ready schema optimized for SaaS identity, security, and performance.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Please provide a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Hide password in query results by default.
    },
    role: {
      type: String,
      enum: {
        values: ROLE_ENUM,
        message: "Role must be either 'ca' or 'client'",
      },
      default: "client",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: {
        values: PLAN_ENUM,
        message: "Plan must be either 'free' or 'pro'",
      },
      default: "free",
      required: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Disable __v field for cleaner documents.
  }
);

// Additional indexes for frequent SaaS query patterns.
userSchema.index({ role: 1, plan: 1 });
userSchema.index({ emailVerified: 1, lastLoginAt: -1 });

/**
 * Hash the password automatically before saving.
 * Note: Async pre-hooks must not use next() callback; they use return or throw.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare a candidate password with the stored hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Remove sensitive fields from API responses.
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  return obj;
};

/**
 * Duplicate email handling guidance:
 * In controllers, detect duplicate key errors and return a clear 409 response.
 * Example: if (err.code === 11000 && err.keyPattern?.email) { throw new AppError('Email already exists', 409); }
 */

module.exports = mongoose.model("User", userSchema);
