// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRegSmile,
  FaHeart,
  FaBrain,
  FaLeaf,
  FaStar,
  FaGem,
  FaFire,
  FaShieldAlt,
} from "react-icons/fa";
import {
  IoMdCalendar,
  IoIosStats,
  IoIosPeople,
  IoIosSettings,
  IoIosGlobe,
  IoIosFitness,
  IoIosPaper,
  IoIosFlash,
  IoIosRocket,
  IoIosTrophy,
} from "react-icons/io";
import {
  BarChart2,
  CalendarDays,
  Clock,
  MapPin,
  UserCircle2,
  Sun,
  Moon,
  Sparkles,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Award,
  Shield,
  Heart,
  Brain,
  Activity,
  Users,
  BookOpen,
  Settings,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import AssessmentForm from "../components/AssessmentForm";
import Chatbot from "../components/ChatBot";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import STORAGE_KEYS, { getFromStorage } from "../utils/storage";
import { getJournals } from "../utils/journalStorage";
import { useTheme } from "../context/ThemeContext";

// Gamified Components
import GamifiedDashboard from "./GamifiedDashboard";

const greetings = ["Hey there", "Welcome back", "Namaste", "Great to see you", "Peace & wellness"];

const moodEmojis = [
  { emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-500", glow: "shadow-yellow-500/30" },
  { emoji: "😐", label: "Neutral", color: "from-gray-400 to-slate-500", glow: "shadow-gray-500/30" },
  { emoji: "😢", label: "Sad", color: "from-blue-400 to-indigo-500", glow: "shadow-blue-500/30" },
  { emoji: "😠", label: "Angry", color: "from-red-400 to-pink-500", glow: "shadow-red-500/30" },
  { emoji: "😴", label: "Tired", color: "from-purple-400 to-violet-500", glow: "shadow-purple-500/30" },
];

const achievements = [
  { icon: FaFire, title: "Streak Master", desc: "7-day mood tracking", unlocked: false },
  { icon: FaBrain, title: "Mindful Soul", desc: "Complete 10 exercises", unlocked: false },
  { icon: FaHeart, title: "Self-Care Champion", desc: "30 journal entries", unlocked: false },
  { icon: FaGem, title: "Wellness Warrior", desc: "Complete assessment", unlocked: false },
];


export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { darkMode, toggleTheme } = useTheme();
  const [greeting, setGreeting] = useState(greetings[0]);
  const [quote, setQuote] = useState("");
  const [mood, setMood] = useState(() => getFromStorage(STORAGE_KEYS.MOOD, ""));
  const [nextAppointment, setNextAppointment] = useState(null);
  const [stats, setStats] = useState({ moodLogs: 0, journals: 0, sessions: 0 });
  const [user, setUser] = useState(null);
  const [showIraBubble, setShowIraBubble] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(-1);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [showAchievements, setShowAchievements] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [showGamifiedFeatures, setShowGamifiedFeatures] = useState(false);
  const [levelProgress, setLevelProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showXPInfo, setShowXPInfo] = useState(false);

  // Initialize level tracking on component mount
  useEffect(() => {
    const savedLevel = localStorage.getItem("mindmates.userLevel");
    if (!savedLevel) {
      // First time user - set initial level
      localStorage.setItem("mindmates.userLevel", "1");
    }
  }, []);

  // Calculate dynamic wellness score based on multiple factors
  const calculateWellnessScore = () => {
    const moodLogs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const journals = getJournals();
    
    let score = 50; // Base score
    
    // Recent mood analysis (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMoods = moodLogs.filter(log => new Date(log.timestamp) > sevenDaysAgo);
    
    if (recentMoods.length > 0) {
      // Calculate average mood score (Happy=100, Neutral=70, Tired=60, Sad=40, Angry=30)
      const moodScores = {
        "😊": 100, "😐": 70, "😴": 60, "😢": 40, "😠": 30
      };
      
      const avgMoodScore = recentMoods.reduce((sum, log) => {
        return sum + (moodScores[log.mood] || 50);
      }, 0) / recentMoods.length;
      
      score = Math.round(avgMoodScore * 0.6); // 60% weight for mood
    }
    
    // Consistency bonus (logging regularly)
    if (recentMoods.length >= 5) score += 10;
    if (recentMoods.length >= 7) score += 10;
    
    // Journal activity bonus
    const recentJournals = journals.filter(journal => {
      if (!journal.date) return false;
      const journalDate = new Date(journal.date);
      return journalDate > sevenDaysAgo;
    });
    
    if (recentJournals.length > 0) score += 15;
    if (recentJournals.length >= 3) score += 10;
    
    // Appointment engagement bonus
    if (stats.sessions > 0) score += 15;
    
    // Assessment completion bonus
    if (assessmentCompleted) score += 20;
    
    // Cap the score between 0 and 100
    return Math.min(100, Math.max(0, score));
  };

  // Calculate user level based on activities
  const calculateUserLevel = () => {
    const moodLogs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const journals = getJournals();
    
    let totalPoints = 0;
    
    // Points for mood logging (5 points each)
    totalPoints += moodLogs.length * 5;
    
    // Points for journal entries (10 points each)
    totalPoints += journals.length * 10;
    
    // Points for sessions (25 points each)
    totalPoints += stats.sessions * 25;
    
    // Points for assessment completion (100 points)
    if (assessmentCompleted) totalPoints += 100;
    
    // Level calculation: every 100 points = 1 level
    const level = Math.floor(totalPoints / 100) + 1;
    const progress = (totalPoints % 100); // Progress towards next level
    
    return { level, progress, totalPoints };
  };

  // Centralized level check function
  const checkForLevelUp = (newLevel) => {
    const savedLevel = parseInt(localStorage.getItem("mindmates.userLevel") || "1");
    const levelUpKey = `mindmates.levelUp.${newLevel}`;
    const hasShownThisLevel = localStorage.getItem(levelUpKey) === "true";
    
    // Only show level up if:
    // 1. New level is higher than saved level
    // 2. Haven't shown popup for this specific level yet
    // 3. Not currently showing level up popup
    if (newLevel > savedLevel && !hasShownThisLevel && !showLevelUp) {
      setShowLevelUp(true);
      
      // Mark this level as shown
      localStorage.setItem(levelUpKey, "true");
      localStorage.setItem("mindmates.userLevel", newLevel.toString());
      
      // Auto-hide the level up popup after 5 seconds
      setTimeout(() => {
        setShowLevelUp(false);
      }, 5000);
      
      toast.success(`🎉 Level Up! You're now Level ${newLevel}!`, {
        duration: 5000,
        style: { 
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', 
          color: 'white',
          fontWeight: 'bold'
        }
      });
    }
  };

  // Update wellness score and level when stats change
  useEffect(() => {
    const newWellnessScore = calculateWellnessScore();
    const { level: newUserLevel, progress: newProgress } = calculateUserLevel();
    
    // Check for level up using centralized function
    checkForLevelUp(newUserLevel);
    
    setWellnessScore(newWellnessScore);
    setUserLevel(newUserLevel);
    setLevelProgress(newProgress);
  }, [stats, assessmentCompleted]); // Removed previousLevel and userLevel dependencies to prevent loops

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
        setUserName(name);
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetch("https://api.quotable.io/random?tags=inspirational|wisdom")
      .then((res) => res.ok ? res.json() : Promise.reject("API error"))
      .then((data) => {
        if (data.content && data.author) {
          setQuote(`"${data.content}" — ${data.author}`);
        } else {
          throw new Error("Malformed quote");
        }
      })
      .catch(() => {
        setQuote("You're doing your best, and that’s enough.");
      });
  }, []);

  useEffect(() => {
    const moodLogs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const journals = JSON.parse(localStorage.getItem("mindmates.journals") || "[]");
    if (moodLogs.length > 0) setMood(moodLogs[moodLogs.length - 1].mood);

    setStats((prev) => ({
      ...prev,
      moodLogs: moodLogs.length,
      journals: journals.length,
    }));

    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      if (!user) return;

      const apptQuery = query(collection(db, "appointments"), where("userId", "==", user.uid));
      const snapshot = await getDocs(apptQuery);

      const futureAppointments = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp?.toDate?.();
          return {
            id: doc.id,
            ...data,
            timestamp,
            date: format(timestamp, "MMM dd, yyyy"),
            time: format(timestamp, "hh:mm a"),
          };
        })
        .filter((appt) => appt.timestamp > new Date())
        .sort((a, b) => a.timestamp - b.timestamp);

      setNextAppointment(futureAppointments[0] || null);
      setStats((prev) => ({ ...prev, sessions: snapshot.size }));
    };

    fetchNextAppointment();
  }, [user]);


  const handleMoodClick = (emoji, index) => {
    const logs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const updatedLogs = [...logs, { mood: emoji, timestamp: new Date().toISOString() }];
    localStorage.setItem("mindmates.moodLogs", JSON.stringify(updatedLogs));
    setMood(emoji);
    setSelectedMoodIndex(index);
    setStats((prev) => ({ ...prev, moodLogs: updatedLogs.length }));
    toast.success(`Mood logged: ${moodEmojis[index].label} ${emoji}`, { 
      position: "top-right",
      style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
    });

    // Trigger recalculation after a short delay to ensure state updates
    setTimeout(() => {
      const newWellnessScore = calculateWellnessScore();
      const { level: newUserLevel, progress: newProgress } = calculateUserLevel();
      
      // Use centralized level check
      checkForLevelUp(newUserLevel);
      
      setWellnessScore(newWellnessScore);
      setUserLevel(newUserLevel);
      setLevelProgress(newProgress);
    }, 100);
  };

  // Handler for under development features: navigate and show toast
  const handleDevFeature = (path) => {
    navigate(path);
    toast("🚧 This feature is under development.", { position: "top-center" });
  };

  // Calculate dynamic achievements based on real user data
  const calculateAchievements = () => {
    const moodLogs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const journals = getJournals();
    
    // Check for 7-day streak (simplified: check if there are mood logs in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMoods = moodLogs.filter(log => new Date(log.timestamp) > sevenDaysAgo);
    
    // Real achievements based on actual user data
    const realAchievements = [
      {
        icon: FaFire,
        title: "Streak Master",
        desc: "7-day mood tracking streak",
        unlocked: recentMoods.length >= 7,
        progress: `${recentMoods.length}/7 days`,
        category: "consistency"
      },
      {
        icon: FaBrain,
        title: "Mindful Soul",
        desc: "Complete 10 mindfulness exercises",
        unlocked: false, // Will be implemented when exercises are added
        progress: "0/10 exercises",
        category: "mindfulness"
      },
      {
        icon: FaHeart,
        title: "Self-Care Champion",
        desc: "Write 30 journal entries",
        unlocked: journals.length >= 30,
        progress: `${journals.length}/30 entries`,
        category: "journaling"
      },
      {
        icon: FaGem,
        title: "Wellness Warrior",
        desc: "Complete mental health assessment",
        unlocked: assessmentCompleted,
        progress: assessmentCompleted ? "Completed" : "Pending",
        category: "assessment"
      },
      {
        icon: FaStar,
        title: "Dedicated User",
        desc: "Log mood for 30 consecutive days",
        unlocked: moodLogs.length >= 30,
        progress: `${moodLogs.length}/30 logs`,
        category: "dedication"
      },
      {
        icon: FaShieldAlt,
        title: "Session Regular",
        desc: "Attend 5 therapy sessions",
        unlocked: stats.sessions >= 5,
        progress: `${stats.sessions}/5 sessions`,
        category: "therapy"
      }
    ];
    
    return realAchievements;
  };

  const dynamicAchievements = calculateAchievements();

  // Get XP information for the info modal
  const getXPInfo = () => {
    const { totalPoints } = calculateUserLevel();
    return {
      currentXP: totalPoints,
      nextLevelXP: userLevel * 100,
      activities: [
        { name: "Log your mood daily", xp: 5 },
        { name: "Write a journal entry", xp: 10 },
        { name: "Attend therapy session", xp: 25 },
        { name: "Complete assessment", xp: 100 },
        { name: "Connect with peers", xp: 15 },
        { name: "Complete mindfulness exercise", xp: 20 }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Professional Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white"
                  >
                    {greeting}, <span className="text-blue-600 dark:text-blue-400">{userName}</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 dark:text-slate-300 font-medium"
                  >
                    Welcome to your wellness dashboard
                  </motion.p>
                </div>
              </div>

              {/* Enhanced Professional Status Bar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Wellness: {wellnessScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Level {userLevel}
                    </span>
                  </div>
                </div>
                
                {/* Level Progress Bar - Clickable for XP info */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowXPInfo(true)}
                  className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        Level {userLevel} Progress
                      </span>
                    </div>
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      {levelProgress}/100 XP
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${levelProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-amber-700 dark:text-amber-400">
                      {100 - levelProgress} XP until Level {userLevel + 1}
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-500">
                      Tap for XP info
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Professional Control Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-row lg:flex-col gap-3"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme} 
                className="p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm transition-all duration-200"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              
              {/* Achievements Button - Only show if there are unlocked achievements */}
              {dynamicAchievements.some(achievement => achievement.unlocked) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAchievements(!showAchievements)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm transition-all duration-200"
                >
                  <Award className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.header>

        {/* Professional Quote Section */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <blockquote className="text-lg font-medium text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  {quote}
                </blockquote>
              </div>
            </div>
          </motion.div>
        )}

        {/* Professional Achievements Modal */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAchievements(false)} />
              <motion.div 
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h3>
                  <button 
                    onClick={() => setShowAchievements(false)} 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  {dynamicAchievements.map((achievement, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          achievement.unlocked ? 'bg-green-500 text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                        }`}>
                          <achievement.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white">{achievement.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{achievement.desc}</p>
                          <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {achievement.progress}
                          </p>
                        </div>
                        {achievement.unlocked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold"
                          >
                            ✓
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up Celebration */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLevelUp(false)}
            >
              <motion.div
                initial={{ y: 50, rotateY: -180 }}
                animate={{ y: 0, rotateY: 0 }}
                exit={{ y: -50, rotateY: 180 }}
                className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border-4 border-white relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowLevelUp(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
                >
                  ✕
                </button>

                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  LEVEL UP!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-white/90 mb-4"
                >
                  You've reached Level {userLevel}!
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="flex items-center justify-center gap-2 bg-white/20 rounded-xl p-3 mb-4"
                >
                  <Crown className="w-6 h-6 text-white" />
                  <span className="text-white font-bold">Wellness Warrior</span>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-white/80 text-sm"
                >
                  Keep up the amazing work on your mental health journey!
                </motion.p>
                
                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 400,
                      y: (Math.random() - 0.5) * 400,
                      opacity: 0
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* XP Information Modal */}
        <AnimatePresence>
          {showXPInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowXPInfo(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Experience Points</h3>
                  </div>
                  <button 
                    onClick={() => setShowXPInfo(false)} 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                {/* Current Level Info */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">Current Level</span>
                    <span className="text-2xl font-bold text-amber-600">{userLevel}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-700 dark:text-amber-400">Progress</span>
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">{levelProgress}/100 XP</span>
                  </div>
                  <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>

                {/* How to Earn XP */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">How to Earn XP</h4>
                  <div className="space-y-2">
                    {getXPInfo().activities.map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                      >
                        <span className="text-sm text-slate-700 dark:text-slate-300">{activity.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-amber-600">+{activity.xp}</span>
                          <span className="text-xs text-slate-500">XP</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Level Benefits */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Level Benefits</h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Unlock new achievements</li>
                    <li>• Access premium features</li>
                    <li>• Personalized wellness insights</li>
                    <li>• Priority support access</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Professional Dashboard Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {/* Professional Mood Tracker */}
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="md:col-span-2 xl:col-span-2 2xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mood Tracker</h2>
                  <p className="text-slate-600 dark:text-slate-300">How are you feeling today?</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.moodLogs}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Total logs</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              {moodEmojis.map((moodData, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodClick(moodData.emoji, index)}
                  className={`relative p-3 rounded-xl transition-all duration-200 ${
                    selectedMoodIndex === index || mood === moodData.emoji
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{moodData.emoji}</div>
                  <div className="text-xs font-medium">{moodData.label}</div>
                  {(selectedMoodIndex === index || mood === moodData.emoji) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg text-white text-xs"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            
            {selectedMoodIndex >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-300">
                    Feeling {moodEmojis[selectedMoodIndex].label.toLowerCase()}? That's perfectly normal!
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Professional Appointment Card */}
          {nextAppointment && (
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Next Session</h3>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircle2 className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-900 dark:text-white">{nextAppointment.doctor}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{nextAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{nextAppointment.time}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDevFeature("/appointments")}
                  className="w-full p-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition-colors duration-200"
                >
                  Manage Sessions
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Professional Stats Dashboard */}
          {(stats.moodLogs > 0 || stats.journals > 0 || stats.sessions > 0) && (
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Progress</h3>
              </div>
              <div className="space-y-4">
                {stats.moodLogs > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mood Logs</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.moodLogs}</span>
                  </div>
                )}
                {stats.journals > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Journal Entries</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.journals}</span>
                  </div>
                )}
                {stats.sessions > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sessions</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.sessions}</span>
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDevFeature("/analytics")}
                className="w-full mt-4 p-3 rounded-xl bg-purple-600 text-white font-semibold shadow-sm hover:bg-purple-700 transition-colors duration-200"
              >
                View Analytics
              </motion.button>
            </motion.div>
          )}

          {/* Professional Assessment Card */}
          {!assessmentCompleted && (
            <motion.div
              whileHover={{ y: -2, scale: 1.01 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-sm">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mind Check</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">PHQ-9 Depression</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">GAD-7 Anxiety</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Stress Assessment</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDevFeature("/assessment")}
                className="w-full mt-4 p-3 rounded-xl bg-orange-600 text-white font-semibold shadow-sm hover:bg-orange-700 transition-colors duration-200"
              >
                Take Assessment
              </motion.button>
            </motion.div>
          )}

          {/* Professional Feedback Card */}
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Share Feedback</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Help us improve your mental wellness journey
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/form")}
              className="w-full p-3 rounded-xl bg-teal-600 text-white font-semibold shadow-sm hover:bg-teal-700 transition-colors duration-200"
            >
              Give Feedback
            </motion.button>
          </motion.div>

          {/* Professional Journals Section */}
          {getJournals().length > 0 && (
            <motion.div
              whileHover={{ y: -2, scale: 1.005 }}
              className="xl:col-span-3 2xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Journal Entries</h3>
                    <p className="text-slate-600 dark:text-slate-300">Your thoughts and reflections</p>
                  </div>
                </div>
                <Link to="/journals">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition-colors duration-200"
                  >
                    View All Entries
                  </motion.button>
                </Link>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getJournals().slice(-3).reverse().map((journal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="text-sm text-slate-700 dark:text-slate-200 line-clamp-4 leading-relaxed mb-3">
                      "{journal.entry}"
                    </div>
                    {journal.date && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {journal.date}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Professional Quick Access Panel */}
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="xl:col-span-1 2xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3">
              {[
                { icon: Activity, label: "Mental Exercises", path: "/exercises", color: "bg-purple-600 hover:bg-purple-700" },
                { icon: Users, label: "Connect Peers", path: "/connect-peer", color: "bg-blue-600 hover:bg-blue-700" },
                { icon: Calendar, label: "Book Session", path: "/appointments", color: "bg-emerald-600 hover:bg-emerald-700" },
                { icon: TrendingUp, label: "View Progress", path: "/analytics", color: "bg-orange-600 hover:bg-orange-700" },
                { icon: Settings, label: "Settings", path: "/settings", color: "bg-slate-600 hover:bg-slate-700" },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDevFeature(item.path)}
                  className={`p-4 rounded-xl ${item.color} text-white shadow-sm transition-all duration-200 flex items-center gap-3`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold truncate">{item.label}</span>
                </motion.button>
              ))}
              
              {/* Gamified Features Toggle */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGamifiedFeatures(!showGamifiedFeatures)}
                className={`p-4 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  showGamifiedFeatures 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-sm'
                }`}
              >
                <Crown className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold truncate">
                  {showGamifiedFeatures ? 'Hide Games' : 'Show Games'}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Gamified Features Section */}
          {showGamifiedFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="xl:col-span-full"
            >
              <GamifiedDashboard />
            </motion.div>
          )}
        </motion.section>

        {/* Professional IRA Assistant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          onClick={() => setShowIraBubble(false)}
          className="relative"
        >
          <Chatbot userName={userName} />
        </motion.div>

        {/* Professional Floating IRA Bubble */}
        <AnimatePresence>
          {showIraBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-8 right-8 z-40"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm shadow-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm"
                    >
                      🤖
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Hey! I'm IRA</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Your AI wellness companion</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowIraBubble(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors shadow-sm text-xs"
                  >
                    ✕
                  </motion.button>
                </motion.div>
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-slate-200 dark:border-slate-700"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
