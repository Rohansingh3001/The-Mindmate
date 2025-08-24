import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ onLogout }) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Read wallet balance from localStorage
    const stored = localStorage.getItem("wallet_balance");
    setBalance(stored ? parseFloat(stored) : 0);

    // Listen for changes from other tabs/windows
    const onStorage = (e) => {
      if (e.key === "wallet_balance") {
        setBalance(e.newValue ? parseFloat(e.newValue) : 0);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // Example notifications array; empty means no notifications
  const notifications = [];
  const settingsRef = useRef();
  const notificationsRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setSettingsOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleNotificationClick = () => {
    setNotificationsOpen((prev) => !prev);
  };

  const handleGoToSettings = () => {
    toast.success("Opening settings...", {
      position: "top-right",
      theme: "colored",
    });
    navigate("/settings");
  };

  return (
    <nav className="w-full z-50 px-4 py-3 backdrop-blur-md bg-white/70 dark:bg-gray-900/50 border-b border-purple-200 dark:border-purple-700 shadow-sm sticky top-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-purple-700 dark:text-purple-200 tracking-tight drop-shadow-sm">
          The MindMates
        </h1>

        {/* Desktop Nav + Wallet Section */}
        <div className="hidden md:flex items-center gap-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={handleNotificationClick}
              className="relative text-purple-600 dark:text-purple-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition"
            >
              <Bell className="w-6 h-6" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800/80 backdrop-blur-md border border-purple-100 dark:border-gray-700 rounded-xl shadow-xl z-30 text-sm">
                {notifications.length === 0 ? (
                  <div className="px-4 py-3 text-center text-gray-400 select-none">No notifications available.</div>
                ) : (
                  notifications.map((note, idx) => (
                    <div key={idx} className="px-4 py-2 hover:bg-purple-50 dark:hover:bg-gray-700 transition">{note}</div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="text-purple-600 dark:text-purple-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800/80 backdrop-blur-md border border-purple-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-30 text-sm">
                <button
                  onClick={handleGoToSettings}
                  className="w-full px-4 py-2 text-left text-purple-700 dark:text-purple-300 font-medium hover:bg-purple-50 dark:hover:bg-gray-700 transition rounded-t-xl"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 text-left text-red-500 font-medium hover:bg-red-50 dark:hover:bg-gray-700 transition flex items-center gap-2 rounded-b-xl"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Wallet Section - at end of nav row */}
          <button
            onClick={() => navigate('/topup')}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white font-semibold shadow hover:scale-105 transition-transform"
            title="View or recharge wallet"
          >
            <span className="w-5 h-5 bg-yellow-400 rounded-full text-yellow-900 font-bold flex items-center justify-center mr-1">₹</span>
            {`₹${Number(balance).toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {navOpen && (
        <div className="md:hidden mt-3 px-3 space-y-2 animate-fade-in-down">
          <button
            onClick={handleGoToSettings}
            className="w-full flex items-center justify-between px-4 py-2 border border-purple-500 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900 transition"
          >
            Settings
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
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
