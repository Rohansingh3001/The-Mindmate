import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
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
    if (key === 'language') {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-4"
          >
            <ArrowLeft size={16} /> {t('common.goBack')}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                {t('settings.title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {t('settings.subtitle')}
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {user.displayName || "User"}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
                  <Mail size={14} />
                  {user.email}
                </p>
              </div>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition text-sm">
                {t('settings.editProfile')}
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <SectionHeader icon={<Palette />} title={t('settings.appearance')} subtitle={t('settings.appearance.subtitle')} />
              
              <div className="space-y-6 mt-6">
                {/* Theme */}
                <SettingBlock icon={<Sun />} label={t('settings.theme')}>
                  <div className="grid grid-cols-3 gap-3">
                    {["light", "dark", "system"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => updateSetting("theme", mode)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          settings.theme === mode
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600"
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
                <SettingBlock icon={<Languages />} label={t('settings.language')} description={t('settings.language.subtitle')}>
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <SectionHeader icon={<Smartphone />} title={t('settings.experience')} subtitle={t('settings.experience.subtitle')} />
              
              <div className="space-y-4 mt-6">
                {/* Test Plan */}
                <SettingBlock icon={<LayoutGrid />} label={t('settings.assessment')} description={t('settings.assessment.subtitle')}>
                  <div className="flex gap-2">
                    {["one", "two", "all"].map((option) => (
                      <button
                        key={option}
                        onClick={() => updateSetting("testPlan", option)}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition ${
                          settings.testPlan === option
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600"
                        }`}
                      >
                        {t(`settings.assessment.${option}`)}
                      </button>
                    ))}
                  </div>
                </SettingBlock>

                <ToggleBlock
                  icon={<Quote />}
                  label={t('settings.quotes')}
                  description={t('settings.quotes.desc')}
                  checked={settings.showQuotes}
                  onToggle={() => updateSetting("showQuotes", !settings.showQuotes)}
                />

                <ToggleBlock
                  icon={<Volume2 />}
                  label={t('settings.sound')}
                  description={t('settings.sound.desc')}
                  checked={settings.soundEffects}
                  onToggle={() => updateSetting("soundEffects", !settings.soundEffects)}
                />

                <ToggleBlock
                  icon={<DownloadCloud />}
                  label={t('settings.autoDownload')}
                  description={t('settings.autoDownload.desc')}
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <SectionHeader icon={<Bell />} title={t('settings.notifications')} subtitle={t('settings.notifications.subtitle')} />
              
              <div className="space-y-4 mt-6">
                <ToggleBlock
                  icon={<Bell />}
                  label={t('settings.push')}
                  description={t('settings.push.desc')}
                  checked={settings.notifications}
                  onToggle={() => updateSetting("notifications", !settings.notifications)}
                  compact
                />

                <ToggleBlock
                  icon={<Mail />}
                  label={t('settings.email')}
                  description={t('settings.email.desc')}
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <SectionHeader icon={<Lock />} title={t('settings.privacy')} subtitle={t('settings.privacy.subtitle')} />
              
              <div className="space-y-4 mt-6">
                <ToggleBlock
                  icon={<Database />}
                  label={t('settings.analytics')}
                  description={t('settings.analytics.desc')}
                  checked={settings.dataCollection}
                  onToggle={() => updateSetting("dataCollection", !settings.dataCollection)}
                  compact
                />

                <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition text-sm flex items-center justify-center gap-2">
                  <Shield size={16} />
                  {t('settings.privacyPolicy')}
                </button>

                <button className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition text-sm flex items-center justify-center gap-2">
                  <Info size={16} />
                  {t('settings.terms')}
                </button>
              </div>
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <SectionHeader icon={<User />} title={t('settings.account')} subtitle={t('settings.account.subtitle')} />
              
              <div className="space-y-3 mt-6">
                <button className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <Lock size={16} />
                  {t('settings.changePassword')}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  {t('nav.logout')}
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
          className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          <p>{t('brand.name')} v2.0.0 • {t('brand.footer')}</p>
        </motion.div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
        {React.cloneElement(icon, { className: "text-indigo-600 dark:text-indigo-400", size: 20 })}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
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
          {React.cloneElement(icon, { className: "text-slate-600 dark:text-slate-400", size: 18 })}
        </div>
        <div className="flex-1">
          <label className="font-medium text-slate-900 dark:text-white block">
            {label}
          </label>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
    <div className={`flex items-start justify-between gap-4 ${!compact && 'py-4 border-b border-slate-200 dark:border-slate-800'}`}>
      <div className="flex items-start gap-3 flex-1">
        <div className={`${compact ? 'mt-1' : 'mt-0.5'}`}>
          {React.cloneElement(icon, { className: "text-slate-600 dark:text-slate-400", size: 18 })}
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white">
            {label}
          </p>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
        <div className={`w-11 h-6 rounded-full p-1 transition-all duration-300 ${checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
}
