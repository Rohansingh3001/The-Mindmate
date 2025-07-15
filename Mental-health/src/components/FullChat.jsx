import React, { useEffect, useRef, useState } from "react";
import { Send, X, Sun, Moon, Mic, Volume2, VolumeX } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const FullChat = ({ messages, setMessages, onClose }) => {
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(() => localStorage.getItem("tts_enabled") === "true");
  const [listening, setListening] = useState(false);
  const [iraGreeted, setIraGreeted] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [userName, setUserName] = useState("User");
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem("selected_voice") || "");

  const chatContainerRef = useRef();
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserName(user.displayName || "User");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-IN";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onend = () => setListening(false);
    }

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
      if (!selectedVoice && voicesRef.current.length > 0) {
        const defaultVoice = voicesRef.current.find(v =>
          v.lang.toLowerCase() === "en-in" || v.name.toLowerCase().includes("zira")
        );
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
          localStorage.setItem("selected_voice", defaultVoice.name);
        }
      }
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const speakText = (text) => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.94;
    utterance.pitch = 1.15;
    utterance.volume = 1;

    const voice = voicesRef.current.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (showNotice) setShowNotice(false);

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
      speakText(data.reply);

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

  const handleKey = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("chat_theme", next ? "dark" : "light");
      return next;
    });
  };

  const toggleTTS = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    localStorage.setItem("tts_enabled", next.toString());
    window.speechSynthesis.cancel();
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setListening((prev) => !prev);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-950 text-white" : "bg-white text-black"}`}>
      <div className={`flex items-center justify-between p-5 border-b shadow-sm ${darkMode ? "bg-gray-900 border-gray-800" : "bg-indigo-700 text-white border-indigo-800"}`}>
        <h2 className="text-xl font-bold tracking-wide">Chat Assistant - Ira</h2>
        <div className="flex items-center gap-3">
          {ttsEnabled && (
            <select
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                localStorage.setItem("selected_voice", e.target.value);
              }}
              className="text-xs bg-white text-black dark:bg-gray-800 dark:text-white border-none outline-none px-2 py-1 rounded"
              title="Choose Ira's voice"
            >
              {voicesRef.current
                .filter((v) => v.lang.toLowerCase().includes("en") || v.name.toLowerCase().includes("female"))
                .map((voice, i) => (
                  <option key={i} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          )}
          <button onClick={toggleTTS} title="Toggle TTS">
            {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button onClick={toggleDarkMode} title="Toggle Theme">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={onClose} title="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div ref={chatContainerRef} className={`flex-1 overflow-y-auto p-6 space-y-5 text-sm font-medium scrollbar-thin transition-all ${darkMode ? "bg-gray-900 scrollbar-thumb-gray-700 scrollbar-track-gray-800" : "bg-gray-100 scrollbar-thumb-indigo-400 scrollbar-track-gray-300"}`}>
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">Start a conversation</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}>
              {msg.sender !== "user" && (
                <div className="mr-2 w-8 h-8 bg-indigo-500 text-white flex items-center justify-center text-xs font-bold rounded-full shadow-md">🤖</div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-br-none" : darkMode ? "bg-gray-800 text-white rounded-bl-none" : "bg-white text-gray-900 rounded-bl-none"}`}>
                <div className="flex flex-col gap-1">
                  <span>{msg.loading ? <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span> : msg.text}</span>
                  <span className="text-[10px] opacity-60 self-end">{msg.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-300"}`}>
        {showNotice && (
          <div className={`mb-2 text-xs text-center px-4 py-2 rounded-md font-medium ${darkMode ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"}`}>
            ⚠️ You're chatting with Ira, an AI-based mental health assistant. She may make mistakes — please avoid sharing any personal, sensitive, or confidential information.
          </div>
        )}
        <div className="flex gap-3 items-center">
          <input
            className={`flex-grow px-4 py-2 rounded-lg text-sm border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "border-gray-300"}`}
            placeholder="Type or use mic..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button onClick={handleVoiceInput} className={`p-2 rounded-full transition-colors duration-150 ${listening ? "bg-red-500 text-white" : darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`} title="Voice Input">
            <Mic className="w-5 h-5" />
          </button>
          <button onClick={handleSendMessage} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700" title="Send">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Typing animation CSS */}
      <style>{`
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
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
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

export default FullChat;
