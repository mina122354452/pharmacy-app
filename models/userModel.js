const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const { invalidateUserCache } = require("../utils/setUserCache");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password is required only if googleId is not present
      },
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },
    emailVerify: String,
    emailVerifyExpires: Date,
    emailConfirm: {
      type: Boolean,
      default: function () {
        return this.googleId ? true : false;
      },
    },

    googleId: {
      type: String,
      unique: true, // Ensure each Google ID is unique
      sparse: true, // Allows multiple documents to have no googleId
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    pharmacies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pharmacies",
        default: null,
      },
    ],
    toBeDeletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ toBeDeletedAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      return next(
        new Error(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."
        )
      );
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("email") && !this.googleId) {
    this.emailConfirm = false;
    this.toBeDeletedAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  next();
});
userSchema.pre("save", function (next) {
  if (this.isModified()) {
    // Check if any field is modified
    console.log("Modified fields:", this.modifiedPaths());

    // Invalidate cache for this user
    invalidateUserCache(this._id);
  }

  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resettoken;
};

userSchema.methods.verifyEmail = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerify = crypto.createHash("sha256").update(token).digest("hex");
  this.emailVerifyExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return token;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
