import express from "express";
import passport from "passport";
import { Register, Login } from "../controllers/auth.js";
import {checkAuthenticted} from "../middleware/isAuthenticated.js"
const router = express.Router();

const CLIENT_HOME = "http://127.0.0.1:3000/home";


router.get("/login/failed", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get('/user', (req, res) => {
  console.log(req.user)
})

router.get("/login/success", checkAuthenticted, (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: "Successful",
        user: req.user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://127.0.0.1:3000/login" }), function(req, res) {
    res.redirect("http://127.0.0.1:3000/home");
  }
);

router.post("/register", Register);
router.post("/login", Login)

export default router;
