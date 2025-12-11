import React, { useState, useEffect } from 'react';
import { 
  Flower, 
  TreePine, 
  Sun, 
  Cloud, 
  CloudRain, 
  Sparkles, 
  Heart,
  Droplets,
  Wind,
  Flame,
  Snowflake,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_TO_PLANT = {
  '😊': { type: 'sunflower', color: '#FFD700', growth: 3, weather: 'sunny' },
  '😐': { type: 'grass', color: '#90EE90', growth: 1, weather: 'cloudy' },
  '😢': { type: 'bluebell', color: '#4169E1', growth: 2, weather: 'rainy' },
  '😠': { type: 'cactus', color: '#FF6347', growth: 1, weather: 'stormy' },
  '😴': { type: 'lavender', color: '#E6E6FA', growth: 2, weather: 'misty' },
  '🥰': { type: 'rose', color: '#FF69B4', growth: 4, weather: 'perfect' },
  '😰': { type: 'willow', color: '#DDA0DD', growth: 1, weather: 'windy' },
  '🤔': { type: 'sage', color: '#9ACD32', growth: 2, weather: 'calm' },
  '🎉': { type: 'cherry_blossom', color: '#FFB6C1', growth: 5, weather: 'festive' },
  '😌': { type: 'bamboo', color: '#98FB98', growth: 3, weather: 'serene' }
};

const PLANT_COMPONENTS = {
  sunflower: ({ size, color }) => (
    <div className="relative">
      <div 
        className={`w-${size} h-${size} rounded-full border-4 border-yellow-600 flex items-center justify-center`}
        style={{ backgroundColor: color, width: `${size * 4}px`, height: `${size * 4}px` }}
      >
        <div className="w-3 h-3 bg-yellow-800 rounded-full"></div>
      </div>
      <div className={`w-2 bg-green-500 mx-auto`} style={{ height: `${size * 2}px` }}></div>
    </div>
  ),
  rose: ({ size, color }) => (
    <div className="relative">
      <div 
        className={`w-${size} h-${size} rounded-full`}
        style={{ backgroundColor: color, width: `${size * 3}px`, height: `${size * 3}px` }}
      >
        <div className="absolute inset-1 border-2 border-pink-300 rounded-full opacity-60"></div>
      </div>
      <div className={`w-1 bg-green-600 mx-auto`} style={{ height: `${size * 2}px` }}></div>
    </div>
  ),
  tree: ({ size, color }) => (
    <div className="relative">
      <div 
        className={`w-${size} h-${size} rounded-full`}
        style={{ backgroundColor: color, width: `${size * 4}px`, height: `${size * 4}px` }}
      ></div>
      <div className={`w-3 bg-amber-800 mx-auto`} style={{ height: `${size * 2}px` }}></div>
    </div>
  ),
  grass: ({ size, color }) => (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className={`w-1 bg-green-400`} 
          style={{ height: `${size * 3}px`, backgroundColor: color }}
        ></div>
      ))}
    </div>
  ),
  default: ({ size, color }) => (
    <div 
      className={`w-${size} h-${size} rounded-full`}
      style={{ backgroundColor: color, width: `${size * 3}px`, height: `${size * 3}px` }}
    ></div>
  )
};

const WEATHER_EFFECTS = {
  sunny: { icon: Sun, color: '#FFD700', effect: 'sunny' },
  cloudy: { icon: Cloud, color: '#87CEEB', effect: 'cloudy' },
  rainy: { icon: CloudRain, color: '#4682B4', effect: 'rainy' },
  stormy: { icon: CloudRain, color: '#2F4F4F', effect: 'stormy' },
  misty: { icon: Cloud, color: '#F5F5DC', effect: 'misty' },
  perfect: { icon: Sparkles, color: '#FF69B4', effect: 'perfect' },
  windy: { icon: Wind, color: '#98FB98', effect: 'windy' },
  calm: { icon: Star, color: '#E6E6FA', effect: 'calm' },
  festive: { icon: Sparkles, color: '#FF1493', effect: 'festive' },
  serene: { icon: Star, color: '#20B2AA', effect: 'serene' }
};

