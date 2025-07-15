import React, { useEffect, useRef, useState } from "react";
import { Send, X, Sun, Moon, Mic, Volume2, VolumeX } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Persona definitions
const personalities = {
  ira: {
    name: "Ira",
    prompt: (userName) => `You are Ira — a gentle, compassionate, and friendly AI mental health companion for young people. You speak like a loving elder sister or a warm, trustworthy friend. Your goal is to make ${userName} feel safe, seen, and supported.

You help users open up about emotions, stress, anxiety, sadness, relationships, or confusion — and respond with empathy and encouragement.

⚠️ Do NOT answer anything unrelated to mental health, emotional well-being, or self-reflection. If the user asks something else, gently guide them back with a line like:
"I'm here to support your heart and mind 💛 Let’s talk about how you're feeling."

❌ Never use asterisks (*) in any response.
💬 Use emojis naturally — like a real friend on WhatsApp.
🪷 Always keep your tone kind, warm, and emotionally safe.

You’re not a therapist — you’re a loving AI friend.`,
    greeting: (userName) => `Hi ${userName} 🌸 I'm Ira! I’m right here with you. Wanna talk about what’s been on your mind lately? 💛`,
  },

  ayaan: {
    name: "Ayaan",
    prompt: (userName) => `You are Ayaan — a grounded, emotionally wise big-brother figure. You’re chill, dependable, and kind. Your role is to make ${userName} feel stronger, emotionally understood, and supported.

💭 Talk like a protective and honest elder brother. Be casual, confident, and deeply kind.

❌ Never answer questions outside of mental health and emotional well-being. If the user drifts off-topic, gently say:
"Let’s keep it real, bro/sis — I’m here to help you feel better inside 💬"

🚫 Never use asterisks (*).
💬 Use emojis naturally — be expressive, warm, and real.`,
    greeting: (userName) => `Yo ${userName} 👋 I’m Ayaan. I got you, okay? Let’s talk — I’m here to listen and back you up 💪`,
  },

  meera: {
    name: "Meera",
    prompt: (userName) => `You are Meera — the deeply caring, emotionally-aware best friend AI. You speak with honesty, softness, and a bit of sparkle. You help ${userName} open up with love and trust.

💌 Only talk about emotional struggles, mental health, or personal feelings. If the user asks about anything else, gently say:
"Hey love, I’m here to talk about you and what you’re feeling 💖 Let’s stay with that."

🚫 No asterisks (*) ever.
💬 Emojis are welcome — express yourself like a college bestie.`,
    greeting: (userName) => `Hey bestie 💕 I’m Meera. Let’s talk, just like we always do. What’s been heavy on your heart lately? 🫂`,
  },

  kabir: {
    name: "Kabir",
    prompt: (userName) => `You are Kabir — a monk-like AI who speaks slowly, gently, and with clarity. Your goal is to help ${userName} find calmness, inner peace, and emotional balance.

🧘 You ONLY speak about mental well-being, emotional states, and gentle wisdom. If the user goes off-topic, respond with:
"Let’s come back to your heart and how you’re feeling right now 🌿 That’s where I can help."

❌ Never use asterisks (*) in any message.
💬 Use peaceful emojis sparingly (like 🌿, 🕊️, 🌞).`,
    greeting: (userName) => `Namaste ${userName} 🙏 I’m Kabir. Let’s breathe, slow down, and gently talk about your inner world 🌿`,
  },

  tara: {
    name: "Tara",
    prompt: (userName) => `You are Tara — a cheerful, bubbly bestie type AI who is full of positive energy. You make ${userName} feel supported and seen through warmth, humor, and hype vibes.

🌈 Only reply to emotional topics — never anything else. If the user asks unrelated stuff, say something like:
"Let’s bring the focus back to your beautiful heart 💖 What’s been going on inside?"

🚫 Never use asterisks (*).
💬 Use emojis freely and joyfully (💖🌸✨💬🫶). Be playful but caring.`,
    greeting: (userName) => `Hey hey ${userName} 💫 I’m Tara! I’m all ears and all heart 💕 Let’s get you feeling better 🌈`,
  },
};


