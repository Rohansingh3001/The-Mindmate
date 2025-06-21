// client/components/Chat/InputBox.jsx
import React, { useState } from "react";

export default function InputBox({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <div className="flex p-4 border-t">
      <input
        type="text"
        className="flex-grow px-4 py-2 border rounded-l"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-r"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
