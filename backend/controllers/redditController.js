import env from "dotenv";
import User from "../models/User.js";
env.config();

export const redditAuthFailure = (req, res) => {
  const errorMessage = req.session.messages?.[0] || "Reddit authentication failed";
  req.session.messages = [];
  res.redirect(
    `${process.env.FRONTEND_URL}/reddit_failed`
  );
};

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
  });
};

export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

export const getRedditStats = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const redditData = user.platforms?.reddit || {};

    res.json({
      redditUsername: redditData.redditUsername || "N/A",
      avatar: redditData.avatar || "",
      stats: {
        linkKarma: redditData.stats?.linkKarma || 0,
        commentKarma: redditData.stats?.commentKarma || 0,
        totalKarma: redditData.stats?.totalKarma || 0,
        awardsReceived: redditData.stats?.awardsReceived || 0,
        posts: redditData.stats?.posts || 0,
        comments: redditData.stats?.comments || 0,
        lastUpdated: redditData.stats?.lastUpdated || null,
      },
      recentPosts: redditData.recentPosts || [],
    });
  } catch (err) {
    console.error("Error fetching Reddit stats:", err);
    res.status(500).json({ msg: "Server error" });
  }
};