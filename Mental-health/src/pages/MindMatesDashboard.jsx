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
    <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 flex flex-col">
      {/* 3-Column Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Desktop Only */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <DashboardTopHeader />

          {/* Dashboard Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-4 lg:pb-6">
            <div className="max-w-[1600px] mx-auto">
              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Upcoming Appointment */}
                  <UpcomingAppointmentCard />

                  {/* Activities Chart */}
                  <PatientActivitiesChart />

                  {/* Quick Actions - Mobile Only */}
                  <div className="lg:hidden grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/user/mood')}
                      className="p-4 bg-white rounded-2xl shadow-lg border border-purple-200 flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                        <Heart className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">Log Mood</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/user/fullchat')}
                      className="p-4 bg-white rounded-2xl shadow-lg border border-purple-200 flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center shadow-md">
                        <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-gray-900">AI Support</span>
                    </motion.button>
                  </div>
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="space-y-6">
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

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-purple-200 px-4 py-3 z-50 shadow-lg">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 min-w-[60px]"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg'
                      : 'bg-purple-100'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-700'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isActive ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default MindMatesDashboard;
