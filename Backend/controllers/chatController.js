// server/controllers/chatController.js
import { messages } from "../websocket/socketManager.js";

export const getAllMessages = (req, res) => {
  res.json({ success: true, messages });
};

export const postMessage = (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ success: false, error: 'username and text required' });
  }

  const message = { username, text, timestamp: new Date().toISOString() };
  messages.push(message);

  res.status(201).json({ success: true, message });
};
