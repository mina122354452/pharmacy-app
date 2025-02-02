// validator.js
const { body, validationResult, param } = require("express-validator");
// improve whole validation functions improve err handler
const RegisterValidation = [
  body("firstname").isLength({ min: 1 }).withMessage("First name is required"),

  body("lastname").isLength({ min: 1 }).withMessage("Last name is required"),

  body("email").isEmail().withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("passConfirm")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
const forgetPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
];

const updatePasswordValidation = [
  body("currentPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("passwordConfirm")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
const updateUserValidation = [
  body("firstname")
    .optional()
    .isLength({ min: 1 })
    .withMessage("First name is required"),
  body("lastname")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Last name is required"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address"),
];
const resetPasswordValidation = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("passwordConfirm")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
const emailVerificationValidation = [
  param("token")
    .isLength({ min: 10, max: 100 })
    .withMessage("Token must be between 10 and 100 characters long")
    .matches(/^[A-Za-z0-9-_]+$/)
    .withMessage(
      "Token can only contain letters, numbers, hyphens, and underscores"
    )
    .trim()
    .escape(), // Sanitize the token to prevent XSS attacks
];
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(JSON.stringify({ errors: errors.array() }));
    error.name = "ValidationError"; // Set a custom error name to match the handler
    return next(error); // Pass the error to the next middleware (errorHandler)
  }
  next(); // Proceed if no errors
};

module.exports = {
  RegisterValidation,
  handleValidationErrors,
  loginValidation,
  forgetPasswordValidation,
  updatePasswordValidation,
  updateUserValidation,
  resetPasswordValidation,
  emailVerificationValidation,
};
