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
    res.redirect(`${process.env.FRONTEND_URL}/youTubeAnalysis?token=${token}`);
  }
);







router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.platforms?.youtube) {
      return res.status(400).json({ error: "YouTube not connected" });
    }

    // Ensure access token is fresh
    const accessToken = await refreshYoutubeToken(user._id);

    // YouTube client
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    const youtube = google.youtube("v3");
    const youtubeAnalytics = google.youtubeAnalytics("v2");

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

    // 2) Fetch top videos (by viewCount)
    const { data: videosData } = await youtube.search.list({
      auth: oauth2Client,
      part: "snippet",
      forMine: true,
      type: "video",
      order: "viewCount",
      maxResults: 10,
    });

    // Map top videos and fetch their statistics
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
          thumbnail:
            snippet.thumbnails?.default?.url ||
            videoItem.snippet.thumbnails?.default?.url ||
            null,
        };
      })
    );

    const filteredTopVideos = topVideos.filter(Boolean);

    // ======================
    // 🔹 EXTRA ANALYTICS
    // ======================

    // Engagement rate
    const totalViews = filteredTopVideos.reduce((acc, v) => acc + v.views, 0);
    const totalLikes = filteredTopVideos.reduce((acc, v) => acc + v.likes, 0);
    const totalComments = filteredTopVideos.reduce((acc, v) => acc + v.comments, 0);
    const engagementRate =
      totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

    // Growth trends (mock for now)
    const growthTrends = {
      subscribers: {
        current: Number(channel.statistics.subscriberCount || 0),
        previous: Number(channel.statistics.subscriberCount || 0) - 50,
      },
      views: {
        current: Number(channel.statistics.viewCount || 0),
        previous: Number(channel.statistics.viewCount || 0) - 1000,
      },
    };

    // ======================
    // 🔹 REAL AUDIENCE INSIGHTS
    // ======================
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    let demographics = {};
    let trafficSources = {};

    // Demographics (age + gender)
    try {
      const demoRes = await youtubeAnalytics.reports.query({
        auth: oauth2Client,
        ids: "channel==MINE",
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate,
        metrics: "viewerPercentage",
        dimensions: "ageGroup,gender",
      });

      demographics = (demoRes.data.rows || []).reduce((acc, row) => {
        const [ageGroup, gender, percentage] = row;
        if (!acc[ageGroup]) acc[ageGroup] = {};
        acc[ageGroup][gender] = Number(percentage);
        return acc;
      }, {});
    } catch (err) {
      console.error("Error fetching demographics:", err.response?.data || err.message);
    }

    // Traffic sources
    try {
      const trafficRes = await youtubeAnalytics.reports.query({
        auth: oauth2Client,
        ids: "channel==MINE",
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate,
        metrics: "views",
        dimensions: "insightTrafficSourceType",
      });

      trafficSources = (trafficRes.data.rows || []).reduce((acc, row) => {
        const [source, views] = row;
        acc[source] = Number(views);
        return acc;
      }, {});
    } catch (err) {
      console.error("Error fetching traffic sources:", err.response?.data || err.message);
    }

    // ======================
    // Final Response
    // ======================
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
      insights: {
        engagementRate: engagementRate.toFixed(2),
        growthTrends,
        audienceInsights: {
          demographics,
          trafficSources,
        },
      },
    });
  } catch (err) {
    console.error("Error fetching YouTube analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});



export default router;
