import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullChat from './FullChat';

const FullChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  const handleClose = () => {
    navigate('/user'); // Navigate back to dashboard
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <FullChat
        messages={messages}
        setMessages={setMessages}
        onClose={handleClose}
      />
    </div>
  );
};

export default FullChatPage;
