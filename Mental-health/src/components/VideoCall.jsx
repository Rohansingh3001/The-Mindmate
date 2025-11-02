import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Settings,
  RotateCcw,
  Maximize2,
  Users,
  MessageSquare,
  Share,
  Monitor,
  Camera
} from "lucide-react";
import {
  initializePeer,
  getUserMedia,
  makeCall,
  answerCall,
  onIncomingCall,
  endCall,
  toggleVideo as toggleVideoTrack,
  toggleAudio as toggleAudioTrack,
  switchCamera,
  startScreenShare,
  stopScreenShare,
  getPeerId,
  destroyPeer
} from "../utils/webrtcHelpers";

export default function VideoCall({ 
  peerId, 
  currentUser, 
  isVideoEnabled, 
  isAudioEnabled, 
  onEndCall 
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const [callDuration, setCallDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [myPeerId, setMyPeerId] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [localVideoEnabled, setLocalVideoEnabled] = useState(isVideoEnabled);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(isAudioEnabled);

  useEffect(() => {
    let interval;
    if (connectionStatus === "Connected") {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        setConnectionStatus("Initializing peer connection...");
        
        // Initialize PeerJS
        const peerIdGenerated = await initializePeer(currentUser);
        setMyPeerId(peerIdGenerated);
        setConnectionStatus("Getting media access...");

        // Get user media
        const stream = await getUserMedia(isVideoEnabled, isAudioEnabled);
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setConnectionStatus("Ready to connect...");

        // Listen for incoming calls
        onIncomingCall((call) => {
          console.log('Incoming call from:', call.peer);
          setIncomingCall(call);
        });

        // Auto-start call if we have a peer ID to call
        if (peerId && peerId !== currentUser) {
          setConnectionStatus("Calling peer...");
          try {
            const remoteStream = await makeCall(
              peerId, 
              localVideoRef.current, 
              remoteVideoRef.current
            );
            setRemoteStream(remoteStream);
            setConnectionStatus("Connected");
            setIsConnecting(false);
          } catch (error) {
            console.error('Error making call:', error);
            setConnectionStatus("Failed to connect");
          }
        } else {
          setConnectionStatus("Waiting for peer...");
          setIsConnecting(false);
        }

      } catch (error) {
        console.error("Error initializing call:", error);
        setConnectionStatus("Failed to initialize");
        setIsConnecting(false);
      }
    };

    initializeCall();

    return () => {
      destroyPeer();
    };
  }, [currentUser, peerId, isVideoEnabled, isAudioEnabled]);

  // Handle incoming call
  useEffect(() => {
    if (incomingCall) {
      const handleIncomingCall = async () => {
        try {
          setConnectionStatus("Answering call...");
          const remoteStream = await answerCall(
            incomingCall,
            localVideoRef.current,
            remoteVideoRef.current
          );
          setRemoteStream(remoteStream);
          setConnectionStatus("Connected");
          setIncomingCall(null);
        } catch (error) {
          console.error('Error answering call:', error);
          setConnectionStatus("Failed to answer call");
        }
      };

      handleIncomingCall();
    }
  }, [incomingCall]);

  // Update video/audio tracks when props change
  useEffect(() => {
    setLocalVideoEnabled(isVideoEnabled);
    toggleVideoTrack(isVideoEnabled);
  }, [isVideoEnabled]);

  useEffect(() => {
    setLocalAudioEnabled(isAudioEnabled);
    toggleAudioTrack(isAudioEnabled);
  }, [isAudioEnabled]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEndCall = () => {
    endCall();
    onEndCall();
  };

  const handleToggleVideo = () => {
    const newState = !localVideoEnabled;
    setLocalVideoEnabled(newState);
    toggleVideoTrack(newState);
  };

  const handleToggleAudio = () => {
    const newState = !localAudioEnabled;
    setLocalAudioEnabled(newState);
    toggleAudioTrack(newState);
  };

  const handleSwitchCamera = async () => {
    try {
      await switchCamera();
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  const handleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await startScreenShare();
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  if (isConnecting) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-semibold mb-2">Setting up call...</h3>
          <p className="text-white/70 mb-4">{connectionStatus}</p>
          
          {myPeerId && (
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-white/60 mb-1">Your Peer ID:</p>
              <p className="text-sm font-mono text-white bg-black/30 rounded px-2 py-1">
                {myPeerId}
              </p>
            </div>
          )}
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            className="h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex-1 relative bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Remote Video (Main) */}
      <div className="absolute inset-0">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-800 via-blue-800 to-indigo-800 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {connectionStatus === "Connected" ? "Peer joined" : "Waiting for peer..."}
              </h3>
              <p className="text-white/70">{connectionStatus}</p>
              {myPeerId && (
                <div className="mt-4 bg-black/20 rounded-lg p-3 max-w-xs mx-auto">
                  <p className="text-xs text-white/60 mb-1">Share this ID with your peer:</p>
                  <p className="text-xs font-mono text-white bg-black/30 rounded px-2 py-1 break-all">
                    {myPeerId}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        drag
        dragConstraints={{
          left: 20,
          right: window.innerWidth - 220,
          top: 20,
          bottom: window.innerHeight - 160
        }}
        className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 z-10 cursor-move"
      >
        {localVideoEnabled ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <VideoOff size={24} className="text-white mx-auto mb-1" />
              <p className="text-xs text-white/70">Camera off</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
          You
        </div>
        {!localAudioEnabled && (
          <div className="absolute top-2 left-2">
            <MicOff size={16} className="text-red-400" />
          </div>
        )}
      </motion.div>

      {/* Call Info */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === "Connected" ? "bg-green-500" : "bg-yellow-500"
            }`}></div>
            <span className="text-sm font-medium">{connectionStatus}</span>
          </div>
          {connectionStatus === "Connected" && (
            <div className="text-sm text-white/70">
              Duration: {formatDuration(callDuration)}
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleVideo}
            className={`p-4 rounded-full transition-all ${
              localVideoEnabled
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {localVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleAudio}
            className={`p-4 rounded-full transition-all ${
              localAudioEnabled
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {localAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleScreenShare}
            className={`p-4 rounded-full transition-all ${
              isScreenSharing
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Monitor size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEndCall}
            className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
          >
            <PhoneOff size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {}}
            className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all"
          >
            <MessageSquare size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all"
          >
            <Maximize2 size={24} />
          </motion.button>
        </div>
      </motion.div>

      {/* Additional Controls */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-3 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwitchCamera}
          className="p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all"
        >
          <RotateCcw size={20} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all"
        >
          <Settings size={20} />
        </motion.button>
      </div>

      {/* Network Quality Indicator */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className={`w-1 h-3 rounded-full ${
                connectionQuality === "excellent" || connectionQuality === "good" ? "bg-green-500" : "bg-gray-500"
              }`}></div>
              <div className={`w-1 h-3 rounded-full ${
                connectionQuality === "excellent" || connectionQuality === "good" ? "bg-green-500" : "bg-gray-500"
              }`}></div>
              <div className={`w-1 h-3 rounded-full ${
                connectionQuality === "excellent" ? "bg-green-500" : "bg-gray-500"
              }`}></div>
              <div className={`w-1 h-3 rounded-full ${
                connectionQuality === "excellent" ? "bg-green-500" : "bg-gray-500"
              }`}></div>
            </div>
            <span className="text-xs capitalize">{connectionQuality}</span>
          </div>
        </div>
      </div>

      {/* Incoming Call Notification */}
      {incomingCall && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-2">Incoming Call</h3>
            <p className="text-gray-600 mb-4">from {incomingCall.peer}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIncomingCall(null)}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => {/* Answer call logic handled in useEffect */}}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Answer
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
