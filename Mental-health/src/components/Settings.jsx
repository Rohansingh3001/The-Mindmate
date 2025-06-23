import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, Moon, Monitor, LogOut,
  Languages, LayoutGrid, DownloadCloud, Quote, ArrowLeft, User
} from "lucide-react";
import { getAuth } from "firebase/auth";

const defaultSettings = {
  theme: "system",
  language: "en",
  testPlan: "all",
  autoDownload: false,
  showQuotes: true,
};

export default function Settings() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem("mindmates_settings");
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme =
      settings.theme === "system"
        ? systemDark ? "dark" : "light"
        : settings.theme;
    html.classList.toggle("dark", theme === "dark");
  }, [settings.theme]);

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("mindmates_settings", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 sm:p-10 backdrop-blur-lg ring-1 ring-purple-200 dark:ring-purple-700">
        
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-300 hover:underline transition"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-200 mb-8 text-center">
          ⚙️ Settings
        </h1>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-4 mb-10 bg-purple-50 dark:bg-purple-900/30 p-4 rounded-2xl border border-purple-200 dark:border-purple-700">
            <User className="text-purple-600 dark:text-purple-300" size={24} />
            <div>
              <p className="font-semibold text-purple-800 dark:text-purple-100">{user.displayName || "User"}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        )}

        <div className="space-y-8 text-sm text-gray-700 dark:text-gray-200">
          {/* Theme */}
          <SettingBlock icon={<Sun />} label="Theme">
            <div className="flex flex-wrap gap-3">
              {["light", "dark", "system"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting("theme", mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                    settings.theme === mode
                      ? "bg-purple-100 border-purple-500 dark:bg-purple-600 dark:text-white"
                      : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                  }`}
                >
                  {mode === "light" && <Sun size={16} />}
                  {mode === "dark" && <Moon size={16} />}
                  {mode === "system" && <Monitor size={16} />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </SettingBlock>

          {/* Language */}
          <SettingBlock icon={<Languages />} label="Language">
            <select
              value={settings.language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </SettingBlock>

          {/* Test Plan */}
          <SettingBlock icon={<LayoutGrid />} label="Test Plan">
            <div className="flex gap-2">
              {["one", "two", "all"].map((option) => (
                <button
                  key={option}
                  onClick={() => updateSetting("testPlan", option)}
                  className={`px-4 py-2 rounded-xl border font-medium transition ${
                    settings.testPlan === option
                      ? "bg-purple-200 border-purple-500 dark:bg-purple-700 dark:text-white"
                      : "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                  }`}
                >
                  {option === "one" ? "1 Test" : option === "two" ? "2 Tests" : "All Tests"}
                </button>
              ))}
            </div>
          </SettingBlock>

          {/* Auto Download */}
          <ToggleBlock
            icon={<DownloadCloud />}
            label="Auto Download Report"
            checked={settings.autoDownload}
            onToggle={() => updateSetting("autoDownload", !settings.autoDownload)}
          />

          {/* Show Quotes */}
          <ToggleBlock
            icon={<Quote />}
            label="Motivational Quotes"
            checked={settings.showQuotes}
            onToggle={() => updateSetting("showQuotes", !settings.showQuotes)}
          />

          {/* Logout */}
          <div className="pt-8 text-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingBlock({ icon, label, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 font-semibold text-purple-700 dark:text-purple-300">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function ToggleBlock({ icon, label, checked, onToggle }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium">
        {icon}
        {label}
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onToggle}
        />
        <div className={`w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition ${checked ? 'bg-purple-500' : ''}`}>
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
}
