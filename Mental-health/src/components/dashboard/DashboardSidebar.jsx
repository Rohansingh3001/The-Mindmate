// src/components/layout/DashboardSidebar.jsx
import React from "react";
import { Home, Heart, MessageCircle, Calendar, Settings, Activity, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/user/dashboard", color: "bg-gradient-to-br from-purple-600 to-purple-500" },
  { icon: Heart, label: "Mood Tracking", path: "/user/mood", color: "bg-gradient-to-br from-pink-500 to-purple-500" },
  { icon: MessageCircle, label: "AI Therapist", path: "/user/fullchat", color: "bg-gradient-to-br from-purple-500 to-indigo-500" },
  // Sessions / Appointments
  { icon: Calendar, label: "Sessions", path: "/user/appointments", color: "bg-gradient-to-br from-purple-400 to-purple-600" },
  { icon: Settings, label: "Settings", path: "/user/settings", color: "bg-gradient-to-br from-gray-600 to-gray-700" },
];

function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/login");
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 h-screen bg-gradient-to-b from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 border-r border-purple-200/30 dark:border-gray-700 sticky top-0 left-0 shadow-xl">
      <div className="p-6 flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="mb-6 pb-6 border-b border-purple-200/50 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h2 className="font-extrabold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
               The MindMates
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your wellness companion</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6 p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-sm">
          <div className="relative mb-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-1 shadow-lg"
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <span className="text-3xl" aria-hidden>👤</span>
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-3 border-white dark:border-gray-800 shadow-lg flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Rohan Singh</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-md">
              <span className="text-xs font-bold text-white">👑 Premium</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg shadow-purple-500/30" 
                    : "hover:bg-white dark:hover:bg-gray-700/50 hover:shadow-md"
                  }
                  focus:outline-none focus:ring-2 focus:ring-purple-400`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon container with gradient */}
                <motion.div
                  whileHover={{ rotate: isActive ? 0 : 5 }}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    isActive 
                      ? "bg-white/20 shadow-inner" 
                      : "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 group-hover:from-purple-200 group-hover:to-pink-200"
                  }`}
                >
                  <item.icon
                    className={`${isActive ? "text-white" : "text-purple-600 dark:text-purple-400 group-hover:text-purple-700"}`}
                    strokeWidth={2.5}
                    size={20}
                    aria-hidden
                  />
                </motion.div>

                <div className="flex-1 text-left">
                  <span className={`font-bold text-sm ${isActive ? "text-white" : "text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400"}`}>
                    {item.label}
                  </span>
                </div>

                {/* Arrow indicator for active */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white"
                  >
                    →
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/user/assessment")}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-purple-500/40 transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden group"
          title="Check Your Condition"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <Activity className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
          <span className="relative z-10">Health Assessment</span>
        </motion.button>

        {/* Stats Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mt-5 p-5 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-300/20 to-yellow-300/20 rounded-full -mr-10 -mt-10" />
          <div className="relative z-10">
            <p className="text-xs text-orange-800 dark:text-orange-300 font-bold mb-2 flex items-center gap-1">
              <span>🔥</span> Wellness Streak
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">7</span>
              <span className="text-sm text-gray-800 dark:text-gray-300 font-semibold">days strong!</span>
            </div>
            <div className="h-2.5 bg-white/60 dark:bg-gray-700/60 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-lg"
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">3 days to next milestone! 🎯</p>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-4 w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 border border-red-200 dark:border-red-800 transition-all duration-150 shadow-sm hover:shadow-md group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <LogOut className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-red-700 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-red-300">Logout</span>
        </motion.button>
      </div>
    </aside>

      {/* Mobile Bottom Navigation - Enhanced Modern Design */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-xl border border-gray-200 dark:border-gray-700 pointer-events-auto backdrop-blur-xl bg-white/95 dark:bg-gray-800/95">
          <div className="flex justify-around items-center px-2 py-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex flex-col items-center gap-1 min-w-[60px] px-2 py-1"
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                >
                  {/* Active Indicator - Animated */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      aria-hidden="true"
                    />
                  )}
                  
                  {/* Icon Container - Modern gradient with scale effect */}
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-500 dark:to-purple-600 shadow-lg scale-110'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <item.icon
                      className={`w-6 h-6 transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                      aria-hidden="true"
                    />
                  </div>
                  
                  {/* Label - Bold for active state */}
                  <span
                    className={`text-[10px] font-bold transition-colors duration-200 ${
                      isActive ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

export default DashboardSidebar;
