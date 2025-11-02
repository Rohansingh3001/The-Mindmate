import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Star, 
  Clock, 
  CheckCircle, 
  Circle, 
  Gift, 
  Flame,
  Heart,
  Brain,
  Users,
  Calendar,
  BookOpen,
  Smile,
  Award,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { syncQuestProgress, getActiveQuestsWithProgress } from '../utils/questTracker';

const QUEST_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  SPECIAL: 'special'
};

const QUEST_CATEGORIES = {
  MINDFULNESS: 'mindfulness',
  JOURNALING: 'journaling',
  SOCIAL: 'social',
  SELF_CARE: 'self_care',
  LEARNING: 'learning'
};

const DAILY_QUESTS = [
  {
    id: 'daily_mood_log',
    title: 'Check In With Yourself',
    description: 'Log your mood for today',
    category: QUEST_CATEGORIES.MINDFULNESS,
    icon: Smile,
    xp: 10,
    type: QUEST_TYPES.DAILY,
    action: 'mood_log'
  },
  {
    id: 'daily_journal',
    title: 'Express Your Thoughts',
    description: 'Write a journal entry (min 50 words)',
    category: QUEST_CATEGORIES.JOURNALING,
    icon: BookOpen,
    xp: 15,
    type: QUEST_TYPES.DAILY,
    action: 'journal_entry',
    requirement: { wordCount: 50 }
  },
  {
    id: 'daily_breathing',
    title: 'Take a Deep Breath',
    description: 'Complete a 5-minute breathing exercise',
    category: QUEST_CATEGORIES.MINDFULNESS,
    icon: Heart,
    xp: 12,
    type: QUEST_TYPES.DAILY,
    action: 'breathing_exercise'
  },
  {
    id: 'daily_gratitude',
    title: 'Practice Gratitude',
    description: 'Write down 3 things you\'re grateful for',
    category: QUEST_CATEGORIES.SELF_CARE,
    icon: Star,
    xp: 10,
    type: QUEST_TYPES.DAILY,
    action: 'gratitude_practice'
  }
];

const WEEKLY_QUESTS = [
  {
    id: 'weekly_streak',
    title: 'Consistency Champion',
    description: 'Complete daily quests for 5 days this week',
    category: QUEST_CATEGORIES.MINDFULNESS,
    icon: Flame,
    xp: 100,
    type: QUEST_TYPES.WEEKLY,
    action: 'daily_streak',
    requirement: { streakDays: 5 }
  },
  {
    id: 'weekly_social',
    title: 'Connect & Share',
    description: 'Have 3 meaningful conversations this week',
    category: QUEST_CATEGORIES.SOCIAL,
    icon: Users,
    xp: 75,
    type: QUEST_TYPES.WEEKLY,
    action: 'social_interaction',
    requirement: { interactions: 3 }
  },
  {
    id: 'weekly_learning',
    title: 'Mental Health Explorer',
    description: 'Complete 3 mental health exercises',
    category: QUEST_CATEGORIES.LEARNING,
    icon: Brain,
    xp: 80,
    type: QUEST_TYPES.WEEKLY,
    action: 'complete_exercises',
    requirement: { exercises: 3 }
  },
  {
    id: 'weekly_journal_depth',
    title: 'Deep Reflection',
    description: 'Write 3 journal entries with 200+ words each',
    category: QUEST_CATEGORIES.JOURNALING,
    icon: BookOpen,
    xp: 90,
    type: QUEST_TYPES.WEEKLY,
    action: 'deep_journaling',
    requirement: { entries: 3, wordCount: 200 }
  }
];

const SPECIAL_QUESTS = [
  {
    id: 'first_week',
    title: 'Welcome Adventurer',
    description: 'Complete your first week on MindMates',
    category: QUEST_CATEGORIES.MINDFULNESS,
    icon: Gift,
    xp: 200,
    type: QUEST_TYPES.SPECIAL,
    action: 'first_week_complete'
  },
  {
    id: 'mood_master',
    title: 'Emotion Expert',
    description: 'Log 30 different mood entries',
    category: QUEST_CATEGORIES.MINDFULNESS,
    icon: Smile,
    xp: 150,
    type: QUEST_TYPES.SPECIAL,
    action: 'mood_diversity',
    requirement: { uniqueMoods: 30 }
  }
];

