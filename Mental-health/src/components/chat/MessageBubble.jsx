// client/components/Chat/MessageBubble.jsx
import React from "react";

export default function MessageBubble({ msg, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`rounded-xl px-4 py-2 max-w-xs ${isMine ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}>
        <p className="text-sm">{msg.text}</p>
        <span className="text-xs opacity-60">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
