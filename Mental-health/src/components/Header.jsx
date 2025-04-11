import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const navItems = ['Home', 'Doctor', 'Testimonials', 'About'];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl font-extrabold tracking-tight text-[#8f71ff]"
        >
          Mind Mates
        </motion.h1>

        {/* Desktop Navigation */}
        <nav className="space-x-8 text-lg hidden md:flex">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ scale: 1.1 }}
              className="text-black font-medium relative inline-block transition duration-300 hover:text-[#8f71ff] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#8f71ff] after:transition-all after:duration-300 hover:after:w-full"
              transition={{ delay: 0.1 * index }}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <motion.button
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            className="text-3xl text-[#8f71ff]"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 w-full bg-white/90 border-t border-white/30 shadow-lg md:hidden"
        >
          <div className="flex flex-col items-center py-4 space-y-4">
            {navItems.map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg text-black font-medium hover:text-[#8f71ff]"
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Header;
