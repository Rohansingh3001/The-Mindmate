import React, { useEffect, useRef, useState } from "react";
import { Send, X, Sun, Moon, Mic, Volume2, VolumeX, Sparkles, Heart, Shield, Star, Zap, Crown, Menu, Wallet } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

// AI Companions
const personalities = {
  ira: {
    name: "Ira",
    avatar: "🌸",
    icon: Crown,
    color: "from-rose-400 to-purple-500",
    specialty: "Emotional Wellness Expert",
    description: "Compassionate guidance with gentle wisdom",
    prompt: (userName) => `You are Ira — a gentle, caring mental health friend for ${userName}. Keep messages short, friendly, and real. No asterisks. Use emojis naturally.`,
    greeting: (userName) => `Hi ${userName} 🌸 I'm Ira — here to listen. What's on your mind? 💛`
  },
  ayaan: {
    name: "Ayaan",
    avatar: "💪",
    icon: Shield,
    color: "from-blue-500 to-purple-600",
    specialty: "Resilience & Strength Coach",
    description: "Building confidence with supportive guidance",
    prompt: (userName) => `You are Ayaan — the chill big-brother type for ${userName}. Talk like a real, honest sibling. Only emotional and mental health topics.`,
    greeting: (userName) => `Yo ${userName} 👋 I'm Ayaan. Got your back — let's talk 💪`
  },
  meera: {
    name: "Meera",
    avatar: "💕",
    icon: Heart,
    color: "from-purple-500 to-rose-500",
    specialty: "Empathetic Connection Specialist",
    description: "Deep understanding with heartfelt support",
    prompt: (userName) => `You are Meera — the best friend who gets feelings for ${userName}. Be honest, gentle, and sparkly.`,
    greeting: (userName) => `Hey bestie 💕 I'm Meera. Open heart, open ears — what's up? 🫂`
  },
  kabir: {
    name: "Kabir",
    avatar: "🧘‍♂️",
    icon: Zap,
    color: "from-emerald-500 to-cyan-600",
    specialty: "Mindfulness & Inner Peace Guide",
    description: "Centering wisdom for mental clarity",
    prompt: (userName) => `You are Kabir — monk-like, deeply calm. Help ${userName} find inner peace and balance.`,
    greeting: (userName) => `Namaste ${userName} 🙏 I'm Kabir. Let's talk about your inner world 🌿`
  },
  tara: {
    name: "Tara",
    avatar: "🌈",
    icon: Star,
    color: "from-amber-400 to-yellow-500",
    specialty: "Positivity & Joy Catalyst",
    description: "Uplifting energy with radiant optimism",
    prompt: (userName) => `You are Tara — cheerful bestie for ${userName}. Full of hype and sunshine. Be bubbly and sweet!`,
    greeting: (userName) => `Hey hey ${userName} 💫 I'm Tara! How are you, really? 🌈`
  },
};

