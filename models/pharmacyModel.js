const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();
// Shift Sub-schema
const shiftSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },
  start: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: (props) => `${props.value} is not a valid start time!`,
    },
  },
  end: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: (props) => `${props.value} is not a valid end time!`,
    },
  },
});

const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
    },
    activated: {
      type: Boolean,
      default: false,
    },
    devices: {
      type: Number,
      default: () => {
        if (!this.activated) return 0;
        else return 1;
      },
    },
    // under devolopment
    devicesData: {
      type: Array,
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          try {
            let number = phoneUtil.parseAndKeepRawInput(v, "US");
            return phoneUtil.isValidNumber(number);
          } catch (err) {
            return false;
          }
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },

    emailVerify: String,
    emailVerifyExpires: Date,
    emailConfirm: {
      type: Boolean,
      default: false,
    },
    openingHours: {
      monday: {
        open: { type: Boolean, required: true },
        start: {
          type: String,
          required: function () {
            return this.openingHours.monday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid start time!`,
          },
        },
        end: {
          type: String,
          required: function () {
            return this.openingHours.monday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid end time!`,
          },
        },
        shifts: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
      tuesday: {
        open: { type: Boolean, required: true },
        start: {
          type: String,
          required: function () {
            return this.openingHours.tuesday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid start time!`,
          },
        },
        end: {
          type: String,
          required: function () {
            return this.openingHours.tuesday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid end time!`,
          },
        },
        shifts: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
      wednesday: {
        open: { type: Boolean, required: true },
        start: {
          type: String,
          required: function () {
            return this.openingHours.wednesday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid start time!`,
          },
        },
        end: {
          type: String,
          required: function () {
            return this.openingHours.wednesday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid end time!`,
          },
        },
        shifts: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
      thursday: {
        open: { type: Boolean, required: true },
        start: {
          type: String,
          required: function () {
            return this.openingHours.thursday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid start time!`,
          },
        },
        end: {
          type: String,
          required: function () {
            return this.openingHours.thursday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid end time!`,
          },
        },
        shifts: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
      friday: {
        open: { type: Boolean, required: true },
        start: {
          type: String,
          required: function () {
            return this.openingHours.friday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid start time!`,
          },
        },
        end: {
          type: String,
          required: function () {
            return this.openingHours.friday.open;
          },
          validate: {
            validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
            message: (props) => `${props.value} is not a valid end time!`,
          },
        },
        shifts: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
      saturday: {
        open: { type: Boolean, required: true },
        shifts: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
      sunday: {
        open: { type: Boolean, required: true },
        shifts: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
    },

    paymentPayed: {
      amount: {
        type: Number,
      },
      paymentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "paymentInfo",
      },
    },
    toBeDeletedAt: { type: Date, default: null }, // Field for TTL
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for validation
pharmacySchema.pre("save", async function (next) {
  // Ensure email confirmation reset on change
  if (this.isModified("email")) {
    this.emailConfirm = false;
    this.toBeDeletedAt = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000); // 20 days
  }

  // Validate shifts for conflicts

  next();
});
//-------------------------------

// pharmacySchema.pre("save", function (next) {
//   const days = [
//     "monday",
//     "tuesday",
//     "wednesday",
//     "thursday",
//     "friday",
//     "saturday",
//     "sunday",
//   ];

//   // Validate shifts for each day
//   for (const day of days) {
//     const dayOpeningHours = this.openingHours[day];
//     const shiftsForDay = dayOpeningHours.shifts;

//     if (dayOpeningHours.open) {
//       shiftsForDay.forEach((shift) => {
//         // Ensure shift is within opening hours
//         if (
//           shift.start < dayOpeningHours.start ||
//           shift.end > dayOpeningHours.end
//         ) {
//           return next(
//             new Error(
//               `Shift (${shift.start} - ${shift.end}) for ${day} is outside the operating hours (${dayOpeningHours.start} - ${dayOpeningHours.end}).`
//             )
//           );
//         }

//         // Ensure shift start is before shift end
//         if (shift.start >= shift.end) {
//           return next(
//             new Error(
//               `Shift start time (${shift.start}) must be earlier than end time (${shift.end}) for ${day}.`
//             )
//           );
//         }
//       });
//     } else if (shiftsForDay.length > 0) {
//       return next(new Error(`Shifts are not allowed on closed days (${day}).`));
//     }
//   }

//   next();
// });

// pharmacySchema.pre("save", async function (next) {
//   const days = [
//     "monday",
//     "tuesday",
//     "wednesday",
//     "thursday",
//     "friday",
//     "saturday",
//     "sunday",
//   ];

//   for (const day of days) {
//     const shifts = this.openingHours[day].shifts;

//     for (let i = 0; i < shifts.length; i++) {
//       const currentShift = shifts[i];
//       const currentStart = parseInt(currentShift.start.replace(":", ""), 10);
//       const currentEnd = parseInt(currentShift.end.replace(":", ""), 10);

//       if (currentEnd <= currentStart) {
//         return next(
//           new Error(`Shift end time must be after start time for ${day}.`)
//         );
//       }

//       for (let j = i + 1; j < shifts.length; j++) {
//         const nextShift = shifts[j];
//         const nextStart = parseInt(nextShift.start.replace(":", ""), 10);
//         const nextEnd = parseInt(nextShift.end.replace(":", ""), 10);

//         if (
//           (currentStart < nextEnd && currentEnd > nextStart) ||
//           (nextStart < currentEnd && nextEnd > currentStart)
//         ) {
//           return next(new Error(`Shifts cannot overlap on ${day}.`));
//         }
//       }
//     }
//   }

//   next();
// });

//-------------------------------

pharmacySchema.pre("save", function (next) {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const errors = []; // To accumulate validation errors

  // Validate shifts for each day
  for (const day of days) {
    const dayOpeningHours = this.openingHours[day];
    const shiftsForDay = dayOpeningHours.shifts;

    if (dayOpeningHours.open) {
      // Ensure each shift is within operating hours and that start time is before end time
      shiftsForDay.forEach((shift) => {
        // Check if the shift is within operating hours
        if (
          shift.start < dayOpeningHours.start ||
          shift.end > dayOpeningHours.end
        ) {
          errors.push(
            `Shift (${shift.start} - ${shift.end}) for ${day} is outside the operating hours (${dayOpeningHours.start} - ${dayOpeningHours.end}).`
          );
        }

        // Ensure shift start is before shift end
        if (shift.start >= shift.end) {
          errors.push(
            `Shift start time (${shift.start}) must be earlier than end time (${shift.end}) for ${day}.`
          );
        }
      });
    } else if (shiftsForDay.length > 0) {
      // No shifts allowed on closed days
      errors.push(`Shifts are not allowed on closed days (${day}).`);
    }

    // Validate shift overlaps for each day
    for (let i = 0; i < shiftsForDay.length; i++) {
      const currentShift = shiftsForDay[i];
      const currentStart = parseInt(currentShift.start.replace(":", ""), 10);
      const currentEnd = parseInt(currentShift.end.replace(":", ""), 10);

      if (currentEnd <= currentStart) {
        errors.push(`Shift end time must be after start time for ${day}.`);
      }

      for (let j = i + 1; j < shiftsForDay.length; j++) {
        const nextShift = shiftsForDay[j];
        const nextStart = parseInt(nextShift.start.replace(":", ""), 10);
        const nextEnd = parseInt(nextShift.end.replace(":", ""), 10);

        // Check for overlapping shifts
        if (
          (currentStart < nextEnd && currentEnd > nextStart) ||
          (nextStart < currentEnd && nextEnd > currentStart)
        ) {
          errors.push(`Shifts cannot overlap on ${day}.`);
        }
      }
    }
  }

  // If any validation errors exist, pass them to the next function
  if (errors.length > 0) {
    return next(new Error(errors.join(" "))); // Combine all errors into one string
  }

  // Proceed with the save if no errors
  next();
});

pharmacySchema.pre("save", function (next) {
  if (this.devices === 0) {
    // Clear devicesData if no devices are present
    this.devicesData = [];
  } else {
    // Ensure devicesData is provided when devices > 0
    if (!this.devicesData || this.devicesData.length === 0) {
      return next(new Error("devicesData is required when devices > 0"));
    }
  }

  next();
});

// Generate email verification token
pharmacySchema.methods.verifyEmail = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerify = crypto.createHash("sha256").update(token).digest("hex");
  this.emailVerifyExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return token;
};

// Export the model
module.exports = mongoose.model("Pharmacies", pharmacySchema);
