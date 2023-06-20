import UserModel from "../models/users.js";
import bcryptjs from "bcryptjs";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const SECRET = process.env.S3_SECRET_KEY;
export const Register = async (req, res) => {
  const { email, password } = req.body;
  if (req.body.googleAccessToken) {
    //google oauth
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${req.body.googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const firstName = response.data.given_name;
        const lastName = response.data.family_name;
        const email = response.data.email;
        const picture = response.data.picture;

        const alreadyExistUser = await UserModel.findOne({ email });
        if (alreadyExistUser) {
          return res.status(400).json({ message: "User already exist" });
        }
        const result = await UserModel.create({
          firstName,
          lastName,
          email,
          profilePicture: picture,
        });

        const token = jwt.sign(
          { email: result.email, id: result._id },
          SECRET,
          { expiresIn: "4h" }
        );

        return res.status(200).json({ result, token });
      })
      .catch((error) => {
        return res.status(400).json({ error });
      });
  } else {
    //normal form register
    const { email, firstName, lastName, confirmPassword, password } = req.body;
    try {
      if (
        (!email,
        !firstName,
        !lastName,
        !confirmPassword,
        !password,
        password.length < 8)
      ) {
        return res.status(400).json({ message: "Invalid Inputs" });
      }
      const alreadyExistUser = await UserModel.findOne({ email });
      if (alreadyExistUser) {
        return res.status(400).json({ message: "User already exist" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const result = await UserModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign({ email: result.email, id: result._id }, SECRET, {
        expiresIn: "4h",
      });

      return res.status(200).json({ result, token });
    } catch (error) {
      console.log(error);
    }
  }
};

export const Login = async (req, res) => {
  if (req.body.googleAccessToken) {
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${req.body.googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const email = response.data.email;
        const alreadyExistUser = await UserModel.findOne({ email });
        if (!alreadyExistUser) {
          return res.status(400).json({ message: "User don't exist" });
        }
        const token = jwt.sign(
          { email: alreadyExistUser.email, id: alreadyExistUser._id },
          SECRET,
          { expiresIn: "4h" }
        );
        return res.status(200).json({ result: alreadyExistUser, token });
      });
  } else {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const comparedPassword = bcryptjs.compare(password, existingUser.password);
    if (!comparedPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET,
      { expiresIn: "4h" }
    );

    return res.status(200).json({ result: existingUser, token });
  }
};
