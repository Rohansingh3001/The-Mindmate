import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ChatWindow from "../components/chat/ChatWindow";
import "react-toastify/dist/ReactToastify.css";

export default function PeerDashboard() {
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  // Handle auth + chat stream
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);

        const q = query(collection(db, "chats"), where("peerId", "==", user.uid));
        const unsubscribeChats = onSnapshot(q, (snapshot) => {
          const chatData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChatUsers(chatData);
        });

        return () => unsubscribeChats();
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <ToastContainer />

      {/* Sidebar */}
      <aside className="w-1/3 max-w-sm min-w-[250px] border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">
            👥 Peer Chats
          </h2>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline hover:text-red-600"
          >
            Logout
          </button>
        </div>

        {chatUsers.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            No chats found yet.
          </div>
        ) : (
          <ul className="space-y-2">
            {chatUsers.map((chat) => (
              <li
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-3 rounded-lg transition cursor-pointer border ${
                  selectedChatId === chat.id
                    ? "bg-purple-600 text-white border-purple-700"
                    : "bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                }`}
              >
                <div className="font-semibold truncate">
                  {chat.userName || "User"}
                </div>
                <div className="text-xs opacity-70 truncate">
                  {chat.userEmail}
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 p-4 overflow-hidden">
        {selectedChatId ? (
          <ChatWindow chatId={selectedChatId} currentUser={currentUserId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a chat to start messaging 💬
          </div>
        )}
      </main>
    </div>
  );
}
