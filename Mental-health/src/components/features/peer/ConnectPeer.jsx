import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageSquare,
  Minimize2,
  Maximize2,
  Settings,
  MoreVertical
} from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "../../chat/ChatWindow";
import VideoCall from "./VideoCall";
import { initChatConnection } from "../../../utils/chatHelpers";

export default function ConnectPeer() {
  const { peerId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState("");
  const [peerInfo, setPeerInfo] = useState(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [userStatus, setUserStatus] = useState("online");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && peerId) {
        const uid = user.uid;
        const generatedChatId = [uid, peerId].sort().join("_");

        setCurrentUser(uid);
        setChatId(generatedChatId);
        initChatConnection(uid);

        // fetch peer info
        try {
          const docRef = doc(db, "peers", peerId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPeerInfo(docSnap.data());
          } else {
            console.warn("Peer not found.");
          }
        } catch (err) {
          console.error("Error fetching peer info", err);
        }
      }
    });

    return () => unsubscribe();
  }, [peerId]);

  const startVideoCall = () => {
    setIsVideoCallActive(true);
    setActiveTab("video");
  };

  const endVideoCall = () => {
    setIsVideoCallActive(false);
    setActiveTab("chat");
    setIsCallMinimized(false);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  if (!peerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          <p className="text-gray-600 dark:text-gray-300 text-lg">Invalid peer ID.</p>
        </motion.div>
      </div>
    );
  }

  if (!currentUser || !chatId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Connecting to peer...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-purple-100 dark:border-gray-700 sticky top-0 z-10"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              to="/connect-peer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </Link>

            {peerInfo && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {peerInfo.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                    userStatus === 'online' ? 'bg-green-500' : 
                    userStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {peerInfo.name}
                  </h2>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {peerInfo.tag} • {userStatus}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Navigation */}
            <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "chat"
                    ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                <MessageSquare size={16} className="inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "video"
                    ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                <Video size={16} className="inline mr-2" />
                Video
              </button>
            </div>

            {/* Call Controls */}
            <div className="flex items-center gap-2">
              {!isVideoCallActive ? (
                <button
                  onClick={startVideoCall}
                  className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <Video size={20} />
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                      isVideoEnabled
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                      isAudioEnabled
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button
                    onClick={endVideoCall}
                    className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    <PhoneOff size={20} />
                  </button>
                </>
              )}
              
              <button className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <ChatWindow chatId={chatId} currentUser={currentUser} />
            </motion.div>
          )}
          
          {activeTab === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1"
            >
              <VideoCall
                peerId={peerId}
                currentUser={currentUser}
                isVideoEnabled={isVideoEnabled}
                isAudioEnabled={isAudioEnabled}
                onEndCall={endVideoCall}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Video Call Overlay */}
        {isVideoCallActive && isCallMinimized && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-4 right-4 w-64 h-48 bg-black rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={() => setIsCallMinimized(false)}
                className="p-1 bg-black/50 text-white rounded hover:bg-black/70"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={endVideoCall}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <PhoneOff size={14} />
              </button>
            </div>
            {/* Mini video preview would go here */}
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
              <p className="text-sm">Video Call Active</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
