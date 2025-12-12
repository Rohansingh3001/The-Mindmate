import React, { useState, useEffect } from 'react';
import { Bell, Menu, Wallet, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function DashboardTopHeader() {
  const [userName, setUserName] = useState('User');
  const [balance, setBalance] = useState('0.0');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || user.email?.split('@')[0] || 'User';
        setUserName(name);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateBalance = () => {
      const walletBalance = localStorage.getItem("wallet_balance") || "0.0";
      setBalance(walletBalance);
    };
    updateBalance();
    window.addEventListener("walletUpdate", updateBalance);
    return () => window.removeEventListener("walletUpdate", updateBalance);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-lavender-200/50 dark:border-gray-700 sticky top-0 z-20">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-4">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {greeting}, <span className="text-purple-600 dark:text-purple-400 font-extrabold">{userName}</span> 👋
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">Let's track your wellness today.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Balance */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/user/topup')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-colors border border-purple-200 dark:border-purple-700"
          >
            <Wallet className="w-4 h-4 text-purple-700 dark:text-purple-300" />
            <span className="font-bold text-purple-900 dark:text-purple-200">₹{balance}</span>
          </motion.button>

          {/* Theme Switcher */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-yellow-200 hover:to-orange-200 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 flex items-center justify-center transition-all border border-yellow-200 dark:border-indigo-700"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-orange-600" />
              )}
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center justify-center transition-colors"
          >
            <Bell className="w-5 h-5 text-purple-700 dark:text-purple-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {greeting}!
              </h1>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">{userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Switcher - Mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-orange-600" />
                )}
              </motion.div>
            </motion.button>

            {/* Notifications - Mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-purple-700 dark:text-purple-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>
          </div>
        </div>

        {/* Balance Bar - Mobile */}
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Wallet Balance</span>
              </div>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">₹{balance}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/user/topup')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold text-sm shadow-lg"
          >
            Top Up
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopHeader;
