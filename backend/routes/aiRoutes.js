import express from "express";
import { askAssistant } from "../controllers/aiController.js";
import env from "dotenv";
env.config();

const router = express.Router();

// POST /ai/assistant
router.post("/assistant", askAssistant);

export default router;
