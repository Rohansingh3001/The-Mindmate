// src/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ChatWindow from "../components/chat/ChatWindow";
import { initChatConnection } from "../utils/chatHelpers";

export default function ChatPage() {
  const { peerId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState("");
  const [peerInfo, setPeerInfo] = useState(null);

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Link
          to="/connect-peer"
          className="text-purple-600 dark:text-purple-300 flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back
        </Link>
        {peerInfo && (
          <div className="text-right">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
              {peerInfo.name}
            </h2>
            <p className="text-sm text-purple-600 dark:text-purple-300">
              {peerInfo.tag}
            </p>
          </div>
        )}
      </div>

      {/* Chat Window */}
      <ChatWindow chatId={chatId} currentUser={currentUser} />
    </div>
  );
}
