const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");
const { generateToken } = require("../config/jwt");
const { generateRefreshToken } = require("../config/refreshToken");
const {
  generatePasswordResetMail,
  generateVerifyMail,
} = require("../messages/email");

const FRONTEND_HOST = process.env.HTTP_URL;
const validateMongoDbId = require("../utils/validateMongodbId");
const {
  setAllUsersCache,
  setUserDetailsCache,
  setRestPasswordCache,
  invalidateRestPasswordCache,
  setPassTokenCache,
  setEmailTokenCache,
  setEmailVerificationCache,
  setUserDataCache,
  setUserPharmaciesCache,
  invalidEmailVerificationCache,
} = require("../utils/UserCache");
const redisClient = require("../config/redis");
const createUser = expressAsyncHandler(async (req, res) => {
  try {
    const { firstname, lastname, email, password, passConfirm } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 20 days in the future
      if (!firstname || !lastname || !email || !password || !passConfirm) {
        return res.status(400).json({
          status: "fail",
          success: false,
          error: "All fields are required",
        });
      } else if (password !== passConfirm) {
        return res.status(400).json({
          status: "fail",
          success: false,

          error: "Password does not match password confirmation",
        });
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          status: "fail",
          success: false,

          error:
            "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "fail",
          success: false,

          error: "Invalid email format",
        });
      }
      const newUser = await User.create({
        firstname,
        lastname,
        email,
        password,
        toBeDeletedAt: thirtyDaysFromNow, // Schedule deletion
      });
      if (newUser.emailConfirm === false) {
        verifyEmailToken(req, res);
      } else {
        return res.status(201).json({
          status: "success",
          success: true,

          message: "User created successfully",
        });
      }
    } else {
      return res.status(409).json({
        status: "fail",
        success: false,

        error: "user already exists with the same email",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const loginUser = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({
        success: false,
        status: "fail",

        error: "User does not exist",
      });
    }
    if (findUser?.googleId) {
      return res.status(401).json({
        status: "fail",
        success: false,

        error:
          "User signs out of Google account without signing in with Google account",
      });
    }
    const passwordStatus = await findUser.isPasswordMatched(password);

    if (findUser && passwordStatus) {
      if (findUser.emailConfirm === false) {
        verifyEmailToken(req, res);
      } else if (findUser.isBlocked == true) {
        return res.status(403).json({
          success: false,

          status: "fail",
          error: "User is blocked",
        });
      } else {
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(
          findUser?._id,
          {
            refreshToken: refreshToken,
          },
          {
            new: true,
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 72 * 60 * 60 * 1000, // 3 days
        });
        res.status(200).json({
          status: "success",
          success: true,

          message: "User logged in successfully",
          token: generateToken(findUser?._id),

          user: {
            firstname: updateUser.firstname,
            lastname: updateUser.lastname,
            email: updateUser.email,
          },
        });
      }
    } else {
      return res.status(401).json({
        status: "fail",
        success: false,

        error: "Invalid credentials",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const verifyEmailToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const cacheKey = `emailVerificationFor:${email}`; // Unique cache key for each user

  const data = await redisClient.get(cacheKey);

  if (data !== null) {
    console.log("data:", data);
    let response = JSON.parse(data);
    return res.status(response.statusCode).json(response);
  }
  console.log(req.body);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      let failResponse = {
        statusCode: 404,
        success: false,
        status: "fail",
        message: "User Not Found With this email",
      };
      setEmailVerificationCache(email, failResponse);
      return res.status(failResponse.statusCode).json(failResponse);
    }

    if (user.emailConfirm === false) {
      const token = await user.verifyEmail();
      await user.save();
      // todo
      let mail = await generateVerifyMail(token, user.firstname, user.lastname);

      const data = {
        to: email,
        subject: "verify your Email",
        html: mail,
      };
      console.log(process.env.password);
      await sendEmail(data);
      let successResponse = {
        statusCode: 200,

        status: "success",
        success: true,

        message:
          "we sent email verification, Note: (if you didn't verify the email during 30 days, User will be deleted)",
      };
      setEmailVerificationCache(email, successResponse);

      res.status(successResponse.statusCode).json(successResponse);
    } else {
      let notModifiedResponse = {
        statusCode: 200,

        success: true,
        status: "Not Modified",
        message: "your email is already verified",
      };
      setEmailVerificationCache(email, notModifiedResponse);

      await res
        .status(notModifiedResponse.statusCode)
        .json(notModifiedResponse);
    }
  } catch (error) {
    throw new Error(error);
  }
});
const verifyEmail = expressAsyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerify: hashedToken,
      emailVerifyExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      let failResponse = {
        statusCode: 400,
        success: false,
        status: "fail",
        error:
          "Token expired or Invalid link verification, please try again later",
      };
      setEmailTokenCache(token, failResponse);
      return res.status(failResponse.statusCode).json(failResponse);
    }

    user.emailConfirm = true;
    user.emailVerify = undefined;
    user.emailVerifyExpires = undefined;
    user.toBeDeletedAt = null;

    await user.save();

    if (user.emailConfirm === true) {
      let successResponse = {
        statusCode: 202,
        status: "success",
        success: true,

        message: "User email verified successfully, you can login now",
      };
      setEmailTokenCache(token, successResponse);
      invalidEmailVerificationCache(user.email);
      res.status(successResponse.statusCode).json(successResponse);
    }
  } catch (error) {
    throw new Error(error);
  }
});
const loginAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("No credentials");

    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorized");
    const passwordStatus = await findAdmin.isPasswordMatched(password);
    if (findAdmin && passwordStatus) {
      const refreshToken = await generateRefreshToken(findAdmin?.id);
      const updateUser = await User.findByIdAndUpdate(
        findAdmin?._id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,

        status: "success",
        message: "Admin logged in successfully",
        token: generateToken(findAdmin?._id),
        user: {
          id: findAdmin?._id,
          firstname: findAdmin?.firstName,
          lastname: findAdmin?.lastName,
          email: findAdmin?.email,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        status: "fail",
        error: "Invalid credentials",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const handleRefreshToken = expressAsyncHandler(async (req, res) => {
  try {
    let cookie = await req.cookies;

    if (!cookie?.refreshToken) {
      return res.status(401).json({
        status: "fail",
        error: "No refresh token in cookies",
      });
    }
    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({
      refreshToken,
    });
    if (!user) {
      return res.status(401).json({
        success: false,

        status: "fail",
        error: "No refresh token in database or token does not match",
      });
    }
    if (user.emailConfirm === false) {
      verifyEmailToken(req, res);
    } else {
      jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
          return res.status(401).json({
            success: false,

            status: "fail",
            error: "Refresh token is not valid",
          });
        }
        const accessToken = generateToken(user?._id);
        res.status(200).json({
          success: true,

          status: "success",
          accessToken,
        });
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const logout = expressAsyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, // Set to true in production
      sameSite: "strict",
    });

    // Handle standard logout (refresh token in cookies)
    if (cookie?.refreshToken) {
      const refreshToken = cookie.refreshToken;

      // Find the user with the refresh token
      const user = await User.findOne({ refreshToken });

      if (user) {
        // Clear the refresh token in the database
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
      }
    }

    // Handle social logout (session-based logout)
    if (req?.logout) {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Failed to log out",
            error: err,
          });
        }
      });
    }

    // Respond with success
    return res.status(200).json({
      success: true,
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getallUser = expressAsyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering for comparison operators
    let queryStr = JSON.stringify(queryObj);

    // Parse the modified query string back into an object
    const parsedQueryObj = JSON.parse(queryStr);

    // Add regex search for title or any other text fields
    if (parsedQueryObj.firstname) {
      parsedQueryObj.firstname = {
        $regex: parsedQueryObj.firstname,
        $options: "i",
      };
    }
    if (parsedQueryObj.lastname) {
      parsedQueryObj.lastname = {
        $regex: parsedQueryObj.lastname,
        $options: "i",
      };
    }

    let query = User.find(parsedQueryObj);

    // Find the product with the minimum price

    // If there are no matching products, return appropriate response

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select(
        "-emailVerifyExpires -emailVerify -emailConfirm   -__v"
      );
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    query = query.skip((page - 1) * limit).limit(limit);

    // Count total number of documents for pagination
    const totalProducts = await User.countDocuments(parsedQueryObj);

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / limit);

    if (req.query.page && page > totalPages) {
      return res.status(404).json({
        message: "This page does not exist",
      });
    }

    const user = await query;
    const response = {
      statusCode: 200,
      status: "success",
      success: true,

      message: "Users fetched successfully",
      currentPage: page,

      user,
      totalPages,
    };
    setAllUsersCache(req.originalUrl, response);
    // Include only the prices of the min and max products in the response
    res.status(response.statusCode).json(response);
  } catch (error) {
    throw new Error(error);
  }
});
const getaUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id).populate("pharmacies");

    if (!getaUser) {
      let failResponse = {
        statusCode: 404,
        success: false,
        status: "fail",
        error: "User not found",
      };
      setUserDataCache(id, failResponse);
      res.status(failResponse.statusCode).json(failResponse);
    } else {
      let successResponse = {
        statusCode: 200,
        success: true,
        status: "success",

        message: "User fetched successfully",
        user: getaUser,
      };
      setUserDataCache(id, successResponse);

      res.status(successResponse.statusCode).json(successResponse);
    }
  } catch (err) {
    throw new Error(err);
  }
});
const getUserDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id)
      .select("firstname lastname email -_id pharmacies googleId")
      .populate({
        path: "pharmacies",
        select: "-updatedAt -createdAt -toBeDeletedAt  -_id -__v -devicesData", // Specify the fields you want to select from the pharmacies collection
      });
    if (!getaUser) {
      let failResponse = {
        statusCode: 404,
        success: false,
        status: "fail",
        error: "User not found",
      };

      setUserDetailsCache(id, failResponse);
      return res.status(failResponse.statusCode).json(failResponse);
    }

    let response = {
      statusCode: 200,
      success: true,
      status: "success",
      user: getaUser,
    };
    setUserDetailsCache(id, response);
    res.status(response.statusCode).json(response);
  } catch (err) {
    throw new Error(err);
  }
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id).select(
      "firstname lastname email googleId"
    );

    if (req?.body?.firstname) user.firstname = req?.body?.firstname;
    if (req?.body?.lastname) user.lastname = req?.body?.lastname;
    if (req?.body?.email) {
      if (req?.body?.email === user.email) {
        res.status(200).json({
          success: true,

          status: "Not Modified",
          message: "Email not modified",
          user: user,
        });
        await user.save();
      } else {
        if (user?.googleId) {
          return;
        } else {
          const searchEmail = await User.findOne({
            email: req?.body?.email,
          });
          if (!searchEmail) {
            user.email = req?.body?.email;
            await user.save();
            verifyEmailToken(req, res);
          } else {
            res.status(409).json({
              success: false,
              status: "fail",
              user: user,
              error: "Email already in use",
            });
          }
        }
      }
    } else {
      user.save();
      res.status(202).json({
        success: true,

        status: "success",
        message: "User updated successfully",
        user: user,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteaUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,

      status: "success",
      message: "User Deleted successfully",
    });
  } catch (err) {
    throw new Error(err);
  }
});

const blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res
      .status(202)
      .json({ success: true, status: "success", message: "User Blocked" });
  } catch (err) {
    throw new Error(err);
  }
});
const unblockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res
      .status(202)
      .json({ success: true, status: "success", message: "User unBlocked" });
  } catch (err) {
    throw new Error(err);
  }
});
const updatePassword = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { currentPassword, password, passwordConfirm } = req.body;
  validateMongoDbId(_id);
  try {
    const user = await User.findById(_id);

    if (user?.googleId) {
      return res.status(403).json({
        success: false,

        status: "fail",
        error: "You use Google to sign/log in",
      });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,

        status: "fail",
        error:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }
    if (!currentPassword || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,

        status: "fail",
        error: "All fields are required",
      });
    }

    const isMatch = await user.isPasswordMatched(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,

        status: "fail",
        error: "Current password is incorrect",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,

        status: "fail",
        error: "Password does not match password confirmation",
      });
    }

    user.password = password;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,

      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const forgotPasswordToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    let responseFail = {
      statusCode: 404,
      success: false,

      status: "fail",
      error: "User Not Found With this email",
    };
    setRestPasswordCache(email, responseFail);
    return res.status(responseFail.statusCode).json(responseFail);
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    // todo
    let mail = await generatePasswordResetMail(
      token,
      user.firstname,
      user.lastname
    );
    const data = {
      to: email,
      subject: "Reset Password link",
      html: mail,
    };
    await sendEmail(data);
    let successResponse = {
      statusCode: 200,
      success: true,

      status: "success",
      message: "Password reset token sent to your email",
    };
    setRestPasswordCache(email, successResponse);

    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = expressAsyncHandler(async (req, res) => {
  try {
    const { password, passwordConfirm } = req.body;
    const { token } = req.params;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,

        status: "fail",
        error:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,

        status: "fail",
        error: "Password does not match password confirmation",
      });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      let responseFail = {
        statusCode: 400,
        success: false,

        status: "fail",
        error: "Token expired or invalid, please try again later",
      };
      setPassTokenCache(token, responseFail);
      return res.status(responseFail.statusCode).json(responseFail);
    }
    user.password = password;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    invalidateRestPasswordCache(user.email);
    await user.save();
    let responseSuccess = {
      statusCode: 200,
      success: true,

      status: "success",
      message: "Password changed successfully",
    };
    setPassTokenCache(responseSuccess.statusCode, responseSuccess);

    res.json(responseSuccess);
  } catch (error) {
    throw new Error(error);
  }
});

