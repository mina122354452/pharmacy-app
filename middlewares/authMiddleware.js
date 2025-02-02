const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const pharmacyModel = require("../models/pharmacyModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded?.id);
      // Custom error handler
      if (user.isBlocked) {
        return res
          .status(403)
          .json({ success: false, status: "fail", error: "User is blocked" });
      }
      if (!user.emailConfirm) {
        return res.status(401).json({
          status: "fail",
          success: false,
          error: "User is not verified, login again",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "fail",
          success: false,
          error: "Token expired, Please Login again",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: "fail",
          success: false,
          error: "Invalid token, Please Login again",
        });
      } else {
        return res.status(500).json({
          status: "fail",
          success: false,
          error: error.message,
        });
      }
      // Custom error handler
    }
  } else {
    return res.status(401).json({
      status: "fail",
      error: "There is no token attached to header",
    });
  }
});
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

const isOwner = asyncHandler(async (req, res, next) => {
  const { pharmacyId } = req.params;

  // Find the pharmacy to be removed
  const pharmacy = await pharmacyModel.findById(pharmacyId);
  if (!pharmacy) {
    return res.status(404).json({
      status: "fail",
      success: false,
      message: "Pharmacy not found",
    });
  }
  // Check if the user is the owner of the pharmacy
  if (pharmacy.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      success: false,
      message: "Not authorized to access this pharmacy",
    });
  }
  next();
});

module.exports = {
  authMiddleware,
  isAdmin,
  isOwner,
};
