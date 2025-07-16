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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import redditRoutes from './routes/reddit.js';
import assistantRoutes from './routes/assistant.js';
// import redditAuth from './auth/reddit.js';

dotenv.config();

const app = express();

// ejs 
app.set('view engine', 'ejs');


// === Middleware ===
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, function(accessToken, refreshToken, profile, cb) {
  cb(null, profile);
}));


passport.serializeUser(function(user,cb){
   cb(null,user);
});
passport.deserializeUser(function(obj,cb){
   cb(null,obj);
});

app.use(express.static(path.join(__dirname ,'public'))); // Serve static files from the public directory

app.get("/login", (req, res) => {
  res.render(path.join(__dirname,  'login.ejs'));
});
app.get("/dashboard",(req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.render(path.join(__dirname,  'dashboard.ejs'), { user: req.user });
});
app.get('/logout',(req,res)=>{
  req.logout((err)=>{
    if(err) {
      console.error('Logout error:', err);
    };
    res.redirect('/login');
  });
});

app.get('/auth/google',passport.authenticate("google",{
  scope:['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate("google", {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/dashboard'); // ✅ This gets called *after* successful login
  }
);


// redditAuth(); // Initialize Reddit OAuth Strategy

// === MongoDB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`database connected successfully`))
  .catch((err) => console.log(err));

// === Routes ===
app.use('/api/reddit', redditRoutes);
app.use('/api/ai', assistantRoutes);

// === Reddit OAuth Routes ===
app.get('/auth/reddit', passport.authenticate('reddit'));

app.get('/callback',
  passport.authenticate('reddit', {
    failureRedirect: '/login-failed',
    successRedirect: 'http://localhost:5173/dashboard',
  })
);

// === Authenticated Profile Test Route ===
app.get('/api/reddit/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
