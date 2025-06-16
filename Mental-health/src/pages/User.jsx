import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import FullChat from "../components/FullChat";
import ChatBot from "../components/ChatBot";
import AssessmentForm from "../components/AssessmentForm";
import MentalHealthChart from "../components/MentalHealthChart";

function User() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [showBotPopup, setShowBotPopup] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetails({
          name: user.displayName || "User",
          email: user.email,
        });
      } else {
        navigate("/login");
      }
    });

    const timer = setTimeout(() => setShowBotPopup(false), 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const handleViewAccount = () => {
    if (userDetails) {
      alert(`Name: ${userDetails.name}\nEmail: ${userDetails.email}`);
    } else {
      alert("No user details available.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f0e9ff] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
      <Navbar onLogout={handleLogout} onViewAccount={handleViewAccount} />

      <main className="flex flex-col w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fullchat" element={<FullChat />} />
          <Route path="/assessment" element={<AssessmentForm />} />
          <Route path="/chart" element={<MentalHealthChart />} />
          {/* Add more routes as needed */}
        </Routes>
      </main>

      {/* Optional Bot Popup (can be styled or replaced later) */}
      {showBotPopup && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
          👋 Hi there! Need someone to talk to?
        </div>
      )}
    </div>
  );
}

export default User;
