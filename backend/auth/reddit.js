import passport from 'passport';
import { Strategy as RedditStrategy } from 'passport-reddit';
import dotenv from 'dotenv';

dotenv.config();

const redditAuth = () => {
  passport.use(new RedditStrategy({
    clientID: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    callbackURL: process.env.REDDIT_CALLBACK_URL,
    scope: ['identity', 'read', 'history'],
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, { profile, accessToken });
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

export default redditAuth;
