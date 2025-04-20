"use client";

import { Users, HeartHandshake, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ConnectSection() {
  return (
    <section id="connect" className="relative bg-white py-24 px-6 overflow-hidden">
      {/* Animated Background "COMING SOON" */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <motion.h1
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="text-[14vw] sm:text-[10vw] md:text-[8vw] font-extrabold text-[#bfb3f7] opacity-20 rotate-[-12deg] tracking-widest select-none uppercase blur-sm"
        >
          Coming Soon
        </motion.h1>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#7e5bef] to-[#a18aff] bg-clip-text text-transparent mb-4"
        >
          Connect with People Who Understand You
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-12"
        >
          Introducing <span className="font-semibold text-[#8f71ff]">Connect</span> – a safe, supportive space to share your journey, join circles, attend real-life meetups, and take part in stress-busting sessions. You're never alone with Mind Mates.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card Template */}
          {[
            {
              title: "Peer Support",
              Icon: HeartHandshake,
              desc: "Connect with people on similar mental health journeys. Share, listen, and grow together.",
            },
            {
              title: "Safe Circles",
              Icon: Users,
              desc: "Join moderated, private groups on shared experiences. A safe space to speak your mind.",
            },
            {
              title: "Real-World Meetups",
              Icon: MapPin,
              desc: "Attend events and support circles nearby. Relax, recharge, and find your people.",
            },
          ].map(({ title, Icon, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="backdrop-blur-md bg-white/40 border border-[#e8e0ff] rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-tr from-[#a18aff] to-[#7e5bef] rounded-full">
                  <Icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-[#6a4eeb]">{title}</h3>
              </div>
              <p className="text-gray-700 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
