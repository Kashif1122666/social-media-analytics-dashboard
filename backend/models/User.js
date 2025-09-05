// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // only for Local login
  provider: { type: String, enum: ["local", "google", "linkedin"], default: "local" },
  googleId: { type: String },
  linkedinId: { type: String },
  avatar: { type: String },
  platforms: {
    youtube: {
      youtubeId: String,
      title: String,
      description: String,
      thumbnail: String,
      stats: Object,
      accessToken: String,
      refreshToken: String,
    },
    linkedin: {
      accessToken: String,
      refreshToken: String,
    },
    reddit: {
      redditId: String,
      redditUsername: String,
      accessToken: String,
    },
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
