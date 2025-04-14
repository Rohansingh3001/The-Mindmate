import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaSignOutAlt, FaComments, FaBookOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here if using auth
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f0e9ff] p-6 flex flex-col items-center text-gray-800">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#8f71ff]">Mind Mates 🌟</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-4 py-2 rounded-xl transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl mb-6"
      >
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-5xl text-[#8f71ff]" />
          <div>
            <h2 className="text-2xl font-semibold">Welcome back, User!</h2>
            <p className="text-gray-600">Here’s your wellness dashboard 💖</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Daily Quote */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-[#8f71ff] mb-3">Daily Uplift ✨</h3>
          <p className="text-gray-700 italic">
            “You don’t have to control your thoughts. You just have to stop letting them control you.”
            <br />
            <span className="block text-sm mt-2 text-gray-500">— Dan Millman</span>
          </p>
        </div>

        {/* Journal */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-[#8f71ff] mb-3">Your Journal 📓</h3>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#8f71ff]"
            placeholder="Write down your thoughts..."
          ></textarea>
          <button className="mt-3 bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-4 py-2 rounded-xl">
            Save Entry
          </button>
        </div>

        {/* Chat Bot */}
        <div className="col-span-1 md:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-[#8f71ff]">Talk to Mind Mate 💬</h3>
            <FaComments className="text-2xl text-[#8f71ff]" />
          </div>
          <p className="text-gray-600 mb-2">
            Need someone to talk to? Open our AI-based support chat.
          </p>
          <button className="bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-4 py-2 rounded-xl">
            Launch Chatbot
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
