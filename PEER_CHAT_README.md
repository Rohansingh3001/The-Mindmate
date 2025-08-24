# 🧠 MindMate - Peer Chat App with Video Calling

A modern, beautiful peer-to-peer chat application with real-time messaging and video calling capabilities built for mental health support.

## ✨ Features

### 💬 Real-time Chat
- **Instant messaging** with Socket.IO
- **Typing indicators** and read receipts
- **File sharing** (images, documents, etc.)
- **Voice messages** recording
- **Emoji reactions** and rich text
- **End-to-end encryption** ready

### 📹 Video Calling
- **High-quality video calls** with WebRTC
- **Audio/video toggle** controls
- **Screen sharing** capabilities
- **Camera switching** (front/back)
- **Call quality indicators**
- **Picture-in-picture** mode
- **Full-screen** support

### 🎨 Beautiful UI/UX
- **Modern gradient design** with glassmorphism
- **Dark/light mode** support
- **Smooth animations** with Framer Motion
- **Responsive design** for all devices
- **Drag-and-drop** file uploads
- **Loading states** and transitions

### 🔧 Technical Features
- **WebRTC** for peer-to-peer video calls
- **Socket.IO** for real-time communication
- **PeerJS** for simplified WebRTC signaling
- **React** with modern hooks
- **Tailwind CSS** for styling
- **Firebase** for authentication
- **Express.js** backend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Modern web browser with WebRTC support
- Webcam and microphone for video calls

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   The backend will run on:
   - REST API: `http://localhost:3000`
   - WebSocket: `ws://localhost:3000`
   - Socket.IO: `http://localhost:3000`
   - PeerJS Server: `http://localhost:9000/peerjs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Mental-health
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

## 🛠️ Configuration

### Environment Variables

The following environment variables are configured in `.env`:

```env
# Chat and Video Call Configuration
VITE_SOCKET_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_PEER_HOST=localhost
VITE_PEER_PORT=9000
VITE_PEER_SECURE=false
VITE_API_BASE_URL=http://localhost:3000
```

### Production Deployment

For production, update the environment variables:

```env
VITE_SOCKET_URL=https://your-domain.com
VITE_PEER_HOST=your-domain.com
VITE_PEER_PORT=443
VITE_PEER_SECURE=true
```

## 📱 Usage

### Starting a Chat
1. Navigate to `/connect-peer/:peerId`
2. The chat interface will load automatically
3. Start typing to send messages
4. Use the attachment button for files

### Video Calling
1. Click the **video call button** in the chat header
2. Wait for peer connection to establish
3. Use the control buttons to:
   - Toggle video/audio
   - Share screen
   - Switch cameras
   - End call

### Chat Features
- **Send messages**: Type and press Enter
- **Voice messages**: Hold the mic button
- **File sharing**: Click the attachment button
- **Reactions**: Hover over messages for reactions
- **Typing indicators**: See when others are typing

## 🔧 API Endpoints

### Socket.IO Events

#### Client → Server
- `join-user`: Join as a user
- `join-chat`: Join a chat room
- `send-message`: Send a message
- `typing`: Send typing indicator
- `initiate-call`: Start a video call
- `call-response`: Accept/reject call
- `end-call`: End a video call

#### Server → Client
- `receive-message`: Receive a message
- `typing`: Receive typing indicator
- `incoming-call`: Receive call notification
- `call-accepted`: Call was accepted
- `call-rejected`: Call was rejected
- `call-ended`: Call ended
- `online-users`: Updated user list

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │  PeerJS Server  │
│                 │    │                 │    │                 │
│  - Chat UI      │◄──►│  - Socket.IO    │    │  - WebRTC       │
│  - Video UI     │    │  - REST API     │    │  - Signaling    │
│  - WebRTC       │    │  - WebSocket    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Firebase     │
                    │                 │
                    │  - Auth         │
                    │  - Database     │
                    │  - Storage      │
                    └─────────────────┘
```

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (`from-purple-500 to-purple-600`)
- **Secondary**: Pink accent (`from-pink-500 to-pink-600`)
- **Success**: Green (`bg-green-500`)
- **Danger**: Red (`bg-red-500`)
- **Background**: Gradient (`from-purple-50 to-pink-50`)

### Components
- **Buttons**: Rounded with hover animations
- **Cards**: Glassmorphism with backdrop blur
- **Modals**: Smooth scale animations
- **Messages**: Gradient bubbles with tails

## 🔒 Security Features

- **CORS configuration** for cross-origin requests
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **Secure WebRTC** connections
- **Environment variable** protection

## 🐛 Troubleshooting

### Common Issues

1. **Video call not connecting**
   - Check camera/microphone permissions
   - Ensure PeerJS server is running
   - Verify network connectivity

2. **Messages not sending**
   - Check Socket.IO connection
   - Verify backend server is running
   - Check browser console for errors

3. **Poor video quality**
   - Check internet connection
   - Close other applications using camera
   - Try switching to audio-only mode

### Debug Mode

Enable debug mode by setting:
```javascript
localStorage.setItem('debug', 'mindmate:*');
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Socket.IO** for real-time communication
- **PeerJS** for WebRTC simplification
- **Tailwind CSS** for beautiful styling
- **Framer Motion** for smooth animations

---

Made with ❤️ for mental health support and peer connection.
