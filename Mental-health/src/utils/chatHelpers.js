// client/utils/chatHelpers.js
import io from 'socket.io-client';

let socket = null;
let messageListener = null;
let isConnected = false;

// Initialize Socket.IO connection
export function initChatConnection(username) {
  if (socket && isConnected) return socket;

  // Use environment variable for socket URL, fallback to localhost
  const SOCKET_URL = process.env.VITE_SOCKET_URL || "http://localhost:3000";
  
  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    timeout: 5000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('✅ Socket.IO connected as', username);
    isConnected = true;
    
    // Join user to their room
    socket.emit('join-user', { username, userId: username });
  });

  socket.on('disconnect', (reason) => {
    console.warn('❌ Socket.IO disconnected:', reason);
    isConnected = false;
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Socket.IO connection error:', error);
    isConnected = false;
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(`🔄 Socket.IO reconnected after ${attemptNumber} attempts`);
    isConnected = true;
  });

  return socket;
}

// Send a message
export function sendMessage(chatId, message) {
  if (!socket || !isConnected) {
    console.warn('⚠️ Socket not ready, message not sent.');
    return false;
  }

  const messageData = {
    chatId,
    message: {
      id: generateMessageId(),
      from: message.from,
      text: message.text,
      timestamp: Date.now(),
      type: 'text'
    }
  };

  socket.emit('send-message', messageData);
  return true;
}

// Send typing indicator
export function sendTypingIndicator(chatId, isTyping, username) {
  if (!socket || !isConnected) return;

  socket.emit('typing', {
    chatId,
    username,
    isTyping
  });
}

// Subscribe to messages
export function subscribeToMessages(chatId, setMessages) {
  if (!socket) {
    console.warn('⚠️ Socket not initialized');
    return () => {};
  }

  // Join the chat room
  socket.emit('join-chat', { chatId });

  // Listen for new messages
  const handleNewMessage = (data) => {
    if (data.chatId === chatId) {
      setMessages((prev) => {
        // Avoid duplicate messages
        const exists = prev.some(msg => msg.id === data.message.id);
        if (exists) return prev;
        
        return [...prev, data.message];
      });
    }
  };

  // Listen for typing indicators
  const handleTyping = (data) => {
    if (data.chatId === chatId) {
      // Handle typing indicator logic here
      console.log(`${data.username} is ${data.isTyping ? 'typing' : 'stopped typing'}`);
    }
  };

  // Listen for message status updates
  const handleMessageStatus = (data) => {
    if (data.chatId === chatId) {
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, read: data.status === 'read' }
            : msg
        )
      );
    }
  };

  socket.on('receive-message', handleNewMessage);
  socket.on('typing', handleTyping);
  socket.on('message-status', handleMessageStatus);

  // Cleanup function
  return () => {
    socket.off('receive-message', handleNewMessage);
    socket.off('typing', handleTyping);
    socket.off('message-status', handleMessageStatus);
    socket.emit('leave-chat', { chatId });
  };
}

// Send file/media message
export function sendFileMessage(chatId, fileData, sender) {
  if (!socket || !isConnected) {
    console.warn('⚠️ Socket not ready, file not sent.');
    return false;
  }

  const messageData = {
    chatId,
    message: {
      id: generateMessageId(),
      from: sender,
      type: 'file',
      fileData: fileData,
      timestamp: Date.now()
    }
  };

  socket.emit('send-message', messageData);
  return true;
}

// Start video call
export function initiateVideoCall(chatId, callerId, calleeId) {
  if (!socket || !isConnected) {
    console.warn('⚠️ Socket not ready, call not initiated.');
    return false;
  }

  const callData = {
    chatId,
    callerId,
    calleeId,
    type: 'video',
    timestamp: Date.now()
  };

  socket.emit('initiate-call', callData);
  return true;
}

// Handle incoming call
export function handleIncomingCall(onIncomingCall) {
  if (!socket) return () => {};

  const handleCall = (callData) => {
    onIncomingCall(callData);
  };

  socket.on('incoming-call', handleCall);
  
  return () => {
    socket.off('incoming-call', handleCall);
  };
}

// Accept/reject call
export function respondToCall(callId, response, userId) {
  if (!socket || !isConnected) return false;

  socket.emit('call-response', {
    callId,
    response, // 'accept' or 'reject'
    userId
  });
  
  return true;
}

// End call
export function endCall(callId, userId) {
  if (!socket || !isConnected) return false;

  socket.emit('end-call', {
    callId,
    userId
  });
  
  return true;
}

// Get online users in chat
export function getOnlineUsers(chatId, callback) {
  if (!socket || !isConnected) return () => {};

  socket.emit('get-online-users', { chatId });
  
  const handleOnlineUsers = (data) => {
    if (data.chatId === chatId) {
      callback(data.users);
    }
  };

  socket.on('online-users', handleOnlineUsers);
  
  return () => {
    socket.off('online-users', handleOnlineUsers);
  };
}

// Disconnect socket
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
}

// Helper function to generate unique message IDs
function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get connection status
export function getConnectionStatus() {
  return {
    isConnected,
    socket: socket?.connected || false
  };
}

// Fallback WebSocket implementation for development
export function initWebSocketConnection(username) {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  const WS_URL = process.env.VITE_WS_URL || "ws://localhost:3000";
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "join", username }));
    console.log("✅ WebSocket connected as", username);
    isConnected = true;
  };

  socket.onclose = () => {
    console.warn("❌ WebSocket disconnected");
    isConnected = false;
  };

  socket.onerror = (err) => {
    console.error("⚠️ WebSocket error:", err);
    isConnected = false;
  };

  return socket;
}
