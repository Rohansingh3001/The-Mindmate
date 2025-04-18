import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaSignOutAlt, FaComments, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// or adjust path as necessary
import { fetchUserDetails } from '../firebase';

import ChatBot from '../components/ChatBot';
import Scheduler from '../components/Sheduler'; // ✅ Import Scheduler component
import MentalHealthChart from '../components/MentalHealthChart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MoodTracker from '../components/MoodTracker'; // ✅ new import

const User = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [userDetails, setUserDetails] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUserDetails();
      if (user) {
        setUserName(user.name);
        setUserDetails(user);
      }
    };
    getUser();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };
  const handleSaveMood = (moodEntry) => {
    // Later you can push this to Firestore
    console.log('Saved Mood:', moodEntry);
    // For now, optionally append to sampleMoodData
    // Or refetch from DB
  };

  // ✅ Add your sample mood data here (can later replace with real Firestore mood logs)
  const sampleMoodData = [
    { date: 'Apr 1', mood: 6 },
    { date: 'Apr 3', mood: 5 },
    { date: 'Apr 5', mood: 7 },
    { date: 'Apr 7', mood: 4 },
    { date: 'Apr 9', mood: 6 },
    { date: 'Apr 11', mood: 8 },
    { date: 'Apr 13', mood: 7 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f0e9ff] p-4 md:p-6 flex flex-col items-center text-gray-800">
      {/* Top Nav Bar */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        {/* Header and Hamburger */}
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#8f71ff]">MindFlow-AI</h1>

          {/* Hamburger (Mobile only) */}
          <button
            className="md:hidden text-[#8f71ff] text-2xl"
            onClick={() => setNavOpen(!navOpen)}
          >
            <FaBars />
          </button>
        </div>

        {/* Nav Buttons */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto transition-all duration-300 ease-in-out ${navOpen ? 'block' : 'hidden'
          } md:flex`}>
          <button
            onClick={() => setShowAccountModal(true)}
            className="text-[#8f71ff] border border-[#8f71ff] px-4 py-1 rounded-xl hover:bg-[#8f71ff] hover:text-white transition w-full sm:w-auto"
          >
            View Account
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-4 py-2 rounded-xl transition w-full sm:w-auto"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-xl mb-6"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <FaUserCircle className="text-4xl md:text-5xl text-[#8f71ff]" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Welcome back, {userName}!</h2>
            <p className="text-gray-600 text-sm md:text-base">Here’s your wellness dashboard 💖</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl">
        {/* Daily Quote */}
        <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg md:text-xl font-semibold text-[#8f71ff] mb-2">Daily Uplift ✨</h3>
          <p className="text-gray-700 italic text-sm md:text-base">
            “You don’t have to control your thoughts. You just have to stop letting them control you.”
            <br />
            <span className="block text-xs mt-2 text-gray-500">— Dan Millman</span>
          </p>
        </div>

        {/* Journal */}
        <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg md:text-xl font-semibold text-[#8f71ff] mb-2">Your Journal 📓</h3>
          <textarea
            className="w-full h-32 md:h-40 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#8f71ff] text-sm"
            placeholder="Write down your thoughts..."
          ></textarea>
          <button className="mt-3 bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-4 py-2 rounded-xl w-full md:w-auto">
            Save Entry
          </button>
        </div>
        {/* Mood Tracker */}
        <div className="mt-6 w-full max-w-5xl">
          <MoodTracker onSaveMood={handleSaveMood} />
        </div>

        {/* Chat Bot Launcher */}
        <div className="col-span-1 md:col-span-2 bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg md:text-xl font-semibold text-[#8f71ff]">Talk to Mind Mate 💬</h3>
            <FaComments className="text-xl md:text-2xl text-[#8f71ff]" />
          </div>
          <p className="text-gray-600 text-sm mb-2">
            Need someone to talk to? Open our AI-based support chat.
          </p>
          <button
            onClick={() => setShowChatBot(prev => !prev)}
            className="bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-4 py-2 rounded-xl w-full sm:w-auto"
          >
            {showChatBot ? 'Close Chatbot' : 'Launch Chatbot'}
          </button>
          {showChatBot && (
            <div className="mt-4">
              <ChatBot />
            </div>
          )}
        </div>

        {/* Scheduler */}
        <div className="col-span-1 md:col-span-2">
          <Scheduler userDetails={userDetails} />
        </div>
      </div>

      {/* Mood Chart */}
      <div className="mt-6 w-full max-w-5xl bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg md:text-xl font-semibold text-[#8f71ff] mb-3">Mood Progress 📈</h3>
        <MentalHealthChart moodData={sampleMoodData} />
      </div>

      {/* Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 md:p-6 rounded-2xl w-full max-w-md shadow-xl text-gray-800">
            <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#8f71ff]">👤 Account Details</h2>
            <p className="text-sm"><strong>Name:</strong> {userDetails?.name}</p>
            <p className="text-sm"><strong>Email:</strong> {userDetails?.email}</p>
            <p className="text-sm"><strong>UID:</strong> {userDetails?.uid}</p>
            <button
              onClick={() => setShowAccountModal(false)}
              className="mt-4 bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-4 py-2 rounded-xl w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default User;