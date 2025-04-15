import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newUserMessage = { type: 'user', text: input };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botReply = {
        type: 'bot',
        text: 'I’m here for you 💙 Feel free to share anything on your mind.',
      };
      setMessages(prev => [...prev, botReply]);
    }, 800);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section className="max-w-2xl mx-auto my-8 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-[#f8f6ff] to-[#e8e4ff] border border-[#d3cfff]">
      <h3 className="text-2xl font-semibold text-center text-[#7a5fff] mb-4">💬 Talk to Mind Mate</h3>

      {/* Chat Box */}
      <div className="h-80 overflow-y-auto p-4 bg-white rounded-xl shadow-inner border border-gray-200 mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 max-w-xs text-sm rounded-2xl shadow-md ${
                msg.type === 'user'
                  ? 'bg-[#8f71ff] text-white rounded-br-none'
                  : 'bg-[#e9e4ff] text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="How are you feeling today?"
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8f71ff]"
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-[#8f71ff] hover:bg-[#7a5fff] text-white rounded-xl transition-all"
        >
          <FaPaperPlane />
        </button>
      </div>
    </section>
  );
}

export default ChatBot;
