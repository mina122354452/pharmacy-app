// not Found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler

const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errorMessages = Object.values(JSON.parse(err.message).errors).map(
      (e) => e.msg
    );
    return res.status(400).json({
      status: "fail",
      success: false,
      error: "Validation failed",
      errors: errorMessages,
    });
  }

  // If it's a custom error (like one from the pre-save hooks in schemas)
  if (err.name === "Error") {
    return res.status(400).json({
      status: "fail",

      success: false,
      error: err.message,
    });
  }
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode);
  return res.json({
    status: "fail",
    success: false,
    error: err?.message,
    stack: err?.stack,
  });
};

// const errorHandler = (err, req, res, next) => {
//   // Handle Mongoose Validation Errors (e.g., required field errors)
//   if (err.name === "ValidationError") {
//     let errorMessages = [];

//     // Check if the `err.errors` object exists (for Mongoose errors)
//     if (err.errors) {
//       // Map over each field error and extract the message
//       errorMessages = Object.values(err.errors).map((e) => e.message);
//     } else {
//       // If `err.message` is not structured (e.g., for custom errors), include it
//       errorMessages = [err.message];
//     }

//     return res.status(400).json({
//       status: "fail",
//       success: false,
//       error: "Validation failed",
//       errors: errorMessages,
//     });
//   }

//   if (err.name === "Error") {
//     return res.status(400).json({
//       status: "fail",
//       success: false,
//       error: err.message,
//     });
//   }

//   // Generic Error Handler (catch any unexpected errors)
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   return res.status(statusCode).json({
//     status: "fail",
//     success: false,
//     error: err?.message || "An unexpected error occurred",
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
// };

module.exports = { errorHandler, notFound };
