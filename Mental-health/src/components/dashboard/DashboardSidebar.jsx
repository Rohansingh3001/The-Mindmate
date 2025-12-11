import React from 'react';
import { Home, Heart, MessageCircle, Calendar, Settings, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/user/dashboard', color: 'from-purple-600 to-purple-500' },
  { icon: Heart, label: 'Mood Tracking', path: '/user/mood', color: 'from-pink-500 to-purple-500' },
  { icon: MessageCircle, label: 'AI Therapist', path: '/user/fullchat', color: 'from-purple-500 to-indigo-500' },
  { icon: Calendar, label: 'Appointments', path: '/user/appointments', color: 'from-purple-400 to-purple-600' },
  { icon: Settings, label: 'Settings', path: '/user/settings', color: 'from-gray-600 to-gray-700' },
];

function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    auth.signOut();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-white border-r border-lavender-200/50 sticky top-0 left-0">
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Rohan Singh</h3>
          <p className="text-sm text-purple-600 font-semibold">Premium Member</p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-100 to-purple-200 shadow-lg'
                    : 'hover:bg-purple-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <span className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/user/assessment')}
          className="mt-8 w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Activity className="w-5 h-5" strokeWidth={3} />
          Check Your Condition
        </motion.button>

        {/* Stats Card */}
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border border-purple-300 shadow-md">
          <p className="text-xs text-purple-800 font-bold mb-2">Wellness Streak 🔥</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">7</span>
            <span className="text-sm text-gray-800 font-semibold">days</span>
          </div>
          <div className="mt-3 h-2 bg-white/70 rounded-full overflow-hidden shadow-inner">
            <div className="h-full w-3/4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full shadow-sm"></div>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-4 w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <LogOut className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <span className="font-semibold text-red-700">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
