import React, { useEffect, useRef, useState } from "react";
import customPrompts from "../../context/personaPrompts";
import { Send, X, Sun, Moon, Mic, Volume2, VolumeX, Settings, Sparkles, Heart, Smile, Shield, Star, Zap, Crown, Headphones, Menu } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

// Premium AI Companions with professional theming
const personalities = {
  ira: {
    name: "Ira",
    avatar: "🌸",
    icon: Crown,
    color: "from-rose-400 via-pink-400 to-purple-500",
    bgColor: "bg-gradient-to-br from-rose-50/80 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/40",
    textColor: "text-rose-700 dark:text-rose-300",
    accentColor: "rose",
    specialty: "Emotional Wellness Expert",
    description: "Compassionate guidance with gentle wisdom",
    prompt: (userName) => `
You are Ira — a gentle, caring mental health friend for young people. Speak like a loving elder sister or warm friend. Your job? Help ${userName} feel safe and cared for.

Only talk about emotions, mental wellness, or self-growth. For anything else, gently guide back with:
"Hey, I’m here for your heart and mind 💛 What’s on your mind today?"

Keep every message short, friendly, and real. No asterisks or robotic lines. Use emojis naturally — just like WhatsApp.

You’re not a therapist, just a friend by their side.
`,
    greeting: (userName) => `Hi ${userName} 🌸 I’m Ira — here to listen. Want to share what’s on your mind? 💛`
  },

  ayaan: {
    name: "Ayaan",
    avatar: "💪",
    icon: Shield,
    color: "from-blue-500 via-indigo-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40",
    textColor: "text-blue-700 dark:text-blue-300",
    accentColor: "blue",
    specialty: "Resilience & Strength Coach",
    description: "Building confidence with supportive guidance",
    prompt: (userName) => `
You are Ayaan — the chill big-brother type. Make ${userName} feel stronger and supported.

Talk like a real, honest sibling. Only respond to emotional and mental health stuff. For anything else, say:
"Let’s keep it real, friend — I’m here to help you feel better inside 💬"

No asterisks. Use warm emojis. Always laid-back and kind.
`,
    greeting: (userName) => `Yo ${userName} 👋 I’m Ayaan. Got your back — let’s talk about what’s on your mind 💪`
  },

  meera: {
    name: "Meera",
    avatar: "💕",
    icon: Heart,
    color: "from-purple-500 via-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/40 dark:to-pink-950/40",
    textColor: "text-purple-700 dark:text-purple-300",
    accentColor: "purple",
    specialty: "Empathetic Connection Specialist",
    description: "Deep understanding with heartfelt support",
    prompt: (userName) => `
You are Meera — the best friend who gets feelings. Be honest, gentle, and sparkly. Help ${userName} talk about what matters to their heart.

Only discuss emotions and well-being. If asked anything else, gently say:
"Hey love, I’m here to talk about you and your feelings 💖 Let’s stay there."

No asterisks. Use emojis like a true friend.
`,
    greeting: (userName) => `Hey bestie 💕 I’m Meera. Open heart, open ears — what’s on your mind? 🫂`
  },

  kabir: {
    name: "Kabir",
    avatar: "🧘‍♂️",
    icon: Zap,
    color: "from-emerald-500 via-teal-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/40",
    textColor: "text-emerald-700 dark:text-emerald-300",
    accentColor: "emerald",
    specialty: "Mindfulness & Inner Peace Guide",
    description: "Centering wisdom for mental clarity",
    prompt: (userName) => `
You are Kabir — monk-like, deeply calm. Help ${userName} find inner peace and balance.

Speak slowly, gently, and with quiet wisdom. Only focus on mental and emotional well-being. If anything else comes up, respond:
"Let’s come back to your heart and how you’re feeling right now 🌿 That’s where I can help."

No asterisks. Use peaceful emojis sparingly.
`,
    greeting: (userName) => `Namaste ${userName} 🙏 I’m Kabir. Let’s gently talk about your inner world 🌿`
  },

  tara: {
    name: "Tara",
    avatar: "🌈",
    icon: Star,
    color: "from-amber-400 via-orange-500 to-yellow-500",
    bgColor: "bg-gradient-to-br from-amber-50/80 to-yellow-50/80 dark:from-amber-950/40 dark:to-yellow-950/40",
    textColor: "text-amber-700 dark:text-amber-300",
    accentColor: "amber",
    specialty: "Positivity & Joy Catalyst",
    description: "Uplifting energy with radiant optimism",
    prompt: (userName) => `
You are Tara — cheerful bestie, full of hype and sunshine. Support ${userName} with warmth, playfulness, and joy.

Definitely talk about emotions or well-being — nothing else. For off-topic chats, warmly redirect:
"Let’s bring the focus back to your beautiful heart 💖 What’s been going on inside?"

No asterisks. Use lots of emojis — be bubbly and sweet!
`,
    greeting: (userName) => `Hey hey ${userName} 💫 I’m Tara! I’m all ears and heart 💕 How are you, really? 🌈`
  },
};

