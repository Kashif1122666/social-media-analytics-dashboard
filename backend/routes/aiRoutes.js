import express from "express";
import axios from "axios";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/ai/analyze
router.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body; // User's actual question
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.youtube) {
      return res.status(400).json({ message: "YouTube not connected" });
    }

    // Example: grab the latest stored YouTube stats from DB
    const { channelName, subscribers, views, videos } = user.youtube;

    // Build dynamic prompt
    const prompt = `
You are an AI assistant helping creators grow their YouTube channels.

Channel name: ${channelName}
Subscribers: ${subscribers}
Total views: ${views}
Videos uploaded: ${videos}

The user asked: "${query}"

Please provide helpful, specific, and actionable advice tailored to their channel and question.
    `;

    // Call Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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
      "Sorry, I couldn't generate advice.";

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("AI Analysis Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed to analyze" });
  }
});

export default router;
