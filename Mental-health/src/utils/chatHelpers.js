// client/utils/chatHelpers.js

let socket = null;
let messageListener = null;

export function initChatConnection(username) {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "join", username }));
    console.log("✅ WebSocket connected as", username);
  };

  socket.onclose = () => {
    console.warn("❌ WebSocket disconnected");
  };

  socket.onerror = (err) => {
    console.error("⚠️ WebSocket error:", err);
  };
}

export function sendMessage(chatId, message) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("⚠️ Socket not ready, message not sent.");
    return;
  }

  const payload = {
    type: "message",
    chatId,
    username: message.from,
    text: message.text,
  };

  socket.send(JSON.stringify(payload));
}

export function subscribeToMessages(chatId, setMessages) {
  // Remove old listener if exists
  if (messageListener) {
    socket?.removeEventListener("message", messageListener);
  }

  messageListener = (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === "message" && msg.chatId === chatId) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            from: msg.username,
            text: msg.text,
            timestamp: msg.timestamp,
          },
        ]);
      }
    } catch (err) {
      console.error("Error parsing incoming message", err);
    }
  };

  socket?.addEventListener("message", messageListener);

  return () => {
    socket?.removeEventListener("message", messageListener);
    messageListener = null;
  };
}
