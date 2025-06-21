// client/components/Chat/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import { subscribeToMessages, sendMessage } from "../../utils/chatHelpers";

export default function ChatWindow({ chatId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, setMessages);
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isMine={msg.from === currentUser} />
        ))}
        <div ref={endRef} />
      </div>
      <InputBox
        onSend={(text) => sendMessage(chatId, { text, from: currentUser })}
      />
    </div>
  );
}
