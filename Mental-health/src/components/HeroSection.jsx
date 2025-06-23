import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import image from '../assets/image.png';
import AnimatedLoader from './AnimatedLoader';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

function HeroSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AnimatedLoader />;

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-24 gap-y-14 md:gap-x-20 bg-gradient-to-br from-[#f7f4fe] via-[#ede6ff] to-[#f9f6ff]"
    >
      {/* Left Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex-[1.1] text-center md:text-left"
      >
        <header>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
          >
            Your AI Mental Health <br />
            <span className="text-[#8f71ff]">Companion 💜</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-md sm:text-lg text-indigo-500 mt-4 font-medium tracking-wide"
          >
            Because no one should have to fight their mental battles alone.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl mt-6 text-gray-600 max-w-md mx-auto md:mx-0 leading-relaxed"
          >
            The MindMates blends cutting-edge AI with human empathy — offering
            teens and young adults someone to talk to, whenever they need it
            most.
          </motion.p>
        </header>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
        >
          <Link to="/signup" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0px 0px 12px #8f71ff' }}
              whileTap={{ scale: 0.96 }}
              className="bg-[#8f71ff] hover:bg-[#7b60e8] text-white text-lg px-6 py-3 rounded-xl shadow-lg transition-all w-full sm:w-auto"
            >
              💬 Start Chatting
            </motion.button>
          </Link>

          <a href="#our-story" className="w-full sm:w-auto">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: '#eeeaff',
                boxShadow: '0px 0px 8px #d1c6ff',
              }}
              whileTap={{ scale: 0.96 }}
              className="border border-[#8f71ff] text-[#8f71ff] text-lg px-6 py-3 rounded-xl transition-all w-full sm:w-auto"
            >
              ✨ Learn More
            </motion.button>
          </a>
        </motion.div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="flex-[1.1] max-w-xl w-full"
      >
        <motion.img
          src={image}
          alt="Illustration of The MindMates Chat UI"
          className="rounded-3xl shadow-2xl w-full"
          animate={{ y: [0, -8, 0], rotate: [0, 0.3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;
