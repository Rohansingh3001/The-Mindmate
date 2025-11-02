import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import FullChat from "./FullChat";
import { useTheme } from "../context/ThemeContext";
import { storeTrainingData } from "../utils/trainingDataStorage";
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
  IoSparkles,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoInformationCircleOutline,
  IoChevronDown,
  IoChevronUp
} from "react-icons/io5";

const Chatbot = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [trainingConsent, setTrainingConsent] = useState(null); // Will be loaded per user
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showAnonymizationDetails, setShowAnonymizationDetails] = useState(false);
  const [showNoShareDetails, setShowNoShareDetails] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [wallet, setWallet] = useState(() => parseFloat(localStorage.getItem("wallet_balance") || "10"));
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isFullChat, setIsFullChat] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [iraGreeted, setIraGreeted] = useState(false);
  const [showFullChatTip, setShowFullChatTip] = useState(true);

  const chatContainerRef = useRef();
  const timerRef = useRef(null);

  // Derive darkMode from theme for compatibility
  const darkMode = theme === "dark";

  // Wallet management - sync with localStorage and custom events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "wallet_balance" || e.type === "walletUpdate") {
        const newBalance = parseFloat(localStorage.getItem("wallet_balance") || "10");
        setWallet(newBalance);
        if (newBalance <= 0) {
          setTimerActive(false);
          setShowTopup(true);
        }
      }
    };

    // Listen for storage events (from other tabs)
    window.addEventListener("storage", handleStorageChange);
    // Listen for custom wallet update events (same tab)
    window.addEventListener("walletUpdate", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("walletUpdate", handleStorageChange);
    };
  }, []);

  // Timer logic for wallet deduction
  useEffect(() => {
    if (timerActive && !showTopup && wallet > 0) {
      timerRef.current = setInterval(() => {
        setWallet((prev) => {
          const newBalance = Math.max(0, prev - 0.5); // ₹0.5 per minute
          localStorage.setItem("wallet_balance", newBalance.toString());
          // Dispatch custom event for same-tab sync
          window.dispatchEvent(new Event("walletUpdate"));
          
          if (newBalance <= 0) {
            setTimerActive(false);
            setShowTopup(true);
            toast.error(t('chat.toast.balanceDepleted'));
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
        setCurrentUserId(user.uid);
        
        // Load user-specific consent from localStorage
        const userConsentKey = `chat_training_consent_${user.uid}`;
        const saved = localStorage.getItem(userConsentKey);
        setTrainingConsent(saved !== null ? JSON.parse(saved) : null);
      } else {
        setCurrentUserId(null);
        setTrainingConsent(null);
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
      toast.error(t('chat.toast.insufficientBalance'));
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
      const botReply = data.reply;
      
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, text: botReply, loading: false } : msg
        )
      );
      
      // Store training data if user has consented (DPDP Act 2023 compliant)
      if (currentUserId && trainingConsent === true) {
        try {
          const currentLanguage = localStorage.getItem('language') || 'en';
          await storeTrainingData(
            trimmed,           // User's message
            botReply,          // AI's response
            currentUserId,     // User ID (for consent check only)
            currentLanguage,   // Language
            'ira'              // Persona
          );
        } catch (error) {
          // Silent fail - don't interrupt user experience
          console.error('[Training Data] Storage failed:', error);
        }
      }
      
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

  const handleOpenFullChat = () => {
    // Navigate to fullchat route
    navigate('/user/fullchat');
  };
  
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
    if (showFullChatTip) setShowFullChatTip(false);
  };

  // Handle chat toggle with consent check
  const handleChatToggle = () => {
    if (!currentUserId) {
      toast.error("Please log in to use the chat feature.");
      return;
    }
    
    if (!isOpen && trainingConsent === null) {
      // First time opening chat for this user, show consent modal
      setShowConsentModal(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Handle consent response
  const handleConsentResponse = (consent) => {
    if (!currentUserId) {
      toast.error("Please log in to save your preference.");
      return;
    }
    
    setTrainingConsent(consent);
    // Save consent with user-specific key
    const userConsentKey = `chat_training_consent_${currentUserId}`;
    localStorage.setItem(userConsentKey, JSON.stringify(consent));
    setShowConsentModal(false);
    setIsOpen(true);
    
    if (consent) {
      toast.success("Thank you for helping us improve! Your conversations will be stored anonymously.", {
        duration: 4000,
        icon: "🙏"
      });
    } else {
      toast.success("Your choice has been saved. You can change this anytime in Settings.", {
        duration: 4000,
        icon: "✅"
      });
    }
  };

  // Remove the fullchat overlay rendering since it now opens in a new route
  return (
    <>
      {/* Privacy Consent Modal */}
      <AnimatePresence>
        {showConsentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-[100] overflow-y-auto"
            onClick={() => setShowConsentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-xl w-full rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 my-4 sm:my-8 max-h-[95vh] overflow-y-auto ${
                darkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"
              }`}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: darkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <IoShieldCheckmarkOutline className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base sm:text-lg font-bold mb-1 leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                    Help Ira Learn & Improve
                  </h3>
                  <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Explicit Consent & Transparency
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${darkMode ? "bg-indigo-900/20 border-indigo-700/30" : "bg-indigo-50 border-indigo-200"}`}>
                  <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                    To help <strong>Ira</strong> learn and improve, we store <strong>both your messages and Ira's replies</strong> anonymously for <strong>AI model training</strong>.
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed mt-2 sm:mt-3 font-semibold ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                    We <u>never</u> save your name, email, phone number, or any personal identifiers.
                  </p>
                </div>

                {/* What We Store */}
                <div className={`p-2.5 sm:p-3 rounded-lg ${darkMode ? "bg-slate-800/50 border border-slate-700" : "bg-slate-50 border border-slate-200"}`}>
                  <p className={`text-xs font-semibold mb-1.5 sm:mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    📝 What Gets Stored:
                  </p>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className={`text-[11px] sm:text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      ✓ Your message (anonymized): "I'm feeling anxious about exams"
                    </p>
                    <p className={`text-[11px] sm:text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      ✓ Ira's reply (anonymized): "That's completely normal..."
                    </p>
                    <p className={`text-[11px] sm:text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      ✓ Conversation context to improve responses
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <IoLockClosedOutline className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                        Complete Anonymity
                      </p>
                      <p className={`text-[11px] sm:text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        All personal information is removed from both your messages and Ira's replies before storage.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <IoShieldCheckmarkOutline className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                        Encrypted Storage
                      </p>
                      <p className={`text-[11px] sm:text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        Both messages and replies are encrypted and stored securely on our servers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <IoInformationCircleOutline className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                        Used Only for Training
                      </p>
                      <p className={`text-[11px] sm:text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        Complete conversations help improve Ira's understanding and response quality for everyone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Anonymous Storage Example */}
                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${darkMode ? "bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-700/30" : "bg-gradient-to-br from-green-50 to-blue-50 border-green-200"}`}>
                  <button
                    onClick={() => setShowAnonymizationDetails(!showAnonymizationDetails)}
                    className="w-full flex items-center justify-between gap-2 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔐</span>
                      <p className={`text-sm font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                        How We Anonymize Your Chats
                      </p>
                    </div>
                    {showAnonymizationDetails ? (
                      <IoChevronUp className={`w-5 h-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                    ) : (
                      <IoChevronDown className={`w-5 h-5 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showAnonymizationDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mt-2">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-slate-800/50" : "bg-white/70"}`}>
                            <p className={`text-xs font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                              ❌ <strong>What We Remove (from both your messages and Ira's replies):</strong>
                            </p>
                            <ul className={`text-xs space-y-0.5 ml-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                              <li>• Your name, email, phone number</li>
                              <li>• Location data and IP addresses</li>
                              <li>• Device identifiers and metadata</li>
                              <li>• Timestamps and session IDs</li>
                              <li>• Any personally identifiable information</li>
                            </ul>
                          </div>

                          <div className={`p-2 rounded-lg ${darkMode ? "bg-slate-800/50" : "bg-white/70"}`}>
                            <p className={`text-xs font-medium mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                              ✅ <strong>What We Keep (from complete conversations):</strong>
                            </p>
                            <ul className={`text-xs space-y-0.5 ml-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                              <li>• Your anonymized messages</li>
                              <li>• Ira's anonymized replies</li>
                              <li>• Conversation flow patterns</li>
                              <li>• Emotional context and sentiment</li>
                              <li>• Response quality metrics</li>
                            </ul>
                          </div>

                          <div className={`p-2 rounded-lg border ${darkMode ? "bg-blue-900/20 border-blue-700/30" : "bg-blue-50 border-blue-200"}`}>
                            <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                              📝 Example of Complete Conversation Storage:
                            </p>
                            <div className="space-y-2">
                              <div>
                                <p className={`text-xs font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                                  <strong>Your original message:</strong>
                                </p>
                                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                                  "Hi, I'm Rohan from Delhi, feeling anxious about my exam tomorrow"
                                </p>
                              </div>
                              
                              <div>
                                <p className={`text-xs font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                                  <strong>Stored anonymously as:</strong>
                                </p>
                                <p className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"}`}>
                                  "Hi, I'm &lt;USER&gt; from &lt;CITY&gt;, feeling anxious about my exam tomorrow"
                                </p>
                              </div>
                              
                              <div>
                                <p className={`text-xs font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                                  <strong>Ira's reply (also stored anonymously):</strong>
                                </p>
                                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                                  "Hi &lt;USER&gt;! Exam anxiety is completely normal. Let's work through this..."
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* What Happens If You Don't Allow */}
                <div className={`p-4 rounded-xl border-2 ${darkMode ? "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/30" : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"}`}>
                  <button
                    onClick={() => setShowNoShareDetails(!showNoShareDetails)}
                    className="w-full flex items-center justify-between gap-2 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤝</span>
                      <p className={`text-sm font-bold ${darkMode ? "text-purple-300" : "text-purple-700"}`}>
                        If You Choose "Don't Share"
                      </p>
                    </div>
                    {showNoShareDetails ? (
                      <IoChevronUp className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                    ) : (
                      <IoChevronDown className={`w-5 h-5 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showNoShareDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 mt-2">
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-0.5">✓</span>
                            <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              <strong>Full functionality:</strong> All AI companions work perfectly
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-0.5">✓</span>
                            <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              <strong>Complete privacy:</strong> Chats stay only on your device
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 text-sm mt-0.5">✓</span>
                            <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              <strong>No disadvantages:</strong> Same quality service guaranteed
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-blue-500 text-sm mt-0.5">ℹ️</span>
                            <p className={`text-xs ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              <strong>You help us:</strong> By sharing, you improve AI for everyone
                            </p>
                          </div>

                          <div className={`mt-3 p-2 rounded-lg ${darkMode ? "bg-slate-800/50" : "bg-white/70"}`}>
                            <p className={`text-xs italic ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                              💡 Your choice is respected. You can change it anytime in Settings without any impact on your experience.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Terms Link */}
                <div className={`p-3 rounded-lg ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-50 border border-slate-200"}`}>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Learn more about how we handle your data:{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>
                    {" "}and{" "}
                    <a
                      href="/terms-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Terms & Conditions
                    </a>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => handleConsentResponse(false)}
                  className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl text-sm font-semibold transition-all ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300"
                  }`}
                >
                  🚫 Opt Out
                </button>
                <button
                  onClick={() => handleConsentResponse(true)}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  ✅ Agree & Help Improve
                </button>
              </div>

              {/* Footer Note */}
              <p className={`text-[10px] sm:text-xs text-center mt-3 sm:mt-4 ${darkMode ? "text-slate-500" : "text-slate-500"}`}>
                ✅ <strong>DPDP Act 2023 Compliant</strong> • You can change your preference anytime in Settings
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <button
        onClick={handleChatToggle}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-500"
      >
        {isOpen ? (
          <IoClose className="w-6 h-6 sm:w-7 sm:h-7" />
        ) : (
          <IoChatbubbleEllipses className="w-6 h-6 sm:w-7 sm:h-7" />
        )}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className={`fixed inset-x-4 bottom-16 sm:bottom-20 sm:right-6 sm:left-auto sm:w-[380px] z-50 max-h-[calc(100vh-5rem)] sm:max-h-[520px] flex flex-col shadow-xl rounded-2xl overflow-hidden border ${darkMode ? "bg-slate-900 text-white border-slate-700" : "bg-white text-slate-900 border-slate-200"}`}>
          {/* Header */}
          <div className={`p-3 sm:p-4 font-semibold flex justify-between items-center rounded-t-2xl border-b ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <IoChatbubbleEllipses className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <span className={`font-bold text-base sm:text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>{t('chat.assistant')}</span>
                <div className={`text-xs hidden sm:block ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{t('chat.support')}</div>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 items-center">
              <button 
                onClick={toggleTheme} 
                title={t('chat.toggleTheme')}
                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 shadow-sm ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                {darkMode ? (
                  <IoSunny className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <IoMoon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <button 
                onClick={handleOpenFullChat} 
                title={t('chat.fullScreen')}
                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 shadow-sm ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                <IoExpand className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={handleCloseWidget} 
                title={t('chat.closeChat')}
                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 shadow-sm ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                <IoClose className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className={`px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between text-xs sm:text-sm border-b ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className={`flex items-center gap-1 sm:gap-2 font-semibold px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm border ${timerActive && !showTopup 
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700" 
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"}`}>
              {timerActive && !showTopup ? (
                <IoCheckmarkCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <IoCloseCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="text-xs font-bold">
                {timerActive && !showTopup ? t('chat.active') : t('chat.paused')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 sm:gap-2 font-bold px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm cursor-pointer hover:scale-105 transition-transform border ${
                wallet <= 5 
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700 animate-pulse" 
                  : darkMode 
                    ? "bg-indigo-900/30 text-indigo-300 border-indigo-700" 
                    : "bg-indigo-100 text-indigo-700 border-indigo-200"
              }`} onClick={wallet <= 5 ? handleTopup : undefined}>
                <IoWallet className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">₹{wallet.toFixed(2)}</span>
                {wallet <= 5 && <IoSparkles className="w-3 h-3 animate-bounce" />}
              </div>
              
              {wallet <= 5 && (
                <button
                  onClick={handleTopup}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-lg text-xs font-bold hover:scale-105 transition-transform shadow-sm"
                >
                  {t('chat.topUp')}
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className={`flex-grow overflow-y-auto p-2.5 sm:p-3 lg:p-4 space-y-2.5 sm:space-y-3 lg:space-y-4 scrollbar-thin ${darkMode
              ? "bg-slate-900 text-white scrollbar-thumb-slate-600"
              : "bg-slate-50 text-slate-900 scrollbar-thumb-slate-400"
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
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold text-white mr-2 sm:mr-3 flex-shrink-0">
                        🤖
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-xl text-sm sm:text-sm shadow-sm relative border ${isUser
                        ? "bg-indigo-600 text-white rounded-br-none border-indigo-500"
                        : darkMode
                          ? "bg-slate-800 text-white border-slate-700 rounded-bl-none"
                          : "bg-white text-slate-900 border-slate-200 rounded-bl-none"
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
                        <span className={`absolute -top-3.5 sm:-top-4 left-1.5 sm:left-2 text-[9px] sm:text-[10px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>MindMates AI</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className={`p-2.5 sm:p-3 border-t flex flex-col gap-2 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
            {wallet <= 5 && (
              <div className="mb-1 text-[10px] sm:text-[11px] text-center px-2 py-1 rounded-lg font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 border border-orange-200 dark:border-orange-700 animate-pulse shadow-sm">
                ⚠️ Low Balance: ₹{wallet.toFixed(2)} remaining. <button onClick={handleTopup} className="underline font-bold hover:text-orange-900 dark:hover:text-orange-100">Top up now!</button>
              </div>
            )}
            {showFullChatTip && (
              <div className={`mb-1 text-[10px] sm:text-[11px] text-center px-2 py-1 rounded-lg font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700 shadow-sm`}>
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
                className={`flex-grow p-2 sm:p-2.5 rounded-lg border text-sm shadow-sm ${
                  wallet <= 0 
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 cursor-not-allowed"
                    : darkMode
                      ? "bg-slate-800 text-white border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                      : "bg-white text-slate-900 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                  } focus:outline-none focus:ring-2`}
              />
              <button
                onClick={handleSendMessage}
                disabled={wallet <= 0}
                className={`p-2 sm:p-2.5 rounded-lg flex-shrink-0 transition-colors shadow-sm ${
                  wallet <= 0
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
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