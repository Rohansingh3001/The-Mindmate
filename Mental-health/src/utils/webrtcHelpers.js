// utils/webrtcHelpers.js
import Peer from 'peerjs';

let peer = null;
let localStream = null;
let currentCall = null;

// Initialize PeerJS
export function initializePeer(userId) {
  return new Promise((resolve, reject) => {
    try {
      // Create PeerJS instance
      peer = new Peer(userId, {
        host: process.env.VITE_PEER_HOST || 'localhost',
        port: process.env.VITE_PEER_PORT || 9000,
        path: '/peerjs',
        secure: process.env.VITE_PEER_SECURE === 'true',
        debug: 2,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            {
              urls: 'turn:numb.viagenie.ca',
              credential: 'muazkh',
              username: 'webrtc@live.com'
            }
          ]
        }
      });

      peer.on('open', (id) => {
        console.log('✅ PeerJS connected with ID:', id);
        resolve(id);
      });

      peer.on('error', (error) => {
        console.error('❌ PeerJS error:', error);
        reject(error);
      });

      peer.on('disconnected', () => {
        console.log('🔌 PeerJS disconnected');
      });

      peer.on('close', () => {
        console.log('🔒 PeerJS connection closed');
      });

    } catch (error) {
      console.error('Failed to initialize PeerJS:', error);
      reject(error);
    }
  });
}

// Get user media
export async function getUserMedia(videoEnabled = true, audioEnabled = true) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoEnabled ? {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      } : false,
      audio: audioEnabled ? {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } : false
    });

    localStream = stream;
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
}

// Make a video call
export function makeCall(remotePeerId, localVideoElement, remoteVideoElement) {
  return new Promise((resolve, reject) => {
    if (!peer || !localStream) {
      reject(new Error('Peer or local stream not initialized'));
      return;
    }

    try {
      // Display local video
      if (localVideoElement) {
        localVideoElement.srcObject = localStream;
      }

      // Make the call
      currentCall = peer.call(remotePeerId, localStream);

      currentCall.on('stream', (remoteStream) => {
        console.log('📹 Received remote stream');
        if (remoteVideoElement) {
          remoteVideoElement.srcObject = remoteStream;
        }
        resolve(remoteStream);
      });

      currentCall.on('error', (error) => {
        console.error('❌ Call error:', error);
        reject(error);
      });

      currentCall.on('close', () => {
        console.log('📞 Call ended');
        if (remoteVideoElement) {
          remoteVideoElement.srcObject = null;
        }
      });

    } catch (error) {
      console.error('Error making call:', error);
      reject(error);
    }
  });
}

// Answer incoming call
export function answerCall(call, localVideoElement, remoteVideoElement) {
  return new Promise((resolve, reject) => {
    if (!localStream) {
      reject(new Error('Local stream not initialized'));
      return;
    }

    try {
      currentCall = call;

      // Display local video
      if (localVideoElement) {
        localVideoElement.srcObject = localStream;
      }

      // Answer the call
      call.answer(localStream);

      call.on('stream', (remoteStream) => {
        console.log('📹 Received remote stream');
        if (remoteVideoElement) {
          remoteVideoElement.srcObject = remoteStream;
        }
        resolve(remoteStream);
      });

      call.on('error', (error) => {
        console.error('❌ Call error:', error);
        reject(error);
      });

      call.on('close', () => {
        console.log('📞 Call ended');
        if (remoteVideoElement) {
          remoteVideoElement.srcObject = null;
        }
      });

    } catch (error) {
      console.error('Error answering call:', error);
      reject(error);
    }
  });
}

// Listen for incoming calls
export function onIncomingCall(callback) {
  if (!peer) {
    console.error('Peer not initialized');
    return;
  }

  peer.on('call', (call) => {
    console.log('📞 Incoming call from:', call.peer);
    callback(call);
  });
}

// End current call
export function endCall() {
  try {
    if (currentCall) {
      currentCall.close();
      currentCall = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      localStream = null;
    }

    console.log('📞 Call ended successfully');
    return true;
  } catch (error) {
    console.error('Error ending call:', error);
    return false;
  }
}

// Toggle video
export function toggleVideo(enabled) {
  if (localStream) {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = enabled;
      return true;
    }
  }
  return false;
}

// Toggle audio
export function toggleAudio(enabled) {
  if (localStream) {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = enabled;
      return true;
    }
  }
  return false;
}

// Switch camera (front/back)
export async function switchCamera() {
  try {
    if (!localStream) return false;

    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return false;

    // Get current facing mode
    const settings = videoTrack.getSettings();
    const currentFacingMode = settings.facingMode;
    
    // Toggle between front and back camera
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

    // Stop current video track
    videoTrack.stop();

    // Get new stream with different camera
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: newFacingMode },
      audio: true
    });

    // Replace video track in local stream
    const newVideoTrack = newStream.getVideoTracks()[0];
    localStream.removeTrack(videoTrack);
    localStream.addTrack(newVideoTrack);

    // Update peer connection if call is active
    if (currentCall && currentCall.peerConnection) {
      const sender = currentCall.peerConnection.getSenders().find(
        s => s.track && s.track.kind === 'video'
      );
      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }
    }

    return true;
  } catch (error) {
    console.error('Error switching camera:', error);
    return false;
  }
}

// Get connection statistics
export function getConnectionStats() {
  if (!currentCall || !currentCall.peerConnection) {
    return null;
  }

  return currentCall.peerConnection.getStats();
}

// Screen sharing
export async function startScreenShare() {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    if (currentCall && currentCall.peerConnection) {
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = currentCall.peerConnection.getSenders().find(
        s => s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      // Handle screen share end
      videoTrack.onended = () => {
        stopScreenShare();
      };
    }

    return screenStream;
  } catch (error) {
    console.error('Error starting screen share:', error);
    throw error;
  }
}

export async function stopScreenShare() {
  try {
    // Get camera stream back
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    if (currentCall && currentCall.peerConnection) {
      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = currentCall.peerConnection.getSenders().find(
        s => s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }
    }

    // Update local stream
    localStream = cameraStream;
    return cameraStream;
  } catch (error) {
    console.error('Error stopping screen share:', error);
    throw error;
  }
}

// Destroy peer connection
export function destroyPeer() {
  try {
    endCall();
    
    if (peer) {
      peer.destroy();
      peer = null;
    }

    console.log('🔥 Peer connection destroyed');
  } catch (error) {
    console.error('Error destroying peer:', error);
  }
}

// Get peer ID
export function getPeerId() {
  return peer?.id || null;
}

// Get local stream
export function getLocalStream() {
  return localStream;
}

// Get current call
export function getCurrentCall() {
  return currentCall;
}

// Check if peer is connected
export function isPeerConnected() {
  return peer && !peer.disconnected;
}
