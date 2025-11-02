import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { BookOpen, Flame, Star, Award, Sparkles, Target, Calendar, TrendingUp, Trophy, Heart, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { trackJournalEntry } from '../utils/questTracker';

const JOURNAL_ACHIEVEMENTS = {
  FIRST_ENTRY: { id: 'first_entry', title: 'First Steps', description: 'Write your first journal entry', icon: BookOpen, points: 10 },
  STREAK_3: { id: 'streak_3', title: 'Consistency Seeker', description: '3-day writing streak', icon: Flame, points: 25 },
  STREAK_7: { id: 'streak_7', title: 'Week Warrior', description: '7-day writing streak', icon: Calendar, points: 50 },
  STREAK_30: { id: 'streak_30', title: 'Monthly Master', description: '30-day writing streak', icon: Trophy, points: 100 },
  EMOTIONAL_INSIGHT: { id: 'emotional_insight', title: 'Emotion Explorer', description: 'Use 5 different emotion words', icon: Heart, points: 30 },
  GRATITUDE_GURU: { id: 'gratitude_guru', title: 'Gratitude Guru', description: 'Write 10 gratitude entries', icon: Star, points: 40 },
  DEEP_THINKER: { id: 'deep_thinker', title: 'Deep Thinker', description: 'Write entries over 200 words 5 times', icon: Brain, points: 35 },
  MORNING_RITUAL: { id: 'morning_ritual', title: 'Morning Ritual', description: 'Write 5 morning entries (6-10 AM)', icon: Zap, points: 30 }
};

const JOURNAL_PROMPTS = [
  "What made you smile today, no matter how small?",
  "Describe a moment when you felt completely at peace.",
  "What's one thing you're grateful for right now?",
  "Write about a challenge you overcame recently.",
  "What would you tell your younger self?",
  "Describe your ideal day in detail.",
  "What's something new you learned about yourself this week?",
  "Write about someone who inspires you and why.",
  "What's a goal you're working towards?",
  "Describe a place where you feel most comfortable.",
  "What's a small act of kindness you witnessed or performed?",
  "Write about a fear you'd like to overcome.",
  "What does success mean to you?",
  "Describe your perfect evening routine.",
  "What's something you're looking forward to?"
];

const MOOD_COLORS = {
  '😊': '#FFD700', // Happy - Gold
  '😐': '#87CEEB', // Neutral - Sky Blue
  '😢': '#4682B4', // Sad - Steel Blue
  '😠': '#DC143C', // Angry - Crimson
  '😴': '#9370DB', // Tired - Medium Purple
  '🥰': '#FF69B4', // Loved - Hot Pink
  '😰': '#FF6347', // Anxious - Tomato
  '🤔': '#20B2AA', // Thoughtful - Light Sea Green
  '🎉': '#FF1493', // Excited - Deep Pink
  '😌': '#98FB98'  // Peaceful - Pale Green
};

export default function GamifiedJournal() {
  const [entry, setEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [journals, setJournals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showAchievement, setShowAchievement] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    loadJournalData();
    setRandomPrompt();
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const loadJournalData = () => {
    const savedJournals = JSON.parse(localStorage.getItem('gamified_journals') || '[]');
    const savedAchievements = JSON.parse(localStorage.getItem('journal_achievements') || '[]');
    const savedPoints = parseInt(localStorage.getItem('journal_points') || '0');
    const savedStreak = parseInt(localStorage.getItem('journal_streak') || '0');
    
    setJournals(savedJournals);
    setAchievements(savedAchievements);
    setPoints(savedPoints);
    setStreak(savedStreak);
  };

  const setRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    setCurrentPrompt(JOURNAL_PROMPTS[randomIndex]);
  };

  const calculateStreak = (journalEntries) => {
    if (journalEntries.length === 0) return 0;
    
    const today = new Date().toDateString();
    const sortedEntries = journalEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    let checkDate = new Date();
    
    for (let entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      if (entryDate.toDateString() === checkDate.toDateString()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const checkAchievements = (newJournals) => {
    const newAchievements = [...achievements];
    let newPoints = points;

    // First entry achievement
    if (newJournals.length === 1 && !achievements.includes('first_entry')) {
      newAchievements.push('first_entry');
      newPoints += JOURNAL_ACHIEVEMENTS.FIRST_ENTRY.points;
      showAchievementPopup(JOURNAL_ACHIEVEMENTS.FIRST_ENTRY);
    }

    // Streak achievements
    const currentStreak = calculateStreak(newJournals);
    if (currentStreak >= 3 && !achievements.includes('streak_3')) {
      newAchievements.push('streak_3');
      newPoints += JOURNAL_ACHIEVEMENTS.STREAK_3.points;
      showAchievementPopup(JOURNAL_ACHIEVEMENTS.STREAK_3);
    }
    if (currentStreak >= 7 && !achievements.includes('streak_7')) {
      newAchievements.push('streak_7');
      newPoints += JOURNAL_ACHIEVEMENTS.STREAK_7.points;
      showAchievementPopup(JOURNAL_ACHIEVEMENTS.STREAK_7);
    }
    if (currentStreak >= 30 && !achievements.includes('streak_30')) {
      newAchievements.push('streak_30');
      newPoints += JOURNAL_ACHIEVEMENTS.STREAK_30.points;
      showAchievementPopup(JOURNAL_ACHIEVEMENTS.STREAK_30);
    }

    // Deep thinker achievement
    const longEntries = newJournals.filter(j => j.entry.split(' ').length > 200).length;
    if (longEntries >= 5 && !achievements.includes('deep_thinker')) {
      newAchievements.push('deep_thinker');
      newPoints += JOURNAL_ACHIEVEMENTS.DEEP_THINKER.points;
      showAchievementPopup(JOURNAL_ACHIEVEMENTS.DEEP_THINKER);
    }

    // Morning ritual achievement
    const morningEntries = newJournals.filter(j => {
      const hour = new Date(j.timestamp).getHours();
      return hour >= 6 && hour <= 10;
    }).length;
    if (morningEntries >= 5 && !achievements.includes('morning_ritual')) {
      newAchievements.push('morning_ritual');
      newPoints += JOURNAL_ACHIEVEMENTS.MORNING_RITUAL.points;
      showAchievementPopup(JOURNAL_ACHIEVEMENTS.MORNING_RITUAL);
    }

    setAchievements(newAchievements);
    setPoints(newPoints);
    setStreak(currentStreak);
    
    localStorage.setItem('journal_achievements', JSON.stringify(newAchievements));
    localStorage.setItem('journal_points', newPoints.toString());
    localStorage.setItem('journal_streak', currentStreak.toString());
  };

  const showAchievementPopup = (achievement) => {
    setShowAchievement(achievement);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setShowAchievement(null), 4000);
  };

  const saveJournal = () => {
    if (!entry.trim() || !selectedMood) {
      alert('Please write your entry and select a mood!');
      return;
    }

    const newJournal = {
      id: Date.now(),
      content: entry.trim(),
      entry: entry.trim(),
      mood: selectedMood,
      date: new Date().toDateString(),
      timestamp: new Date().toISOString(),
      prompt: currentPrompt,
      wordCount: entry.trim().split(' ').length
    };

    const updatedJournals = [...journals, newJournal];
    setJournals(updatedJournals);
    localStorage.setItem('gamified_journals', JSON.stringify(updatedJournals));

    // Track journal entry for quest completion
    trackJournalEntry(newJournal);

    checkAchievements(updatedJournals);
    
    setEntry('');
    setSelectedMood('');
    setRandomPrompt();
  };

  const getStreakMessage = () => {
    if (streak === 0) return "Start your journaling journey today! 🌱";
    if (streak === 1) return "Great start! Keep it going! 🔥";
    if (streak < 7) return `${streak} days strong! You're building a habit! 💪`;
    if (streak < 30) return `${streak} days! You're on fire! 🔥🔥`;
    return `${streak} days! You're a journaling legend! 🏆`;
  };

  const moodEmojis = ['😊', '😐', '😢', '😠', '😴', '🥰', '😰', '🤔', '🎉', '😌'];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'}`}>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Header with Stats */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ Mindful Journal ✨
          </h1>
          
          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Star className="text-yellow-500" size={20} />
              <span className="font-semibold">{points} Points</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Flame className="text-orange-500" size={20} />
              <span className="font-semibold">{streak} Day Streak</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Trophy className="text-purple-500" size={20} />
              <span className="font-semibold">{achievements.length} Achievements</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">{getStreakMessage()}</p>
        </div>

        {/* Journal Writing Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Today's Reflection</h2>
          
          {/* Mood Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">How are you feeling today?</label>
            <div className="flex flex-wrap gap-3">
              {moodEmojis.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedMood(emoji)}
                  className={`p-3 text-2xl rounded-full transition-all duration-200 ${
                    selectedMood === emoji
                      ? 'ring-4 ring-purple-400 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedMood === emoji ? MOOD_COLORS[emoji] + '40' : 'transparent',
                    border: `2px solid ${MOOD_COLORS[emoji] || '#ccc'}`
                  }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Writing Prompt */}
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border-l-4 border-purple-400">
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">💭 Today's Prompt:</p>
            <p className="font-medium">{currentPrompt}</p>
            <button
              onClick={setRandomPrompt}
              className="mt-2 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
            >
              Get new prompt →
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Start writing your thoughts here... Let your mind flow freely."
            className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
            style={{ fontFamily: 'Georgia, serif' }}
          />
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">{entry.split(' ').filter(word => word.length > 0).length} words</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveJournal}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
            >
              Save Entry ✨
            </motion.button>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">🏆 Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(JOURNAL_ACHIEVEMENTS).map((achievement) => {
              const Icon = achievement.icon;
              const isUnlocked = achievements.includes(achievement.id);
              
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      className={`${isUnlocked ? 'text-yellow-600' : 'text-gray-400'}`} 
                      size={24} 
                    />
                    <div>
                      <h4 className={`font-semibold ${isUnlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">+{achievement.points} points</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Entries */}
        {journals.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">📖 Recent Entries</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {journals.slice(-5).reverse().map((journal) => (
                <div
                  key={journal.id}
                  className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border-l-4"
                  style={{ borderLeftColor: MOOD_COLORS[journal.mood] || '#ccc' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{journal.mood}</span>
                    <span className="text-sm text-gray-500">{journal.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {journal.entry}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {journal.wordCount} words
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center space-x-4">
                <Trophy size={32} />
                <div>
                  <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                  <p className="text-sm">{showAchievement.title}</p>
                  <p className="text-xs opacity-90">+{showAchievement.points} points</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
