const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel"); // Adjust the path to your user model
const FacebookStrategy = require("passport-facebook").Strategy; // Add this import
const PORT = process.env.PORT || 4000;

// callbackURL edit if neede
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/api/user/auth/google/callback`,
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
// # on production server

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_SECRET, // Use your Facebook App ID
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET, // Use your Facebook App Secret
      callbackURL: `http://localhost:${PORT}/api/user/auth/facebook/callback`,
      profileFields: ["id", "emails", "name"], // Request relevant profile fields
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Facebook Profile received:", profile);
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          console.log("User not found, creating new user.");
          user = new User({
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            email: profile.emails[0].value,
            facebookId: profile.id, // Save the Facebook ID
          });
          await user.save();
        }

        console.log("Facebook User found or created:", user);
        return done(null, user); // Pass the user to the done function
      } catch (err) {
        console.error("Error in passport Facebook strategy:", err);
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
