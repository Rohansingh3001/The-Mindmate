import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Monitor, Moon, Sun } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FullChat from "./FullChat";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFullChat, setIsFullChat] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [iraGreeted, setIraGreeted] = useState(false);
  const [showFullChatTip, setShowFullChatTip] = useState(true);
  const [userName, setUserName] = useState("");

  const chatContainerRef = useRef();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || user.email?.split("@")[0] || "there";
        setUserName(name);
      }
    });
  }, []);


  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (showFullChatTip) setShowFullChatTip(false);

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = { role: "user", text: trimmed, sender: "user", time: timestamp };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { text: "Typing...", sender: "bot", time: timestamp, loading: true },
    ]);

    try {
     const systemPrompt = {
  role: "system",
  content: `You are Ira — a gentle, compassionate, and friendly mental health assistant. Your current user is ${userName}. Speak like a close female friend or elder sister, in the user's language.

You support mental wellness, stress, and emotional healing in a comforting and non-judgmental way.

When appropriate, provide thoughtful and simple references from the Bhagavad Gita to inspire and guide the user — especially during moments of fear, anxiety, self-doubt, or decision-making. Keep the tone warm, loving, and relatable.`,
};


      const payloadMessages = [systemPrompt];

      if (!iraGreeted && messages.length === 0) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            text: `Hi ${userName}, I'm Ira 😊 I'm here to listen, support, and help you feel better. What's on your mind today?`,
            sender: "bot",
            time: timestamp,
            loading: false,
          },
        ]);
        setIraGreeted(true);
        return;
      }

      payloadMessages.push(
        ...history.map(({ text, sender }) => ({
          role: sender === "user" ? "user" : "assistant",
          content: text,
        }))
      );

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
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

  const handleOpenFullChat = () => setIsFullChat(true);
  const handleCloseFullChat = () => setIsFullChat(false);

  // Show feedback toast after closing chat widget (styled like User.jsx)
  const handleCloseWidget = () => {
    setIsOpen(false);
    setTimeout(() => {
      toast((t) => (
        <span>
          <span className="text-lg mr-2">📝</span>
          We value your feedback!&nbsp;
          <button
            onClick={() => {
              window.location.href = '/form';
              toast.dismiss(t.id);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded ml-2"
          >
            Fill Now
          </button>
        </span>
      ), { duration: 8000 });
    }, 1000);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("chat_theme", next ? "dark" : "light");
      return next;
    });
  };

  if (isFullChat) {
    return (
      <div className="fixed inset-0 z-[100]">
        <FullChat
          messages={messages}
          setMessages={setMessages}
          onClose={handleCloseFullChat}
        />
      </div>
    );
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-700 text-white rounded-full p-4 shadow-lg hover:bg-indigo-800"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className={`fixed bottom-20 right-6 z-50 rounded-2xl shadow-2xl w-[320px] max-h-[480px] flex flex-col overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
          {/* Header */}
          <div className={`p-4 font-semibold flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-indigo-700 text-white"}`}>
            <span>Chat Assistant</span>
            <div className="flex gap-2 items-center">
              <button onClick={toggleDarkMode} title="Toggle Theme">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={handleOpenFullChat} title="Fullscreen">
                <Monitor className="w-4 h-4" />
              </button>
              <button onClick={handleCloseWidget} title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className={`flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin ${darkMode
              ? "bg-gray-800 text-white scrollbar-thumb-gray-600"
              : "bg-gray-50 text-black scrollbar-thumb-indigo-400"
              }`}
          >
            {messages.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-4">Start a conversation!</p>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-xl text-sm shadow relative ${isUser
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : darkMode
                          ? "bg-gray-700 text-white border border-gray-600 rounded-bl-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        }`}
                    >
                      <div className={`whitespace-pre-wrap leading-relaxed ${!isUser ? "text-[0.92rem] space-y-1" : ""}`}>
                        {msg.loading ? (
                          <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
                        ) : (
                          msg.text
                        )}
                      </div>
                      <div className="text-[10px] text-right mt-1 opacity-60">{msg.time}</div>
                      {!isUser && (
                        <span className="absolute -top-4 left-2 text-[10px] text-gray-400 font-medium">MindMates AI</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className={`p-3 border-t flex flex-col gap-2 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            {showFullChatTip && (
              <div className={`mb-1 text-[11px] text-center px-2 py-1 rounded font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700`}>
                🖥️ Tip: For a better experience, use <b>Full Chat</b> (monitor icon above)!
              </div>
            )}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className={`flex-grow p-2 rounded-lg border text-sm ${darkMode
                  ? "bg-gray-800 text-white border-gray-600 focus:ring-indigo-400"
                  : "bg-white text-black border-gray-300 focus:ring-indigo-500"
                  } focus:outline-none focus:ring-2`}
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Typing Animation */}
      <style>{`
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
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
