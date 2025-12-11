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
    <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 p-4 sm:p-6 lg:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-semibold transition mb-4 bg-white px-4 py-2 rounded-xl shadow-sm"
          >
            <ArrowLeft size={16} /> {t("common.goBack")}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("settings.title")}
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                {t("settings.subtitle")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Profile Card */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {user.displayName || "User"}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Mail size={14} />
                  {user.email}
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 rounded-xl font-bold transition-all shadow-md text-sm">
                {t("settings.editProfile")}
              </button>
            </div>
          </motion.div>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Appearance & Preferences */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Appearance Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200"
            >
              <SectionHeader icon={<Palette />} title={t("settings.appearance")} subtitle={t("settings.appearance.subtitle")} />
              
              <div className="space-y-6 mt-6">
                {/* Theme */}
                <SettingBlock icon={<Sun />} label={t("settings.theme")}>
                  <div className="grid grid-cols-3 gap-3">
                    {["light", "dark", "system"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting("theme", mode)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                          settings.theme === mode
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg"
                            : "bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-100"
                        }`}
                      >
                        {mode === "light" && <Sun size={24} />}
                        {mode === "dark" && <Moon size={24} />}
                        {mode === "system" && <Monitor size={24} />}
                        <span className="text-xs">
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

            {/* Experience Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200"
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
            
            {/* Notifications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200"
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

            {/* Privacy Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200"
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

                <button className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 shadow-sm">
                  <Shield size={16} />
                  {t("settings.privacyPolicy")}
                </button>

                <button className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 shadow-sm">
                  <Info size={16} />
                  {t("settings.terms")}
                </button>
              </div>
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-purple-200"
            >
              <SectionHeader icon={<User />} title={t("settings.account")} subtitle={t("settings.account.subtitle")} />
              
              <div className="space-y-3 mt-6">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                  <Lock size={16} />
                  {t("settings.changePassword")}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  {t("nav.logout")}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* App Version Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center text-sm text-gray-600 bg-white rounded-2xl p-4 shadow-lg border border-purple-200"
        >
          <p className="font-semibold">{t("brand.name")} v2.0.0 • {t("brand.footer")}</p>
        </motion.div>
      </div>
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
    <div className={`flex items-start justify-between gap-4 ${!compact && "py-4 border-b border-purple-200"}`}>
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
        <div className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 shadow-inner ${checked ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-300"}`}>
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
}
