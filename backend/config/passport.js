import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as RedditStrategy } from "passport-reddit";
import { Strategy as LinkedInStrategy } from '@sokratis/passport-linkedin-oauth2';
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import env from "dotenv";
import { Strategy as CustomStrategy } from "passport-custom";
import { google } from "googleapis";
import axios from "axios";
import jwt from "jsonwebtoken";

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
        const user = await User.findById(decoded.id); // now we have the user
        if (!user) return done(new Error("User not found"));

        // YouTube API client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const youtube = google.youtube("v3");
        const { data } = await youtube.channels.list({
          auth: oauth2Client,
          part: "snippet,statistics",
          mine: true,
        });

        const channel = data.items?.[0];
        if (!channel) return done(new Error("No YouTube channel found"));

        // Update user with YouTube info
        user.platforms.youtube = {
          youtubeId: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnail: channel.snippet.thumbnails?.default?.url,
          stats: {
            subscribers: parseInt(channel.statistics.subscriberCount),
            views: parseInt(channel.statistics.viewCount),
            videos: parseInt(channel.statistics.videoCount),
          },
          accessToken,
          refreshToken,
        };

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

      const { access_token } = tokenRes.data;
      const meRes = await axios.get("https://oauth.reddit.com/api/v1/me", {
        headers: { Authorization: `Bearer ${access_token}`, "User-Agent": "social-media-analytics-dashboard/1.0 by EffectiveBus186" },
      });

      const profile = meRes.data;
      let user = await User.findOne({ redditId: profile.id });

      if (!user) {
        user = new User({
          redditId: profile.id,
          redditUsername: profile.name,
          accessToken: access_token,
        });
      } else {
        user.accessToken = access_token;
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
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_REDIRECT_URL,
      scope: ["openid","profile","email","r_member_social","w_member_social"],
      state: true,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, params, done) => {
      try {
        const profile = await fetchLinkedInProfile(accessToken);
        if (!profile || !profile.id) throw new Error("Failed to fetch LinkedIn profile");

        const linkedinId = profile.id;
        const email = profile.email || "";
        const name = `${profile.firstName} ${profile.lastName}` || "";
        const avatar = profile.profilePicture?.displayImage || "";
        // ... your existing user handling logic
      } catch (err) {
        console.error("❌ LinkedIn auth error:", err);
        return done(err, null);
      }
    }
  )
);

async function fetchLinkedInProfile(accessToken) {
  try {
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Connection': 'Keep-Alive' },
    });
    if (!profileResponse.ok) throw new Error(`LinkedIn API error: ${profileResponse.statusText}`);
    const profileData = await profileResponse.json();

    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Connection': 'Keep-Alive' },
    });

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
    }

    return { id: profileData.id, firstName: profileData.localizedFirstName, lastName: profileData.localizedLastName, email, profilePicture: profileData.profilePicture || {} };
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    throw error;
  }
}

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
