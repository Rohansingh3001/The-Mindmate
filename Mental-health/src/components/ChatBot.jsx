import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const chatContainerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
    }
  }, [isOpen]);

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
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const launchFullChat = () => {
    navigate("/fullchat");
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-indigo-500 to-purple-700">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-xl hover:bg-indigo-700 focus:outline-none transition duration-300 transform hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Notification */}
      {showNotification && (
        <div className="absolute bottom-24 right-8 bg-indigo-600 text-white p-4 rounded-lg shadow-lg">
          <p>Use the AI Chatbot for assistance!</p>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-full max-w-xl bg-white rounded-2xl shadow-2xl fixed bottom-16 right-6 z-50 transition-transform duration-500 ease-in-out transform">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 text-lg font-semibold rounded-t-2xl flex justify-between items-center">
            <span>Chat with our Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Scrollable Container */}
          <div
            className="flex-grow max-h-80 p-4 overflow-y-auto bg-gray-50 rounded-b-2xl scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200"
            ref={chatContainerRef}
          >
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
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
          </div>

          {/* Input + Full Chat Button */}
          <div className="flex flex-col gap-2 p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none shadow-lg transition duration-300 ease-in-out"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={launchFullChat}
              className="text-sm text-indigo-600 hover:underline self-end"
            >
              Launch Full Chat →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
