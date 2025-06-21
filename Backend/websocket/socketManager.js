// server/websocket/socketManager.js
import { broadcast } from "../utils/broadcast.js";

export let messages = []; // In-memory message storage
let users = new Map();    // socket -> username

export function setupSocketServer(wss) {
  wss.on("connection", (ws) => {
    ws.on("message", (data) => {
      const msg = JSON.parse(data);

      if (msg.type === "join") {
        users.set(ws, msg.username);
        broadcastUserList(wss);
      }

      if (msg.type === "message") {
        const message = {
          username: msg.username,
          text: msg.text,
          timestamp: new Date().toISOString()
        };
        messages.push(message);
        broadcast(wss, { type: "message", ...message });
      }
    });

    ws.on("close", () => {
      users.delete(ws);
      broadcastUserList(wss);
    });
  });
}

function broadcastUserList(wss) {
  const usernames = Array.from(users.values());
  broadcast(wss, { type: "users", users: usernames });
}
