import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Local signup
    email: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        // Email required only if no OAuth provider
        return !this.googleId && !this.redditId && !this.linkedinId && !this.youtubeId;
      },
    },
    password: {
      type: String,
      required: function () {
        // Password required only for local signup
        return !this.googleId && !this.redditId && !this.linkedinId && !this.youtubeId;
      },
    },
    name: { type: String },
    avatar: { type: String },

    // OAuth IDs
    googleId: { type: String, unique: true, sparse: true },
    redditId: { type: String, unique: true, sparse: true },
    youtubeId: { type: String, unique: true, sparse: true },
    linkedinId: { type: String, unique: true, sparse: true },

    // Provider tokens (encrypt if possible)
    googleAccessToken: { type: String },
    googleRefreshToken: { type: String },
    redditAccessToken: { type: String },
    redditRefreshToken: { type: String },
    youtubeAccessToken: { type: String },
    youtubeRefreshToken: { type: String },
    linkedinAccessToken: { type: String },
    linkedinRefreshToken: { type: String },

    // Which method they signed up with
    provider: { type: String, enum: ["local", "google", "reddit", "youtube", "linkedin"], default: "local" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
