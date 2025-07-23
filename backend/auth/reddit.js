import passport from 'passport';
import { Strategy } from 'passport-custom';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const redditAuth = () => {
  passport.use('reddit', new Strategy(async (req, done) => {
    const { code } = req.query;

    if (!code) {
      return done(null, false, { message: 'Missing code' });
    }

    try {
      const basicAuth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');

      // Step 1: Exchange code for access token
      const tokenRes = await axios.post('https://www.reddit.com/api/v1/access_token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.REDDIT_CALLBACK_URL
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
            'User-Agent': 'social-media-analytics-dashboard/1.0 by EffectiveBus186'
          }
        }
      );

      const { access_token } = tokenRes.data;

      // Step 2: Fetch Reddit profile
      const meRes = await axios.get('https://oauth.reddit.com/api/v1/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'User-Agent': 'social-media-analytics-dashboard/1.0 by EffectiveBus186'
        }
      });

      const profile = meRes.data;

      return done(null, { profile, access_token });
    } catch (err) {
      console.error('❌ Reddit OAuth error:', err.response?.data || err.message);
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

export default redditAuth;
