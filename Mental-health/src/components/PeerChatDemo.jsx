import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Video, 
  MessageSquare, 
  Copy, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function PeerChatDemo() {
  const [peerId, setPeerId] = useState('');
  const [currentUserId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);

  const generateRandomPeerId = () => {
    return `peer_${Math.random().toString(36).substr(2, 9)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            Peer Chat Demo
          </div>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Test Your Peer Chat
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience real-time messaging and video calling with WebRTC technology
          </p>
        </motion.div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Current User Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-purple-100 dark:border-gray-700 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Your ID
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share this with others
                </p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <code className="text-sm font-mono text-gray-800 dark:text-white">
                {currentUserId}
              </code>
              <button
                onClick={() => copyToClipboard(currentUserId)}
                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </motion.div>

          {/* Connect to Peer Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-purple-100 dark:border-gray-700 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Connect to Peer
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter their peer ID
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                value={peerId}
                onChange={(e) => setPeerId(e.target.value)}
                placeholder="Enter peer ID..."
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-white"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPeerId(generateRandomPeerId())}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                >
                  Generate Demo ID
                </button>
                
                <Link
                  to={peerId ? `/chat/${peerId}` : '#'}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors ${
                    peerId 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    Start Chat
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          {/* Real-time Chat */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Real-time Chat
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Instant messaging with typing indicators and file sharing
            </p>
          </div>

          {/* Video Calling */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Video Calls
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              High-quality WebRTC video calls with screen sharing
            </p>
          </div>

          {/* Peer-to-Peer */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              P2P Connection
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Direct peer-to-peer communication for privacy and speed
            </p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            How to Test:
          </h3>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">1</span>
              Open this page in two different browser tabs/windows
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">2</span>
              Copy your ID from the first tab and paste it in the second tab
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">3</span>
              Click "Start Chat" to begin messaging
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">4</span>
              Try the video call feature by clicking the video button
            </li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
