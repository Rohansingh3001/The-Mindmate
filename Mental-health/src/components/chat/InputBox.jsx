// client/components/Chat/InputBox.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Image, 
  Camera,
  Plus,
  X
} from "lucide-react";

export default function InputBox({ onSend }) {
  const [text, setText] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const attachmentOptions = [
    { icon: Image, label: "Photo", color: "bg-blue-500" },
    { icon: Camera, label: "Camera", color: "bg-green-500" },
    { icon: Paperclip, label: "Document", color: "bg-purple-500" },
  ];

  return (
    <div className="p-4">
      {/* Attachment Options */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showAttachments ? "auto" : 0,
          opacity: showAttachments ? 1 : 0 
        }}
        className="overflow-hidden mb-3"
      >
        <div className="flex gap-3 py-2">
          {attachmentOptions.map((option, index) => (
            <motion.button
              key={option.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: showAttachments ? 1 : 0,
                opacity: showAttachments ? 1 : 0
              }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl ${option.color} text-white hover:scale-105 transition-transform`}
              onClick={() => fileInputRef.current?.click()}
            >
              <option.icon size={20} />
              <span className="text-xs font-medium">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Input Area */}
      <div className="flex items-end gap-3">
        {/* Attachment Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAttachments(!showAttachments)}
          className={`p-3 rounded-full transition-all ${
            showAttachments 
              ? "bg-purple-500 text-white rotate-45" 
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {showAttachments ? <X size={20} /> : <Plus size={20} />}
        </motion.button>

        {/* Input Container */}
        <div className="flex-1 relative">
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus-within:border-purple-500 dark:focus-within:border-purple-400 transition-colors">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none border-none outline-none max-h-32 min-h-[20px]"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '20px',
                maxHeight: '128px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <Smile size={18} />
                </button>
                <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <Paperclip size={18} />
                </button>
              </div>
              
              <div className="text-xs text-gray-400">
                {text.length > 0 && `${text.length} characters`}
              </div>
            </div>
          </div>
        </div>

        {/* Voice/Send Button */}
        <div className="flex gap-2">
          {text.trim() === "" ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-all ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Mic size={20} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full transition-all shadow-lg"
            >
              <Send size={20} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        onChange={(e) => {
          // Handle file upload
          console.log("Files selected:", e.target.files);
        }}
      />

      {/* Recording indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-center gap-2 text-red-500"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Recording...</span>
        </motion.div>
      )}
    </div>
  );
}
