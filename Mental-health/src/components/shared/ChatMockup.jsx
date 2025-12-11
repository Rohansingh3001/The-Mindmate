import { useState, useEffect, useRef } from "react";

const iraReplies = [
  "That’s okay. Thank you for sharing that with me.",
  "Would you like to do a calming activity together?",
  "You're not alone — I'm here for you.",
  "Take a deep breath. You're doing better than you think.",
  "We can take things one step at a time.",
  "Do you want to try journaling together?",
  "You’ve already taken the first brave step by opening up.",
];

const ChatMockup = () => {
  const [messages, setMessages] = useState([
    { from: "ira", text: "Hi! I'm Ira. 🌸 How are you feeling today?" },
    { from: "user", text: "I'm feeling a bit anxious." },
    { from: "ira", text: "Thank you for sharing that. I'm here for you." },
    { from: "ira", text: "Would you like to talk or try a calming activity?" },
    { from: "user", text: "Let's talk." },
    { from: "ira", text: "Of course! I'm all ears. What’s on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input.trim() }];
    setMessages(newMessages);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const randomReply =
        iraReplies[Math.floor(Math.random() * iraReplies.length)];
      setMessages([...newMessages, { from: "ira", text: randomReply }]);
      setTyping(false);
    }, 1200);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <div className="w-full max-w-md h-[500px] sm:h-[580px] rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* macOS-style header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-400 rounded-full" />
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span className="w-3 h-3 bg-green-400 rounded-full" />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Chat Assistant – Ira
        </span>
        <span />
      </div>

      {/* Chat messages */}
      <div
        ref={chatRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto text-sm scrollbar-hide"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[75%] ${
                msg.from === "ira"
                  ? "bg-gray-100 dark:bg-indigo-800 text-gray-800 dark:text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="text-xs text-gray-500 dark:text-gray-400">Ira is typing...</div>
        )}
      </div>

      {/* Input bar */}
      <div className="flex items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMockup;
