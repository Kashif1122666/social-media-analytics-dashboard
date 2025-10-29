import express from "express";
import axios from "axios";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/ai/analytics
router.post("/analytics", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body; // User's question
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.platforms || !user.platforms.youtube) {
      return res.status(400).json({ error: "YouTube not connected!" });
    }

    // Pull YouTube details
    const yt = user.platforms.youtube;
    const stats = yt.stats || {};

    // Build dynamic prompt with full schema data
    const prompt = `
You are an AI assistant helping creators grow their YouTube channels.

Channel Name: ${yt.title}
Description: ${yt.description || "No description provided"}
Subscribers: ${stats.subscribers || 0}
Total Views: ${stats.views || 0}
Engagement Rate: ${stats.engagementRate || 0}%
Growth Rate: ${stats.growthRate || 0}%
Watch Time: ${stats.watchTime || 0}
Click-Through Rate (CTR): ${stats.ctr || 0}%
Retention: ${stats.retention || 0}%

Recent Video Performance:
${(stats.videos || [])
  .map(
    (v) => `
    - Title: ${v.title}
      Views: ${v.views}
      Likes: ${v.likes}
      Comments: ${v.comments}
      Uploaded At: ${new Date(v.uploadedAt).toLocaleString()}
  `
  )
  .join("\n")}

The user asked: "${query}"

Please provide helpful, specific, and actionable advice tailored to their channel and question.
    `;

    // Call Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    // Extract AI answer safely
    const aiMessage =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate advice right now.";

    res.json({ message: aiMessage });
  } catch (err) {
    console.error("AI Analysis Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});


router.post("/ask-ai", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body; // User's AI question
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user || !user.platforms?.reddit) {
      return res.status(400).json({ error: "Reddit not connected!" });
    }

    const reddit = user.platforms.reddit;
    const stats = reddit.stats || {};
    const recentPosts = reddit.recentPosts || [];

    // Build a detailed prompt for Gemini AI
    const prompt = `
You are an AI assistant helping users understand and improve their Reddit presence.

Reddit Username: ${reddit.redditUsername}
Avatar: ${reddit.avatar || "No avatar available"}
Link Karma: ${stats.linkKarma || 0}
Comment Karma: ${stats.commentKarma || 0}
Total Karma: ${stats.totalKarma || 0}
Last Updated: ${stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : "Unknown"}

Recent Posts:
${recentPosts.length > 0
  ? recentPosts
      .map(
        (p) => `
- Title: ${p.title || "No title"}
  Upvotes: ${p.upvotes || 0}
  Comments: ${p.comments || 0}
  Posted At: ${p.postedAt ? new Date(p.postedAt).toLocaleString() : "Unknown"}
`
      )
      .join("\n")
  : "No recent posts available."}

The user asked: "${query}"

Please provide actionable, detailed advice tailored to their Reddit stats and recent activity.
    `;

    // Call Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const aiMessage =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, AI could not generate insights right now.";

    res.json({ answer: aiMessage });
  } catch (err) {
    console.error("Reddit AI Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
