const express = require("express");
const rateLimit = require("express-rate-limit");
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
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
/**
 * rate limiter
 * validator
 * redis
 ** API Response Caching
 ** Database Query Caching
 */

const PhLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
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
const {
  createPharmacy,
  getPharmacies,
  verifyEmail,
  removePharmacy,
  getPharmacy,
  updatePharmacy,
} = require("../controller/pharmacyCtrl.js");
const {
  authMiddleware,
  isAdmin,
  isOwner,
  isActivated,
} = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.get("/all", authMiddleware, isAdmin, getPharmacies);
router.get("/:pharmacyId", PhLimiter, authMiddleware, isOwner, getPharmacy);
router.post("/create", PhLimiter, authMiddleware, createPharmacy);
router.put(
  "/update/:pharmacyId",
  PhLimiter,
  authMiddleware,
  isOwner,
  updatePharmacy
);
router.put("/Email-verification/:token", PhLimiter, verifyEmail);
router.delete(
  "/deletePharmacy/:pharmacyId",

  authMiddleware,
  isOwner,
  removePharmacy
);
module.exports = router;
