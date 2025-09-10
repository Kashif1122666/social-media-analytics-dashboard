import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as RedditStrategy } from "passport-reddit";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import env from "dotenv";
import { Strategy as CustomStrategy } from "passport-custom";
import { google } from "googleapis";
import axios from "axios";
import jwt from "jsonwebtoken";
import OAuth2Strategy  from "passport-oauth2";

env.config();

// -----------------
// LOCAL STRATEGY
// -----------------
passport.use(new LocalStrategy(
  { usernameField: "email", passwordField: "password", session: false },
  async (email, password, done) => {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashedPassword, name: email.split("@")[0] });
        await user.save();
        return done(null, user);
      }
      if (!user.password) return done(null, false, { message: "Use OAuth provider to login" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// GOOGLE STRATEGY
// -----------------
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails?.[0]?.value });
      if (!user) {
        user = new User({
          provider: "google",
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
        });
        await user.save();
      } else {
        user.googleId = profile.id;
        user.avatar = profile.photos?.[0]?.value;
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// ===================
// YOUTUBE STRATEGY (Link account)
// ===================


passport.use(
  "youtube",
  new GoogleStrategy(
    {
      clientID: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/youtube/callback`,
      passReqToCallback: true,
      skipUserProfile: true,
    },
    async (req, accessToken, refreshToken, params, profile, done) => {
      try {
        // 🔹 Decode JWT from state to get the user ID
        const token = req.query.state;
        if (!token) return done(new Error("No token provided"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return done(new Error("User not found"));

        // YouTube API client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const youtube = google.youtube("v3");
        const youtubeAnalytics = google.youtubeAnalytics("v2");

        // 1️⃣ Fetch channel info
        const { data } = await youtube.channels.list({
          auth: oauth2Client,
          part: "snippet,statistics",
          mine: true,
        });
        const channel = data.items?.[0];
        if (!channel) return done(new Error("No YouTube channel found"));

        // 2️⃣ Fetch top videos
        const { data: videosData } = await youtube.search.list({
          auth: oauth2Client,
          part: "snippet",
          forMine: true,
          type: "video",
          order: "viewCount",
          maxResults: 10,
        });

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
              videoId,
              title: snippet.title || videoItem.snippet.title,
              views: Number(stats.viewCount || 0),
              likes: Number(stats.likeCount || 0),
              comments: Number(stats.commentCount || 0),
              uploadedAt: snippet.publishedAt || null,
              length: snippet.duration || 0,
              tags: snippet.tags || [],
              thumbnail:
                snippet.thumbnails?.default?.url ||
                videoItem.snippet.thumbnails?.default?.url ||
                null,
            };
          })
        ).then((arr) => arr.filter(Boolean));

        // 3️⃣ Calculate engagement rate
        const totalViews = topVideos.reduce((acc, v) => acc + (v.views || 0), 0);
        const totalLikes = topVideos.reduce((acc, v) => acc + (v.likes || 0), 0);
        const totalComments = topVideos.reduce((acc, v) => acc + (v.comments || 0), 0);
        const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

        // 4️⃣ Fetch audience demographics (age & gender)
        let demographics = {};
        try {
          const endDate = new Date().toISOString().split("T")[0];
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);

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

        // 5️⃣ Fetch traffic sources
        let trafficSources = {};
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

        // Preserve old growth and device arrays if they exist
        const subscriberGrowth = user.platforms.youtube?.stats?.subscriberGrowth || [];
        const viewsGrowth = user.platforms.youtube?.stats?.viewsGrowth || [];
        const audienceDevices = user.platforms.youtube?.stats?.audienceDevices || {};

        // 6️⃣ Update user
        user.platforms.youtube = {
          youtubeId: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description || "",
          thumbnail: channel.snippet.thumbnails?.default?.url || "",
          stats: {
            subscribers: Number(channel.statistics.subscriberCount || 0),
            views: Number(channel.statistics.viewCount || 0),
            videos: Number(channel.statistics.videoCount || 0),
            engagementRate,
            growthRate: 0,
            watchTime: 0,
            ctr: 0,
            retention: 0,
            subscriberGrowth,
            viewsGrowth,
            videos: topVideos,
            lastUpdated: new Date(),
            audienceAge: demographics,
            audienceCountries: trafficSources,
            audienceDevices,
          },
          accessToken,
          refreshToken,
        };

        // Save updated user
        await user.save();
        return done(null, user);
      } catch (err) {
        console.error("YouTube OAuth error:", err);
        return done(err, null);
      }
    }
  )
);



// ===================
// REDDIT STRATEGY (Link account)
// ===================
passport.use(
  "reddit",
  new CustomStrategy(async (req, done) => {
    const { code } = req.query;
    if (!code) return done(null, false, { message: "Missing code" });

    try {
      const basicAuth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString("base64");
      const tokenRes = await axios.post(
        "https://www.reddit.com/api/v1/access_token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.REDDIT_CALLBACK_URL,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${basicAuth}`,
            "User-Agent": "social-media-analytics-dashboard/1.0 by EffectiveBus186",
          },
        }
      );

      const { access_token, refresh_token } = tokenRes.data;
      const meRes = await axios.get("https://oauth.reddit.com/api/v1/me", {
        headers: { Authorization: `Bearer ${access_token}`, "User-Agent": "social-media-analytics-dashboard/1.0 by EffectiveBus186" },
      });

      const profile = meRes.data;
        const token = req.query.state;
        if (!token) return done(new Error("No token provided"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id);

 if (!user) {
        return done(new Error("User not found"))
      } else {
        // 🔄 Update existing Reddit platform tokens & stats
        user.platforms.reddit = {
          ...user.platforms.reddit,
          redditId: profile.id,
          redditUsername: profile.name,
          avatar: profile.icon_img || "",
          accessToken: access_token,
          refreshToken: refresh_token || user.platforms.reddit.refreshToken,
          stats: {
            linkKarma: profile.link_karma || 0,
            commentKarma: profile.comment_karma || 0,
            totalKarma:
              (profile.link_karma || 0) + (profile.comment_karma || 0),
            lastUpdated: new Date(),
          },
        };
      }

      await user.save();

      return done(null, user);
    } catch (err) {
      console.error("❌ Reddit OAuth error:", err.response?.data || err.message);
      return done(err);
    }
  })
);

// ===================
// LINKEDIN STRATEGY (Updated)
// ===================


// passport.use(
//   "linkedin",
//   new OAuth2Strategy(
//     {
//       authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
//       tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: process.env.LINKEDIN_REDIRECT_URL,
//       scope: ["openid", "profile", "email", "w_member_social"],
//     },
//     async (accessToken, refreshToken, params, profile, done) => {
//       try {
//         // Fetch basic profile
//         const me = await axios.get("https://api.linkedin.com/v2/me", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         // Fetch email
//         const email = await axios.get(
//           "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         );

//         const userProfile = {
//           id: me.data.id,
//           firstName: me.data.localizedFirstName,
//           lastName: me.data.localizedLastName,
//           email: email.data.elements[0]["handle~"].emailAddress,
//         };

//         return done(null, userProfile);
//       } catch (err) {
//         console.error("LinkedIn fetch error:", err.response?.data || err.message);
//         return done(err, null);
//       }
//     }
//   )
// );





// ===================
// SERIALIZE & DESERIALIZE
// ===================
passport.serializeUser((user, done) => {
  done(null, user._id || user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
