const rateLimit = require("express-rate-limit");
const getClientIp = (req) => {
  return req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
};
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  keyGenerator: getClientIp,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      status: "fail",
      error: "Too many requests, try again later.",
    });
  },
  headers: true,
});
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: getClientIp,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      status: "fail",
      error: "Too many requests, try again later.",
    });
  },
  headers: true,
});

const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  keyGenerator: getClientIp,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      status: "fail",
      error: "Too many requests, try again later.",
    });
  },
  headers: true,
});

const PhLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  keyGenerator: getClientIp,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      status: "fail",
      error: "Too many requests, try again later.",
    });
  },
  headers: true,
});
module.exports = {
  authLimiter,
  globalLimiter,
  paymentLimiter,
  PhLimiter,
};
