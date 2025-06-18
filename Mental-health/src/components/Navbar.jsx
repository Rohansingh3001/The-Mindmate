import React, { useState, useEffect, useRef } from "react";
import { Bell, User, LogOut, Menu } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ onLogout, onViewAccount }) => {
  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef();
  const notificationsRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    toast.info("You have a new notification!", {
      position: "top-right",
      theme: "colored",
    });
  };

  const handleViewProfile = () => {
    toast.success("Viewing your account details...", {
      position: "top-right",
      theme: "colored",
    });
    onViewAccount();
  };

  return (
    <nav className="w-full bg-gradient-to-r from-white via-[#f8f5ff] to-[#ede7ff] px-4 py-3 shadow-sm border-b border-purple-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#7b5fff] tracking-tight">
          The MindMates
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                handleNotificationClick();
              }}
              className="relative text-[#7b5fff] hover:text-indigo-700 transition-all"
            >
              <Bell className="w-6 h-6" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-purple-100 rounded-xl shadow-lg z-30 text-sm">
                <div className="px-4 py-2 hover:bg-gray-100 transition">📢 New update available</div>
                <div className="px-4 py-2 hover:bg-gray-100 transition">💡 Try mood logging today</div>
                <div className="px-4 py-2 hover:bg-gray-100 transition">🎯 Goal progress saved</div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="text-[#7b5fff] hover:text-indigo-700 transition-all"
            >
              <User className="w-6 h-6" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-100 rounded-xl shadow-xl py-2 z-30 text-sm">
                <button
                  onClick={handleViewProfile}
                  className="w-full px-4 py-2 text-left text-[#7b5fff] font-medium hover:bg-purple-50 transition rounded-t-xl"
                >
                  👤 View Profile
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left text-red-500 font-medium hover:bg-red-50 transition flex items-center gap-2 rounded-b-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="text-[#7b5fff] focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {navOpen && (
        <div className="md:hidden mt-3 px-3 space-y-2 animate-fade-in-down">
          <button
            onClick={handleViewProfile}
            className="w-full flex items-center justify-between px-4 py-2 border border-[#7b5fff] text-[#7b5fff] rounded-xl hover:bg-[#7b5fff] hover:text-white transition"
          >
            View Profile
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-2 bg-[#7b5fff] text-white rounded-xl hover:bg-[#6c54e0] transition"
          >
            Logout
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer autoClose={4000} hideProgressBar closeOnClick pauseOnHover />
    </nav>
  );
};

export default Navbar;
