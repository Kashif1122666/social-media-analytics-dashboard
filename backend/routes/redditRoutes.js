import express from "express";
import passport from "passport";
import {
  redditAuthFailure,
  logout,
  getCurrentUser,
  getRedditStats,
} from "../controllers/redditController.js";
import env from "dotenv";
import { authMiddleware } from "../middleware/auth.js";
env.config();

const router = express.Router();

router.get("/auth/reddit", (req, res) => {
    const token = req.query.state; // JWT from frontend

  if (!token) return res.status(401).json({ msg: "User must be logged in" });
const redditAuthUrl = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=${token}&redirect_uri=${encodeURIComponent(
    process.env.REDDIT_CALLBACK_URL
  )}&duration=permanent&scope=identity history read submit mysubreddits`;
  res.redirect(redditAuthUrl);
});

router.get("/auth/reddit/callback", (req, res, next) => {
  passport.authenticate("reddit", (err, user, info) => {
    if (err) {
      console.error("Error during Reddit authentication:", err);
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?error=reddit_auth_failed`
      );
    }
    if (!user) {
      console.log("No user authenticated");
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?error=reddit_no_user`
      );
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.redirect(
          `${process.env.FRONTEND_URL}/dashboard?error=reddit_login_failed`
        );
      }
      return res.redirect(
        `${process.env.FRONTEND_URL}/redditAnalysis`
      );
    });
  })(req, res, next);
});


router.get("/reddit/stats", authMiddleware, getRedditStats);

// router.get("/auth/reddit/failure", redditAuthFailure);
// router.get("/logout", logout);
// router.get("/current_user", getCurrentUser);

export default router;
