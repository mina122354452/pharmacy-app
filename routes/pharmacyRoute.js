const express = require("express");

/**
 * rate limiter
 * validator
 * redis
 ** API Response Caching
 ** Database Query Caching
 */

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
const { PhLimiter } = require("../utils/rateLimiter.js");

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
