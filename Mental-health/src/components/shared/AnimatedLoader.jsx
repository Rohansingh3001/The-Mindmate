import React from 'react';
import { motion, useAnimationControls } from 'framer-motion';

// Word drop-in animation
const wordDrop = {
  hidden: { opacity: 0, y: -30, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.4,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

function AnimatedLoader() {
  const words = ['The', 'MindMates'];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#f7f4fe] via-[#ede6ff] to-[#f9f6ff] flex items-center justify-center">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{ delay: words.length * 0.4 + 0.6, duration: 1.5, ease: 'easeInOut' }}
        className="flex space-x-4 text-4xl sm:text-5xl font-extrabold text-[#8f71ff] tracking-wide"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={wordDrop}
            initial="hidden"
            animate="visible"
            className="drop-shadow-md"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default AnimatedLoader;
