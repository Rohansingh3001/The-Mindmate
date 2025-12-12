import React from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopHeader from '../components/dashboard/DashboardTopHeader';
import UpcomingAppointmentCard from '../components/dashboard/UpcomingAppointmentCard';
import PatientActivitiesChart from '../components/dashboard/PatientActivitiesChart';
import DailyProgressCard from '../components/dashboard/DailyProgressCard';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import AppointmentList from '../components/dashboard/AppointmentList';
import { Home, Heart, MessageCircle, Calendar, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// MindMates Wellness Dashboard - Purple Theme
function MindMatesDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const bottomNavItems = [
    { icon: Home, label: 'Dashboard', path: '/user/dashboard' },
    { icon: Heart, label: 'Mood', path: '/user/mood' },
    { icon: MessageCircle, label: 'AI Chat', path: '/user/fullchat' },
    { icon: Calendar, label: 'Sessions', path: '/user/appointments' },
    { icon: Settings, label: 'Settings', path: '/user/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* 3-Column Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Desktop Only */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <DashboardTopHeader />

          {/* Dashboard Content */}
          <main className="flex-1 p-3 md:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-6">
            <div className="max-w-[1600px] mx-auto">
              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  {/* Upcoming Appointment */}
                  <UpcomingAppointmentCard />

                  {/* Quick Actions - Mobile Only */}
                  <div className="lg:hidden grid grid-cols-2 gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/user/mood')}
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                        <Heart className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Track Mood</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Log your feelings</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/user/fullchat')}
                      className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">AI Therapist</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Chat now</span>
                    </motion.button>
                  </div>

                  {/* Activities Chart */}
                  <PatientActivitiesChart />
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="space-y-4 md:space-y-6">
                  {/* Daily Progress */}
                  <DailyProgressCard />

                  {/* Calendar */}
                  <CalendarWidget />

                  {/* Appointments List */}
                  <AppointmentList />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Enhanced */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-xl border border-gray-200 dark:border-gray-700 pointer-events-auto backdrop-blur-xl bg-white/95 dark:bg-gray-800/95">
          <div className="flex items-center justify-around px-2 py-3">
            {bottomNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex flex-col items-center gap-1 min-w-[60px] px-2 py-1"
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Icon Container */}
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
                    />
                  </div>
                  
                  {/* Label */}
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
    </div>
  );
}

export default MindMatesDashboard;
