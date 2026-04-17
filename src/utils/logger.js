const serializeMeta = (meta = {}) => {
  if (!meta || Object.keys(meta).length === 0) {
    return "";
  }

  try {
    return JSON.stringify(meta);
  } catch (error) {
    return JSON.stringify({ error: "Failed to serialize log metadata" });
  }
};

const writeLog = (level, message, meta = {}) => {
  if (process.env.NODE_ENV === "production") {
    const payload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    console.log(JSON.stringify(payload));
    return;
  }

  const serializedMeta = serializeMeta(meta);
  const output = serializedMeta ? `[${level}] ${message} ${serializedMeta}` : `[${level}] ${message}`;
  console.log(output);
};

module.exports = {
  info: (message, meta) => writeLog("info", message, meta),
  warn: (message, meta) => writeLog("warn", message, meta),
  error: (message, meta) => writeLog("error", message, meta),
};