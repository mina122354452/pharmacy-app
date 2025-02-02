const express = require("express");
const dbConnect = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
const app = express();
require("express-async-handler");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const user = require("./routes/userRoute.js");
const pharmacy = require("./routes/pharmacyRoute.js");
const morgan = require("morgan");
const cors = require("cors");
const credentials = require("./middlewares/credentials.js");
const corsOptions = require("./config/cors");
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet");
const csrf = require("csurf");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const redisClient = require("./config/redis");
const { globalLimiter } = require("./utils/rateLimiter.js");
const csrfProtection = csrf({
  cookie: {
    httpOnly: false, // Allow frontend to access the CSRF token
    secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
  },
});

app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(csrfProtection);
app.set("trust proxy", true);
app.use(globalLimiter);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./config/passport.js");
app.use(
  session({
    secret: process.env.SESSION_SECRET, //! change it
    resave: false,
    saveUninitialized: false,
  })
);
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/user", user);
app.use("/api/pharmacy", pharmacy);
app.get("/csrf-token", (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false, // Allow frontend to read the cookie
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "strict", // Prevent CSRF attacks
  });
  res.json({ success: true, csrfToken: req.csrfToken() });
});
app.use(notFound);
app.use(errorHandler);
async function start() {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch {
    (err) => {
      console.log(err);
    };
  }
}
start();
