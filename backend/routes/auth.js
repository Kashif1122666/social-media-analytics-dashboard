// routes/auth.js
import express from "express";
import passport from "../config/passport.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js"; // import User model
import bcrypt from "bcryptjs";

const router = express.Router();

// Local signup
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    await user.save();

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// Local login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ msg: info.message });
    const token = generateToken(user);
    res.json({ user, token });
  })(req, res, next);
});

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
});

export default router;
