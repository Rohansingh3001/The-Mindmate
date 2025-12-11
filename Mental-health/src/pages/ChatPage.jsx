// src/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SEO from "../components/shared/SEO";
import ChatWindow from "../components/chat/ChatWindow";
import { initChatConnection } from "../utils/chatHelpers";

export default function ChatPage() {
  const { peerId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && peerId) {
        const uid = user.uid;

        const generatedChatId = [uid, peerId].sort().join("_");
        setCurrentUser(uid);
        setChatId(generatedChatId);

        initChatConnection(uid); // safe to call once per user
      }
    });

    return () => unsubscribe();
  }, [peerId]);

  if (!peerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-sm">Invalid peer ID.</p>
      </div>
    );
  }

  if (!currentUser || !chatId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-sm">Loading chat...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Peer Support Chat - Connect with Understanding Peers"
        description="Chat with supportive peers who understand your mental health journey. The MindMates peer support provides safe, anonymous conversations with trained peer counselors."
        keywords="peer support, peer counseling, mental health chat, anonymous support, peer-to-peer therapy, mental health community"
        url={`https://themindmates.in/chat/${peerId}`}
      />
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        {/* Back Button */}
        <div className="p-4 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <Link
            to="/connect-peer"
            className="text-purple-600 dark:text-purple-300 flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </Link>
        </div>

        {/* Chat Window */}
        <ChatWindow chatId={chatId} currentUser={currentUser} />
      </div>
    </>
  );
}
