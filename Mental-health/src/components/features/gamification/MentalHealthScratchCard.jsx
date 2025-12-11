import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Star, Trophy, Heart, Sparkles, RefreshCw, Info } from 'lucide-react';

const REWARDS = [
  { id: 1, type: 'tip', title: 'Mental Health Tip', content: 'Taking breaks throughout your day helps reduce stress and improve focus.', xp: 10, icon: '💡' },
  { id: 2, type: 'affirmation', title: 'Daily Affirmation', content: 'You are capable of overcoming any challenge that comes your way.', xp: 10, icon: '💪' },
  { id: 3, type: 'tip', title: 'Self-Care Reminder', content: 'Remember to drink water and take deep breaths regularly.', xp: 10, icon: '💧' },
  { id: 4, type: 'affirmation', title: 'Positive Thought', content: 'Your feelings are valid, and it\'s okay to take time for yourself.', xp: 10, icon: '🌟' },
  { id: 5, type: 'xp_boost', title: 'XP Bonus!', content: 'You earned bonus experience points!', xp: 25, icon: '⭐' },
  { id: 6, type: 'tip', title: 'Mindfulness Tip', content: 'Try a 5-minute breathing exercise to center yourself today.', xp: 10, icon: '🧘‍♀️' },
  { id: 7, type: 'affirmation', title: 'Encouragement', content: 'Every small step you take towards better mental health matters.', xp: 10, icon: '🌈' },
  { id: 8, type: 'xp_boost', title: 'Lucky Day!', content: 'Double XP reward for your consistency!', xp: 50, icon: '🎉' },
  { id: 9, type: 'tip', title: 'Connection Tip', content: 'Reach out to a friend or loved one today. Connection is vital for wellbeing.', xp: 10, icon: '🤝' },
  { id: 10, type: 'affirmation', title: 'Self-Love', content: 'You deserve kindness, especially from yourself.', xp: 10, icon: '❤️' },
  { id: 11, type: 'tip', title: 'Sleep Hygiene', content: 'Try to maintain a consistent sleep schedule for better mental clarity.', xp: 10, icon: '😴' },
  { id: 12, type: 'xp_boost', title: 'Mega Bonus!', content: 'Incredible! Triple XP for your dedication!', xp: 100, icon: '🏆' },
];

