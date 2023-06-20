import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";
const userSchema = new mongoose.Schema(
  {
    username: String,
    name: String,
    googleId: String,
    password: String,
    email: {
      type: String,
      require: true,
      index: true,
      unique: true,
      sparse: true,
    },
    secret: String,
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
