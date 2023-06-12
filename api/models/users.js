import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    name: String,
    photos: String,
    password: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    username: { type: String, require: true, default: 'admin'},
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
