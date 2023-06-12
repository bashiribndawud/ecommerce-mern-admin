import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session'
import passport from 'passport';
import flash from "flash"
import connectDB from './config/dbconnet.js';
import authRouter from "./routers/auth.js"
import productRouter from "./routers/product.js"
import authCategory from "./routers/category.js"
import dotenv from "dotenv"
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "./models/users.js";
import "./googleOAuth.js";
import "./PassportLocal.js"
import { fileURLToPath } from "url";
import path from "path";
dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT
const allowOrigins = ["http://127.0.0.1:3000", "http://127.0.0.1:5173"];

const app = express();

// middlewares
app.use(
    session({
        secret: "jfkjgfkdgjfdjfdjgfdgfjdgjfdkgjdkf",
        resave: false,
        saveUninitialized: false,
    })
    
);
app.use(flash());
app.use(passport.initialize()) //initalize passport for authentication request;
app.use(passport.session()) //enable passportjs to manage user session and persist user auth state across multiple http request

app.use('/getFiles/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.disable("x-powered-by");
app.use(morgan('tiny'))
app.use(
  cors({
    origin: allowOrigins,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);


app.use('/auth', authRouter)
app.use('/product', productRouter);
app.use('/category', authCategory)


app.listen(PORT, () => {
    console.log(`Server listenning on port: ${PORT}`)
    connectDB();
})
