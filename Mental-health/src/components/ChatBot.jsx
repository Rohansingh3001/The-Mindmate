import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef();
  const navigate = useNavigate();

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

  const openFullChat = () => {
    navigate("/fullchat");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-700 text-white rounded-full p-4 shadow-lg hover:bg-indigo-800"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Widget Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 bg-white text-black rounded-2xl shadow-2xl w-[320px] max-h-[450px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 text-white p-4 font-semibold flex justify-between items-center">
            <span>Chat Assistant</span>
            <div className="flex gap-2">
              <button
                onClick={openFullChat}
                className="hover:bg-indigo-800 p-1 rounded-full"
                title="Open in Fullscreen"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-indigo-800 p-1 rounded-full"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
