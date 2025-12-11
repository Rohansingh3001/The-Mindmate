import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // If using React Router

const FullChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef();
  const navigate = useNavigate(); // Comment out if not using router

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-indigo-600 text-white px-6 py-4 shadow-md">
        <button
          onClick={() => navigate(-1)} // Replace or remove if not using routing
          className="p-2 hover:bg-indigo-700 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Centered Title */}
        <h1 className="text-lg font-bold text-center flex-grow">MindMates Chat</h1>

        {/* To keep the title centered, add an empty placeholder */}
        <div className="w-8" />
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-4"
        ref={chatContainerRef}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-sm p-3 rounded-xl shadow ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="border-t border-gray-300 bg-white px-4 py-3 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow px-4 py-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FullChatInterface;