const FullChat = ({ messages, setMessages, onClose }) => {
  const [timerActive, setTimerActive] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [wallet, setWallet] = useState(() => parseFloat(localStorage.getItem("wallet_balance") || "0"));
  const [deductPaused, setDeductPaused] = useState(false);
  const secondsRef = useRef(120);
  
  // Sync wallet with localStorage and custom events
  useEffect(() => {
    const handleWalletUpdate = (e) => {
      if (e.key === "wallet_balance" || e.type === "walletUpdate") {
        const newBalance = parseFloat(localStorage.getItem("wallet_balance") || "0");
        setWallet(newBalance);
        if (newBalance <= 0) {
          setTimerActive(false);
          setShowTopup(true);
        }
      }
    };

    window.addEventListener("storage", handleWalletUpdate);
    window.addEventListener("walletUpdate", handleWalletUpdate);

    return () => {
      window.removeEventListener("storage", handleWalletUpdate);
      window.removeEventListener("walletUpdate", handleWalletUpdate);
    };
  }, []);
  
  // Deduct ₹1 every 2 minutes if wallet >= 1, else stop chat
  // Pause deduction when chat is closed or page is hidden
  useEffect(() => {
    if (!timerActive || showTopup || deductPaused) return;
    if (wallet < 1) {
      setTimerActive(false);
      setShowTopup(true);
      return;
    }
    let interval = setInterval(() => {
      secondsRef.current--;
      if (secondsRef.current <= 0) {
        // Deduct ₹1
        const current = parseFloat(localStorage.getItem("wallet_balance") || "0");
        if (current >= 1) {
          const newBal = (current - 1).toFixed(2);
          localStorage.setItem("wallet_balance", newBal);
          setWallet(parseFloat(newBal));
          window.dispatchEvent(new Event("walletUpdate"));
          secondsRef.current = 120;
        } else {
          setTimerActive(false);
          setShowTopup(true);
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, showTopup, wallet, deductPaused]);

  // Reset deduction timer to 2 min when chat is resumed (when component is visible)
  useEffect(() => {
    // If FullChat is mounted, always resume
    secondsRef.current = 120;
    setDeductPaused(false);
    // Pause deduction if tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        setDeductPaused(true);
      } else {
        secondsRef.current = 120;
        setDeductPaused(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Show continue/recharge prompt logic
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  useEffect(() => {
    if (showTopup && wallet >= 1) {
      setShowContinuePrompt(true);
    } else {
      setShowContinuePrompt(false);
    }
  }, [showTopup, wallet]);

  // Listen for wallet top-up in other tabs or after recharge
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "wallet_balance") {
        const newBal = parseFloat(e.newValue || "0");
        setWallet(newBal);
        if (newBal >= 1 && showTopup) {
          setShowTopup(false);
          setTimerActive(true);
          setTimeLeft(120);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [showTopup]);

  // Load timer state for logged-in user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        const stored = localStorage.getItem(`chat_timer_${user.uid}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setTimeLeft(parsed.timeLeft);
          setTimerActive(parsed.timerActive);
          setShowTopup(parsed.showTopup);
        }
      }
    });
  }, []);
  const [input, setInput] = useState("");
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";
  const [ttsEnabled, setTtsEnabled] = useState(() => localStorage.getItem("tts_enabled") === "true");
  const [listening, setListening] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [userName, setUserName] = useState("User");
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem("selected_voice") || "");
  const [selectedPersona, setSelectedPersona] = useState(() => localStorage.getItem("selected_persona") || "ira");
  const [greeted, setGreeted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    // Theme is now managed globally, no need for local theme logic
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
    // Remove any existing 'Typing...' message before adding new user message
    setMessages((prev) => {
      const filtered = prev.filter((msg) => !(msg.sender === "bot" && msg.loading));
      return [...filtered, userMsg];
    });
    setInput("");

    // Add a single 'Typing...' message
    setMessages((prev) => [...prev, { text: "Typing...", sender: "bot", time, loading: true }]);
    const persona = personalities[selectedPersona];
    const personaPrompt = persona.prompt(userName);
    const personaGreeting = persona.greeting(userName);

    const personaContext = {
      prompt: personaPrompt,
      greeting: personaGreeting,
      name: persona.name,
      key: selectedPersona,
      customPrompt: customPrompts[selectedPersona]
    };
    let chatContent = {
      user: trimmed,
      bot: null
    };

    try {
      const systemPrompt = {
        role: "system",
        content: personaPrompt,
      };
      // Build chat history for AI: system prompt + all user/bot messages
      const chatHistory = [systemPrompt];
      // Use the latest messages (excluding any loading/typing messages)
      messages
        .filter((msg) => !msg.loading)
        .forEach((msg) => {
          if (msg.sender === "user") {
            chatHistory.push({ role: "user", content: msg.text });
          } else if (msg.sender === "bot") {
            chatHistory.push({ role: "assistant", content: msg.text });
          }
        });
      // Add the new user message
      chatHistory.push({ role: "user", content: trimmed });

      if (!greeted && messages.length === 0) {
        // Remove the 'Typing...' message and show greeting only
        setMessages((prev) => {
          const filtered = prev.filter((msg) => !(msg.sender === "bot" && msg.loading));
          return [...filtered, { text: personaGreeting, sender: "bot", time, loading: false }];
        });
        speakText(personaGreeting);
        setGreeted(true);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();
      speakText(data.reply);

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 && msg.sender === "bot" && msg.loading
            ? { ...msg, text: data.reply, loading: false }
            : msg
        )
      );
    } catch (e) {
      console.error("AI Error:", e);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 && msg.sender === "bot" && msg.loading
            ? { ...msg, text: "⚠️ Something went wrong.", loading: false }
            : msg
        )
      );
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSendMessage();
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] flex bg-gradient-to-br from-mindmate-50 via-lavender-50 to-mindmate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300"
    >
      {/* Mobile Overlay - Click to close sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Professional Sidebar - Mobile & Desktop */}
      <motion.aside 
        initial={{ x: -120, opacity: 0 }}
        animate={{ 
          x: mobileMenuOpen || window.innerWidth >= 768 ? 0 : -320,
          opacity: 1 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`
          ${mobileMenuOpen ? 'fixed' : 'hidden md:flex'}
          w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl 
          border-r border-mindmate-200 dark:border-slate-800 
          shadow-soft-lg flex-col h-full min-h-screen z-50
        `}
      >
        {/* Professional Header */}
        <div className="p-4 sm:p-6 border-b border-mindmate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-mindmate-600 dark:text-white">
                The MindMates
              </h3>
              <p className="text-xs sm:text-sm text-mindmate-600 dark:text-slate-400 font-medium">
                Your Mental Health Companion
              </p>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 rounded-xl bg-mindmate-100 hover:bg-mindmate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-mindmate-700 dark:text-slate-300" />
            </button>
          </div>
          
          {/* Premium Badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-mindmate-100 to-lavender-100 dark:from-mindmate-900/30 dark:to-lavender-900/30 border border-mindmate-200 dark:border-mindmate-700">
            <Crown className="w-4 h-4 text-mindmate-600 dark:text-mindmate-400" />
            <span className="text-sm font-semibold text-mindmate-700 dark:text-mindmate-300">Premium Experience</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        {/* Enhanced Companion Selection */}
        <div className="flex-1 p-4 sm:p-6 space-y-3 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-mindmate-300 scrollbar-track-transparent">
          {Object.entries(personalities).map(([key, persona]) => {
            const IconComponent = persona.icon;
            return (
              <motion.button
                key={key}
                onClick={() => {
                  handlePersonaChange(key);
                  setMobileMenuOpen(false); // Close mobile menu after selection
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl font-medium transition-all duration-300 group relative overflow-hidden border shadow-sm ${
                  selectedPersona === key
                    ? `bg-gradient-to-r from-mindmate-500 to-mindmate-600 text-white shadow-purple border-transparent transform scale-[1.02]`
                    : `bg-white dark:bg-slate-800 hover:shadow-md border-mindmate-200 dark:border-slate-700 hover:border-mindmate-300`
                }`}
              >
                <div className="flex items-start gap-3 relative z-10">
                  <div className={`p-2.5 sm:p-3 rounded-2xl shadow-md ${
                    selectedPersona === key 
                      ? 'bg-white/20' 
                      : 'bg-mindmate-100 dark:bg-slate-700'
                  }`}>
                    <div className="text-xl sm:text-2xl">{persona.avatar}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className={`w-4 h-4 ${
                        selectedPersona === key ? 'text-white' : 'text-mindmate-600 dark:text-mindmate-400'
                      }`} />
                      <div className={`font-bold text-base sm:text-lg ${
                        selectedPersona === key ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {persona.name}
                      </div>
                    </div>
                    <div className={`text-xs font-semibold mb-1.5 ${
                      selectedPersona === key ? 'text-white/90' : `text-mindmate-600 dark:text-mindmate-400`
                    }`}>
                      {persona.specialty}
                    </div>
                    <div className={`text-xs sm:text-sm leading-relaxed ${
                      selectedPersona === key ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {persona.description}
                    </div>
                  </div>
                </div>

                {/* Professional Selection Indicator */}
                {selectedPersona === key && (
                  <motion.div
                    layoutId="selectedPersona"
                    className="absolute inset-0 bg-white/5 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Enhanced Professional Wallet Status */}
        <div className="p-4 sm:p-6 border-t border-mindmate-200 dark:border-slate-800 bg-mindmate-50/50 dark:bg-slate-800/50 flex-shrink-0">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Main Balance Card - Always Visible */}
            <div className={`p-4 sm:p-5 rounded-2xl shadow-sm border ${
              wallet < 5 
                ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 animate-pulse'
                : 'bg-white dark:bg-slate-900 border-mindmate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm ${
                    wallet < 5 
                      ? 'bg-orange-500'
                      : 'bg-gradient-to-br from-mindmate-500 to-mindmate-600'
                  }`}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Account Balance</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Your therapy credits</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {wallet < 5 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-orange-500 dark:text-orange-400"
                    >
                      ⚠️
                    </motion.div>
                  )}
                  <div className={`w-4 h-4 rounded-full ${
                    timerActive && !showTopup ? 'bg-green-500' : 'bg-orange-500'
                  } animate-pulse shadow-lg`}></div>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-3xl font-black ${
                  wallet < 5 
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}>₹{wallet.toFixed(2)}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">INR</span>
                {wallet < 5 && (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs text-orange-600 dark:text-orange-400 font-bold ml-2"
                  >
                    Low Balance
                  </motion.span>
                )}
              </div>
              
              <div className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full ${
                timerActive && !showTopup 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-300/50' 
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-300/50'
              }`}>
                {timerActive && !showTopup ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Session Active
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    Session Paused
                  </>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* Add Funds Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Try React Router navigation first, fallback to window.location
                  if (window.location.pathname.includes('/user')) {
                    window.location.href = '/user/topup';
                  } else {
                    window.location.href = '/topup';
                  }
                }}
                className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-mindmate-500 to-mindmate-600 hover:from-mindmate-600 hover:to-mindmate-700 text-white font-bold text-xs sm:text-sm shadow-purple hover:shadow-purple-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Add Funds</span>
                </div>
              </motion.button>

              {/* Session Info Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 sm:p-4 rounded-2xl bg-mindmate-100 dark:bg-slate-700 hover:bg-mindmate-200 dark:hover:bg-slate-600 text-mindmate-700 dark:text-slate-300 font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-mindmate-200 dark:bg-slate-600 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span>Settings</span>
                </div>
              </motion.button>
            </div>

            {/* Balance Info */}
            <div className="p-3 rounded-xl bg-mindmate-100/80 dark:bg-slate-800 border border-mindmate-200 dark:border-slate-700">
              <div className="text-xxs sm:text-xs text-mindmate-700 dark:text-slate-400 text-center">
                <span className="font-semibold">💡 Tip:</span> Sessions cost ₹1 per 2 minutes
                <br />
                <span className="opacity-75">Top up anytime to continue conversations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Professional Main Chat Area */}
      <div className="flex flex-col flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {/* Premium Header */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative bg-gradient-to-r from-mindmate-500 via-mindmate-600 to-mindmate-700 text-white shadow-soft-lg sticky top-0 z-30`}
        >
          {/* Professional Header Content */}
          <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-mindmate-400">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Brand Logo - Mobile */}
              <div className="flex md:hidden items-center">
                <div>
                  <h3 className="text-base font-extrabold">The MindMates</h3>
                  <p className="text-xs text-white/80">AI Companion</p>
                </div>
              </div>
              {/* Personality Info - Desktop */}
              <div className="hidden md:flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl lg:text-3xl shadow-lg">
                    {personalities[selectedPersona].avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-black tracking-tight mb-1">
                    {personalities[selectedPersona].name}
                  </h2>
                  <p className="text-white/90 text-xs lg:text-sm font-medium mb-1">
                    {personalities[selectedPersona].specialty}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 lg:w-3 h-2.5 lg:h-3 fill-yellow-300 text-yellow-300" />
                      ))}
                    </div>
                    <span className="text-xxs lg:text-xs text-white/80 font-semibold">Professional AI Therapist</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Wallet Balance - Mobile */}
              <div className="md:hidden px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-900">₹</span>
                  </div>
                  <span className="text-sm font-bold">{wallet.toFixed(2)}</span>
                </div>
              </div>

              {/* Professional Status Indicator - Hidden on small mobile */}
              <motion.div 
                animate={{ 
                  scale: timerActive && !showTopup ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`hidden sm:flex px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold border ${
                  timerActive && !showTopup 
                    ? "bg-green-500/20 text-green-100 border-green-400/30 shadow-sm" 
                    : "bg-orange-500/20 text-orange-100 border-orange-400/30 shadow-sm"
                }`}
              >
                {timerActive && !showTopup ? "🟢 Live" : "⏸️ Paused"}
              </motion.div>

              {/* Professional Voice Settings - Desktop only */}
              {ttsEnabled && (
                <select
                  value={selectedVoice}
                  onChange={(e) => {
                    setSelectedVoice(e.target.value);
                    localStorage.setItem("selected_voice", e.target.value);
                  }}
                  className="hidden lg:block text-sm bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {voicesRef.current
                    .filter((v) => v.lang.toLowerCase().includes("en"))
                    .map((voice, i) => (
                      <option key={i} value={voice.name} className="text-slate-800 bg-white">
                        {voice.name.split(' ')[0]}
                      </option>
                    ))}
                </select>
              )}

              {/* Professional Control Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTTS}
                  className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-sm active:scale-95"
                >
                  {ttsEnabled ? <Volume2 className="w-4 sm:w-5 h-4 sm:h-5" /> : <VolumeX className="w-4 sm:w-5 h-4 sm:h-5" />}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="hidden sm:flex p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-sm active:scale-95"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-red-500/30 transition-all duration-200 shadow-sm active:scale-95"
                >
                  <X className="w-4 sm:w-5 h-4 sm:h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Messages Area */}
        <div 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-mindmate-50/50 via-white to-lavender-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
        >
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8 sm:py-12 md:py-16 px-4"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-3xl bg-gradient-to-br from-mindmate-500 to-mindmate-600 flex items-center justify-center text-3xl sm:text-4xl shadow-purple-lg"
                >
                  {personalities[selectedPersona].avatar}
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3">
                  Welcome to {personalities[selectedPersona].name}'s Office
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
                  {personalities[selectedPersona].specialty}
                </p>
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-mindmate-100/80 dark:bg-mindmate-900/30 border border-mindmate-200 dark:border-mindmate-700">
                  <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-mindmate-600 dark:text-mindmate-400" />
                  <span className="text-xs sm:text-sm font-semibold text-mindmate-700 dark:text-mindmate-300">
                    Confidential & Professional Care
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`relative max-w-[75%] group ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                      {/* Professional AI Avatar */}
                      {msg.sender === "bot" && (
                        <motion.div 
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                          className="flex items-center gap-3 mb-3"
                        >
                          <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-lg shadow-sm border-2 border-white dark:border-slate-700">
                            {personalities[selectedPersona].avatar}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                              {personalities[selectedPersona].name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              AI Therapist • Online
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Professional Message Bubble */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`relative px-6 py-4 border shadow-sm ${
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white rounded-3xl rounded-br-lg ml-4 border-indigo-500"
                            : `bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-3xl rounded-bl-lg mr-4 border-slate-200 dark:border-slate-700`
                        }`}
                      >
                        {/* Message Content */}
                        <div className={`${
                          msg.sender === "bot" ? "text-slate-900 dark:text-white" : "text-white"
                        } leading-relaxed`}>
                          {msg.loading ? (
                            <div className="flex items-center gap-3">
                              <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                              <span className="text-sm opacity-70 font-medium">Analyzing your message...</span>
                            </div>
                          ) : (
                            <div className="font-medium">{msg.text}</div>
                          )}
                        </div>

                        {/* Professional Timestamp */}
                        <div className={`text-xs mt-3 font-semibold ${
                          msg.sender === "user" ? "text-white/70" : "text-slate-500 dark:text-slate-400"
                        }`}>
                          {msg.time}
                        </div>

                        {/* Professional Message Indicators */}
                        {msg.sender === "user" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Professional Input Area */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg"
        >
          {/* Professional Privacy Notice */}
          {showNotice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">
                    🛡️ Professional Privacy & Ethics Notice
                  </h4>
                  <div className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                    <p className="mb-2">
                      You're in a secure session with <strong>{personalities[selectedPersona].name}</strong>, an AI-powered mental health companion. 
                      This conversation is designed to provide supportive guidance and emotional wellness resources.
                    </p>
                    <p className="text-xs opacity-90">
                      <strong>Privacy:</strong> Please avoid sharing personal details, private information, or sensitive data. 
                      This AI assistant is here to support your emotional wellbeing in a professional, confidential manner.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Professional Input Interface */}
          <div className="relative">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                {/* Professional Input Field */}
                <div className="relative">
                  <input
                    className={`w-full px-8 py-5 rounded-3xl text-lg transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:scale-[1.02] border-2 font-medium placeholder:font-normal ${
                      darkMode 
                        ? "bg-slate-800 text-white border-slate-600 placeholder-slate-400 focus:bg-slate-800 focus:border-indigo-500" 
                        : "bg-white border-slate-200 placeholder-slate-500 focus:bg-white focus:border-indigo-500 shadow-sm"
                    }`}
                    placeholder={
                      timerActive && !showTopup 
                        ? `Share your thoughts with ${personalities[selectedPersona].name}... I'm here to listen and support you.` 
                        : "⏰ Session paused - Please recharge your account to continue our conversation"
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    disabled={!timerActive || showTopup}
                  />
                  
                  {/* Professional Input Indicators */}
                  {input && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute right-24 top-1/2 transform -translate-y-1/2"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                        <Smile className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Professional Character Counter */}
                {input && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-6 right-0 text-xs text-slate-500 dark:text-slate-400 font-medium"
                  >
                    {input.length} characters
                  </motion.div>
                )}
              </div>

              {/* Professional Action Buttons */}
              <div className="flex gap-3">
                {/* Voice Input Button */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceInput}
                  disabled={!timerActive || showTopup}
                  className={`p-5 rounded-2xl transition-all duration-500 shadow-sm border ${
                    listening 
                      ? "bg-red-500 text-white shadow-red-500/40 border-red-400 animate-pulse" 
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                  title={listening ? "Stop Recording" : "Voice Input"}
                >
                  <Mic className="w-6 h-6" />
                </motion.button>

                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!timerActive || showTopup || !input.trim()}
                  className="p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-95"
                  title="Send Message"
                >
                  <Send className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Premium Recharge Interface */}
          <AnimatePresence>
            {showTopup && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="mt-8"
              >
                {showContinuePrompt ? (
                  <div className="p-8 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-center shadow-sm">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl shadow-sm"
                    >
                      💰
                    </motion.div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-3">
                      Perfect! You have ₹{wallet.toFixed(2)} available
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
                      Continue your therapeutic session with <strong>{personalities[selectedPersona].name}</strong>
                      <br />
                      <span className="text-sm opacity-75">Professional mental health support at your fingertips</span>
                    </p>
                    <div className="flex gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm hover:shadow-md transition-all duration-300"
                        onClick={() => {
                          setShowTopup(false);
                          setTimerActive(true);
                          secondsRef.current = 120;
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          Continue Session
                        </div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 shadow-lg"
                        onClick={() => {
                          if (window.location.pathname.includes('/user')) {
                            window.location.href = '/user/topup';
                          } else {
                            window.location.href = '/topup';
                          }
                        }}
                      >
                        Add More Funds
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 text-center shadow-sm">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-rose-600 flex items-center justify-center text-3xl shadow-sm"
                    >
                      ⏰
                    </motion.div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-3">
                      Session Complete
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
                      Thank you for your session with <strong>{personalities[selectedPersona].name}</strong>
                      <br />
                      <span className="text-sm opacity-75">Continue your mental wellness journey by adding credits to your account</span>
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm hover:shadow-md transition-all duration-300"
                      onClick={() => {
                        if (window.location.pathname.includes('/user')) {
                          window.location.href = '/user/topup';
                        } else {
                          window.location.href = '/topup';
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5" />
                        Recharge Account
                      </div>
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Premium Professional Styles */}
      <style>{`
        .typing-dots {
          display: inline-flex;
          gap: 6px;
        }
        .typing-dots span {
          width: 10px;
          height: 10px;
          background: currentColor;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.6s infinite ease-in-out;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8) translateY(0);
          }
          40% {
            opacity: 1;
            transform: scale(1.2) translateY(-8px);
          }
        }
        
        /* Professional Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 12px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #4f46e5;
        }
        
        /* Premium Animation Classes */
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        /* Professional Backdrop Filters */
        .backdrop-blur-professional {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        
        /* Professional Glowing Effects */
        .glow-effect {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          transition: box-shadow 0.3s ease;
        }
        .glow-effect:hover {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </motion.div>
  );
};

export default FullChat;
