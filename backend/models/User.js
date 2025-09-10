// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // only for Local login
    provider: {
      type: String,
      enum: ["local", "google", "linkedin", "reddit"],
      default: "local",
    },
    googleId: { type: String },
    linkedinId: { type: String },
    avatar: { type: String },

    platforms: {
      youtube: {
        youtubeId: String,
        title: String,
        description: String,
        thumbnail: String,

        stats: {
          subscribers: { type: Number, default: 0 },
          views: { type: Number, default: 0 },
          videos: { type: Number, default: 0 },
          engagementRate: { type: Number, default: 0 },
          growthRate: { type: Number, default: 0 },
          watchTime: { type: Number, default: 0 },
          ctr: { type: Number, default: 0 },
          retention: { type: Number, default: 0 },

          subscriberGrowth: { type: [Number], default: [] },
          viewsGrowth: { type: [Number], default: [] },
          audienceAge: { type: Object, default: {} },
          audienceCountries: { type: Object, default: {} },
          audienceDevices: { type: Object, default: {} },

          videos: {
            type: [
              {
                videoId: String,
                title: String,
                views: Number,
                likes: Number,
                comments: Number,
                length: Number,
                tags: [String],
                uploadedAt: Date,
              },
            ],
            default: [],
          },

          lastUpdated: { type: Date, default: Date.now },
        },

        accessToken: String,
        refreshToken: String,
      },
      linkedin: {
    linkedinId: String,
    accessToken: String,
    refreshToken: String,
    stats: {
      followers: { type: Number, default: 0 },
      posts: { type: Number, default: 0 },
      engagements: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
    },
  },
      reddit: {
  redditId: String,           // account id (t2_xxx)
  redditUsername: String,     // account username
  avatar: String,             // profile icon img
  accessToken: String,
  refreshToken: String,

  stats: {
    linkKarma: { type: Number, default: 0 },     // post karma
    commentKarma: { type: Number, default: 0 },  // comment karma
    totalKarma: { type: Number, default: 0 },    // link + comment
    awardsReceived: { type: Number, default: 0 },// total awards
    posts: { type: Number, default: 0 },         // number of submissions fetched
    comments: { type: Number, default: 0 },      // number of comments fetched
    lastUpdated: { type: Date, default: Date.now },
  },

  recentPosts: {
    type: [
      {
        postId: String,
        title: String,
        subreddit: String,
        score: Number,          // upvotes - downvotes
        upvotes: Number,
        comments: Number,
        createdAt: Date,
        url: String,
      },
    ],
    default: [],
  },
},

    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
