import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ onLogout }) => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Read wallet balance from localStorage
    const stored = localStorage.getItem("wallet_balance");
    setBalance(stored ? parseFloat(stored) : 0);

    // Listen for changes from other tabs/windows and same tab
    const onStorageChange = (e) => {
      if (e.key === "wallet_balance" || e.type === "walletUpdate") {
        const newBalance = localStorage.getItem("wallet_balance");
        setBalance(newBalance ? parseFloat(newBalance) : 0);
      }
    };
    
    window.addEventListener("storage", onStorageChange);
    window.addEventListener("walletUpdate", onStorageChange);
    
    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("walletUpdate", onStorageChange);
    };
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
    toast.success(t("settings.notifications.opening"), {
      position: "top-right",
      theme: "colored",
    });
    navigate("/user/settings");
  };

  return (
    <nav className="w-full z-50 px-4 sm:px-6 py-3 sm:py-4 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl border-b border-purple-100 dark:border-slate-800 shadow-sm sticky top-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Name */}
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent dark:text-white tracking-tight whitespace-nowrap">
            The MindMates
          </h1>
        </div>

        {/* Desktop Nav + Wallet Section */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={handleNotificationClick}
              className="p-2.5 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-600 dark:text-slate-300 transition-all duration-200 hover:shadow-md"
            >
              <Bell className="w-5 h-5" strokeWidth={2} />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-800 border border-mindmate-200 dark:border-slate-700 rounded-2xl shadow-soft-lg z-30 overflow-hidden">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-mindmate-400 dark:text-slate-400 text-sm">
                    {t("notifications.none")}
                  </div>
                ) : (
                  notifications.map((note, idx) => (
                    <div key={idx} className="px-4 py-3 hover:bg-mindmate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-mindmate-100 dark:border-slate-700 last:border-0">
                      {note}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2.5 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-600 dark:text-slate-300 transition-all duration-200 hover:shadow-md"
            >
              <SettingsIcon className="w-5 h-5" strokeWidth={2} />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-mindmate-200 dark:border-slate-700 rounded-2xl shadow-soft-lg z-30 overflow-hidden">
                <button
                  onClick={handleGoToSettings}
                  className="w-full px-4 py-3 text-left text-mindmate-700 dark:text-slate-300 font-medium hover:bg-mindmate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4" />
                  {t("nav.settings")}
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border-t border-mindmate-100 dark:border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  {t("nav.logout")}
                </button>
              </div>
            )}
          </div>

          {/* Wallet Section */}
          <button
            onClick={() => navigate('/user/topup')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            title="View or recharge wallet"
          >
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-yellow-900 font-bold text-xs">₹</span>
            </div>
            <span className="text-sm">{`₹${Number(balance).toFixed(2)}`}</span>
          </button>
        </div>

        {/* Mobile Menu Button - App-like */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="md:hidden p-2.5 rounded-xl bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-600 dark:text-slate-300 transition-all duration-200 active:scale-95"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile Dropdown - App-like Overlay */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4 space-y-3 pb-2"
          >
            {/* Language Switcher - Mobile */}
            <div className="px-2 py-2 bg-mindmate-50 dark:bg-slate-800/50 rounded-2xl">
              <LanguageSwitcher />
            </div>
            
            <button
              onClick={handleGoToSettings}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-slate-700 transition-all duration-200 active:scale-98"
            >
              <span className="font-medium">{t("nav.settings")}</span>
              <SettingsIcon className="w-5 h-5" strokeWidth={2} />
            </button>
            
            <button
              onClick={() => navigate("/user/topup")}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white transition-all duration-200 shadow-md active:scale-98"
            >
              <span className="font-semibold">{t("wallet.balance")}: ₹{Number(balance).toFixed(2)}</span>
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-yellow-900 font-bold text-xs">₹</span>
              </div>
            </button>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 shadow-sm active:scale-98"
            >
              <span className="font-medium">{t("nav.logout")}</span>
              <LogOut className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer autoClose={4000} hideProgressBar closeOnClick pauseOnHover />
    </nav>
  );
};

export default Navbar;
