import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ChatMockup from "./ChatMockup";
import AnimatedLoader from "./AnimatedLoader";

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
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
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 md:px-20 py-24 gap-y-16 lg:gap-x-24 bg-gradient-to-br from-[#f7f4fe] via-[#ede6ff] to-[#f9f6ff]"
    >
      {/* Left Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 text-center lg:text-left"
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
            className="text-md sm:text-lg text-mindmate-700 mt-4 font-semibold tracking-wide"
          >
            Because no one should have to fight their mental battles alone.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl mt-6 text-gray-700 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            The MindMates blends cutting-edge AI with human empathy — offering
            teens and young adults someone to talk to, whenever they need it most.
          </motion.p>
        </header>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
        >
          <Link to="/signup" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0px 0px 12px #8f71ff" }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-mindmate-500 to-mindmate-600 hover:from-mindmate-600 hover:to-mindmate-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg transition-all w-full sm:w-auto"
            >
              💬 Start Chatting
            </motion.button>
          </Link>

          <a href="/about" className="w-full sm:w-auto">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#ffffff",
                boxShadow: "0px 0px 8px #d1c6ff",
              }}
              whileTap={{ scale: 0.96 }}
              className="border-2 border-mindmate-600 bg-white text-mindmate-700 text-lg font-bold px-8 py-4 rounded-xl transition-all w-full sm:w-auto shadow-sm"
            >
              ✨ Learn More
            </motion.button>
          </a>
        </motion.div>
      </motion.div>

      {/* Right Chat Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full max-w-[500px] sm:max-w-[540px] md:max-w-[580px] lg:w-1/2"
      >
        <div className="flex justify-center lg:justify-end w-full">
          <ChatMockup />
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
