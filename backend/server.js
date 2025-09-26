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


// Middleware
app.use(express.json());
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
// mongoose.connect(process.env.MONGO_URI, {
// })
// .then(() => console.log("✅ MongoDB connected successfully"))
// .catch((err) => console.error("❌ MongoDB connection error:", err));

const mongooseOptions = {
  bufferCommands: false, // 🔥 CRITICAL: Disable buffering for serverless
  maxPoolSize: 5, // Reduce connection pool size
  minPoolSize: 1, // Maintain minimal connections
  serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
  socketTimeoutMS: 45000, // Socket timeout after 45 seconds
  family: 4, // Use IPv4
};

// Connection caching for serverless environment
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    console.log("🔄 Establishing new MongoDB connection...");
    await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    isConnected = false;
    throw err;
  }
}

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    res.status(500).json({ 
      message: "Database connection failed",
      error: process.env.NODE_ENV === 'production' ? {} : error.message 
    });
  }
});

// Connection event handlers for better debugging
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ Mongoose disconnected');
  isConnected = false;
});



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

// app.get("/", async (req, res) => {
//   try {
//     // Check mongoose connection state
//     const dbState = mongoose.connection.readyState; 
//     // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

//     let statusMsg = "❌ DB not connected";
//     if (dbState === 1) statusMsg = "✅ DB connected";
//     if (dbState === 2) statusMsg = "⏳ DB connecting";

//     res.json({
//       message: "Server is running...",
//       db: statusMsg
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error checking DB", error: err.message });
//   }
// });



// app.use((err, req, res, next) => {
//   console.error("🔥 Server Error:", err.stack);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  
  res.json({
    message: "Server is running...",
    database: states[dbState],
    timestamp: new Date().toISOString()
  });
});


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});  
}

export default app;
