import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.uvs9bhc.mongodb.net/?retryWrites=true&w=majority`;


const connectDB = async () => {
    try {
       await mongoose.connect(MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectDB