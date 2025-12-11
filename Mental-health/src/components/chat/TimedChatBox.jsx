import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // Your firebase setup

const TimedChatBox = ({ userId, messages, setMessages, handleBotReply }) => {
  const [chatStartedAt, setChatStartedAt] = useState(null);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes
  const [freeTimeExpired, setFreeTimeExpired] = useState(false);
  const [chatLocked, setChatLocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchTokens = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserTokens(docSnap.data().tokens || 0);
      }
    };
    fetchTokens();
  }, [userId]);

  useEffect(() => {
    if (chatStartedAt) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - chatStartedAt) / 1000);
        const remaining = 300 - elapsed;
        setRemainingTime(remaining);

        if (remaining <= 0) {
          setFreeTimeExpired(true);
          if (userTokens <= 0) {
            setChatLocked(true);
          }
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [chatStartedAt, userTokens]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!chatStartedAt) setChatStartedAt(Date.now());

    if (freeTimeExpired && userTokens <= 0) {
      setChatLocked(true);
      return;
    }

    if (freeTimeExpired) {
      const newTokenCount = userTokens - 1;
      setUserTokens(newTokenCount);
      await updateDoc(doc(db, "users", userId), {
        tokens: newTokenCount,
      });
    }

    const userMsg = {
      sender: "user",
      text: input,
      timestamp: serverTimestamp(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");

    await addDoc(collection(db, "users", userId, "messages"), userMsg);

    if (handleBotReply) {
      handleBotReply(input, updatedMessages);
    }
  };

  const handleBuyTokens = async () => {
    const confirmed = window.confirm("This is a dummy payment. Add 10 tokens?");
    if (!confirmed) return;

    const newTokenCount = userTokens + 10;
    await updateDoc(doc(db, "users", userId), {
      tokens: newTokenCount,
    });
    await addDoc(collection(db, "users", userId, "purchases"), {
      amount: 10,
      type: "dummy",
      timestamp: serverTimestamp(),
    });
    setUserTokens(newTokenCount);
    setChatLocked(false);
    alert("✅ Dummy payment successful! 10 tokens added.");
  };

  return (
    <div className="w-full">
      {!freeTimeExpired && (
        <p className="text-xs text-gray-500 mb-2">
          Free chat ends in: {Math.floor(remainingTime / 60)}:
          {String(remainingTime % 60).padStart(2, "0")}
        </p>
      )}

      <div className="flex items-center gap-2">
        <input
          className="flex-1 border rounded p-2 text-sm"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={chatLocked}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          disabled={chatLocked}
        >
          Send
        </button>
      </div>

      {chatLocked && (
        <div className="mt-2 text-red-500 text-sm">
          Free time is over and you have no tokens left. Please buy tokens to continue.
        </div>
      )}

      <div className="mt-3">
        <p className="text-xs text-gray-500">
          Your tokens: <strong>{userTokens}</strong>
        </p>
        <button
          onClick={handleBuyTokens}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          💰 Dummy Buy Tokens (10)
        </button>
      </div>
    </div>
  );
};

export default TimedChatBox;