const REWARDS = {
  AVATAR_FRAMES: [
    { id: 'bronze_frame', name: 'Bronze Frame', cost: 100, rarity: 'common' },
    { id: 'silver_frame', name: 'Silver Frame', cost: 250, rarity: 'uncommon' },
    { id: 'gold_frame', name: 'Gold Frame', cost: 500, rarity: 'rare' },
    { id: 'rainbow_frame', name: 'Rainbow Frame', cost: 1000, rarity: 'legendary' }
  ],
  BADGES: [
    { id: 'mindful_warrior', name: 'Mindful Warrior', cost: 200, rarity: 'uncommon' },
    { id: 'zen_master', name: 'Zen Master', cost: 400, rarity: 'rare' },
    { id: 'emotion_guru', name: 'Emotion Guru', cost: 300, rarity: 'rare' }
  ],
  THEMES: [
    { id: 'sunset_theme', name: 'Sunset Theme', cost: 150, rarity: 'common' },
    { id: 'ocean_theme', name: 'Ocean Theme', cost: 300, rarity: 'uncommon' },
    { id: 'galaxy_theme', name: 'Galaxy Theme', cost: 600, rarity: 'epic' }
  ]
};

export default function MentalHealthQuests() {
  const [activeQuests, setActiveQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [questProgress, setQuestProgress] = useState({});
  const [showReward, setShowReward] = useState(null);
  const [selectedTab, setSelectedTab] = useState('active');
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  const [availableRewards, setAvailableRewards] = useState([]);

  useEffect(() => {
    initializeQuests();
    loadUserData();
    syncQuestProgress(); // Sync progress on load
  }, []);

  const initializeQuests = () => {
    const today = new Date().toDateString();
    const thisWeek = getWeekNumber(new Date());
    
    // Reset daily quests
    const savedDaily = JSON.parse(localStorage.getItem('daily_quests_date') || '""');
    if (savedDaily !== today) {
      generateDailyQuests();
      localStorage.setItem('daily_quests_date', JSON.stringify(today));
    }

    // Reset weekly quests
    const savedWeekly = JSON.parse(localStorage.getItem('weekly_quests_week') || '0');
    if (savedWeekly !== thisWeek) {
      generateWeeklyQuests();
      localStorage.setItem('weekly_quests_week', JSON.stringify(thisWeek));
    }

    loadQuests();
  };

  const generateDailyQuests = () => {
    const selectedQuests = shuffleArray(DAILY_QUESTS).slice(0, 3);
    localStorage.setItem('active_daily_quests', JSON.stringify(selectedQuests));
  };

  const generateWeeklyQuests = () => {
    const selectedQuests = shuffleArray(WEEKLY_QUESTS).slice(0, 2);
    localStorage.setItem('active_weekly_quests', JSON.stringify(selectedQuests));
  };

  const loadQuests = () => {
    const dailyQuests = JSON.parse(localStorage.getItem('active_daily_quests') || '[]');
    const weeklyQuests = JSON.parse(localStorage.getItem('active_weekly_quests') || '[]');
    const specialQuests = SPECIAL_QUESTS.filter(quest => 
      !JSON.parse(localStorage.getItem('completed_quests') || '[]').includes(quest.id)
    );
    
    setActiveQuests([...dailyQuests, ...weeklyQuests, ...specialQuests]);
  };

  const loadUserData = () => {
    const savedXP = parseInt(localStorage.getItem('user_xp') || '0');
    const savedLevel = parseInt(localStorage.getItem('user_level') || '1');
    const savedProgress = JSON.parse(localStorage.getItem('quest_progress') || '{}');
    const savedCompleted = JSON.parse(localStorage.getItem('completed_quests') || '[]');
    const savedUnlocked = JSON.parse(localStorage.getItem('unlocked_rewards') || '[]');
    
    setUserXP(savedXP);
    setUserLevel(savedLevel);
    setQuestProgress(savedProgress);
    setCompletedQuests(savedCompleted);
    setUnlockedRewards(savedUnlocked);
    setAvailableRewards(Object.values(REWARDS).flat());
  };

  const completeQuest = (questId) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest || completedQuests.includes(questId)) return;

    const newXP = userXP + quest.xp;
    const newLevel = Math.floor(newXP / 100) + 1;
    const newCompleted = [...completedQuests, questId];

    setUserXP(newXP);
    setUserLevel(newLevel);
    setCompletedQuests(newCompleted);

    localStorage.setItem('user_xp', newXP.toString());
    localStorage.setItem('user_level', newLevel.toString());
    localStorage.setItem('completed_quests', JSON.stringify(newCompleted));

    // Show reward animation
    setShowReward({ quest, xp: quest.xp });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => setShowReward(null), 3000);

    // Remove completed quest from active quests
    setActiveQuests(prev => prev.filter(q => q.id !== questId));
  };

  const updateQuestProgress = (questId, progress) => {
    const newProgress = { ...questProgress, [questId]: progress };
    setQuestProgress(newProgress);
    localStorage.setItem('quest_progress', JSON.stringify(newProgress));

    // Check if quest is complete
    const quest = activeQuests.find(q => q.id === questId);
    if (quest && isQuestComplete(quest, progress)) {
      completeQuest(questId);
    }
  };

  const isQuestComplete = (quest, progress) => {
    if (!quest.requirement) return true;
    
    const req = quest.requirement;
    if (req.wordCount && progress.wordCount >= req.wordCount) return true;
    if (req.streakDays && progress.streakDays >= req.streakDays) return true;
    if (req.interactions && progress.interactions >= req.interactions) return true;
    if (req.exercises && progress.exercises >= req.exercises) return true;
    if (req.entries && progress.entries >= req.entries) return true;
    if (req.uniqueMoods && progress.uniqueMoods >= req.uniqueMoods) return true;
    
    return false;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getProgressPercentage = (quest) => {
    const progress = questProgress[quest.id] || {};
    if (!quest.requirement) return completedQuests.includes(quest.id) ? 100 : 0;

    const req = quest.requirement;
    if (req.wordCount) return Math.min((progress.wordCount || 0) / req.wordCount * 100, 100);
    if (req.streakDays) return Math.min((progress.streakDays || 0) / req.streakDays * 100, 100);
    if (req.interactions) return Math.min((progress.interactions || 0) / req.interactions * 100, 100);
    if (req.exercises) return Math.min((progress.exercises || 0) / req.exercises * 100, 100);
    if (req.entries) return Math.min((progress.entries || 0) / req.entries * 100, 100);
    if (req.uniqueMoods) return Math.min((progress.uniqueMoods || 0) / req.uniqueMoods * 100, 100);

    return 0;
  };

  const getCategoryColor = (category) => {
    const colors = {
      [QUEST_CATEGORIES.MINDFULNESS]: 'from-purple-500 to-pink-500',
      [QUEST_CATEGORIES.JOURNALING]: 'from-blue-500 to-cyan-500',
      [QUEST_CATEGORIES.SOCIAL]: 'from-green-500 to-teal-500',
      [QUEST_CATEGORIES.SELF_CARE]: 'from-orange-500 to-red-500',
      [QUEST_CATEGORIES.LEARNING]: 'from-indigo-500 to-purple-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-600',
      uncommon: 'text-green-600',
      rare: 'text-blue-600',
      epic: 'text-purple-600',
      legendary: 'text-yellow-600'
    };
    return colors[rarity] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎯 Mental Health Quests
          </h1>
          
          {/* User Stats */}
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Award className="text-purple-500" size={20} />
              <span className="font-semibold">Level {userLevel}</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Star className="text-yellow-500" size={20} />
              <span className="font-semibold">{userXP} XP</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-md">
              <Target className="text-green-500" size={20} />
              <span className="font-semibold">{completedQuests.length} Completed</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(userXP % 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {userXP % 100}/100 XP to Level {userLevel + 1}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4">
          {['active', 'completed', 'rewards'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedTab === tab
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Active Quests */}
        {selectedTab === 'active' && (
          <div className="space-y-6">
            {['daily', 'weekly', 'special'].map((type) => {
              const typeQuests = activeQuests.filter(quest => 
                (type === 'daily' && quest.type === QUEST_TYPES.DAILY) ||
                (type === 'weekly' && quest.type === QUEST_TYPES.WEEKLY) ||
                (type === 'special' && quest.type === QUEST_TYPES.SPECIAL)
              );

              if (typeQuests.length === 0) return null;

              return (
                <div key={type} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
                    {type} Quests
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeQuests.map((quest) => {
                      const Icon = quest.icon;
                      const progress = getProgressPercentage(quest);
                      const isComplete = completedQuests.includes(quest.id);
                      
                      return (
                        <motion.div
                          key={quest.id}
                          whileHover={{ scale: 1.02 }}
                          className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 transition-all ${
                            isComplete 
                              ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
                              : 'border-transparent hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${getCategoryColor(quest.category)}`}>
                              <Icon className="text-white" size={24} />
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                +{quest.xp} XP
                              </span>
                              {isComplete && (
                                <CheckCircle className="text-green-500 mt-1" size={20} />
                              )}
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            {quest.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {quest.description}
                          </p>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getCategoryColor(quest.category)}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% Complete</p>
                          </div>

                          {/* Quest Type Badge */}
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              quest.type === QUEST_TYPES.DAILY 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : quest.type === QUEST_TYPES.WEEKLY
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {quest.type}
                            </span>
                            
                            {!isComplete && (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Info size={14} className="mr-1" />
                                <span className="text-xs">Auto-completes</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed Quests */}
        {selectedTab === 'completed' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Completed Quests ({completedQuests.length})
            </h2>
            
            {completedQuests.length === 0 ? (
              <div className="text-center py-12">
                <Target className="mx-auto text-gray-400" size={64} />
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  No completed quests yet. Start your journey!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedQuests.map((questId) => {
                  const quest = [...DAILY_QUESTS, ...WEEKLY_QUESTS, ...SPECIAL_QUESTS]
                    .find(q => q.id === questId);
                  if (!quest) return null;
                  
                  const Icon = quest.icon;
                  
                  return (
                    <div
                      key={questId}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                          <Icon className="text-white" size={24} />
                        </div>
                        <CheckCircle className="text-green-500" size={24} />
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {quest.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {quest.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          Completed ✓
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          +{quest.xp} XP Earned
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Rewards Shop */}
        {selectedTab === 'rewards' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Rewards Shop
            </h2>
            
            <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4">
              <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
                Your Balance: {userXP} XP
              </p>
            </div>

            {Object.entries(REWARDS).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 capitalize">
                  {category.replace('_', ' ')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => {
                    const isUnlocked = unlockedRewards.includes(item.id);
                    const canAfford = userXP >= item.cost;
                    
                    return (
                      <div
                        key={item.id}
                        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 transition-all ${
                          isUnlocked 
                            ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
                            : canAfford
                            ? 'border-purple-300 hover:border-purple-400'
                            : 'border-gray-300 opacity-60'
                        }`}
                      >
                        <div className="text-center space-y-4">
                          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center`}>
                            <Gift className="text-white" size={28} />
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                              {item.name}
                            </h4>
                            <p className={`text-sm font-medium ${getRarityColor(item.rarity)}`}>
                              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                              {item.cost} XP
                            </p>
                          </div>

                          {isUnlocked ? (
                            <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                              <CheckCircle size={20} />
                              <span className="ml-2 font-medium">Unlocked</span>
                            </div>
                          ) : canAfford ? (
                            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                              Unlock
                            </button>
                          ) : (
                            <button disabled className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-2 rounded-lg font-medium cursor-not-allowed">
                              Insufficient XP
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reward Popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                Quest Complete!
              </h3>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {showReward.quest.title}
              </p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                +{showReward.xp} XP Earned!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
