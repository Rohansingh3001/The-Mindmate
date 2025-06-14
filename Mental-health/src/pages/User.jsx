// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Ensure correct path
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import FullChat from "../components/FullChat";
import { User } from "lucide-react";

function App() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

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

    return () => unsubscribe();
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
          {/* Add other routes here */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
