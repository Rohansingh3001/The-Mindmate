import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Make sure you export 'auth' from your firebase.js
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';

import MentalHealthChart from '../components/MentalHealthChart';
import Dashboard from '../components/Dashboard';

const User = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [showBotPopup, setShowBotPopup] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetails({ name: user.displayName || 'User', email: user.email });
      } else {
        navigate('/login');
      }
    });

    // Hide popup after 5 seconds
    const timer = setTimeout(() => setShowBotPopup(false), 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const handleViewAccount = () => {
    if (userDetails) {
      alert(`Name: ${userDetails.name}\nEmail: ${userDetails.email}`);
    } else {
      alert('No user details available.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-[#f0e9ff] text-gray-800 relative">
      {/* Navbar */}
      <Navbar onLogout={handleLogout} onViewAccount={handleViewAccount} />

      {/* Fullscreen Dashboard */}
      <main className="flex-1 flex flex-col w-full">
        <div className="flex-1 flex flex-col w-full">
          <Dashboard />
          {/* The grid below is left empty as requested */}
         
        </div>
      </main>

    
    </div>
  );
};

export default User;
