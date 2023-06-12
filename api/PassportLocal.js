import passport from "passport";
import LocalStrategy from 'passport-local';
import UserModel from "./models/users.js";
import bcrypt from 'bcrypt'


const authenticateUser = async (email, password, done) => {
    const user = await UserModel.findOne({ email });
    if(user === null){
        return done(null, false, {message: 'No user with that email'})
    }

    try {
        if(await bcrypt.compare(password, user.password)){
            return done(null, user)
        }else {
            return done(null, false, {message: "Invalid Email or Password"})
        }
    } catch (error) {
        done(error)
    }
}

passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))



passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const user = await UserModel.findById({_id: id});
        if (user) {
          return done(null, user);
        }
    } catch (error) {
        return done(error);
    }
});