const express = require("express");
const passport = require("passport");

const {
  createUser,
  verifyEmailToken,
  verifyEmail,
  loginUser,
  loginAdmin,
  handleRefreshToken,
  logout,
  getallUser,
  getaUser,
  getUserDetails,
  updateUser,
  deleteaUser,
  blockUser,
  unblockUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  socialLogin,
  socialLogout,
  getUserPharmacies,
} = require("../controller/userCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/loginAdmin", loginAdmin);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/password", authMiddleware, updatePassword);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/reset-password/:token", resetPassword);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
//!put
router.put("/Email-verification/:token", verifyEmail);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// Google callback
// Google authentication route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }), // Passport adds user to req object
  socialLogin // Only called if authentication is successful
);

// # on production server
// 1 . Facebook authentication route doesnot work from facebook campany (account issue)
// 2. user model ingreate (facebookId) //!impotant in many conditions

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"], // You can add more permissions if necessary
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  socialLogin // Only called if authentication is successful
);
// ######
router.get("/auth/logout", socialLogout); // Adjust the path as necessary

router.get("/refresh", handleRefreshToken);
router.get("/all-users", authMiddleware, isAdmin, getallUser);
router.get("/logout", logout);
router.get("/details/", authMiddleware, getUserDetails);
router.get("/getPharmacies", authMiddleware, getUserPharmacies);
router.get("/:id", authMiddleware, isAdmin, getaUser);

router.delete("/:id", authMiddleware, isAdmin, deleteaUser);

module.exports = router;
