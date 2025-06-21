// server/server.js
import http from "http";
import { WebSocketServer } from "ws";
import app from "./app.js";
import { setupSocketServer } from "./websocket/socketManager.js";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupSocketServer(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ REST API running at http://localhost:${PORT}`);
  console.log(`🔌 WebSocket running at ws://localhost:${PORT}`);
});
