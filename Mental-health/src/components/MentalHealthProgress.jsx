import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Target, 
  Star,
  Brain,
  Heart,
  Zap,
  Shield,
  Crown,
  Diamond,
  Flame,
  Trophy,
  CheckCircle2,
  BarChart3,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const BADGE_TIERS = {
  BRONZE: { color: '#CD7F32', glow: '#CD7F32' },
  SILVER: { color: '#C0C0C0', glow: '#C0C0C0' },
  GOLD: { color: '#FFD700', glow: '#FFD700' },
  PLATINUM: { color: '#E5E4E2', glow: '#E5E4E2' },
  DIAMOND: { color: '#B9F2FF', glow: '#00BFFF' }
};

const MENTAL_HEALTH_BADGES = {
  // Consistency Badges
  JOURNAL_STREAK: {
    id: 'journal_streak',
    name: 'Journal Streak',
    description: 'Consistent journaling',
    icon: Brain,
    tiers: [
      { days: 3, tier: 'BRONZE', title: 'Journal Starter' },
      { days: 7, tier: 'SILVER', title: 'Weekly Writer' },
      { days: 14, tier: 'GOLD', title: 'Bi-weekly Blogger' },
      { days: 30, tier: 'PLATINUM', title: 'Monthly Master' },
      { days: 100, tier: 'DIAMOND', title: 'Journal Legend' }
    ]
  },
  
  MOOD_TRACKING: {
    id: 'mood_tracking',
    name: 'Mood Tracker',
    description: 'Regular mood logging',
    icon: Heart,
    tiers: [
      { count: 5, tier: 'BRONZE', title: 'Mood Beginner' },
      { count: 20, tier: 'SILVER', title: 'Emotion Explorer' },
      { count: 50, tier: 'GOLD', title: 'Feeling Expert' },
      { count: 100, tier: 'PLATINUM', title: 'Mood Master' },
      { count: 365, tier: 'DIAMOND', title: 'Emotional Intelligence' }
    ]
  },

  MINDFULNESS_PRACTICE: {
    id: 'mindfulness_practice',
    name: 'Mindful Warrior',
    description: 'Mindfulness and meditation',
    icon: Zap,
    tiers: [
      { minutes: 30, tier: 'BRONZE', title: 'Mindful Beginner' },
      { minutes: 150, tier: 'SILVER', title: 'Zen Seeker' },
      { minutes: 500, tier: 'GOLD', title: 'Meditation Master' },
      { minutes: 1200, tier: 'PLATINUM', title: 'Wisdom Keeper' },
      { minutes: 3000, tier: 'DIAMOND', title: 'Enlightened One' }
    ]
  },

  SELF_CARE: {
    id: 'self_care',
    name: 'Self-Care Champion',
    description: 'Taking care of yourself',
    icon: Shield,
    tiers: [
      { activities: 5, tier: 'BRONZE', title: 'Care Starter' },
      { activities: 15, tier: 'SILVER', title: 'Wellness Warrior' },
      { activities: 30, tier: 'GOLD', title: 'Care Champion' },
      { activities: 60, tier: 'PLATINUM', title: 'Self-Love Expert' },
      { activities: 120, tier: 'DIAMOND', title: 'Care Master' }
    ]
  },

  GROWTH_MINDSET: {
    id: 'growth_mindset',
    name: 'Growth Seeker',
    description: 'Personal development',
    icon: TrendingUp,
    tiers: [
      { score: 10, tier: 'BRONZE', title: 'Growth Starter' },
      { score: 50, tier: 'SILVER', title: 'Progress Pioneer' },
      { score: 150, tier: 'GOLD', title: 'Development Master' },
      { score: 300, tier: 'PLATINUM', title: 'Transformation Expert' },
      { score: 500, tier: 'DIAMOND', title: 'Evolution Legend' }
    ]
  },

  RESILIENCE: {
    id: 'resilience',
    name: 'Resilient Soul',
    description: 'Overcoming challenges',
    icon: Crown,
    tiers: [
      { challenges: 3, tier: 'BRONZE', title: 'Brave Beginner' },
      { challenges: 10, tier: 'SILVER', title: 'Courage Builder' },
      { challenges: 25, tier: 'GOLD', title: 'Resilience Master' },
      { challenges: 50, tier: 'PLATINUM', title: 'Strength Legend' },
      { challenges: 100, tier: 'DIAMOND', title: 'Unbreakable Spirit' }
    ]
  }
};

