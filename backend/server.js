import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import ejs from 'ejs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import redditRoutes from './routes/reddit.js';
import assistantRoutes from './routes/assistant.js';
import redditAuth from './auth/reddit.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// === MongoDB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log(err));

// === Middleware ===
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// === Google OAuth Strategy ===
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// === Reddit OAuth Strategy (Custom) ===
redditAuth();

// === Routes ===
app.get('/auth/google', passport.authenticate("google", { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate("google", { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// === Reddit OAuth Routes ===
app.get('/auth/reddit', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.REDDIT_CLIENT_ID,
    response_type: 'code',
    state: 'randomStateString123', // Optional: You can generate a real random string
    redirect_uri: process.env.REDDIT_CALLBACK_URL,
    duration: 'temporary',
    scope: 'identity read history'
  });
  res.redirect(`https://www.reddit.com/api/v1/authorize?${params.toString()}`);
});

app.get('/callback',
  passport.authenticate('reddit', { failureRedirect: '/login-failed' }),
  (req, res) => {
    console.log("✅ Reddit Login Success:", req.user);
    res.redirect('http://localhost:5173/reddit-success');
  }
);

// === Auth Pages ===
app.get('/login', (req, res) => res.render(path.join(__dirname, 'login.ejs')));
app.get('/login-failed', (req, res) => res.send('Reddit Login Failed. Please try again.'));
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.render(path.join(__dirname, 'dashboard.ejs'), { user: req.user });
});
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login');
  });
});

// === API Routes ===
app.use('/api/ai', assistantRoutes);
app.use('/api/reddit', redditRoutes);

// === Test Auth Route ===
app.get('/api/reddit/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.user);
});

// === Start server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
