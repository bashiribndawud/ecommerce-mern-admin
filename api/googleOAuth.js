import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import UserModel from "./models/users.js";
dotenv.config();

//These functions are used to determine how user information should be stored and retrieved from the session.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      UserModel.findOne({ googleId: profile.id })
        .then((user) => {
          if (user) {
            return cb(null, user);
          } else {
            const [{value}] = profile.photos
            const newUser = new UserModel({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.email,
              photos: value
            });
            newUser
              .save()
              .then((savedUser) => {
                return cb(null, savedUser);
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  )
);

//serialize user object and save it in the session (in this case entire user object)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//deserialize user object and retrieve it from the session (in this case entire user object)
passport.deserializeUser(async (id, done) => {
  await UserModel.findById({_id: id}).then((user) => {
    done(null, user);
  });
});