const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    return sendSuccess(res, 200, "Profile fetched successfully", { user });
  } catch (err) {
    return next(new AppError(500, "Failed to fetch profile"));
  }
};

exports.logout = async (req, res) => {
  return sendSuccess(res, 200, "Logout successful. Remove the token on the client side.", null);
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError(409, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return sendSuccess(res, 201, "User created successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return next(new AppError(500, "Registration failed"));
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(401, "Invalid credentials"));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new AppError(401, "Invalid credentials"));
    }

    if (!process.env.JWT_SECRET) {
      return next(new AppError(500, "JWT secret is not configured"));
    }

    // Store the user id and email inside the JWT so protected routes can trust both values.
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return next(new AppError(500, "Login failed"));
  }
};