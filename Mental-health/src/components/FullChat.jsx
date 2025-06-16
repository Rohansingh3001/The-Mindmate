import React, { useEffect, useRef, useState } from "react";
import { Send, X, Sun, Moon } from "lucide-react";

const FullChat = ({ messages, setMessages, onClose }) => {
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatContainerRef = useRef();

  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = { role: "user", text: trimmed, sender: "user", time: timestamp };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { text: "Typing...", sender: "bot", time: timestamp, loading: true },
    ]);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a compassionate and professional mental health assistant. Only answer questions related to mental well-being, emotional support, therapy, anxiety, stress, depression, and mental health topics. If a question is outside this scope, politely redirect the user to stay on-topic.",
            },
            ...history.map(({ text, sender }) => ({
              role: sender === "user" ? "user" : "assistant",
              content: text,
            })),
          ],
        }),
      });

      const data = await response.json();
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, text: data.reply, loading: false } : msg
        )
      );
    } catch (err) {
      console.error("Groq Error:", err);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, text: "⚠️ Sorry, something went wrong.", loading: false }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("chat_theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-5 border-b shadow-sm ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-indigo-700 text-white border-indigo-800"
        }`}
      >
        <h2 className="text-xl font-bold tracking-wide">Chat Assistant</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-800"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-indigo-100 dark:hover:bg-gray-800"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-6 space-y-5 text-sm font-medium transition-all scrollbar-thin ${
          darkMode
            ? "bg-gray-900 scrollbar-thumb-gray-700 scrollbar-track-gray-800"
            : "bg-gray-100 scrollbar-thumb-indigo-400 scrollbar-track-gray-300"
        }`}
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">Start a conversation</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-end ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-slide-up`}
            >
              {msg.sender !== "user" && (
                <div className="mr-2 w-8 h-8 bg-indigo-500 text-white flex items-center justify-center text-xs font-bold rounded-full shadow-md">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : darkMode
                    ? "bg-gray-800 text-white rounded-bl-none"
                    : "bg-white text-gray-900 rounded-bl-none"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span>
                    {msg.loading ? (
                      <span className="typing-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    ) : (
                      msg.text
                    )}
                  </span>
                  <span className="text-[10px] opacity-60 self-end">{msg.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      <div
        className={`p-4 border-t flex items-center gap-3 ${
          darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-300"
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className={`flex-grow p-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600 focus:ring-indigo-400"
              : "bg-white text-black border-gray-300 focus:ring-indigo-500"
          }`}
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Animations */}
      <style>{`
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .typing-dots {
          display: inline-flex;
          gap: 4px;
        }
        .typing-dots span {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 999px;
          display: inline-block;
          animation: typing 1s infinite ease-in-out;
        }
        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
};

export default FullChat;