const ACHIEVEMENTS = {
  FIRST_PLANT: { title: 'First Seed', description: 'Plant your first mood', icon: '🌱' },
  GARDEN_STARTER: { title: 'Garden Starter', description: 'Plant 5 different moods', icon: '🌸' },
  MOOD_GARDENER: { title: 'Mood Gardener', description: 'Plant 20 moods', icon: '🌻' },
  SEASON_KEEPER: { title: 'Season Keeper', description: 'Garden active for 7 days', icon: '🍂' },
  RAINBOW_GARDEN: { title: 'Rainbow Garden', description: 'Have all 10 plant types', icon: '🌈' },
  GARDEN_MASTER: { title: 'Garden Master', description: 'Plant 50 moods', icon: '🏆' }
};

export default function MoodGarden() {
  const [garden, setGarden] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [gardenStats, setGardenStats] = useState({
    totalPlants: 0,
    uniqueTypes: 0,
    gardenAge: 0,
    longestStreak: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [currentWeather, setCurrentWeather] = useState('sunny');
  const [gardenLevel, setGardenLevel] = useState(1);
  const [isPlanting, setIsPlanting] = useState(false);

  useEffect(() => {
    loadGardenData();
    updateWeather();
  }, []);

  const loadGardenData = () => {
    const savedGarden = JSON.parse(localStorage.getItem('mood_garden') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('garden_stats') || '{}');
    const savedAchievements = JSON.parse(localStorage.getItem('garden_achievements') || '[]');
    const savedLevel = parseInt(localStorage.getItem('garden_level') || '1');

    setGarden(savedGarden);
    setGardenStats(savedStats);
    setAchievements(savedAchievements);
    setGardenLevel(savedLevel);

    // Update garden age
    const firstPlant = savedGarden[0];
    if (firstPlant) {
      const daysSinceFirst = Math.floor((Date.now() - new Date(firstPlant.timestamp)) / (1000 * 60 * 60 * 24));
      setGardenStats(prev => ({ ...prev, gardenAge: daysSinceFirst }));
    }
  };

  const updateWeather = () => {
    const gardens = JSON.parse(localStorage.getItem('mood_garden') || '[]');
    if (gardens.length === 0) {
      setCurrentWeather('sunny');
      return;
    }

    // Set weather based on most recent mood
    const latestPlant = gardens[gardens.length - 1];
    if (latestPlant) {
      const plantData = MOOD_TO_PLANT[latestPlant.mood];
      setCurrentWeather(plantData?.weather || 'sunny');
    }
  };

  const plantMood = (mood) => {
    if (!mood) return;

    setIsPlanting(true);
    
    setTimeout(() => {
      const plantData = MOOD_TO_PLANT[mood];
      const newPlant = {
        id: Date.now(),
        mood,
        type: plantData.type,
        color: plantData.color,
        growth: plantData.growth,
        weather: plantData.weather,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
        size: Math.random() * 3 + 2, // Random size between 2-5
        position: {
          x: Math.random() * 80 + 10, // 10-90% from left
          y: Math.random() * 60 + 30   // 30-90% from top
        }
      };

      const updatedGarden = [...garden, newPlant];
      setGarden(updatedGarden);
      localStorage.setItem('mood_garden', JSON.stringify(updatedGarden));

      // Update stats
      const uniqueTypes = new Set(updatedGarden.map(p => p.type)).size;
      const newStats = {
        totalPlants: updatedGarden.length,
        uniqueTypes,
        gardenAge: gardenStats.gardenAge,
        longestStreak: calculateStreak(updatedGarden)
      };
      
      setGardenStats(newStats);
      localStorage.setItem('garden_stats', JSON.stringify(newStats));

      // Check achievements
      checkAchievements(updatedGarden, newStats);

      // Update weather
      setCurrentWeather(plantData.weather);

      // Update garden level
      const newLevel = Math.floor(updatedGarden.length / 10) + 1;
      if (newLevel > gardenLevel) {
        setGardenLevel(newLevel);
        localStorage.setItem('garden_level', newLevel.toString());
      }

      setIsPlanting(false);
      setSelectedMood('');
    }, 1000);
  };

  const calculateStreak = (gardenData) => {
    if (gardenData.length === 0) return 0;
    
    const sortedPlants = gardenData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const dates = [...new Set(sortedPlants.map(p => p.date))];
    
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

  const checkAchievements = (gardenData, stats) => {
    const newAchievements = [...achievements];

    // First plant
    if (gardenData.length === 1 && !achievements.includes('FIRST_PLANT')) {
      newAchievements.push('FIRST_PLANT');
      showAchievementNotification(ACHIEVEMENTS.FIRST_PLANT);
    }

    // Garden starter
    if (stats.uniqueTypes >= 5 && !achievements.includes('GARDEN_STARTER')) {
      newAchievements.push('GARDEN_STARTER');
      showAchievementNotification(ACHIEVEMENTS.GARDEN_STARTER);
    }

    // Mood gardener
    if (stats.totalPlants >= 20 && !achievements.includes('MOOD_GARDENER')) {
      newAchievements.push('MOOD_GARDENER');
      showAchievementNotification(ACHIEVEMENTS.MOOD_GARDENER);
    }

    // Season keeper
    if (stats.gardenAge >= 7 && !achievements.includes('SEASON_KEEPER')) {
      newAchievements.push('SEASON_KEEPER');
      showAchievementNotification(ACHIEVEMENTS.SEASON_KEEPER);
    }

    // Rainbow garden
    if (stats.uniqueTypes >= 10 && !achievements.includes('RAINBOW_GARDEN')) {
      newAchievements.push('RAINBOW_GARDEN');
      showAchievementNotification(ACHIEVEMENTS.RAINBOW_GARDEN);
    }

    // Garden master
    if (stats.totalPlants >= 50 && !achievements.includes('GARDEN_MASTER')) {
      newAchievements.push('GARDEN_MASTER');
      showAchievementNotification(ACHIEVEMENTS.GARDEN_MASTER);
    }

    setAchievements(newAchievements);
    localStorage.setItem('garden_achievements', JSON.stringify(newAchievements));
  };

  const showAchievementNotification = (achievement) => {
    setShowAchievement(achievement);
    setTimeout(() => setShowAchievement(null), 4000);
  };

  const clearGarden = () => {
    if (window.confirm('Are you sure you want to clear your garden? This cannot be undone.')) {
      setGarden([]);
      localStorage.removeItem('mood_garden');
    }
  };

  const getWeatherIcon = () => {
    const WeatherIcon = WEATHER_EFFECTS[currentWeather]?.icon || Sun;
    return WeatherIcon;
  };

  const getGardenBackground = () => {
    const weatherEffect = WEATHER_EFFECTS[currentWeather];
    const baseClasses = "min-h-screen transition-all duration-1000";
    
    switch (currentWeather) {
      case 'sunny':
        return `${baseClasses} bg-gradient-to-b from-yellow-200 via-green-100 to-green-300`;
      case 'rainy':
        return `${baseClasses} bg-gradient-to-b from-gray-400 via-blue-200 to-green-400`;
      case 'cloudy':
        return `${baseClasses} bg-gradient-to-b from-gray-300 via-gray-100 to-green-200`;
      case 'stormy':
        return `${baseClasses} bg-gradient-to-b from-gray-600 via-gray-400 to-green-500`;
      case 'perfect':
        return `${baseClasses} bg-gradient-to-b from-pink-200 via-purple-100 to-green-200`;
      default:
        return `${baseClasses} bg-gradient-to-b from-blue-200 via-green-100 to-green-300`;
    }
  };

  const moodEmojis = Object.keys(MOOD_TO_PLANT);

  return (
    <div className={getGardenBackground()}>
      <div className="relative max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            🌻 Your Mood Garden 🌻
          </h1>
          
          {/* Weather Display */}
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg">
              {React.createElement(getWeatherIcon(), { 
                className: "text-yellow-500", 
                size: 24 
              })}
              <span className="font-semibold text-gray-700">
                {currentWeather.charAt(0).toUpperCase() + currentWeather.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg">
              <TreePine className="text-green-600" size={20} />
              <span className="font-semibold text-gray-700">Level {gardenLevel}</span>
            </div>
          </div>

          {/* Garden Stats */}
          <div className="flex justify-center items-center space-x-6 flex-wrap gap-2">
            <div className="bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                🌱 {gardenStats.totalPlants} Plants
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                🌈 {gardenStats.uniqueTypes} Types
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                📅 {gardenStats.gardenAge} Days Old
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-lg px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                🔥 {gardenStats.longestStreak} Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">
            How are you feeling? Plant your mood! 🌱
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {moodEmojis.map((mood) => (
              <motion.button
                key={mood}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMood(mood)}
                className={`p-3 text-2xl rounded-full transition-all duration-200 ${
                  selectedMood === mood
                    ? 'ring-4 ring-green-400 shadow-lg bg-green-100'
                    : 'hover:shadow-md bg-white'
                } border-2 border-green-300`}
              >
                {mood}
              </motion.button>
            ))}
          </div>

          {selectedMood && (
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Selected: {selectedMood} → {MOOD_TO_PLANT[selectedMood].type}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => plantMood(selectedMood)}
                disabled={isPlanting}
                className={`px-8 py-3 rounded-full font-semibold text-white shadow-lg transition-all ${
                  isPlanting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                {isPlanting ? 'Planting... 🌱' : 'Plant in Garden 🌱'}
              </motion.button>
            </div>
          )}
        </div>

        {/* Garden Display */}
        <div className="relative bg-green-200/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden" style={{ minHeight: '400px' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-green-300/30 to-transparent"></div>
          
          {garden.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-green-700">
                <TreePine size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Your garden is empty</p>
                <p className="text-sm">Plant your first mood to start growing!</p>
              </div>
            </div>
          ) : (
            <div className="relative h-96 p-6">
              <AnimatePresence>
                {garden.map((plant) => {
                  const PlantComponent = PLANT_COMPONENTS[plant.type] || PLANT_COMPONENTS.default;
                  
                  return (
                    <motion.div
                      key={plant.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${plant.position.x}%`,
                        top: `${plant.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={`${plant.mood} - ${plant.type} (${plant.date})`}
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -5, 0],
                          rotate: [0, 2, -2, 0]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <PlantComponent size={plant.size} color={plant.color} />
                      </motion.div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                          {plant.mood} {plant.type}
                          <div className="text-xs opacity-75">{plant.date}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Weather Effects */}
              {currentWeather === 'rainy' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 h-4 bg-blue-400 opacity-60"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10px`
                      }}
                      animate={{
                        y: ['0vh', '100vh']
                      }}
                      transition={{
                        duration: 1 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
              )}

              {currentWeather === 'perfect' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Garden Controls */}
          <div className="absolute bottom-4 right-4 space-x-2">
            {garden.length > 0 && (
              <button
                onClick={clearGarden}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
              >
                Clear Garden
              </button>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-green-800 mb-4">🏆 Garden Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
              const isUnlocked = achievements.includes(key);
              
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isUnlocked
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : 'bg-gray-50 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className={`font-semibold ${isUnlocked ? 'text-green-800' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{showAchievement.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                  <p className="text-sm">{showAchievement.title}</p>
                  <p className="text-xs opacity-90">{showAchievement.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
