import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../shared/LanguageSwitcher";
import {
  Sun, Moon, Monitor, LogOut, Bell, Shield, Palette,
  Languages, LayoutGrid, DownloadCloud, Quote, ArrowLeft, User,
  Mail, Lock, Globe, Volume2, Smartphone, Database, Info
} from "lucide-react";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

const defaultSettings = {
  theme: "system",
  language: "en",
  testPlan: "all",
  autoDownload: false,
  showQuotes: true,
  notifications: true,
  emailUpdates: false,
  soundEffects: true,
  dataCollection: true,
};

export default function Settings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem("mindmates_settings");
    if (stored) {
      const loadedSettings = JSON.parse(stored);
      setSettings(loadedSettings);
      // Sync language with i18next
      if (loadedSettings.language && loadedSettings.language !== i18n.language) {
        i18n.changeLanguage(loadedSettings.language);
      }
    }
  }, [i18n]);

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
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("mindmates_settings", JSON.stringify(newSettings));
    
    // Update i18next language when language setting changes
    if (key === "language") {
      i18n.changeLanguage(value);
      localStorage.setItem('language', value);
      localStorage.setItem('mindmate-language', value);
    }
  };  const handleLogout = () => {
    localStorage.clear();
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20 pb-20 lg:pb-0">
      <div className="w-full">
        
        {/* Mobile Header - Sticky - Premium Design */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="text-purple-600" size={20} />
              <h1 className="text-lg font-bold text-gray-900">
                Settings
              </h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Desktop & Tablet Layout - Premium Design */}
        <div className="hidden lg:block p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {/* Header Section - Desktop */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-semibold transition-all mb-6 bg-white px-5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300"
              >
                <ArrowLeft size={16} strokeWidth={2.5} /> {t("common.goBack")}
              </button>
              
              <div className="flex items-center gap-5 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="text-white" size={36} strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-1">
                    {t("settings.title")}
                  </h1>
                  <p className="text-gray-600 text-base">
                    {t("settings.subtitle")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6">{/* Mobile & Tablet/Desktop content will go here */}

          {/* User Profile Card - Premium Design */}
          {user && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl lg:rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200 mb-5 lg:mb-7"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold flex-shrink-0">
                  {user.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {user.displayName || "User"}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2 justify-center sm:justify-start">
                    <Mail size={16} />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
                <button className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all text-sm whitespace-nowrap border border-gray-200">
                  {t("settings.editProfile")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Settings Grid - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Left Column - Appearance & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Appearance Section - Premium Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200"
            >
              <SectionHeader icon={<Palette />} title={t("settings.appearance")} subtitle={t("settings.appearance.subtitle")} />
              
              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                {/* Theme */}
                <SettingBlock icon={<Sun />} label={t("settings.theme")}>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {["light", "dark", "system"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting("theme", mode)}
                        className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                          settings.theme === mode
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg"
                            : "bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-100"
                        }`}
                      >
                        {mode === "light" && <Sun size={18} className="sm:w-6 sm:h-6" />}
                        {mode === "dark" && <Moon size={18} className="sm:w-6 sm:h-6" />}
                        {mode === "system" && <Monitor size={18} className="sm:w-6 sm:h-6" />}
                        <span className="text-[10px] sm:text-xs">
                          {t(`settings.theme.${mode}`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </SettingBlock>

                {/* Language */}
                <SettingBlock icon={<Languages />} label={t("settings.language")} description={t("settings.language.subtitle")}>
                  <div className="flex justify-start">
                    <LanguageSwitcher />
                  </div>
                </SettingBlock>
              </div>
            </motion.div>

            {/* Experience Section - Premium Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200"
            >
              <SectionHeader icon={<Smartphone />} title={t("settings.experience")} subtitle={t("settings.experience.subtitle")} />
              
              <div className="space-y-4 mt-6">
                {/* Test Plan */}
                <SettingBlock icon={<LayoutGrid />} label={t("settings.assessment")} description={t("settings.assessment.subtitle")}>
                  <div className="flex gap-2">
                    {["one", "two", "all"].map((option) => (
                      <button
                        key={option}
                        onClick={() => updateSetting("testPlan", option)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 font-bold transition ${
                          settings.testPlan === option
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-md"
                            : "bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-100"
                        }`}
                      >
                        {t(`settings.assessment.${option}`)}
                      </button>
                    ))}
                  </div>
                </SettingBlock>

                <ToggleBlock
                  icon={<Quote />}
                  label={t("settings.quotes")}
                  description={t("settings.quotes.desc")}
                  checked={settings.showQuotes}
                  onToggle={() => updateSetting("showQuotes", !settings.showQuotes)}
                />

                <ToggleBlock
                  icon={<Volume2 />}
                  label={t("settings.sound")}
                  description={t("settings.sound.desc")}
                  checked={settings.soundEffects}
                  onToggle={() => updateSetting("soundEffects", !settings.soundEffects)}
                />

                <ToggleBlock
                  icon={<DownloadCloud />}
                  label={t("settings.autoDownload")}
                  description={t("settings.autoDownload.desc")}
                  checked={settings.autoDownload}
                  onToggle={() => updateSetting("autoDownload", !settings.autoDownload)}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Notifications & Privacy */}
          <div className="space-y-6">
            
            {/* Notifications Section - Premium Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200"
            >
              <SectionHeader icon={<Bell />} title={t("settings.notifications")} subtitle={t("settings.notifications.subtitle")} />
              
              <div className="space-y-4 mt-6">
                <ToggleBlock
                  icon={<Bell />}
                  label={t("settings.push")}
                  description={t("settings.push.desc")}
                  checked={settings.notifications}
                  onToggle={() => updateSetting("notifications", !settings.notifications)}
                  compact
                />

                <ToggleBlock
                  icon={<Mail />}
                  label={t("settings.email")}
                  description={t("settings.email.desc")}
                  checked={settings.emailUpdates}
                  onToggle={() => updateSetting("emailUpdates", !settings.emailUpdates)}
                  compact
                />
              </div>
            </motion.div>

            {/* Privacy Section - Premium Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200"
            >
              <SectionHeader icon={<Lock />} title={t("settings.privacy")} subtitle={t("settings.privacy.subtitle")} />
              
              <div className="space-y-4 mt-6">
                <ToggleBlock
                  icon={<Database />}
                  label={t("settings.analytics")}
                  description={t("settings.analytics.desc")}
                  checked={settings.dataCollection}
                  onToggle={() => updateSetting("dataCollection", !settings.dataCollection)}
                  compact
                />

                <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2 border border-gray-200">
                  <Shield size={16} />
                  {t("settings.privacyPolicy")}
                </button>

                <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2 border border-gray-200">
                  <Info size={16} />
                  {t("settings.terms")}
                </button>
              </div>
            </motion.div>

            {/* Account Actions - Premium Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 border border-gray-200"
            >
              <SectionHeader icon={<User />} title={t("settings.account")} subtitle={t("settings.account.subtitle")} />
              
              <div className="space-y-3 mt-6">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <Lock size={16} />
                  {t("settings.changePassword")}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  {t("nav.logout")}
                </button>
              </div>
            </motion.div>
          </div>{/* End Right Column */}
        </div>{/* End Settings Grid */}

        {/* App Version Footer - Premium Design */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 lg:mt-8 text-center text-xs sm:text-sm text-gray-500 bg-white rounded-xl p-3 sm:p-4 border border-gray-200"
        >
          <p className="font-semibold">{t("brand.name")} v2.0.0 • {t("brand.footer")}</p>
        </motion.div>

        </div>{/* End Content Container */}
      </div>{/* End Desktop Wrapper */}
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-purple-200">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
        {React.cloneElement(icon, { className: "text-white", size: 20 })}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function SettingBlock({ icon, label, description, children }) {
  return (
    <div>
      <div className="flex items-start gap-2 mb-3">
        <div className="mt-0.5">
          {React.cloneElement(icon, { className: "text-purple-600", size: 18 })}
        </div>
        <div className="flex-1">
          <label className="font-bold text-gray-900 block">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-600 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleBlock({ icon, label, description, checked, onToggle, compact }) {
  return (
    <div className={`flex items-start justify-between gap-4 ${!compact && "py-4 border-b border-gray-200"}`}>
      <div className="flex items-start gap-3 flex-1">
        <div className={`${compact ? "mt-1" : "mt-0.5"}`}>
          {React.cloneElement(icon, { className: "text-purple-600", size: 18 })}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {label}
          </p>
          {description && (
            <p className="text-xs text-gray-600 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <label className="inline-flex items-center cursor-pointer flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onToggle}
        />
        <div className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 ${checked ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-300"}`}>
          <div
            className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
}
