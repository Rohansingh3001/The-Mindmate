// client/components/Chat/MessageBubble.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCheck, Heart, Reply, MoreHorizontal } from "lucide-react";

export default function MessageBubble({ msg, isMine }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div
      className={`flex ${isMine ? "justify-end" : "justify-start"} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isMine ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        {!isMine && (
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mb-1">
            {msg.from?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div className="relative">
          {/* Message Bubble */}
          <motion.div
            className={`relative rounded-2xl px-4 py-3 shadow-sm ${
              isMine
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-br-md"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md"
            }`}
            layout
          >
            {/* Message Content */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.text}
            </p>

            {/* Message Info */}
            <div className={`flex items-center gap-1 mt-1 ${
              isMine ? "justify-end" : "justify-start"
            }`}>
              <span className={`text-xs ${
                isMine ? "text-purple-100" : "text-gray-500 dark:text-gray-400"
              }`}>
                {formatTime(msg.timestamp)}
              </span>
              
              {isMine && (
                <div className="flex items-center">
                  {msg.read ? (
                    <CheckCheck size={14} className="text-blue-200" />
                  ) : (
                    <Check size={14} className="text-purple-200" />
                  )}
                </div>
              )}
            </div>

            {/* Message Tail */}
            <div className={`absolute bottom-0 w-4 h-4 ${
              isMine 
                ? "right-0 bg-gradient-to-r from-purple-500 to-purple-600" 
                : "left-0 bg-white dark:bg-gray-700 border-l border-b border-gray-200 dark:border-gray-600"
            }`} style={{
              clipPath: isMine 
                ? "polygon(0 0, 100% 0, 0 100%)" 
                : "polygon(100% 0, 0 0, 100% 100%)"
            }}></div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              scale: isHovered ? 1 : 0.8 
            }}
            className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${
              isMine ? "-left-20" : "-right-20"
            }`}
          >
            <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Reply size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Heart size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <MoreHorizontal size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
          </motion.div>
        </div>

        {/* My Avatar */}
        {isMine && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mb-1">
            You
          </div>
        )}
      </div>
    </motion.div>
  );
}
