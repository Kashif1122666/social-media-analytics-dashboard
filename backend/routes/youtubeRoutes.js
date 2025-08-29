import express from "express";
import passport from "passport";
import {
  youtubeAuthCallback,
  getYoutubeData,
} from "../controllers/youtubeController.js";
import env from "dotenv";
env.config();

const router = express.Router();

// Step 1: Start YouTube OAuth login
router.get(
  "/auth/youtube",
  passport.authenticate("youtube", {
    scope: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "profile",
      "email",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

// Step 2: Callback after YouTube grants permission
router.get(
  "/auth/youtube/callback",
  passport.authenticate("youtube", {
    failureRedirect: `${process.env.FRONTEND_URL}/youtube_failed`,
    session: true,
  }),
  youtubeAuthCallback
);

// Step 3: Get user’s YouTube data (protected route)
router.get("/youtube/data", getYoutubeData);

export default router;