const FullChat = ({ messages, setMessages, onClose }) => {
  // State Management
  const [wallet, setWallet] = useState(() => parseFloat(localStorage.getItem("wallet_balance") || "0"));
  const [timerActive, setTimerActive] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("User");
  const [selectedPersona, setSelectedPersona] = useState(() => localStorage.getItem("selected_persona") || "ira");
  const [ttsEnabled, setTtsEnabled] = useState(() => localStorage.getItem("tts_enabled") === "true");
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem("selected_voice") || "");
  const [listening, setListening] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Free trial state (5 minutes = 300 seconds)
  const [freeTrialSeconds, setFreeTrialSeconds] = useState(() => {
    const saved = localStorage.getItem("free_trial_seconds");
    return saved !== null ? parseInt(saved) : 300;
  });
  const [isFreeTrialActive, setIsFreeTrialActive] = useState(() => {
    const saved = localStorage.getItem("free_trial_seconds");
    return saved === null || parseInt(saved) > 0;
  });
  const [timeLeft, setTimeLeft] = useState(120); // Display timer for current session
  const [totalSessionTime, setTotalSessionTime] = useState(0); // Total session time in seconds
  
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";
  
  // Refs
  const chatContainerRef = useRef();
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);
  const secondsRef = useRef(120);

  // Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserName(user.displayName || "User");
    });
    return () => unsubscribe();
  }, []);

  // Wallet Sync
  useEffect(() => {
    const handleWalletUpdate = () => {
      const newBalance = parseFloat(localStorage.getItem("wallet_balance") || "0");
      setWallet(newBalance);
      if (newBalance <= 0) {
        setTimerActive(false);
        setShowTopup(true);
      }
    };
    window.addEventListener("storage", handleWalletUpdate);
    window.addEventListener("walletUpdate", handleWalletUpdate);
    return () => {
      window.removeEventListener("storage", handleWalletUpdate);
      window.removeEventListener("walletUpdate", handleWalletUpdate);
    };
  }, []);

  // Timer for free trial and wallet deduction
  useEffect(() => {
    if (!timerActive || showTopup) return;
    
    const interval = setInterval(() => {
      // Increment total session time
      setTotalSessionTime(prev => prev + 1);
      
      // Update display timer
      setTimeLeft(prev => {
        if (prev <= 1) return 120;
        return prev - 1;
      });
      
      secondsRef.current--;
      
      if (secondsRef.current <= 0) {
        // Check if free trial is active
        if (isFreeTrialActive && freeTrialSeconds > 0) {
          const newTrialSeconds = freeTrialSeconds - 1;
          setFreeTrialSeconds(newTrialSeconds);
          localStorage.setItem("free_trial_seconds", newTrialSeconds.toString());
          
          if (newTrialSeconds <= 0) {
            setIsFreeTrialActive(false);
            // Check if wallet has balance
            if (wallet < 1) {
              setTimerActive(false);
              setShowTopup(true);
            }
          }
          secondsRef.current = 1; // Continue counting
        } else if (wallet >= 1) {
          // Deduct from wallet
          const current = parseFloat(localStorage.getItem("wallet_balance") || "0");
          if (current >= 1) {
            const newBal = (current - 1).toFixed(2);
            localStorage.setItem("wallet_balance", newBal);
            setWallet(parseFloat(newBal));
            window.dispatchEvent(new Event("walletUpdate"));
            secondsRef.current = 120;
            setTimeLeft(120);
          } else {
            setTimerActive(false);
            setShowTopup(true);
          }
        } else {
          setTimerActive(false);
          setShowTopup(true);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerActive, showTopup, wallet, isFreeTrialActive, freeTrialSeconds]);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Speech Recognition Setup
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.lang = "en-IN";
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (e) => setInput(e.results[0][0].transcript);
      recognitionRef.current.onend = () => setListening(false);
    }

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
      if (!selectedVoice && voicesRef.current.length > 0) {
        const defaultVoice = voicesRef.current.find(v => v.lang.includes("en"));
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
          localStorage.setItem("selected_voice", defaultVoice.name);
        }
      }
    };
    
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, [selectedVoice]);

  // Text-to-Speech
  const speakText = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    const voice = voicesRef.current.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    window.speechSynthesis.speak(utterance);
  };

  // Send Message
  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { text: trimmed, sender: "user", time };
    
    setMessages((prev) => [...prev.filter(m => !m.loading), userMsg]);
    setInput("");
    setMessages((prev) => [...prev, { text: "Typing...", sender: "bot", time, loading: true }]);

    const persona = personalities[selectedPersona];

    if (!greeted && messages.length === 0) {
      setTimeout(() => {
        setMessages((prev) => [...prev.filter(m => !m.loading), { text: persona.greeting(userName), sender: "bot", time }]);
        speakText(persona.greeting(userName));
        setGreeted(true);
      }, 800);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: persona.prompt(userName) },
            ...messages.filter(m => !m.loading).map(m => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text
            })),
            { role: "user", content: trimmed }
          ]
        }),
      });

      const data = await response.json();
      setMessages((prev) => prev.map((m, i) => 
        i === prev.length - 1 && m.loading ? { ...m, text: data.reply, loading: false } : m
      ));
      speakText(data.reply);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => prev.map((m, i) => 
        i === prev.length - 1 && m.loading ? { ...m, text: "⚠️ Something went wrong.", loading: false } : m
      ));
    }
  };

  const handlePersonaChange = (key) => {
    setSelectedPersona(key);
    localStorage.setItem("selected_persona", key);
    setMessages([]);
    setGreeted(false);
    setMobileMenuOpen(false);
  };

  const toggleTTS = () => {
    const next = !ttsEnabled;
    setTtsEnabled(next);
    localStorage.setItem("tts_enabled", next.toString());
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setListening(!listening);
  };

  const currentPersona = personalities[selectedPersona];

  return (
    <div className="fixed inset-0 z-[9999] flex bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-950">
      {/* Mobile Overlay */}
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

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: mobileMenuOpen || window.innerWidth >= 768 ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`${mobileMenuOpen ? 'fixed' : 'hidden md:flex'} w-full max-w-sm md:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col h-full z-50 shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">The MindMates</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">AI Companions</p>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="md:hidden p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-lg active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 p-2.5 md:p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs md:text-sm font-semibold text-purple-700 dark:text-purple-300">Premium Experience</span>
          </div>
        </div>

        {/* Personality Cards */}
        <div className="flex-1 p-3 md:p-4 space-y-2 md:space-y-3 overflow-y-auto overscroll-contain">
          {Object.entries(personalities).map(([key, persona]) => {
            const IconComponent = persona.icon;
            const isActive = selectedPersona === key;
            return (
              <motion.button
                key={key}
                onClick={() => handlePersonaChange(key)}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-3 md:p-4 rounded-xl transition-all active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700'
                }`}
              >
                <div className="flex items-start gap-2.5 md:gap-3">
                  <div className={`p-1.5 md:p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white dark:bg-gray-700'} shadow-sm`}>
                    <span className="text-xl md:text-2xl">{persona.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                      <IconComponent className={`w-3.5 md:w-4 h-3.5 md:h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
                      <span className={`font-bold text-sm md:text-base ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{persona.name}</span>
                    </div>
                    <p className={`text-xs leading-tight ${isActive ? 'text-white/90' : 'text-purple-600 dark:text-purple-400'}`}>{persona.specialty}</p>
                    <p className={`text-xs mt-1 leading-tight line-clamp-2 ${isActive ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>{persona.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Wallet Section */}
        <div className="p-3 md:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pb-safe">
          {/* Free Trial Banner */}
          {isFreeTrialActive && freeTrialSeconds > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-sm">Free Trial Active!</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
              <div className="text-2xl font-black mb-1">
                {Math.floor(freeTrialSeconds / 60)}:{(freeTrialSeconds % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-xs text-white/90">Free minutes remaining</p>
            </div>
          )}
          
          <div className={`p-4 rounded-xl ${wallet < 5 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-white dark:bg-gray-900'} border ${wallet < 5 ? 'border-orange-200 dark:border-orange-700' : 'border-gray-200 dark:border-gray-700'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${wallet < 5 ? 'bg-orange-500' : 'bg-gradient-to-br from-purple-600 to-blue-600'}`}>
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 block">Balance</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Therapy credits</span>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${timerActive ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-3">₹{wallet.toFixed(2)}</div>
            
            {/* Total Session Timer */}
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total Session Time</span>
                <div className={`w-2 h-2 rounded-full ${timerActive ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
              </div>
              <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {Math.floor(totalSessionTime / 60)}:{(totalSessionTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isFreeTrialActive ? `Free Trial: ${Math.floor(freeTrialSeconds / 60)}:${(freeTrialSeconds % 60).toString().padStart(2, '0')} left` : 'Paid Session'}
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/user/topup'}
              className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Wallet className="w-4 h-4" />
              Recharge Now
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">{currentPersona.avatar}</div>
              <div>
                <h2 className="text-xl font-bold">{currentPersona.name}</h2>
                <p className="text-sm text-white/90">{currentPersona.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Total Session Timer Display */}
              <div className="flex flex-col items-end gap-1 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${timerActive ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
                  <span className="text-sm font-bold">
                    {Math.floor(totalSessionTime / 60)}:{(totalSessionTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] text-white/70 font-semibold">
                  {isFreeTrialActive ? `Free Trial (${Math.floor(freeTrialSeconds / 60)}m left)` : 'Paid Session'}
                </span>
              </div>
              
              {/* Balance Display */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-bold">₹{wallet.toFixed(2)}</span>
              </div>
              
              <button onClick={toggleTTS} className="p-2 hover:bg-white/20 rounded-lg">
                {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button onClick={toggleTheme} className="p-2 hover:bg-white/20 rounded-lg">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={onClose} className="p-2 hover:bg-red-500/30 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Top Row: Menu, Title, Actions */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-white/20 rounded-lg active:scale-95">
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">{currentPersona.avatar}</div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">{currentPersona.name}</h3>
                    <p className="text-xs text-white/80 leading-tight">AI Companion</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={toggleTTS} className="p-2 hover:bg-white/20 rounded-lg active:scale-95">
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button onClick={onClose} className="p-2 hover:bg-red-500/30 rounded-lg active:scale-95">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Row: Timer, Balance, Recharge */}
            <div className="flex items-center justify-between p-2 px-3 gap-2">
              {/* Total Session Timer */}
              <div className="flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg bg-white/20 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${timerActive ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`} />
                  <span className="text-xs font-bold">
                    {Math.floor(totalSessionTime / 60)}:{(totalSessionTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[9px] text-white/70 font-medium">
                  {isFreeTrialActive ? `Free (${Math.floor(freeTrialSeconds / 60)}m)` : 'Paid'}
                </span>
              </div>

              {/* Balance */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/20 border border-white/20">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">₹{wallet.toFixed(2)}</span>
              </div>
              
              {/* Recharge Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/user/topup'}
                className="flex-1 max-w-[100px] px-3 py-1.5 rounded-lg bg-yellow-400 active:bg-yellow-500 text-yellow-900 font-bold text-xs flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Top Up
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50 dark:bg-gray-900 pb-safe">
          {messages.length === 0 ? (
            <div className="text-center py-8 md:py-16 px-4">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                {currentPersona.avatar}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to {currentPersona.name}'s Space</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">{currentPersona.specialty}</p>
              {isFreeTrialActive && freeTrialSeconds > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold">🎉 Free Trial: {Math.floor(freeTrialSeconds / 60)} min left!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                    {msg.sender === "bot" && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-600 flex items-center justify-center text-sm">
                          {currentPersona.avatar}
                        </div>
                        <span className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{currentPersona.name}</span>
                      </div>
                    )}
                    <div className={`px-3 py-2.5 md:px-4 md:py-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm shadow-lg"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-md"
                    }`}>
                      {msg.loading ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-xs md:text-sm opacity-70">Typing...</span>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      )}
                      <span className={`text-xs mt-2 block ${msg.sender === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe">
          {showTopup ? (
            <div className="max-w-2xl mx-auto text-center p-4 md:p-8 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl md:rounded-2xl border-2 border-orange-200 dark:border-orange-700">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">⏰</div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isFreeTrialActive && freeTrialSeconds <= 0 ? "Free Trial Expired" : "Session Complete"}
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-1 md:mb-2">
                {isFreeTrialActive && freeTrialSeconds <= 0 
                  ? "Your 5-minute free trial has ended" 
                  : "Add funds to continue your conversation"}
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mb-4 md:mb-6">
                Recharge your account to keep talking with {currentPersona.name}
              </p>
              <div className="flex flex-col gap-2 md:gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/user/topup'}
                  className="w-full px-6 md:px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 active:from-purple-700 active:to-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Wallet className="w-4 md:w-5 h-4 md:h-5" />
                  <span className="text-sm md:text-base">Recharge Now</span>
                </motion.button>
                {wallet >= 1 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowTopup(false);
                      setTimerActive(true);
                      secondsRef.current = 120;
                      setTimeLeft(120);
                    }}
                    className="w-full px-6 md:px-8 py-3 rounded-xl bg-green-600 active:bg-green-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 md:w-5 h-4 md:h-5" />
                    <span className="text-sm md:text-base">Continue (₹{wallet.toFixed(2)} available)</span>
                  </motion.button>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex gap-2 md:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Message ${currentPersona.name}...`}
                disabled={!timerActive}
                className="flex-1 px-3 py-2.5 md:px-4 md:py-3 text-sm md:text-base rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <button
                onClick={handleVoiceInput}
                disabled={!timerActive}
                className={`p-2.5 md:p-3 rounded-xl transition-all active:scale-95 ${listening ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!timerActive || !input.trim()}
                className="p-2.5 md:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullChat;
