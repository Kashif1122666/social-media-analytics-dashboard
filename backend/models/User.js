// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
email: {
  type: String,
  unique: true,
  sparse: true,
  required: function () {
    // Make email required only if not signing up/signing in with Reddit
    return !this.redditId;
  },
},
  name: { type: String },

  // Linked accounts
  redditId: { type: String, unique: true, sparse: true },
  youtubeId: { type: String, unique: true, sparse: true },
  linkedinId: { type: String, unique: true, sparse: true },

  // Tokens
  redditAccessToken: { type: String },
  redditRefreshToken: { type: String },
  youtubeAccessToken: { type: String },
  youtubeRefreshToken: { type: String },
  linkedinAccessToken: { type: String },
  linkedinRefreshToken: { type: String },

  // General fields
  avatar: String,
  accessToken: String,
  refreshToken: String,
  provider: String

}, { timestamps: true });

export default mongoose.model("User", userSchema);