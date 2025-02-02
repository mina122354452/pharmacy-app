const express = require("express");
const passport = require("passport");
const FRONTEND_HOST = process.env.HTTP_URL;
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
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
  getUserPharmacies,
} = require("../controller/userCtrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
const {
  RegisterValidation,
  handleValidationErrors,
  loginValidation,
  forgetPasswordValidation,
  updatePasswordValidation,
  updateUserValidation,
  resetPasswordValidation,
  emailVerificationValidation,
} = require("../utils/validator.js");
const {
  allUsersCache,
  getUserDetailsCache,
  restPasswordCache,
  passTokenCache,
  emailTokenCache,
} = require("../middlewares/cacheMiddleware.js");

const router = express.Router();
router.post(
  "/register",
  authLimiter,
  RegisterValidation,
  handleValidationErrors,
  createUser
);
router.post(
  "/login",
  authLimiter,
  loginValidation,
  handleValidationErrors,
  loginUser
);
router.post(
  "/loginAdmin",
  authLimiter,
  loginValidation,
  handleValidationErrors,
  loginAdmin
);
router.post(
  "/forgot-password-token",
  authLimiter,
  forgetPasswordValidation,
  handleValidationErrors,
  restPasswordCache,
  forgotPasswordToken
); //api cache

router.put(
  "/password",
  authLimiter,
  updatePasswordValidation,
  handleValidationErrors,
  authMiddleware,
  updatePassword
);
router.put(
  "/edit-user",
  authLimiter,
  updateUserValidation,
  handleValidationErrors,
  authMiddleware,
  updateUser
);
router.put(
  "/reset-password/:token",
  authLimiter,
  resetPasswordValidation,
  handleValidationErrors,
  passTokenCache,
  resetPassword
);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
//!put
router.put(
  "/Email-verification/:token",
  authLimiter,
  emailVerificationValidation,
  handleValidationErrors,
  emailTokenCache,
  verifyEmail
);
router.get(
  "/auth/google",
  authLimiter,
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// Google callback
// Google authentication route
router.get("/auth/google/callback", authLimiter, (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      // Handle errors (e.g., Google API errors, database errors)
      console.error("Error during Google authentication:", err);
      return res.redirect(
        `${FRONTEND_HOST}/user/GoogleAuth?error=${encodeURIComponent(
          err.message
        )}`
      );
    }
    if (!user) {
      // Handle authentication failure (e.g., user denied access or existing email)
      const errorMessage = info?.message || "Authentication failed";
      return res.redirect(
        `${FRONTEND_HOST}/user/GoogleAuth?error=${encodeURIComponent(
          errorMessage
        )}`
      );
    }
    // If authentication is successful, call socialLogin
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.redirect(
          `${FRONTEND_HOST}/user/GoogleAuth?error=${encodeURIComponent(
            err.message
          )}`
        );
      }
      // Call socialLogin for successful authentication
      return socialLogin(req, res);
    });
  })(req, res, next);
});

router.get("/refresh", authLimiter, handleRefreshToken);
router.get("/all-users", authMiddleware, isAdmin, allUsersCache, getallUser);
router.get("/logout", authLimiter, logout);
router.get("/details/", authMiddleware, getUserDetailsCache, getUserDetails);
router.get("/getPharmacies", authMiddleware, getUserPharmacies);
router.get("/:id", authMiddleware, isAdmin, getaUser);

router.delete("/:id", authMiddleware, isAdmin, deleteaUser);

module.exports = router;
