import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserDetails({
          name: user.displayName || "User",
          email: user.email,
        });
        // Show feedback reminder toast
        toast((t) => (
          <span>
            <span className="text-lg mr-2">📝</span>
            We value your feedback!&nbsp;
            <button
              onClick={() => {
                navigate('/form');
                toast.dismiss(t.id);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded ml-2"
            >
              Fill Now
            </button>
          </span>
        ), { duration: 8000 });
      } else {
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
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
    <div className="bg-gradient-to-br from-white to-[#f0e9ff] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 relative">
      <Navbar onLogout={handleLogout} onViewAccount={handleViewAccount} />


      <main className="flex flex-col w-full">
        <UserRoutes /> {/* ✅ Routes moved here */}
      </main>
    </div>
  );
}

export default User;
