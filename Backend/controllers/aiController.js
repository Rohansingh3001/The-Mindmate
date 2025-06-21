// server/controllers/aiController.js
import dotenv from "dotenv";
dotenv.config();
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askAI = async (req, res) => {
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
