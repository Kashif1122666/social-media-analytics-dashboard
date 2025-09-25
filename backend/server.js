import express from "express";
import session from "express-session";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import passport from "./config/passport.js";
import mongoose from "mongoose";
import { Session } from "express-session";
import authRoutes from "./routes/auth.js";
// import linkedinRoutes from "./routes/linkedinRoutes.js";
import redditRoutes from "./routes/redditRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import env from "dotenv";
import cors from "cors";



env.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));


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
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());

            // Routes
// youtube
app.use("/auth", youtubeRoutes);

//ai 
app.use("/api/ai", aiRoutes);
//google
app.use('/auth', authRoutes);
//linkedin
// app.use("/", linkedinRoutes);
//reddit
app.use("/", redditRoutes);

app.get("/", (req, res) => {
  res.send("server is running...");
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
