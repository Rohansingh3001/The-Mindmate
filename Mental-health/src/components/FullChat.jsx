// FullChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FullChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-indigo-700 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold">Full Chat Assistant</h1>
        <button onClick={() => navigate(-1)} className="hover:bg-indigo-800 p-1 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div
        ref={chatRef}
        className="flex-grow p-4 overflow-y-auto bg-gray-100 space-y-4"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg text-sm max-w-xl ${
              msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-300"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-white flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FullChat;