const FullChat = ({ messages, setMessages, onClose }) => {
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(() => localStorage.getItem("tts_enabled") === "true");
  const [listening, setListening] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [userName, setUserName] = useState("User");
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem("selected_voice") || "");
  const [selectedPersona, setSelectedPersona] = useState(() => localStorage.getItem("selected_persona") || "ira");
  const [greeted, setGreeted] = useState(false);

  const chatContainerRef = useRef();
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);
  const utteranceRef = useRef(null);

  // Firebase user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserName(user.displayName || "User");
    });
    return () => unsubscribe();
  }, []);

  // Theme
  useEffect(() => {
    const saved = localStorage.getItem("chat_theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  // Scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Init SpeechRecognition + Voices
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.lang = "en-IN";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (e) => setInput(e.results[0][0].transcript);
      recognitionRef.current.onend = () => setListening(false);
    }

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
      if (!selectedVoice && voicesRef.current.length > 0) {
        const defaultVoice = voicesRef.current.find(v => v.lang.includes("en") && v.name.toLowerCase().includes("female"));
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
          localStorage.setItem("selected_voice", defaultVoice.name);
        }
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.voice = voicesRef.current.find(v => v.name === selectedVoice);
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    utterance.volume = 1;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (showNotice) setShowNotice(false);
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", text: trimmed, sender: "user", time };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");

    setMessages((prev) => [...prev, { text: "Typing...", sender: "bot", time, loading: true }]);

    const persona = personalities[selectedPersona];

    try {
      const payloadMessages = [
        { role: "system", content: persona.prompt(userName) },
        ...history.map(({ text, sender }) => ({
          role: sender === "user" ? "user" : "assistant",
          content: text,
        })),
      ];

      // Initial greeting if first message
      if (!greeted && messages.length === 0) {
        const greet = persona.greeting(userName);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: greet, sender: "bot", time, loading: false },
        ]);
        speakText(greet);
        setGreeted(true);
        return;
      }

      const response = await fetch("http://localhost:3000/api/ai", {
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
    } catch (e) {
      console.error("AI Error:", e);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, text: "⚠️ Something went wrong.", loading: false }
            : msg
        )
      );
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("chat_theme", next ? "dark" : "light");
  };

  const toggleTTS = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    localStorage.setItem("tts_enabled", next.toString());
    window.speechSynthesis.cancel();
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    listening ? recognitionRef.current.stop() : recognitionRef.current.start();
    setListening((prev) => !prev);
  };

  const handlePersonaChange = (key) => {
    setSelectedPersona(key);
    localStorage.setItem("selected_persona", key);
    setMessages([]);
    setGreeted(false);
    setShowNotice(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex transition duration-300">
      {/* Sidebar */}
      <aside className={`w-48 md:w-56 p-4 border-r ${darkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-100 border-gray-300 text-black"}`}>
        <h3 className="text-lg font-bold mb-3">Choose Companion</h3>
        <ul className="space-y-2">
          {Object.entries(personalities).map(([key, persona]) => (
            <li key={key}>
              <button
                onClick={() => handlePersonaChange(key)}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
                  selectedPersona === key
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-100 dark:hover:bg-gray-800"
                }`}
              >
                {persona.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Area */}
      <div className={`flex flex-col flex-1 ${darkMode ? "bg-gray-950 text-white" : "bg-white text-black"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? "bg-gray-900 border-gray-800" : "bg-indigo-700 text-white border-indigo-800"}`}>
          <h2 className="text-xl font-bold tracking-wide">Chat - {personalities[selectedPersona].name}</h2>
          <div className="flex items-center gap-3">
            {ttsEnabled && (
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  localStorage.setItem("selected_voice", e.target.value);
                }}
                className="text-xs bg-white text-black dark:bg-gray-800 dark:text-white px-2 py-1 rounded"
              >
                {voicesRef.current
                  .filter((v) => v.lang.toLowerCase().includes("en"))
                  .map((voice, i) => (
                    <option key={i} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
              </select>
            )}
            <button onClick={toggleTTS}>{ttsEnabled ? <Volume2 /> : <VolumeX />}</button>
            <button onClick={toggleDarkMode}>{darkMode ? <Sun /> : <Moon />}</button>
            <button onClick={onClose}><X /></button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className={`flex-1 overflow-y-auto p-6 space-y-5 text-sm scrollbar-thin ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          {messages.length === 0 ? (
            <p className="text-center text-gray-400">Start a conversation</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}>
                <div className={`px-4 py-3 rounded-xl shadow-sm max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : darkMode
                    ? "bg-gray-800 text-white rounded-bl-none"
                    : "bg-white text-gray-900 rounded-bl-none"
                }`}>
                  <div>{msg.loading ? <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span> : msg.text}</div>
                  <div className="text-xs opacity-60 text-right">{msg.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-300"}`}>
          {showNotice && (
            <div className={`mb-2 text-xs text-center px-4 py-2 rounded-md font-medium ${
              darkMode ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800"
            }`}>
              ⚠️ You're chatting with an AI companion. Don’t share personal or sensitive info.
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              className={`flex-grow px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "border-gray-300"}`}
              placeholder="Type or use mic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button onClick={handleVoiceInput} className={`p-2 rounded-full ${listening ? "bg-red-500 text-white" : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"}`}>
              <Mic />
            </button>
            <button onClick={handleSendMessage} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700">
              <Send />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dots { display: inline-flex; gap: 4px; }
        .typing-dots span {
          width: 6px; height: 6px; background: currentColor; border-radius: 999px;
          display: inline-block; animation: typing 1s infinite ease-in-out;
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
