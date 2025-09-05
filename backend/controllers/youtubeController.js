import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_CALLBACK_URL
);

export const youtubeAuthUrl = (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.json({ url });
};

export const youtubeCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube("v3");
    const { data } = await youtube.channels.list({
      auth: oauth2Client,
      part: "snippet,statistics",
      mine: true,
    });

    const channel = data.items?.[0];
    if (!channel) return res.status(400).json({ error: "No YouTube channel" });

    user.youtube = {
      id: channel.id,
      title: channel.snippet.title,
      stats: channel.statistics,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
    await user.save();

    res.json({ message: "YouTube connected", youtube: user.youtube });
  } catch (err) {
    console.error("YouTube error:", err);
    res.status(500).json({ error: "YouTube connect failed" });
  }
};
