import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Video, 
  MessageSquare, 
  Copy, 
  Plus,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Clock,
  CheckCircle,
  WifiOff,
  Wifi
} from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getConnectionStatus } from '../utils/chatHelpers';

export default function PeerConnect() {
  const [peerId, setPeerId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [myPeerId, setMyPeerId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ isConnected: false, socket: false });
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        // Generate a unique peer ID based on user
        const generatedId = `${user.uid.slice(0, 8)}_${Date.now().toString().slice(-4)}`;
        setMyPeerId(generatedId);
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = () => {
      const status = getConnectionStatus();
      setConnectionStatus(status);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateRandomDemo = () => {
    const demoId = `demo_${Math.random().toString(36).substr(2, 6)}`;
    setPeerId(demoId);
  };

  const startChat = () => {
    if (peerId.trim()) {
      setIsConnecting(true);
      // Add small delay for better UX
      setTimeout(() => {
        navigate(`/chat/${peerId.trim()}`);
      }, 500);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  MindMate Connect
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Secure peer-to-peer communication
                  </p>
                  {connectionStatus.isConnected ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Wifi size={12} />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <WifiOff size={12} />
                      <span>Connecting...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Link
              to="/user"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            Connect with Peers
          </div>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Start Your Private Conversation
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect securely with other users for private chats and video calls. 
            Your conversations are encrypted and private.
          </p>
        </motion.div>

        {/* Main Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Your ID Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-purple-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Shield className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Your Connection ID
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share this with people you want to connect with
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your ID:</p>
                  <code className="text-lg font-mono font-semibold text-purple-700 dark:text-purple-300 break-all">
                    {myPeerId}
                  </code>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(myPeerId)}
                  className="ml-3 p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                >
                  {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                </motion.button>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-green-500" />
                <span>End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span>Real-time communication</span>
              </div>
            </div>
          </motion.div>

          {/* Connect Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-purple-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <MessageSquare className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Connect to Someone
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter their connection ID to start chatting
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Peer Connection ID
                </label>
                <input
                  type="text"
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  placeholder="Enter peer ID (e.g., abc123_4567)"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-white transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={generateRandomDemo}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Generate Demo ID
                </button>
                
                <motion.button
                  whileHover={{ scale: peerId ? 1.02 : 1 }}
                  whileTap={{ scale: peerId ? 0.98 : 1 }}
                  onClick={startChat}
                  disabled={!peerId.trim() || isConnecting}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                    peerId.trim() && !isConnecting
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg' 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isConnecting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Plus size={18} />
                      Start Chat
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
        >
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="text-white" size={20} />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
              Instant Chat
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Real-time messaging with typing indicators
            </p>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Video className="text-white" size={20} />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
              Video Calls
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              HD video calling with screen sharing
            </p>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="text-white" size={20} />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
              Secure
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              End-to-end encrypted communications
            </p>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 text-center border border-purple-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="text-white" size={20} />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
              Support
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Mental health focused conversations
            </p>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              How to Connect with Someone
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Share Your ID
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Copy your connection ID and share it with the person you want to chat with
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Enter Their ID
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get their connection ID and enter it in the connect form
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Start Chatting
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Begin your secure conversation with text messages or video calls
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
