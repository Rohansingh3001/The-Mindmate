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
    
    // Reload stats when window becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserStats();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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

    // Load real recent achievements
    loadRecentAchievements(journals, quests, garden, badges);
  };

  const loadRecentAchievements = (journals, quests, garden, badges) => {
    const achievements = [];
    const now = Date.now();

    // Check for first journal entry
    if (journals.length === 1) {
      const firstJournal = journals[0];
      const timeAgo = getTimeAgo(firstJournal.timestamp);
      achievements.push({
        title: 'Journal Starter',
        description: 'Wrote your first journal entry',
        date: timeAgo,
        icon: '📝'
      });
    }

    // Check for journal streak milestones
    const streak = calculateJournalStreak(journals);
    if (streak === 3) {
      const latestJournal = journals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      achievements.push({
        title: '3-Day Streak!',
        description: 'Maintained a 3-day journaling streak',
        date: getTimeAgo(latestJournal.timestamp),
        icon: '🔥'
      });
    }
    if (streak === 7) {
      const latestJournal = journals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      achievements.push({
        title: 'Week Warrior',
        description: 'Achieved 7-day journaling streak',
        date: getTimeAgo(latestJournal.timestamp),
        icon: '⚡'
      });
    }

    // Check for first mood log
    const moodLogs = JSON.parse(localStorage.getItem('mindmates.moodLogs') || '[]');
    if (moodLogs.length === 1) {
      achievements.push({
        title: 'Mood Tracker',
        description: 'Logged your first mood',
        date: getTimeAgo(moodLogs[0].timestamp),
        icon: '😊'
      });
    }

    // Check for mood log milestones
    if (moodLogs.length === 10) {
      const latestMood = moodLogs[moodLogs.length - 1];
      achievements.push({
        title: 'Emotion Explorer',
        description: 'Logged 10 different moods',
        date: getTimeAgo(latestMood.timestamp),
        icon: '🎭'
      });
    }

    // Check for first quest completion
    if (quests.length === 1) {
      achievements.push({
        title: 'Quest Beginner',
        description: 'Completed your first quest',
        date: 'Recently',
        icon: '🎯'
      });
    }

    // Check for quest milestones
    if (quests.length === 5) {
      achievements.push({
        title: 'Quest Hunter',
        description: 'Completed 5 mental health quests',
        date: 'Recently',
        icon: '🏹'
      });
    }
    if (quests.length === 10) {
      achievements.push({
        title: 'Quest Master',
        description: 'Completed 10 mental health quests',
        date: 'Recently',
        icon: '👑'
      });
    }

    // Check for first garden plant
    if (garden.length === 1) {
      achievements.push({
        title: 'Garden Starter',
        description: 'Planted your first mood in the garden',
        date: getTimeAgo(garden[0].timestamp),
        icon: '🌱'
      });
    }

    // Check for garden milestones
    if (garden.length === 10) {
      const latestPlant = garden[garden.length - 1];
      achievements.push({
        title: 'Blooming Garden',
        description: 'Grew 10 plants in your mood garden',
        date: getTimeAgo(latestPlant.timestamp),
        icon: '🌸'
      });
    }

    // Check for badge unlocks
    if (badges.length === 1) {
      achievements.push({
        title: 'First Badge',
        description: 'Earned your first achievement badge',
        date: 'Recently',
        icon: '🏅'
      });
    }
    if (badges.length === 5) {
      achievements.push({
        title: 'Badge Collector',
        description: 'Collected 5 achievement badges',
        date: 'Recently',
        icon: '🎖️'
      });
    }

    // Check for XP milestones
    const xp = parseInt(localStorage.getItem('user_xp') || '0');
    if (xp >= 100) {
      achievements.push({
        title: 'Century Club',
        description: 'Reached 100 XP',
        date: 'Recently',
        icon: '💯'
      });
    }
    if (xp >= 500) {
      achievements.push({
        title: 'XP Collector',
        description: 'Accumulated 500 XP',
        date: 'Recently',
        icon: '⭐'
      });
    }

    // Sort by most recent and take last 5
    const sortedAchievements = achievements
      .sort((a, b) => {
        // Prioritize time-based achievements
        if (a.date.includes('ago') && !b.date.includes('ago')) return -1;
        if (!a.date.includes('ago') && b.date.includes('ago')) return 1;
        return 0;
      })
      .slice(0, 5);

    setRecentAchievements(sortedAchievements);
  };

  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
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

  // Dynamic gamified features with real-time stats
  const gamifiedFeatures = [
    {
      title: 'Gamified Journal',
      description: 'Write with achievements and rewards',
      icon: BookOpen,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      path: '/gamified-journal',
      stats: `${userStats.journalStreak} day streak`
    },
    {
      title: 'Mental Health Quests',
      description: 'Daily and weekly challenges',
      icon: Target,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      path: '/mental-health-quests',
      stats: `${userStats.completedQuests} completed`
    },
    {
      title: 'Mood Garden',
      description: 'Grow your emotional landscape',
      icon: TreePine,
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      path: '/mood-garden',
      stats: `${userStats.gardenPlants} plants`
    },
    {
      title: 'Mindfulness Challenges',
      description: 'Guided meditation practices',
      icon: Brain,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      path: '/mindfulness-challenges',
      stats: `${Math.floor(userStats.mindfulnessMinutes)} minutes`
    },
    {
      title: 'Progress Tracker',
      description: 'Detailed analytics and badges',
      icon: TrendingUp,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      path: '/mental-health-progress',
      stats: `${userStats.badges} badges earned`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-900 dark:text-white"
          >
            Your Mental Health Journey
          </motion.h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Track your progress, complete challenges, and earn rewards for taking care of your mental health
          </p>
        </div>

        {/* User Level & Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center"
        >
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Trophy className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-600 dark:text-slate-400">Level</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{userStats.level}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Star className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Points</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{userStats.totalPoints}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-600 dark:text-slate-400">Journal Streak</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{userStats.journalStreak}</p>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Level {userStats.level}</span>
              <span>{Math.floor(getLevelProgress())}% to next level</span>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getLevelProgress()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-indigo-600 h-3 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {getPointsNeededForNextLevel()} points to Level {userStats.level + 1}
            </p>
          </div>
        </motion.div>

        {/* Today's Goals */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Today's Goals</h2>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
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
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      goal.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        className={goal.completed ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'} 
                        size={24} 
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${goal.completed ? 'text-green-800 dark:text-green-200' : 'text-slate-900 dark:text-white'}`}>
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
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Explore Features</h2>
          
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
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer group hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${feature.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={feature.iconColor} size={24} />
                      </div>
                      <Sparkles className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {feature.stats}
                      </span>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">
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
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Recent Achievements</h2>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            {recentAchievements.length === 0 ? (
              <div className="text-center py-8">
                <Award className="mx-auto text-slate-400 mb-4" size={48} />
                <p className="text-slate-600 dark:text-slate-400">
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
                    className="flex items-center space-x-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl">
                      {achievement.icon || '🏆'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {achievement.description}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
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
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/gamified-journal')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              📝 Write Journal
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mood-garden')}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              🌱 Plant Mood
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mental-health-quests')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              🎯 Start Quest
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mindfulness-challenges')}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
            >
              🧘‍♀️ Meditate
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
