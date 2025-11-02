// server/controllers/aiController.js
import dotenv from "dotenv";
dotenv.config();
import { Groq } from "groq-sdk";

// Make Groq client optional
let groq = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } else {
    console.warn("⚠️  GROQ_API_KEY not found. AI features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Groq client:", error);
}

export const askAI = async (req, res) => {
  if (!groq) {
    return res.status(503).json({ 
      error: "AI service is not configured. Please check server configuration." 
    });
  }

  const { messages } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages,
      stream: false,
      temperature: 1,
      max_tokens: 1024,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({ error: "AI error. Try again later." });
  }
};
