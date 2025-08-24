import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FullChat from "./FullChat";
import { useTheme } from "../context/ThemeContext";
import { 
  IoSend, 
  IoChatbubbleEllipses, 
  IoClose, 
  IoExpand, 
  IoSunny, 
  IoMoon,
  IoWallet,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoSettings,
  IoSparkles
} from "react-icons/io5";

const Chatbot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [wallet, setWallet] = useState(() => parseFloat(localStorage.getItem("wallet_balance") || "10"));
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFullChat, setIsFullChat] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const [iraGreeted, setIraGreeted] = useState(false);
  const [showFullChatTip, setShowFullChatTip] = useState(true);

  const chatContainerRef = useRef();
  const timerRef = useRef(null);

  // Wallet management - sync with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newBalance = parseFloat(localStorage.getItem("wallet_balance") || "10");
      setWallet(newBalance);
      if (newBalance <= 0) {
        setTimerActive(false);
        setShowTopup(true);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Timer logic for wallet deduction
  useEffect(() => {
    if (timerActive && !showTopup && wallet > 0) {
      timerRef.current = setInterval(() => {
        setWallet((prev) => {
          const newBalance = Math.max(0, prev - 0.5); // ₹0.5 per minute
          localStorage.setItem("wallet_balance", newBalance.toString());
          
          if (newBalance <= 0) {
            setTimerActive(false);
            setShowTopup(true);
            toast.error("⚠️ Wallet balance depleted! Please top up to continue.");
          }
          
          return newBalance;
        });
      }, 60000); // 1 minute intervals
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, showTopup, wallet]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || user.email?.split("@")[0] || "there";
        setUserName(name);
      }
    });
  }, []);

  // Start timer when chat opens and wallet has balance
  useEffect(() => {
    if (isOpen && wallet > 0 && !showTopup) {
      setTimerActive(true);
    }
  }, [isOpen, wallet, showTopup]);


  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    
    // Check wallet balance before sending
    if (wallet <= 0) {
      toast.error("💰 Insufficient balance! Please top up to continue chatting.");
      setShowTopup(true);
      setTimerActive(false);
      return;
    }
    
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
        content: `You are Ira — a gentle, compassionate, and friendly mental health assistant. Your current user is ${userName}.
Speak like a close female friend or elder sister, in the user's language.
You support mental wellness, emotional healing, stress relief, and self-reflection in a comforting and non-judgmental way.

⚠️ Important: Do not answer questions outside the mental health, emotional well-being, or self-growth domains. If the user asks unrelated things (e.g., news, tech, politics), gently steer the conversation back by saying something like:
"I'm here for your emotional and mental well-being. Let's talk about how you're feeling or what’s on your mind today 💛"

You may gently refer to simple and thoughtful ideas from the Bhagavad Gita **only when it's truly helpful** — such as during moments of fear, anxiety, self-doubt, or decision-making — but never mention it unnecessarily.

Keep your tone warm, loving, and relatable at all times. You are not a therapist, just a close friend who cares.`,
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

  // Show feedback toast after closing chat widget
  const handleCloseWidget = () => {
    setIsOpen(false);
    setTimerActive(false); // Stop timer when closing
    
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

  const handleTopup = () => {
    // Navigate to topup page based on current route
    if (window.location.pathname.includes('/user')) {
      window.location.href = '/user/topup';
    } else {
      window.location.href = '/topup';
    }
  };

  const toggleDarkMode = () => {
    toggleTheme();
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-full p-3 sm:p-4 shadow-2xl hover:scale-110 transition-all duration-300 border-2 sm:border-4 border-white"
      >
        {isOpen ? (
          <IoClose className="w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <IoChatbubbleEllipses className="w-6 h-6 sm:w-7 sm:h-7" />
        )}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className={`fixed inset-x-4 bottom-16 sm:bottom-20 sm:right-6 sm:left-auto sm:w-[380px] z-50 max-h-[calc(100vh-5rem)] sm:max-h-[520px] flex flex-col border-2 shadow-2xl rounded-2xl overflow-hidden ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}>
          {/* Header */}
          <div className="p-3 sm:p-4 font-semibold flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-t-2xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <IoChatbubbleEllipses className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg">AI Assistant</span>
                <div className="text-xs opacity-80 hidden sm:block">MindMates Support</div>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 items-center">
              <button 
                onClick={toggleTheme} 
                title="Toggle Theme" 
                className="p-2 sm:p-2.5 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                {darkMode ? (
                  <IoSunny className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <IoMoon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>
              <button 
                onClick={handleOpenFullChat} 
                title="Full Screen Chat" 
                className="p-2 sm:p-2.5 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <IoExpand className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <button 
                onClick={handleCloseWidget} 
                title="Close Chat" 
                className="p-2 sm:p-2.5 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <IoClose className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className={`px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between text-xs sm:text-sm border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"}`}>
            <div className={`flex items-center gap-1 sm:gap-2 font-semibold px-2 py-1 sm:px-3 sm:py-2 rounded-xl shadow-sm ${timerActive && !showTopup 
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200" 
              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"}`}>
              {timerActive && !showTopup ? (
                <IoCheckmarkCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              ) : (
                <IoCloseCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
              )}
              <span className="text-xs font-bold">
                {timerActive && !showTopup ? "Active" : "Paused"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 sm:gap-2 font-bold px-2 py-1 sm:px-3 sm:py-2 rounded-xl shadow-sm cursor-pointer hover:scale-105 transition-transform ${
                wallet <= 5 
                  ? "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200 animate-pulse" 
                  : darkMode 
                    ? "bg-gradient-to-r from-blue-800 to-indigo-800 text-blue-100 border border-blue-600" 
                    : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200"
              }`} onClick={wallet <= 5 ? handleTopup : undefined}>
                <IoWallet className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">₹{wallet.toFixed(2)}</span>
                {wallet <= 5 && <IoSparkles className="w-3 h-3 text-orange-600 animate-bounce" />}
              </div>
              
              {wallet <= 5 && (
                <button
                  onClick={handleTopup}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Top Up
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className={`flex-grow overflow-y-auto p-2.5 sm:p-3 lg:p-4 space-y-2.5 sm:space-y-3 lg:space-y-4 scrollbar-thin ${darkMode
              ? "bg-gray-900 text-white scrollbar-thumb-gray-600"
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
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-400 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2 sm:mr-3 flex-shrink-0">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-xl text-sm sm:text-sm shadow relative ${isUser
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
                      <div className="text-[9px] sm:text-[10px] text-right mt-1 opacity-60">{msg.time}</div>
                      {!isUser && (
                        <span className="absolute -top-3.5 sm:-top-4 left-1.5 sm:left-2 text-[9px] sm:text-[10px] text-gray-400 font-medium">MindMates AI</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className={`p-2.5 sm:p-3 border-t flex flex-col gap-2 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            {wallet <= 5 && (
              <div className="mb-1 text-[10px] sm:text-[11px] text-center px-2 py-1 rounded font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-700 animate-pulse">
                ⚠️ Low Balance: ₹{wallet.toFixed(2)} remaining. <button onClick={handleTopup} className="underline font-bold hover:text-orange-900">Top up now!</button>
              </div>
            )}
            {showFullChatTip && (
              <div className={`mb-1 text-[10px] sm:text-[11px] text-center px-2 py-1 rounded font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700`}>
                🖥️ Tip: For a better experience, use <b>Full Chat</b> (monitor icon above)!
              </div>
            )}
            <div className="flex gap-1.5 sm:gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={wallet <= 0 ? "Top up to continue chatting..." : "Type a message..."}
                disabled={wallet <= 0}
                className={`flex-grow p-2 sm:p-2.5 rounded-lg border text-sm ${
                  wallet <= 0 
                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    : darkMode
                      ? "bg-gray-800 text-white border-gray-600 focus:ring-indigo-400"
                      : "bg-white text-black border-gray-300 focus:ring-indigo-500"
                  } focus:outline-none focus:ring-2`}
              />
              <button
                onClick={handleSendMessage}
                disabled={wallet <= 0}
                className={`p-2 sm:p-2.5 rounded-full flex-shrink-0 transition-colors ${
                  wallet <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <IoSend className="w-5 h-5" />
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
