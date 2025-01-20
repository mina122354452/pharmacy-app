const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel"); // Adjust the path to your user model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Profile received from Google:", profile);
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          console.log("User not found, creating new user.");
          user = new User({
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
        }

        console.log("User found or created:", user);
        return done(null, user); // Pass the user to the done function
      } catch (err) {
        console.error("Error in passport Google strategy:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Save the user's ID to session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Retrieve the full user details from the DB
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
