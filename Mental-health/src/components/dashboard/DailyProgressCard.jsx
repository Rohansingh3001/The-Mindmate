import React from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

function DailyProgressCard() {
  const progress = 65; // percentage completed
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Progress</h3>

      <div className="flex items-center justify-center mb-6">
        {/* Circular Progress */}
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e9d5ff"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="url(#progress-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{progress}%</span>
            <span className="text-xs text-gray-700 font-semibold">Complete</span>
          </div>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-600" />
          Today's Goals
        </h4>

        {/* Goal Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-purple-100 rounded-xl border border-purple-200">
            <span className="text-sm text-gray-800 font-semibold">Morning meditation</span>
            <span className="text-xl">✅</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-purple-100 rounded-xl border border-purple-200">
            <span className="text-sm text-gray-800 font-semibold">Log mood 3x</span>
            <span className="text-sm text-purple-700 font-bold">2/3</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-100 rounded-xl border border-gray-200">
            <span className="text-sm text-gray-700 font-medium">Evening journal</span>
            <span className="text-sm text-gray-600 font-semibold">Pending</span>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700 font-semibold">Current Streak</span>
          </div>
          <span className="text-lg font-bold text-gray-900">7 days 🔥</span>
        </div>
      </div>
    </motion.div>
  );
}

export default DailyProgressCard;
