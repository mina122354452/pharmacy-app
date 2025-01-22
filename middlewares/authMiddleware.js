const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const pharmacyModel = require("../models/pharmacyModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        //FIXME:cutsom error handler
        if (user.isBlocked == true) {
          throw new Error("User is blocked");
        }
        if (user.emailConfirm == false) {
          throw new Error("User is not verified , login again");
        }
        req.user = user;
        next();
      }
    } catch (error) {
      //FIXME:cutsom error handler

      throw new Error(
        error == "JsonWebTokenError: invalid signature"
          ? "Not Authorized token expired, Please Login again"
          : error
      );
    }
  } else {
    throw new Error("There is no token attached to header");
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
    return res.status(404).json({ message: "Pharmacy not found" });
  }
  // Check if the user is the owner of the pharmacy
  if (pharmacy.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to access this pharmacy" });
  }
  next();
});

module.exports = {
  authMiddleware,
  isAdmin,
  isOwner,
};
