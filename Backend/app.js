// server/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import trainingDataRoutes from "./routes/trainingDataRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*", // Configure this properly in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/training-data", trainingDataRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
