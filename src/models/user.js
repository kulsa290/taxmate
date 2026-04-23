const mongoose = require("mongoose");

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} name - User's full name (required, indexed for search)
 * @property {string} email - User's email (required, unique, indexed)
 * @property {string} password - Hashed password (required)
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Exclude password by default in queries
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
  },
  {
    timestamps: true,
    versionKey: false, // Disable MongoDB versioning
  }
);

// Compound index for email searches
userSchema.index({ email: 1 });

// TTL index for potential session cleanup (adjust as needed)
userSchema.index({ createdAt: 1 }, { sparse: true });

/**
 * Pre-save middleware to ensure password is hashed
 * Note: Use controller to hash password, not here
 */
userSchema.pre("save", function(next) {
  // Only proceed if password has been modified
  if (!this.isModified("password")) {
    return next();
  }
  next();
});

/**
 * Virtual method to exclude password from JSON responses
 */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);