const WELLNESS_METRICS = [
  { key: 'mood', label: 'Mood Score', color: '#FF6B6B', icon: Heart },
  { key: 'energy', label: 'Energy Level', color: '#4ECDC4', icon: Zap },
  { key: 'stress', label: 'Stress Management', color: '#45B7D1', icon: Shield },
  { key: 'sleep', label: 'Sleep Quality', color: '#96CEB4', icon: Brain },
  { key: 'social', label: 'Social Connection', color: '#FECA57', icon: Star },
  { key: 'mindfulness', label: 'Mindfulness', color: '#B39DDB', icon: Target }
];

export default function MentalHealthProgress() {
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 1,
    badges: [],
    streaks: {},
    weeklyData: [],
    monthlyData: [],
    wellnessScores: {}
  });
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('mood');
  const [showBadgeDetail, setShowBadgeDetail] = useState(null);
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    loadUserProgress();
    calculateBadgeProgress();
  }, []);

  const loadUserProgress = () => {
    // Load data from various localStorage sources
    const journalData = JSON.parse(localStorage.getItem('gamified_journals') || '[]');
    const moodData = JSON.parse(localStorage.getItem('mindmates.moodLogs') || '[]');
    const mindfulnessData = JSON.parse(localStorage.getItem('completed_mindfulness_challenges') || '[]');
    const questData = JSON.parse(localStorage.getItem('completed_quests') || '[]');
    
    // Calculate streaks
    const journalStreak = calculateJournalStreak(journalData);
    const moodCount = moodData.length;
    
    // Calculate mindfulness minutes
    const mindfulnessMinutes = mindfulnessData.reduce((total, challenge) => {
      // Assuming each challenge has a duration in seconds, convert to minutes
      return total + (challenge.duration || 0) / 60;
    }, 0);

    // Generate sample wellness data for demo
    const wellnessScores = generateWellnessData();
    const weeklyData = generateTimeSeriesData('week');
    const monthlyData = generateTimeSeriesData('month');

    setUserStats({
      totalPoints: calculateTotalPoints(),
      level: calculateLevel(),
      badges: JSON.parse(localStorage.getItem('earned_badges') || '[]'),
      streaks: {
        journal: journalStreak,
        mood: moodCount,
        mindfulness: Math.floor(mindfulnessMinutes)
      },
      weeklyData,
      monthlyData,
      wellnessScores
    });
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

  const calculateTotalPoints = () => {
    const journalPoints = parseInt(localStorage.getItem('journal_points') || '0');
    const questPoints = parseInt(localStorage.getItem('user_xp') || '0');
    const mindfulnessPoints = parseInt(localStorage.getItem('mindfulness_points') || '0');
    return journalPoints + questPoints + mindfulnessPoints;
  };

  const calculateLevel = () => {
    return Math.floor(calculateTotalPoints() / 100) + 1;
  };

  const generateWellnessData = () => {
    // Generate sample data - in real app, this would come from actual user data
    return {
      mood: Math.floor(Math.random() * 40) + 60,
      energy: Math.floor(Math.random() * 30) + 50,
      stress: Math.floor(Math.random() * 25) + 65,
      sleep: Math.floor(Math.random() * 35) + 55,
      social: Math.floor(Math.random() * 40) + 45,
      mindfulness: Math.floor(Math.random() * 30) + 60
    };
  };

  const generateTimeSeriesData = (timeframe) => {
    const days = timeframe === 'week' ? 7 : 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: Math.floor(Math.random() * 40) + 60,
        energy: Math.floor(Math.random() * 30) + 50,
        stress: Math.floor(Math.random() * 25) + 65,
        sleep: Math.floor(Math.random() * 35) + 55
      });
    }
    
    return data;
  };

  const calculateBadgeProgress = () => {
    const newEarnedBadges = [];
    
    Object.values(MENTAL_HEALTH_BADGES).forEach(badge => {
      const currentProgress = getCurrentProgress(badge.id);
      
      badge.tiers.forEach(tier => {
        const isEarned = checkTierRequirement(badge.id, tier, currentProgress);
        const badgeKey = `${badge.id}_${tier.tier}`;
        
        if (isEarned && !userStats.badges.includes(badgeKey)) {
          newEarnedBadges.push({
            id: badgeKey,
            badge: badge,
            tier: tier
          });
        }
      });
    });

    if (newEarnedBadges.length > 0) {
      setNewBadges(newEarnedBadges);
      setTimeout(() => setNewBadges([]), 5000);
      
      // Save new badges
      const updatedBadges = [...userStats.badges, ...newEarnedBadges.map(b => b.id)];
      localStorage.setItem('earned_badges', JSON.stringify(updatedBadges));
      setUserStats(prev => ({ ...prev, badges: updatedBadges }));
    }
  };

  const getCurrentProgress = (badgeId) => {
    switch (badgeId) {
      case 'journal_streak':
        return userStats.streaks.journal || 0;
      case 'mood_tracking':
        return userStats.streaks.mood || 0;
      case 'mindfulness_practice':
        return userStats.streaks.mindfulness || 0;
      case 'self_care':
        return Math.floor(Math.random() * 25); // Placeholder
      case 'growth_mindset':
        return Math.floor(userStats.totalPoints / 5); // Convert points to growth score
      case 'resilience':
        return Math.floor(Math.random() * 15); // Placeholder
      default:
        return 0;
    }
  };

  const checkTierRequirement = (badgeId, tier, currentProgress) => {
    switch (badgeId) {
      case 'journal_streak':
        return currentProgress >= tier.days;
      case 'mood_tracking':
        return currentProgress >= tier.count;
      case 'mindfulness_practice':
        return currentProgress >= tier.minutes;
      case 'self_care':
        return currentProgress >= tier.activities;
      case 'growth_mindset':
        return currentProgress >= tier.score;
      case 'resilience':
        return currentProgress >= tier.challenges;
      default:
        return false;
    }
  };

  const getBadgeProgress = (badge) => {
    const currentProgress = getCurrentProgress(badge.id);
    const nextTier = badge.tiers.find(tier => !checkTierRequirement(badge.id, tier, currentProgress));
    
    if (!nextTier) {
      return { progress: 100, nextTier: null, currentTier: badge.tiers[badge.tiers.length - 1] };
    }
    
    const requirement = Object.values(nextTier)[0]; // Get the requirement value
    const progress = Math.min((currentProgress / requirement) * 100, 100);
    
    return { progress, nextTier, currentTier: null };
  };

  const getHighestEarnedTier = (badge) => {
    const earnedTiers = badge.tiers.filter(tier => 
      userStats.badges.includes(`${badge.id}_${tier.tier}`)
    );
    return earnedTiers.length > 0 ? earnedTiers[earnedTiers.length - 1] : null;
  };

  const getWellnessRadarData = () => {
    return WELLNESS_METRICS.map(metric => ({
      metric: metric.label,
      value: userStats.wellnessScores[metric.key] || 0,
      fullMark: 100
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header with Overall Stats */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🏆 Your Mental Health Journey
          </h1>
          
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <Trophy className="text-yellow-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{userStats.level}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <Star className="text-purple-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{userStats.totalPoints}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <Award className="text-blue-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Badges</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{userStats.badges.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <Flame className="text-orange-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Journal Streak</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{userStats.streaks.journal || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mood Trends */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Mood Trends</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTimeframe('week')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedTimeframe === 'week'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedTimeframe('month')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedTimeframe === 'month'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={selectedTimeframe === 'week' ? userStats.weeklyData : userStats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Line type="monotone" dataKey="mood" stroke="#FF6B6B" strokeWidth={3} dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="energy" stroke="#4ECDC4" strokeWidth={3} dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="stress" stroke="#45B7D1" strokeWidth={3} dot={{ fill: '#45B7D1', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wellness Radar */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Wellness Overview</h2>
            
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={getWellnessRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                <Radar
                  name="Wellness"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Badge Collection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">🏅 Badge Collection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(MENTAL_HEALTH_BADGES).map((badge) => {
              const progress = getBadgeProgress(badge);
              const highestTier = getHighestEarnedTier(badge);
              const Icon = badge.icon;
              
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl cursor-pointer"
                  onClick={() => setShowBadgeDetail(badge)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className={`p-3 rounded-full flex items-center justify-center relative`}
                      style={{
                        backgroundColor: highestTier ? BADGE_TIERS[highestTier.tier].color + '20' : '#f3f4f6',
                        border: `2px solid ${highestTier ? BADGE_TIERS[highestTier.tier].color : '#d1d5db'}`
                      }}
                    >
                      <Icon 
                        size={24} 
                        style={{ color: highestTier ? BADGE_TIERS[highestTier.tier].color : '#6b7280' }}
                      />
                      {highestTier && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                             style={{ backgroundColor: BADGE_TIERS[highestTier.tier].color }}>
                          {highestTier.tier.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {badge.description}
                      </p>
                      {highestTier && (
                        <p className="text-xs font-medium mt-1"
                           style={{ color: BADGE_TIERS[highestTier.tier].color }}>
                          {highestTier.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {progress.nextTier ? `Next: ${progress.nextTier.title}` : 'Maxed Out!'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {Math.round(progress.progress)}%
                      </span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${progress.progress}%`,
                          background: progress.nextTier 
                            ? `linear-gradient(90deg, ${BADGE_TIERS[progress.nextTier.tier].color}20, ${BADGE_TIERS[progress.nextTier.tier].color})`
                            : '#10B981'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">This Week's Goals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3">
                <Brain className="text-purple-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Journal Entries</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">3/7</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-3">
                <Heart className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mood Logs</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">5/7</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center space-x-3">
                <Target className="text-green-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mindfulness</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">45/150 min</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center space-x-3">
                <Shield className="text-orange-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Self-Care</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">2/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {showBadgeDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowBadgeDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <showBadgeDetail.icon size={64} className="text-purple-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {showBadgeDetail.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400">
                  {showBadgeDetail.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Badge Tiers</h4>
                  {showBadgeDetail.tiers.map((tier, index) => {
                    const isEarned = userStats.badges.includes(`${showBadgeDetail.id}_${tier.tier}`);
                    
                    return (
                      <div 
                        key={tier.tier}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isEarned ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: BADGE_TIERS[tier.tier].color }}
                          >
                            {tier.tier.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {tier.title}
                          </span>
                        </div>
                        {isEarned && <CheckCircle2 className="text-green-500" size={20} />}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowBadgeDetail(null)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Badge Notifications */}
      <AnimatePresence>
        {newBadges.map((newBadge, index) => (
          <motion.div
            key={newBadge.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-50"
            style={{ marginTop: `${index * 80}px` }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-2xl shadow-2xl max-w-sm">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: BADGE_TIERS[newBadge.tier.tier].color }}
                >
                  <newBadge.badge.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold">New Badge Earned!</h4>
                  <p className="text-sm">{newBadge.tier.title}</p>
                  <p className="text-xs opacity-90">{newBadge.badge.name}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
