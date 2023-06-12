import UserModel from "../models/users.js"
import bcrypt from 'bcrypt'

export const Register = async (req, res) => {
    const {email, password} = req.body
    try {
        if (!email) {
            return res.status(400).json({message: "Provide Email"})
        }
        if (!password) {
          return res.status(400).json({ message: "Provide Password" });
        }
        if(password.length < 5) {
            return res.status(400).json({message: "Password must be greater than 5"})
        }
        const userExist = await UserModel.findOne({email});
        if(userExist){
            return res.status(400).json({message: "Email taken"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            email,
            password: hashedPassword
        })
        await newUser.save();
        return res.status(201).json({message: "User created"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error})
    }
    
}