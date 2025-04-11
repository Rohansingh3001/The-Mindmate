import React, { useState } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: 'I’m here for you 💙' }]);
    }, 500);
  };

  return (
    <section className="p-4 max-w-xl mx-auto my-6 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Talk to Mind Flow AIs</h3>
      <div className="h-60 overflow-y-auto border p-2 rounded mb-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`my-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-200' : 'bg-green-100'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="How are you feeling?"
          className="flex-1 border rounded p-2"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">Send</button>
      </div>
    </section>
  );
}

export default ChatBot;