export default function MentalHealthScratchCard() {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [todayReward, setTodayReward] = useState(null);
  const [canScratch, setCanScratch] = useState(true);
  const [nextAvailableTime, setNextAvailableTime] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    checkDailyLimit();
    loadTodayReward();
    initCanvas();
  }, []);

  const checkDailyLimit = () => {
    const lastScratchDate = localStorage.getItem('last_scratch_date');
    const today = new Date().toDateString();
    
    if (lastScratchDate === today) {
      // Already scratched today
      setCanScratch(false);
      setIsScratched(true);
      
      // Calculate next available time
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      setNextAvailableTime(tomorrow);
    } else {
      // New day, reset
      setCanScratch(true);
      setIsScratched(false);
    }
  };

  const loadTodayReward = () => {
    const savedReward = JSON.parse(localStorage.getItem('today_scratch_reward') || 'null');
    const lastScratchDate = localStorage.getItem('last_scratch_date');
    const today = new Date().toDateString();
    
    if (savedReward && lastScratchDate === today) {
      // Show already revealed reward
      setTodayReward(savedReward);
      setIsScratched(true);
    } else {
      // Generate new random reward
      const randomReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      setTodayReward(randomReward);
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 340;
    const height = 220;
    
    canvas.width = width;
    canvas.height = height;

    // Draw scratch-off layer
    ctx.fillStyle = '#d4d4d8';
    ctx.fillRect(0, 0, width, height);

    // Add pattern
    for (let i = 0; i < width; i += 20) {
      ctx.fillStyle = i % 40 === 0 ? '#a1a1aa' : '#d4d4d8';
      ctx.fillRect(i, 0, 20, height);
    }

    // Add text hint
    ctx.fillStyle = '#52525b';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal', width / 2, height / 2 - 10);
    ctx.font = '16px Arial';
    ctx.fillText('Your Daily Reward', width / 2, height / 2 + 20);
  };

  const handleScratch = (e) => {
    if (!canScratch || isScratched) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const progress = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchProgress(progress);

    // Complete scratch at 60%
    if (progress > 60 && !isScratched) {
      completeScratch();
    }
  };

  const completeScratch = () => {
    setIsScratched(true);
    setCanScratch(false);

    // Save to localStorage
    const today = new Date().toDateString();
    localStorage.setItem('last_scratch_date', today);
    localStorage.setItem('today_scratch_reward', JSON.stringify(todayReward));

    // Award XP
    const currentXP = parseInt(localStorage.getItem('user_xp') || '0');
    const newXP = currentXP + todayReward.xp;
    localStorage.setItem('user_xp', newXP.toString());

    // Update level
    const newLevel = Math.floor(newXP / 100) + 1;
    localStorage.setItem('user_level', newLevel.toString());

    // Confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
    });

    // Clear canvas to show reward
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleReset = () => {
    // For testing only - remove in production
    localStorage.removeItem('last_scratch_date');
    localStorage.removeItem('today_scratch_reward');
    setIsScratched(false);
    setCanScratch(true);
    setScratchProgress(0);
    loadTodayReward();
    initCanvas();
  };

  const formatTimeUntilNext = () => {
    if (!nextAvailableTime) return '';
    
    const now = new Date();
    const diff = nextAvailableTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            🎁 Daily Scratch Card
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Scratch once per day for mental health tips, affirmations, and bonus XP!
          </p>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <Info size={20} className="inline mr-1" />
            How it works
          </button>

          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300"
            >
              <p>✨ Get one scratch card per day</p>
              <p>🎯 Scratch to reveal rewards: tips, affirmations, or bonus XP</p>
              <p>⭐ Earn 10-100 XP depending on your luck</p>
              <p>🔄 New card available every day at midnight</p>
            </motion.div>
          )}
        </div>

        {/* Status Badge */}
        {!canScratch && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-center">
            <p className="text-yellow-800 dark:text-yellow-300 font-medium">
              ⏰ You've already scratched today! Come back in {formatTimeUntilNext()}
            </p>
          </div>
        )}

        {/* Scratch Card Container */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-200 dark:border-purple-700">
          <div className="relative mx-auto" style={{ width: '340px', height: '220px' }}>
            
            {/* Reward Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl flex flex-col items-center justify-center p-6 text-center">
              {todayReward && (
                <>
                  <div className="text-6xl mb-3">{todayReward.icon}</div>
                  <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                    {todayReward.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {todayReward.content}
                  </p>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold">
                    +{todayReward.xp} XP
                  </div>
                </>
              )}
            </div>

            {/* Scratch Canvas */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 rounded-xl ${canScratch && !isScratched ? 'cursor-pointer' : 'pointer-events-none'}`}
              onMouseDown={() => setIsScratching(true)}
              onMouseUp={() => setIsScratching(false)}
              onMouseMove={(e) => isScratching && handleScratch(e)}
              onMouseLeave={() => setIsScratching(false)}
              onTouchStart={() => setIsScratching(true)}
              onTouchEnd={() => setIsScratching(false)}
              onTouchMove={(e) => handleScratch(e)}
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Progress Bar */}
          {!isScratched && canScratch && scratchProgress > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Scratch Progress</span>
                <span>{Math.round(scratchProgress)}%</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scratchProgress}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Instruction */}
          {canScratch && !isScratched && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm">
              💫 Click/tap and drag to scratch off the card
            </p>
          )}

          {/* Completion Message */}
          {isScratched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center space-y-3"
            >
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-4">
                <p className="text-green-800 dark:text-green-300 font-semibold">
                  ✅ Reward Claimed! +{todayReward.xp} XP earned
                </p>
              </div>
              
              {!canScratch && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  🔄 Come back tomorrow for a new scratch card!
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-200 dark:border-purple-700">
            <Star className="mx-auto text-yellow-500 mb-2" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {localStorage.getItem('user_xp') || '0'}
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-200 dark:border-purple-700">
            <Trophy className="mx-auto text-purple-500 mb-2" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {localStorage.getItem('user_level') || '1'}
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-200 dark:border-purple-700">
            <Gift className="mx-auto text-pink-500 mb-2" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Cards Scratched</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {localStorage.getItem('total_scratches') || '0'}
            </p>
          </div>
        </div>

        {/* Dev Reset Button - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center">
            <button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={16} className="inline mr-2" />
              Reset Card (Dev Only)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