const socialLogin = expressAsyncHandler(async (req, res) => {
  console.log("Google profile received:", req.user);

  try {
    const user = req.user; // Passport adds the authenticated user to req.user

    if (!user) {
      console.warn("User not found in google auth callback fun.");
      return res.status(400).json({
        success: false,

        status: "fail",
        message: "User not found",
      });
    }

    // Generate access token
    const accessToken = generateToken(user._id);

    // Generate refresh token
    const refreshToken = generateRefreshToken(user._id);

    // Optionally, store refresh token in the database if needed
    user.refreshToken = refreshToken;
    await user.save(); // Save refresh token to user record (optional)

    // Set the refresh token in a secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true, // Set to true in production
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });

    res.redirect(`${FRONTEND_HOST}/user/GoogleAuth?token=${accessToken}`);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserPharmacies = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id)
      .select("pharmacies -_id")
      .populate("pharmacies");
    if (user.pharmacies.length > 0) {
      let successResponse = {
        statusCode: 200,
        success: true,
        status: "success",
        pharmacies: user.pharmacies,
      };
      setUserPharmaciesCache(id, successResponse);
      res.status(successResponse.statusCode).json(successResponse);
    } else {
      let failResponse = {
        statusCode: 404,
        success: false,
        status: "fail",
        pharmacies: user.pharmacies,
      };
      setUserPharmaciesCache(id, failResponse);
      res.status(failResponse.statusCode).json(failResponse);
    }
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
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
};
