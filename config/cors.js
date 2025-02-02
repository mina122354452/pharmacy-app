const allowedOrigins = require("./allowed_origins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN"], // Allow headers for security and CSRF
  credentials: true,
};

module.exports = corsOptions;

// Ensure allowedOrigins is an array of valid origins
if (!Array.isArray(allowedOrigins)) {
  throw new Error("allowedOrigins must be an array");
}
