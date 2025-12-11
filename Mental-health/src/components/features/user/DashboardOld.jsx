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
import { trackMoodLog } from "../../../utils/questTracker";
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
import { Card, CardContent } from "../../ui/Card";
import { Button } from "../../ui/Button";
import AssessmentForm from "./AssessmentForm";
import Chatbot from "../../chat/ChatBot";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import STORAGE_KEYS, { getFromStorage } from "../../../utils/storage";
import { getJournals } from "../../../utils/journalStorage";
import { useTheme } from "../../../context/ThemeContext";

// Gamified Components
import GamifiedDashboard from "../gamification/GamifiedDashboard";

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
  const { theme, toggleTheme } = useTheme();
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
  const [showMoodReasonModal, setShowMoodReasonModal] = useState(false);
  const [moodReason, setMoodReason] = useState("");
  const [selectedMoodData, setSelectedMoodData] = useState(null);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

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

  // Check if user has logged mood today and calculate streak
  const checkTodaysMoodLog = () => {
    const moodLogs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const today = new Date().toDateString();
    
    // Check if there's a log for today
    const loggedToday = moodLogs.some(log => {
      const logDate = new Date(log.timestamp).toDateString();
      return logDate === today;
    });
    
    setHasLoggedToday(loggedToday);
    
    // Calculate streak
    const streak = calculateMoodStreak(moodLogs);
    setCurrentStreak(streak);
    
    return loggedToday;
  };

  // Calculate mood logging streak
  const calculateMoodStreak = (logs) => {
    if (logs.length === 0) return 0;
    
    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Group logs by date
    const logsByDate = {};
    sortedLogs.forEach(log => {
      const dateStr = new Date(log.timestamp).toDateString();
      if (!logsByDate[dateStr]) {
        logsByDate[dateStr] = true;
      }
    });
    
    // Check consecutive days starting from today
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    while (true) {
      const dateStr = currentDate.toDateString();
      if (logsByDate[dateStr]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

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
    
    // Check today's mood log and streak
    checkTodaysMoodLog();
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
    // Check if user has already logged mood today
    if (hasLoggedToday) {
      toast.error("You've already logged your mood today! Come back tomorrow to continue your streak. 🔥", {
        position: "top-center",
        duration: 4000,
        style: { background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', color: 'white' }
      });
      return;
    }
    
    // Store selected mood data and show the reason modal
    setSelectedMoodData({ emoji, index, label: moodEmojis[index].label });
    setShowMoodReasonModal(true);
  };

  const saveMoodWithReason = () => {
    if (!selectedMoodData) return;

    const { emoji, index } = selectedMoodData;
    const logs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const newMoodLog = { 
      mood: emoji, 
      timestamp: new Date().toISOString(),
      reason: moodReason.trim() || "No reason provided"
    };
    const updatedLogs = [...logs, newMoodLog];
    localStorage.setItem("mindmates.moodLogs", JSON.stringify(updatedLogs));
    
    // Track mood log for quest completion
    trackMoodLog(newMoodLog);
    
    setMood(emoji);
    setSelectedMoodIndex(index);
    setHasLoggedToday(true);
    setStats((prev) => ({ ...prev, moodLogs: updatedLogs.length }));
    
    // Calculate new streak
    const newStreak = calculateMoodStreak(updatedLogs);
    setCurrentStreak(newStreak);
    
    // Show success toast with streak info
    if (newStreak > 1) {
      toast.success(`🔥 ${newStreak} day streak! Mood logged: ${moodEmojis[index].label} ${emoji}`, { 
        position: "top-center",
        duration: 5000,
        style: { background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)', color: 'white', fontWeight: 'bold' }
      });
    } else {
      toast.success(`Mood logged: ${moodEmojis[index].label} ${emoji}. Start your streak! 🎯`, { 
        position: "top-right",
        style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }
      });
    }

    // Reset and close modal
    setShowMoodReasonModal(false);
    setMoodReason("");
    setSelectedMoodData(null);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Minimalist Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-900 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl mx-auto">
        {/* Minimalist Header */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {greeting}, <span className="text-indigo-600 dark:text-indigo-400">{userName}</span>
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Your wellness dashboard
                  </p>
                </div>
              </div>

              {/* Clean Status Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{wellnessScore}%</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Level {userLevel}</span>
                </div>
              </div>

              {/* Simple Progress Bar */}
              <div 
                onClick={() => setShowXPInfo(true)}
                className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Level {userLevel} Progress
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {levelProgress}/100 XP
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Simple Controls */}
            <div className="flex flex-row lg:flex-col gap-2">
              <button 
                onClick={toggleTheme} 
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" /> : <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
              </button>
              
              {dynamicAchievements.some(achievement => achievement.unlocked) && (
                <button
                  onClick={() => setShowAchievements(!showAchievements)}
                  className="relative p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  <Award className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {dynamicAchievements.filter(a => a.unlocked).length}
                  </span>
                </button>
              )}
            </div>
          </div>
        </motion.header>

        {/* Simple Quote Section */}
        {quote && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <blockquote className="text-base font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed">
                {quote}
              </blockquote>
            </div>
          </div>
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

        {/* Mood Reason Modal */}
        <AnimatePresence>
          {showMoodReasonModal && selectedMoodData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => {
                setShowMoodReasonModal(false);
                setMoodReason("");
                setSelectedMoodData(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    {selectedMoodData.emoji}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    You're feeling {selectedMoodData.label.toLowerCase()}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedMoodData.label === "Happy" && "That's wonderful! What made you happy today?"}
                    {selectedMoodData.label === "Sad" && "It's okay to feel sad. What's making you feel this way?"}
                    {selectedMoodData.label === "Angry" && "Let's talk about it. What's bothering you?"}
                    {selectedMoodData.label === "Neutral" && "Tell us more. What's on your mind today?"}
                    {selectedMoodData.label === "Tired" && "Take it easy. What's making you feel tired?"}
                  </p>
                </div>

                <div className="mb-6">
                  <textarea
                    value={moodReason}
                    onChange={(e) => setMoodReason(e.target.value)}
                    placeholder="Share your thoughts... (optional)"
                    className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    rows="4"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowMoodReasonModal(false);
                      setMoodReason("");
                      setSelectedMoodData(null);
                    }}
                    className="flex-1 p-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveMoodWithReason}
                    className="flex-1 p-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
                  >
                    Save Mood
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                  💡 Tracking your feelings helps you understand your emotional patterns
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Grid */}
        <section className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* Clean Mood Tracker */}
          <div className="md:col-span-2 xl:col-span-2 2xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mood Tracker</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {hasLoggedToday ? "Today's mood logged ✓" : "How are you feeling today?"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.moodLogs}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">total logs</div>
              </div>
            </div>

            {/* Streak Display */}
            {currentStreak > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <p className="text-sm font-bold text-orange-800 dark:text-orange-300">
                        {currentStreak} Day Streak!
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-400">
                        {hasLoggedToday ? "Come back tomorrow!" : "Keep it going!"}
                      </p>
                    </div>
                  </div>
                  {currentStreak >= 7 && (
                    <div className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold">
                      Champion
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Banner */}
            {hasLoggedToday && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                    Mood logged for today! See you tomorrow to continue your streak.
                  </p>
                </div>
              </div>
            )}
            
            <div className={`grid grid-cols-5 gap-3 ${hasLoggedToday ? 'opacity-50 pointer-events-none' : ''}`}>
              {moodEmojis.map((moodData, index) => (
                <button
                  key={index}
                  onClick={() => handleMoodClick(moodData.emoji, index)}
                  disabled={hasLoggedToday}
                  className={`p-3 rounded-xl transition-all ${
                    selectedMoodIndex === index || mood === moodData.emoji
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  } ${hasLoggedToday ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-2xl mb-1">{moodData.emoji}</div>
                  <div className="text-xs font-medium">{moodData.label}</div>
                </button>
              ))}
            </div>
            
            {!hasLoggedToday && selectedMoodIndex >= 0 && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Feeling {moodEmojis[selectedMoodIndex].label.toLowerCase()}? All emotions are valid. 😊
                </p>
              </div>
            )}
          </div>

          {/* Simple Appointment Card */}
          {nextAppointment && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Next Session</h3>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircle2 className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-900 dark:text-white">{nextAppointment.doctor}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1 text-sm text-slate-600 dark:text-slate-300">
                    <CalendarDays className="w-4 h-4" />
                    <span>{nextAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Clock className="w-4 h-4" />
                    <span>{nextAppointment.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDevFeature("/appointments")}
                  className="w-full p-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Manage Sessions
                </button>
              </div>
            </div>
          )}

          {/* Simple Stats Card */}
          {(stats.moodLogs > 0 || stats.journals > 0 || stats.sessions > 0) && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Progress</h3>
              </div>
              <div className="space-y-3">
                {stats.moodLogs > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mood Logs</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.moodLogs}</span>
                  </div>
                )}
                {stats.journals > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Journals</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.journals}</span>
                  </div>
                )}
                {stats.sessions > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sessions</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.sessions}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDevFeature("/analytics")}
                className="w-full mt-4 p-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
              >
                View Analytics
              </button>
            </div>
          )}

          {/* Simple Assessment Card */}
          {!assessmentCompleted && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mind Check</h3>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>PHQ-9 Depression</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span>GAD-7 Anxiety</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span>Stress Assessment</span>
                </div>
              </div>
              <button
                onClick={() => handleDevFeature("/assessment")}
                className="w-full p-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
              >
                Take Assessment
              </button>
            </div>
          )}

          {/* Simple Feedback Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Feedback</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Help us improve your wellness journey
            </p>
            <button
              onClick={() => navigate("/form")}
              className="w-full p-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Give Feedback
            </button>
          </div>

          {/* Simple Journals Section */}
          {getJournals().length > 0 && (
            <div className="xl:col-span-3 2xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Journals</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Recent entries</p>
                  </div>
                </div>
                <Link to="journals">
                  <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    View All
                  </button>
                </Link>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getJournals().slice(-3).reverse().map((journal, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 mb-2">
                      "{journal.entry}"
                    </p>
                    {journal.date && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {journal.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simple Quick Actions */}
          <div className="xl:col-span-1 2xl:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-3">
              {[
                { icon: Activity, label: "Mental Exercises", path: "/exercises" },
                { icon: Users, label: "Connect Peers", path: "/connect-peer" },
                { icon: Calendar, label: "Book Session", path: "/appointments" },
                { icon: TrendingUp, label: "View Progress", path: "/analytics" },
                { icon: Settings, label: "Settings", path: "/settings" },
                { icon: Crown, label: showGamifiedFeatures ? 'Hide Games' : 'Show Games', path: null, action: () => setShowGamifiedFeatures(!showGamifiedFeatures) },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action || (() => handleDevFeature(item.path))}
                  className={`p-4 rounded-lg text-white font-semibold transition-colors flex items-center gap-3 ${
                    item.icon === Crown && showGamifiedFeatures
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

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
        </section>

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
