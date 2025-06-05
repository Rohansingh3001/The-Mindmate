import React from 'react';
import { motion } from 'framer-motion';
import chatImage from '../assets/image.png';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section
      id="home" // 🔗 Added this to link from the header nav
      className="bg-[#f7f4fe] min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 gap-y-12 md:gap-x-20"
    >
      {/* Left content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8 }} 
        className="flex-[1.1] text-center md:text-left"
      >
        <header>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Your AI Mental Health <br />
            <span className="text-[#8f71ff]">Companion</span>
          </h1>
          <p className="text-lg sm:text-xl mt-6 text-gray-600 max-w-md mx-auto md:mx-0">
            The MindMates uses AI to provide personalized mental health support, whenever and wherever you need it. Your safe space to talk, reflect, and grow.
          </p>
        </header>

         {/* CTA buttons */}
<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
  <Link to="/signup" className="w-full sm:w-auto">
    <button className="bg-[#8f71ff] hover:bg-[#7b60e8] text-white text-lg px-6 py-3 rounded-xl shadow transition-all w-full sm:w-auto">
      💬 Start Chatting
    </button>
  </Link>

  <Link to="/signup" className="w-full sm:w-auto">
    <button className="border border-[#8f71ff] text-[#8f71ff] hover:bg-[#eeeaff] text-lg px-6 py-3 rounded-xl transition-all w-full sm:w-auto">
      ✨ Learn More
    </button>
  </Link>
</div>

      </motion.div>

      {/* Right content (Chat Image / Component) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }} 
        className="flex-[1.1] max-w-xl w-full"
      >
        <img 
          src={chatImage} 
          alt="Illustration of The MindMates Chat UI" 
          className="rounded-3xl shadow-xl w-full"
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;
