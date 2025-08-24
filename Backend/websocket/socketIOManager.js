// websocket/socketIOManager.js
const connectedUsers = new Map();
const chatRooms = new Map();
const activeCalls = new Map();

export function setupSocketIOServer(io) {
  console.log('🔌 Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log(`👤 User connected: ${socket.id}`);

    // Handle user joining
    socket.on('join-user', (data) => {
      const { username, userId } = data;
      connectedUsers.set(socket.id, { username, userId, socketId: socket.id });
      socket.userId = userId;
      socket.username = username;
      
      console.log(`✅ User ${username} (${userId}) joined`);
      
      // Notify user of successful connection
      socket.emit('user-connected', { userId, username });
    });

    // Handle joining chat rooms
    socket.on('join-chat', (data) => {
      const { chatId } = data;
      socket.join(chatId);
      
      if (!chatRooms.has(chatId)) {
        chatRooms.set(chatId, new Set());
      }
      chatRooms.get(chatId).add(socket.id);
      
      console.log(`💬 User ${socket.username} joined chat: ${chatId}`);
      
      // Send current online users in chat
      const onlineUsers = Array.from(chatRooms.get(chatId))
        .map(socketId => connectedUsers.get(socketId))
        .filter(Boolean);
      
      io.to(chatId).emit('online-users', { chatId, users: onlineUsers });
    });

    // Handle leaving chat rooms
    socket.on('leave-chat', (data) => {
      const { chatId } = data;
      socket.leave(chatId);
      
      if (chatRooms.has(chatId)) {
        chatRooms.get(chatId).delete(socket.id);
        
        // Send updated online users
        const onlineUsers = Array.from(chatRooms.get(chatId))
          .map(socketId => connectedUsers.get(socketId))
          .filter(Boolean);
        
        io.to(chatId).emit('online-users', { chatId, users: onlineUsers });
      }
      
      console.log(`💬 User ${socket.username} left chat: ${chatId}`);
    });

    // Handle sending messages
    socket.on('send-message', (data) => {
      const { chatId, message } = data;
      
      // Add server timestamp
      message.serverTimestamp = Date.now();
      
      // Broadcast message to all users in the chat room
      io.to(chatId).emit('receive-message', { chatId, message });
      
      console.log(`📨 Message sent in chat ${chatId} by ${message.from}`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { chatId, username, isTyping } = data;
      
      // Broadcast typing status to other users in the chat
      socket.to(chatId).emit('typing', { chatId, username, isTyping });
    });

    // Handle message status updates (read receipts)
    socket.on('message-status', (data) => {
      const { chatId, messageId, status } = data;
      
      io.to(chatId).emit('message-status', { chatId, messageId, status });
    });

    // Handle getting online users
    socket.on('get-online-users', (data) => {
      const { chatId } = data;
      
      if (chatRooms.has(chatId)) {
        const onlineUsers = Array.from(chatRooms.get(chatId))
          .map(socketId => connectedUsers.get(socketId))
          .filter(Boolean);
        
        socket.emit('online-users', { chatId, users: onlineUsers });
      }
    });

    // Video Call Handling
    socket.on('initiate-call', (data) => {
      const { chatId, callerId, calleeId, type } = data;
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store call information
      activeCalls.set(callId, {
        callId,
        chatId,
        callerId,
        calleeId,
        type,
        status: 'initiating',
        startTime: Date.now()
      });

      // Find the callee's socket
      const calleeSocket = Array.from(connectedUsers.entries())
        .find(([socketId, user]) => user.userId === calleeId);

      if (calleeSocket) {
        const [calleeSocketId] = calleeSocket;
        io.to(calleeSocketId).emit('incoming-call', {
          callId,
          callerId,
          callerName: socket.username,
          type
        });
        
        console.log(`📞 Call initiated: ${callerId} -> ${calleeId}`);
      } else {
        socket.emit('call-failed', { reason: 'User not online' });
      }
    });

    // Handle call response
    socket.on('call-response', (data) => {
      const { callId, response, userId } = data;
      
      if (activeCalls.has(callId)) {
        const callInfo = activeCalls.get(callId);
        
        if (response === 'accept') {
          callInfo.status = 'active';
          
          // Notify the caller that call was accepted
          const callerSocket = Array.from(connectedUsers.entries())
            .find(([socketId, user]) => user.userId === callInfo.callerId);

          if (callerSocket) {
            const [callerSocketId] = callerSocket;
            io.to(callerSocketId).emit('call-accepted', { callId, calleeId: userId });
          }
          
          console.log(`✅ Call accepted: ${callId}`);
        } else {
          // Call rejected
          const callerSocket = Array.from(connectedUsers.entries())
            .find(([socketId, user]) => user.userId === callInfo.callerId);

          if (callerSocket) {
            const [callerSocketId] = callerSocket;
            io.to(callerSocketId).emit('call-rejected', { callId, reason: 'User declined' });
          }
          
          activeCalls.delete(callId);
          console.log(`❌ Call rejected: ${callId}`);
        }
      }
    });

    // Handle ending calls
    socket.on('end-call', (data) => {
      const { callId, userId } = data;
      
      if (activeCalls.has(callId)) {
        const callInfo = activeCalls.get(callId);
        
        // Notify the other participant
        const otherUserId = callInfo.callerId === userId ? callInfo.calleeId : callInfo.callerId;
        const otherSocket = Array.from(connectedUsers.entries())
          .find(([socketId, user]) => user.userId === otherUserId);

        if (otherSocket) {
          const [otherSocketId] = otherSocket;
          io.to(otherSocketId).emit('call-ended', { callId, endedBy: userId });
        }
        
        activeCalls.delete(callId);
        console.log(`📞 Call ended: ${callId} by ${userId}`);
      }
    });

    // Handle file/media sharing
    socket.on('send-file', (data) => {
      const { chatId, fileData, fileName, fileType, fileSize } = data;
      
      const fileMessage = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        from: socket.userId,
        type: 'file',
        fileName,
        fileType,
        fileSize,
        fileData,
        timestamp: Date.now(),
        serverTimestamp: Date.now()
      };
      
      io.to(chatId).emit('receive-message', { chatId, message: fileMessage });
      
      console.log(`📁 File sent in chat ${chatId}: ${fileName} (${fileSize} bytes)`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`👤 User disconnected: ${socket.id}`);
      
      // Remove from connected users
      connectedUsers.delete(socket.id);
      
      // Remove from all chat rooms
      for (const [chatId, users] of chatRooms.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          
          // Update online users for this chat
          const onlineUsers = Array.from(users)
            .map(socketId => connectedUsers.get(socketId))
            .filter(Boolean);
          
          io.to(chatId).emit('online-users', { chatId, users: onlineUsers });
        }
      }
      
      // End any active calls
      for (const [callId, callInfo] of activeCalls.entries()) {
        if (callInfo.callerId === socket.userId || callInfo.calleeId === socket.userId) {
          const otherUserId = callInfo.callerId === socket.userId ? callInfo.calleeId : callInfo.callerId;
          const otherSocket = Array.from(connectedUsers.entries())
            .find(([socketId, user]) => user.userId === otherUserId);

          if (otherSocket) {
            const [otherSocketId] = otherSocket;
            io.to(otherSocketId).emit('call-ended', { callId, reason: 'User disconnected' });
          }
          
          activeCalls.delete(callId);
        }
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });

  // Periodic cleanup of inactive calls
  setInterval(() => {
    const now = Date.now();
    for (const [callId, callInfo] of activeCalls.entries()) {
      // Remove calls that have been initiating for more than 1 minute
      if (callInfo.status === 'initiating' && now - callInfo.startTime > 60000) {
        activeCalls.delete(callId);
        console.log(`🧹 Cleaned up inactive call: ${callId}`);
      }
    }
  }, 30000); // Run every 30 seconds

  return io;
}
