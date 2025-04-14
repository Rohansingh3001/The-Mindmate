import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, MessageCircle, HeartPulse,
  BrainCog, Repeat, Gift
} from 'lucide-react';

const useCases = [
  {
    icon: <MessageCircle size={32} />,
    title: 'AI Chat Support',
    desc: 'Have conversations with a smart, empathetic AI that listens and supports you 24/7.'
  },
  {
    icon: <HeartPulse size={32} />,
    title: 'Mood Tracking',
    desc: 'Track your emotional trends and recognize patterns over time to improve self-awareness.'
  },
  {
    icon: <BrainCog size={32} />,
    title: 'Mindful Exercises',
    desc: 'Daily mindfulness prompts and exercises to boost mental clarity and calm.'
  },
  {
    icon: <Repeat size={32} />,
    title: 'Progress Monitoring',
    desc: 'Visualize your mental health journey with easy-to-understand progress graphs.'
  },
  {
    icon: <Sparkles size={32} />,
    title: 'Inspiration Boosts',
    desc: 'Receive personalized quotes and advice to keep you motivated.'
  },
  {
    icon: <Gift size={32} />,
    title: 'Rewards System',
    desc: 'Earn rewards for completing exercises and engaging in the app consistently.'
  },
];

const flowSteps = [
  {
    title: 'Start a Chat',
    desc: 'Open a session and connect with the AI instantly.',
    icon: <MessageCircle size={28} />,
  },
  {
    title: 'Express Your Thoughts',
    desc: 'Share how you’re feeling or what’s on your mind.',
    icon: <HeartPulse size={28} />,
  },
  {
    title: 'Receive AI Guidance',
    desc: 'Get responses that help you understand and cope.',
    icon: <BrainCog size={28} />,
  },
  {
    title: 'Reflect & Track Progress',
    desc: 'Review conversations and track emotional growth.',
    icon: <Repeat size={28} />,
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works" // 🔗 Added ID for nav linking
      className="bg-white py-20 px-6 md:px-20 text-gray-800"
    >
      {/* Section Title */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Explore the features of Mind Flow AIs that help you feel better, think clearer, and grow emotionally.
        </p>
      </motion.div>

      {/* Use Case Cards */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mb-20">
        {useCases.map((useCase, i) => (
          <motion.div
            key={useCase.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-[#f7f4fe] p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition"
          >
            <div className="text-[#8f71ff] mb-6 mx-auto w-16 h-16 flex items-center justify-center bg-[#ebe4ff] rounded-full">
              {useCase.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
            <p className="text-gray-600 text-sm">{useCase.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Process Flow - Vertical Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <h3 className="text-4xl font-bold mb-14">The Flow</h3>
        <div className="relative flex flex-col items-center mx-auto max-w-2xl">
          {flowSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="relative flex items-start mb-16"
            >
              {/* Vertical Line */}
              {i !== flowSteps.length - 1 && (
                <div className="absolute left-8 top-16 h-full w-1 bg-[#8f71ff]"></div>
              )}

              {/* Icon */}
              <div className="w-16 h-16 flex-shrink-0 rounded-full bg-[#ebe4ff] text-[#8f71ff] flex items-center justify-center z-10 text-2xl">
                {step.icon}
              </div>

              {/* Content */}
              <div className="ml-8 text-left max-w-md">
                <h4 className="text-xl font-semibold mb-2">{`${i + 1}. ${step.title}`}</h4>
                <p className="text-gray-600 text-base">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default HowItWorks;
