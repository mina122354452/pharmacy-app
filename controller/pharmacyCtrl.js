const { generateVerifyMailForPharmacy } = require("../messages/email.js");
const Pharmacy = require("../models/pharmacyModel.js");
const expressAsyncHandler = require("express-async-handler");
const userModel = require("../models/userModel.js");
const sendEmail = require("./emailCtrl.js");
const crypto = require("crypto");

// Get all pharmacies

const getPharmacies = expressAsyncHandler(async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({});
    res.json({
      success: true,
      status: "success",
      pharmacies,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Create a pharmacy
//handle validation errors from db
const createPharmacy = expressAsyncHandler(async (req, res) => {
  try {
    const { name, address, contactNumber, email, openingHours } = req.body;
    if (!name || !address || !contactNumber || !email || !openingHours) {
      return res.status(400).json({
        success: false,
        status: "fail",
        error: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        status: "fail",
        error: "Invalid email format",
      });
    }
    const findPharmacy = await Pharmacy.findOne({ email });

    if (!findPharmacy) {
      const twentyDaysFromNow = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000); // 20 days in the future

      const newPharmacy = await Pharmacy.create({
        name,
        address,
        contactNumber,
        email,
        openingHours,
        owner: req.user._id,
        toBeDeletedAt: twentyDaysFromNow, // Schedule deletion
      });
      const user = await userModel.findById(req.user._id);
      console.log(user);

      // add to pharmacies array
      if (
        !user.pharmacies.find((pharmacy) => pharmacy._id === newPharmacy._id)
      ) {
        user.pharmacies.push(newPharmacy);
      }
      await user.save();
      if (newPharmacy.emailConfirm === false) {
        verifyEmailToken(req, res);
      } else {
        return res.status(201).json({
          success: true,
          status: "success",
          message: "pharmacy created",
          pharmacy: newPharmacy,
        });
      }
    } else {
      if (findPharmacy.emailConfirm === false) {
        verifyEmailToken(req, res);
      } else {
        return res.status(400).json({
          success: false,
          status: "fail",
          error: "pharmacy with this email already exists",
        });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

const verifyEmailToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const pharmacy = await Pharmacy.findOne({ email });

  if (!pharmacy) {
    return res.status(404).json({
      success: false,
      status: "fail",
      error: "Pharmacy not found with this email",
    });
  }
  try {
    if (pharmacy.emailConfirm === false) {
      const token = await pharmacy.verifyEmail();
      await pharmacy.save();
      // todo
      let mail = await generateVerifyMailForPharmacy(token, pharmacy.name);
      const data = {
        to: email,
        subject: "verify your pharmacy's Email",
        html: mail,
      };

      await sendEmail(data);

      res.status(201).json({
        success: true,
        status: "success",

        message:
          "we sent pharmacy's email verification , Note:(if you didn't verify the email during 20 days, your pharmacy will be deleted)",
      });
    } else {
      await res.status(200).json({
        success: true,
        status: "Not Modified",
        message: "your pharmacy's email is already verified",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
const verifyEmail = expressAsyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const pharmacy = await Pharmacy.findOne({
    emailVerify: hashedToken,
    emailVerifyExpires: {
      $gt: Date.now(),
    },
  });
  if (!pharmacy) {
    return res.status(400).json({
      success: false,
      status: "fail",

      error: "token Expired,please try again later",
    });
  }
  pharmacy.emailConfirm = true;
  pharmacy.emailVerify = undefined;
  pharmacy.emailVerifyExpires = undefined;
  pharmacy.toBeDeletedAt = null; //!!!
  await pharmacy.save();
  if (pharmacy.emailConfirm === true) {
    res.status(202).json({
      status: "success",
      success: true,
      message: "pharmacy verified successfully",
    });
  }
});

const removePharmacy = expressAsyncHandler(async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { password } = req.body; // User provides their password
    if (!password) {
      return res.status(400).json({
        success: false,
        status: "fail",
        error: "Please provide your password",
      });
    }
    // Find the pharmacy to be removed
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        status: "fail",
        error: "Pharmacy not found",
      });
    }

    // Ensure the user owns the pharmacy

    // Fetch the user's information
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, status: "fail", error: "User not found" });
    }

    // Verify the provided password
    const isPasswordValid = await user.isPasswordMatched(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, status: "fail", error: "Invalid password" });
    }

    // Remove the pharmacy
    await Pharmacy.findByIdAndDelete(pharmacyId);

    // Remove the pharmacy from the user's pharmacies array
    user.pharmacies = user.pharmacies.filter(
      (pharmacy) => pharmacy._id.toString() !== pharmacyId.toString()
    );
    await user.save();

    res.status(200).json({
      success: true,
      status: "success",
      message: "Pharmacy removed successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getPharmacy = expressAsyncHandler(async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const pharmacy = await Pharmacy.findById(pharmacyId).select(
      "-toBeDeletedAt"
    );
    if (!pharmacy) {
      console.log(pharmacyId);
      return res.status(404).json({
        success: false,
        status: "fail",
        error: "Pharmacy not found",
      });
    }
    res.json(pharmacy);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePharmacy = expressAsyncHandler(async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { name, address, contactNumber, email, openingHours } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        status: "fail",
        error: "Invalid email format",
      });
    }
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        status: "fail",
        error: "Pharmacy not found",
      });
    }
    pharmacy.name = name || pharmacy.name;
    pharmacy.address = address || pharmacy.address;
    pharmacy.contactNumber = contactNumber || pharmacy.contactNumber;
    pharmacy.email = email || pharmacy.email;
    pharmacy.openingHours = openingHours || pharmacy.openingHours;

    await pharmacy.save();
    if (pharmacy.emailConfirm === false) {
      verifyEmailToken(req, res);
    } else {
      return res.status(200).json({
        success: true,
        status: "success",
        message: "Pharmacy updated successfully",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getPharmacies,
  createPharmacy,
  verifyEmailToken,
  verifyEmail,
  removePharmacy,
  getPharmacy,
  updatePharmacy,
};
