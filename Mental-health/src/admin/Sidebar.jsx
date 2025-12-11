import React, { useEffect, useState } from "react";
import {
  LogOut,
  Users,
  CalendarCheck,
  BarChart3,
  Home,
  ChevronsLeft,
  ChevronsRight,
  Sun,
  Moon,
  Menu,
  X,
  Briefcase,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  MessageSquare,
  Activity,
  TrendingUp,
  Database,
  FileText,
  UserCheck,
  Zap
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { IoIosPaper } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", icon: <Home size={18} />, key: "dashboard" },
  { label: "Users", icon: <Users size={18} />, key: "users" },
  { label: "Appointments", icon: <CalendarCheck size={18} />, key: "appointments" },
  { label: "Schools", icon: <BarChart3 size={18} />, key: "schools" },
  { label: "Peer Support", icon: <MessageSquare size={18} />, key: "peer" },
  { label: "Interns", icon: <UserCheck size={18} />, key: "interns" },
  { label: "Careers", icon: <Briefcase size={18} />, key: "career" },
  { label: "Forms", icon: <IoIosPaper size={18} />, key: "form" },
  { label: "Settings", icon: <FiSettings size={18} />, key: "manage" }
];

const Sidebar = ({ setActiveSection, activeSection, onSidebarToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(collapsed);
    }
  }, [collapsed, onSidebarToggle]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear admin localStorage session
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminEmail');
      
      // Sign out from Firebase (if logged in via Firebase)
      const auth = getAuth();
      if (auth.currentUser) {
        signOut(auth);
      } else {
        // If not Firebase user, manually redirect
        window.location.href = '/login';
      }
    }
  };

  const SidebarContent = () => (
    <div
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col z-30 ${
        collapsed ? "w-16" : "w-64"
      } transition-all duration-200`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-zinc-900 dark:bg-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-white dark:text-zinc-900" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  MindMates
                </h1>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveSection(item.key);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                activeSection === item.key
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
              title={collapsed ? item.label : ""}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-zinc-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          title={collapsed ? "Toggle Theme" : ""}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>Theme</span>}
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
