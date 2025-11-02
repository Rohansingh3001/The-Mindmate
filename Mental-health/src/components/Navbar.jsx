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
    toast.success(t('settings.notifications.opening'), {
      position: "top-right",
      theme: "colored",
    });
    navigate("/user/settings");
  };

  return (
    <nav className="w-full z-50 px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('brand.name')}
          </h1>
        </div>

        {/* Desktop Nav + Wallet Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={handleNotificationClick}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            >
              <Bell className="w-5 h-5" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 overflow-hidden">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    {t('notifications.none')}
                  </div>
                ) : (
                  notifications.map((note, idx) => (
                    <div key={idx} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0">
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
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 overflow-hidden">
                <button
                  onClick={handleGoToSettings}
                  className="w-full px-4 py-3 text-left text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4" />
                  {t('nav.settings')}
                </button>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>

          {/* Wallet Section */}
          <button
            onClick={() => navigate('/user/topup')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            title="View or recharge wallet"
          >
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-900 font-bold text-xs">₹</span>
            </div>
            <span className="text-sm">{`₹${Number(balance).toFixed(2)}`}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="md:hidden p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {navOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {/* Language Switcher - Mobile */}
          <div className="px-2 py-2">
            <LanguageSwitcher />
          </div>
          
          <button
            onClick={handleGoToSettings}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <span className="font-medium">{t('nav.settings')}</span>
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/user/topup')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
          >
            <span className="font-medium">{t('wallet.balance')}: ₹{Number(balance).toFixed(2)}</span>
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-900 font-bold text-xs">₹</span>
            </div>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors shadow-sm"
          >
            <span className="font-medium">{t('nav.logout')}</span>
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
