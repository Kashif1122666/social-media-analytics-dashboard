import express from "express";
import passport from "passport";
import {  login, logoutUser, register } from "../controllers/authController.js";
import env from "dotenv";
env.config();

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"],prompt: "consent" }));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login`}),
  (req, res) => res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
);

// router.get("/login", loginPage);
// router.get("/dashboard", dashboardPage);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logoutUser);

export default router;
