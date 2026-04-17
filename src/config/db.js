const mongoose = require("mongoose");
const logger = require("../utils/logger");

const parseNumber = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in the environment");
  }

  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    throw new Error(
      "Invalid MONGO_URI format. Expected it to start with 'mongodb://' or 'mongodb+srv://'"
    );
  }

  const conn = await mongoose.connect(mongoUri, {
    maxPoolSize: parseNumber(process.env.MONGODB_MAX_POOL_SIZE, 20),
    minPoolSize: parseNumber(process.env.MONGODB_MIN_POOL_SIZE, 5),
    serverSelectionTimeoutMS: parseNumber(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS, 10000),
    socketTimeoutMS: parseNumber(process.env.MONGODB_SOCKET_TIMEOUT_MS, 45000),
  });

  logger.info("MongoDB connected", { host: conn.connection.host });
  return conn;
};

module.exports = connectDB;