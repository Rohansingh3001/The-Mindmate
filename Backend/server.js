// server/server.js
import http from "http";
import { WebSocketServer } from "ws";
import { Server as SocketIOServer } from "socket.io";
import { PeerServer } from "peer";
import app from "./app.js";
import { setupSocketServer } from "./websocket/socketManager.js";
import { setupSocketIOServer } from "./websocket/socketIOManager.js";

const server = http.createServer(app);

// WebSocket Server (existing)
const wss = new WebSocketServer({ server });
setupSocketServer(wss);

// Socket.IO Server for real-time chat and video calling
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Configure this properly in production
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

setupSocketIOServer(io);

// PeerJS Server for WebRTC signaling
const peerServer = PeerServer({
  port: 9000,
  path: '/peerjs',
  corsOptions: {
    origin: "*", // Configure this properly in production
    methods: ["GET", "POST"]
  }
});

console.log('🎥 PeerJS server running on port 9000');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ REST API running at http://localhost:${PORT}`);
  console.log(`🔌 WebSocket running at ws://localhost:${PORT}`);
  console.log(`💬 Socket.IO running at http://localhost:${PORT}`);
  console.log(`🎥 PeerJS server running at http://localhost:9000/peerjs`);
});
