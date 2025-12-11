import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function DashboardTopHeader() {
  const [userName, setUserName] = useState('User');
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get display name or extract from email
        const name = user.displayName || user.email?.split('@')[0] || 'User';
        setUserName(name);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white border-b border-lavender-200/50 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {greeting}, <span className="text-purple-600 font-extrabold">{userName}</span> 👋
          </h1>
          <p className="text-sm text-gray-700 mt-1 font-medium">Let's track your wellness today.</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-xl bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
          >
            <Bell className="w-5 h-5 text-purple-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Mobile Profile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-mindmate-500 to-lavender-500 flex items-center justify-center"
          >
            <span className="text-xl">👤</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopHeader;
