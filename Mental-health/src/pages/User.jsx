import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Components
import Navbar from "../components/Navbar";
import UserRoutes from "../Routes/UserRoutes.jsx";
 // ✅ Imported from routes folder

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
      alert(`👤 Name: ${userDetails.name}\n📧 Email: ${userDetails.email}`);
    } else {
      alert("⚠️ No user details available.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f0e9ff] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
      <Navbar onLogout={handleLogout} onViewAccount={handleViewAccount} />

      <main className="flex flex-col w-full">
        <UserRoutes /> {/* ✅ Routes moved here */}
      </main>

      
    </div>
  );
}

export default User;
