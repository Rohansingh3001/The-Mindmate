import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Trophy, 
  Flame, 
  Target, 
  BookOpen, 
  Heart, 
  TreePine, 
  Award,
  Calendar,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function GamifiedDashboard() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    level: 1,
    totalPoints: 0,
    journalStreak: 0,
    completedQuests: 0,
    gardenPlants: 0,
    mindfulnessMinutes: 0,
    badges: 0
  });

  const [recentAchievements, setRecentAchievements] = useState([]);
  const [todayGoals, setTodayGoals] = useState([]);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = () => {
    // Load data from localStorage
    const journalPoints = parseInt(localStorage.getItem('journal_points') || '0');
    const questPoints = parseInt(localStorage.getItem('user_xp') || '0');
    const mindfulnessPoints = parseInt(localStorage.getItem('mindfulness_points') || '0');
    const totalPoints = journalPoints + questPoints + mindfulnessPoints;
    
    const journals = JSON.parse(localStorage.getItem('gamified_journals') || '[]');
    const quests = JSON.parse(localStorage.getItem('completed_quests') || '[]');
    const garden = JSON.parse(localStorage.getItem('mood_garden') || '[]');
    const mindfulness = JSON.parse(localStorage.getItem('completed_mindfulness_challenges') || '[]');
    const badges = JSON.parse(localStorage.getItem('earned_badges') || '[]');

    const journalStreak = calculateJournalStreak(journals);

    // More reasonable level calculation: Level 1 = 0-99 points, Level 2 = 100-299, Level 3 = 300-599, etc.
    let level = 1;
    if (totalPoints >= 100) level = 2;
    if (totalPoints >= 300) level = 3;
    if (totalPoints >= 600) level = 4;
    if (totalPoints >= 1000) level = 5;
    if (totalPoints >= 1500) level = Math.floor(totalPoints / 500) + 2; // Higher levels need more points

    setUserStats({
      level,
      totalPoints,
      journalStreak,
      completedQuests: quests.length,
      gardenPlants: garden.length,
      mindfulnessMinutes: mindfulness.reduce((total, challenge) => total + (challenge.duration || 0) / 60, 0),
      badges: badges.length
    });

    // Set today's goals
    setTodayGoals([
      { id: 'journal', title: 'Write Journal Entry', completed: checkTodayJournal(journals), icon: BookOpen, path: '/gamified-journal' },
      { id: 'mood', title: 'Log Your Mood', completed: checkTodayMood(), icon: Heart, path: '/mood-garden' },
      { id: 'quest', title: 'Complete a Quest', completed: checkTodayQuest(), icon: Target, path: '/mental-health-quests' },
      { id: 'mindfulness', title: '5 Min Mindfulness', completed: false, icon: Brain, path: '/mindfulness-challenges' }
    ]);

    // Recent achievements (placeholder)
    setRecentAchievements([
      { title: 'Journal Starter', description: 'Wrote your first journal entry', date: '2 hours ago' },
      { title: 'Mood Tracker', description: 'Logged mood for 3 days', date: '1 day ago' }
    ]);
  };

  const calculateJournalStreak = (journals) => {
    if (journals.length === 0) return 0;
    
    const sortedJournals = journals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const dates = [...new Set(sortedJournals.map(j => new Date(j.timestamp).toDateString()))];
    
    let streak = 0;
    let checkDate = new Date();
    
    for (let date of dates) {
      if (date === checkDate.toDateString()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const checkTodayJournal = (journals) => {
    const today = new Date().toDateString();
    return journals.some(journal => new Date(journal.timestamp).toDateString() === today);
  };

  const checkTodayMood = () => {
    const garden = JSON.parse(localStorage.getItem('mood_garden') || '[]');
    const today = new Date().toDateString();
    return garden.some(plant => new Date(plant.timestamp).toDateString() === today);
  };

  const checkTodayQuest = () => {
    // Check if any quest was completed today
    const quests = JSON.parse(localStorage.getItem('completed_quests') || '[]');
    const today = new Date().toDateString();
    return quests.some(quest => new Date(quest.completedAt || Date.now()).toDateString() === today);
  };

  const getCompletedGoalsCount = () => {
    return todayGoals.filter(goal => goal.completed).length;
  };

  const getLevelProgress = () => {
    const { totalPoints, level } = userStats;
    
    // Define level thresholds
    const levelThresholds = [0, 100, 300, 600, 1000, 1500];
    
    if (level <= 5) {
      const currentLevelMin = levelThresholds[level - 1];
      const nextLevelMin = levelThresholds[level] || (levelThresholds[4] + (level - 4) * 500);
      const progressInLevel = totalPoints - currentLevelMin;
      const pointsNeededForLevel = nextLevelMin - currentLevelMin;
      
      return Math.min(100, (progressInLevel / pointsNeededForLevel) * 100);
    } else {
      // For levels above 5, each level needs 500 points
      const currentLevelMin = 1500 + (level - 6) * 500;
      const progressInLevel = totalPoints - currentLevelMin;
      return Math.min(100, (progressInLevel / 500) * 100);
    }
  };

  const getPointsNeededForNextLevel = () => {
    const { totalPoints, level } = userStats;
    const levelThresholds = [0, 100, 300, 600, 1000, 1500];
    
    if (level <= 5) {
      const nextLevelMin = levelThresholds[level] || (levelThresholds[4] + (level - 4) * 500);
      return nextLevelMin - totalPoints;
    } else {
      const nextLevelMin = 1500 + (level - 5) * 500;
      return nextLevelMin - totalPoints;
    }
  };

  const gamifiedFeatures = [
    {
      title: 'Gamified Journal',
      description: 'Write with achievements and rewards',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      path: '/gamified-journal',
      stats: `${userStats.journalStreak} day streak`
    },
    {
      title: 'Mental Health Quests',
      description: 'Daily and weekly challenges',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      path: '/mental-health-quests',
      stats: `${userStats.completedQuests} completed`
    },
    {
      title: 'Mood Garden',
      description: 'Grow your emotional landscape',
      icon: TreePine,
      color: 'from-green-500 to-emerald-500',
      path: '/mood-garden',
      stats: `${userStats.gardenPlants} plants`
    },
    {
      title: 'Mindfulness Challenges',
      description: 'Guided meditation practices',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500',
      path: '/mindfulness-challenges',
      stats: `${Math.floor(userStats.mindfulnessMinutes)} minutes`
    },
    {
      title: 'Progress Tracker',
      description: 'Detailed analytics and badges',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      path: '/mental-health-progress',
      stats: `${userStats.badges} badges earned`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Debug Section - Only for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Debug Info</h3>
            <div className="text-sm text-red-600 dark:text-red-300 space-y-1">
              <p>Journal Points: {localStorage.getItem('journal_points') || '0'}</p>
              <p>Quest Points: {localStorage.getItem('user_xp') || '0'}</p>
              <p>Mindfulness Points: {localStorage.getItem('mindfulness_points') || '0'}</p>
              <p>Total Points: {userStats.totalPoints}</p>
              <button
                onClick={() => {
                  localStorage.setItem('journal_points', '0');
                  localStorage.setItem('user_xp', '0');
                  localStorage.setItem('mindfulness_points', '0');
                  loadUserStats();
                }}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                Reset All Points
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            ✨ Welcome to Your Mental Health Journey ✨
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Track your progress, complete challenges, and earn rewards for taking care of your mental health
          </p>
        </div>

        {/* User Level & Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl text-center"
        >
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Trophy className="text-yellow-500" size={32} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{userStats.level}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Star className="text-purple-500" size={32} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{userStats.totalPoints}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Flame className="text-orange-500" size={32} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Journal Streak</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{userStats.journalStreak}</p>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Level {userStats.level}</span>
              <span>{Math.floor(getLevelProgress())}% to next level</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getLevelProgress()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {getPointsNeededForNextLevel()} points to Level {userStats.level + 1}
            </p>
          </div>
        </motion.div>

        {/* Today's Goals */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Today's Goals</h2>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Daily Progress ({getCompletedGoalsCount()}/{todayGoals.length})
              </h3>
              <div className="text-2xl">
                {getCompletedGoalsCount() === todayGoals.length ? '🎉' : '💪'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayGoals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <motion.div
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(goal.path)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      goal.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        className={goal.completed ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'} 
                        size={24} 
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${goal.completed ? 'text-green-800 dark:text-green-200' : 'text-gray-800 dark:text-gray-200'}`}>
                          {goal.title}
                        </p>
                        {goal.completed && (
                          <p className="text-xs text-green-600 dark:text-green-400">✓ Completed</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gamified Features Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Explore Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamifiedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => navigate(feature.path)}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl cursor-pointer group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <Sparkles className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {feature.stats}
                      </span>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform duration-300">
                        Explore →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Recent Achievements</h2>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            {recentAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Award className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 dark:text-gray-400">
                  Start your journey to earn your first achievement!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                  >
                    <Trophy className="text-yellow-600" size={24} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {achievement.date}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/gamified-journal')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              📝 Write Journal
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mood-garden')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              🌱 Plant Mood
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mental-health-quests')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              🎯 Start Quest
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mindfulness-challenges')}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              🧘‍♀️ Meditate
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
