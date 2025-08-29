// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "dotenv";
env.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * General AI Assistant
 * - Takes user question (e.g., "summarize my LinkedIn engagement")
 * - Optionally takes analytics data
 */
export const askAssistant = async (req, res) => {
  try {
    const { question, analyticsData } = req.body;

    let context = "";
    if (analyticsData) {
      context = `Here is the analytics data: ${JSON.stringify(analyticsData, null, 2)}`;
    }

    const prompt = `
      You are an AI assistant inside a Social Media Analytics Dashboard.
      Your job is to analyze data and answer questions clearly.

      User Question: ${question}
      ${context}

      Respond in a helpful and professional way with insights, not raw JSON.
    `;

    const result = await model.generateContent(prompt);

    res.json({
      message: "✅ AI response generated",
      response: result.response.text(),
    });
  } catch (error) {
    console.error("❌ AI Assistant Error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};
