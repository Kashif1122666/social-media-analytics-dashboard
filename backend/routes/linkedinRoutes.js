// routes/linkedinRoutes.js
import express from "express";
import {
  linkedinAuth,
  linkedinCallback,
  testLinkedinProfile
} from "../controllers/linkedinController.js";
import env from "dotenv";
env.config();

const router = express.Router();

// Step 1: Redirect to LinkedIn authorization
router.get("/auth/linkedin", linkedinAuth);

// Step 2: Handle callback and exchange code for tokens
router.get("/auth/linkedin/callback", linkedinCallback);

// Additional route to test LinkedIn API access
router.get("/linkedin/test-profile", testLinkedinProfile);

export default router;