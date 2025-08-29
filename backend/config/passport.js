import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as RedditStrategy } from "passport-reddit";
import { Strategy as LinkedInStrategy } from '@sokratis/passport-linkedin-oauth2';
import User from "../models/User.js";
import env from "dotenv";
import { Strategy as CustomStrategy } from "passport-custom";
import axios from "axios";

env.config();

// ===================
// GOOGLE STRATEGY (Main Login)
// ===================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          user = new User({
            provider: "google",
            providerId: profile.id,
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
            accessToken,
            refreshToken,
          });
          await user.save();
        } else {
          // update tokens
          user.googleId = profile.id;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ===================
// YOUTUBE STRATEGY (Link account)
// ===================
passport.use(
  "youtube",
  new GoogleStrategy(
    {
      clientID: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      callbackURL: process.env.YOUTUBE_REDIRECT_URI,
      scope: [
        "https://www.googleapis.com/auth/youtube.readonly",
        "profile",
        "email",
      ],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = req.user; // must already be logged in with Google
        if (!user) {
          return done(new Error("You must be logged in to connect YouTube"));
        }

        user.youtubeId = profile.id;
        user.youtubeAccessToken = accessToken;
        user.youtubeRefreshToken = refreshToken;
        await user.save();

        return done(null, user);
      } catch (err) {
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

    if (!code) {
      return done(null, false, { message: "Missing code" });
    }

    try {
      const basicAuth = Buffer.from(
        `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
      ).toString("base64");

      // Exchange code for access token
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

      // Fetch Reddit profile
      const meRes = await axios.get("https://oauth.reddit.com/api/v1/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "User-Agent": "social-media-analytics-dashboard/1.0 by EffectiveBus186",
        },
      });

      const profile = meRes.data;

    let user = await User.findOne({ redditId: profile.id });

if (!user) {
  user = new User({
    redditId: profile.id,
    redditUsername: profile.name,
    accessToken: access_token,
    // Do NOT set email here
  });
} else {
  user.accessToken = access_token;
}
await user.save();

return done(null, user);


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
      scope: [
                "openid",
                "profile",
                "email",
                "r_member_social",
                "w_member_social"
               ],
      state: true,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, params, done) => {
      try {

        // Manually fetch user profile using the access token
        const profile = await fetchLinkedInProfile(accessToken);

        if (!profile || !profile.id) {
          throw new Error("Failed to fetch LinkedIn profile");
        }

        const linkedinId = profile.id;
        const email = profile.email || "";
        const name = `${profile.firstName} ${profile.lastName}` || "";
        const avatar = profile.profilePicture?.displayImage || "";

        // ... rest of your user handling code

      } catch (err) {
        console.error("❌ LinkedIn auth error:", err);
        return done(err, null);
      }
    }
  )
);

// Helper function to fetch LinkedIn profile manually
async function fetchLinkedInProfile(accessToken) {
  try {
    // Fetch basic profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Connection': 'Keep-Alive',
      },
    });

    if (!profileResponse.ok) {
      throw new Error(`LinkedIn API error: ${profileResponse.statusText}`);
    }

    const profileData = await profileResponse.json();

    // Fetch email address
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Connection': 'Keep-Alive',
      },
    });

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
    }

    return {
      id: profileData.id,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      email: email,
      profilePicture: profileData.profilePicture || {},
      // Add other fields you need
    };

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
