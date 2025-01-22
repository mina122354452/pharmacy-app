const express = require("express");
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
router.get("/:pharmacyId", authMiddleware, isOwner, getPharmacy);
router.post("/create", authMiddleware, createPharmacy);
router.put("/update/:pharmacyId", authMiddleware, isOwner, updatePharmacy);
router.put("/Email-verification/:token", verifyEmail);
router.delete(
  "/deletePharmacy/:pharmacyId",
  authMiddleware,
  isOwner,
  removePharmacy
);
module.exports = router;
