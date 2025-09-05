import express from "express";
import passport from "../config/passport.js";
import { generateToken } from "../utils/jwt.js";
import { google } from "googleapis";
import {authMiddleware} from "../middleware/auth.js";
import { refreshYoutubeToken } from "../utils/refreshTokenYoutube.js";
import User from "../models/User.js";


const router = express.Router();

// Redirect user to YouTube login with JWT in state
router.get("/youtube", (req, res, next) => {
  const token = req.query.state; // JWT from frontend

  if (!token) return res.status(401).json({ msg: "User must be logged in" });

  passport.authenticate("youtube", {
    scope: [
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
    state: token,  // <-- forward JWT to Google
    accessType: "offline",
    prompt: "consent",
  })(req, res, next);
});

// Callback after YouTube auth
router.get(
  "/youtube/callback",
  passport.authenticate("youtube", { session: false }),
  (req, res) => {
    // req.user already updated with YouTube info in the strategy
    // Generate a new JWT
    const token = generateToken(req.user);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);







router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.platforms?.youtube) {
      return res.status(400).json({ error: "YouTube not connected" });
    }

    // Ensure access token is fresh (this util refreshes & saves accessToken)
    const accessToken = await refreshYoutubeToken(user._id);

    // YouTube client
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube("v3");

    // 1) Fetch channel snippet + statistics
    const { data: channelData } = await youtube.channels.list({
      auth: oauth2Client,
      part: "snippet,statistics",
      mine: true,
    });

    const channel = channelData.items?.[0];
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // 2) Fetch top videos (by viewCount) - up to 10 (adjust as needed)
    const { data: videosData } = await youtube.search.list({
      auth: oauth2Client,
      part: "snippet",
      forMine: true,
      type: "video",
      order: "viewCount",
      maxResults: 10,
    });

    // Map top videos and fetch their statistics (views/likes/comments)
    const topVideos = await Promise.all(
      (videosData.items || []).map(async (videoItem) => {
        const videoId = videoItem.id?.videoId;
        if (!videoId) return null;

        const statsRes = await youtube.videos.list({
          auth: oauth2Client,
          part: "statistics,snippet",
          id: videoId,
        });

        const item = statsRes.data.items?.[0] || {};
        const stats = item.statistics || {};
        const snippet = item.snippet || videoItem.snippet || {};

        return {
          title: snippet.title || videoItem.snippet.title,
          videoId,
          views: Number(stats.viewCount || 0),
          likes: Number(stats.likeCount || 0),
          comments: Number(stats.commentCount || 0),
          publishedAt: snippet.publishedAt || null,
          thumbnail: snippet.thumbnails?.default?.url || videoItem.snippet.thumbnails?.default?.url || null,
        };
      })
    );

    // remove any nulls (if any)
    const filteredTopVideos = topVideos.filter(Boolean);

    // Respond with channel + topVideos
    res.json({
      channel: {
        title: channel.snippet.title,
        description: channel.snippet.description || "",
        thumbnail: channel.snippet.thumbnails?.default?.url || null,
        subscribers: Number(channel.statistics.subscriberCount || 0),
        views: Number(channel.statistics.viewCount || 0),
        videos: Number(channel.statistics.videoCount || 0),
      },
      topVideos: filteredTopVideos,
    });
  } catch (err) {
    console.error("Error fetching YouTube analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
