import express from "express";
import session from "express-session";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import passport from "./config/passport.js";
import mongoose from "mongoose";
import { Session } from "express-session";
import googleRoutes from "./routes/authRoutes.js";
import linkedinRoutes from "./routes/linkedinRoutes.js";
import redditRoutes from "./routes/redditRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import env from "dotenv";



env.config();

const app = express();

// setting sesssion
app.use(session({
      secret: 'your_secret_key', 
      resave: false, 
      saveUninitialized: false, // Prevents saving new, unmodified sessions
      cookie: { maxAge: 24 * 60 * 60 * 1000 } // cookie expires in 24 hours
    }));
app.use(passport.initialize());
app.use(passport.session());    

// mongo db 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());

            // Routes
// youtube
app.use(youtubeRoutes);
//ai 
app.use("/ai", aiRoutes);
//google
app.use("/auth",googleRoutes);
//linkedin
app.use("/", linkedinRoutes);
//reddit
app.use("/", redditRoutes);

//testing
app.use("/auth/dashboard" ,(req,res)=>{
  res.send("welcome server is running")
})
app.use("/",(req,res)=>{
    res.send("welcome server is running")
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
