const express = require("express");
const dbConnect = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
const app = express();
require("express-async-handler");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3000;
const user = require("./routes/userRoute.js");
const morgan = require("morgan");
const cors = require("cors");
const credentials = require("./middlewares/credentials.js");
const corsOptions = require("./config/cors");
const passport = require("passport");
const session = require("express-session");

const { notFound, errorHandler } = require("./middlewares/errorHandler");
app.use(credentials);
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
require("./config/passport.js");
app.use(
  session({
    secret: process.env.SESSION_SECRET, //! change it
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/user", user);
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
