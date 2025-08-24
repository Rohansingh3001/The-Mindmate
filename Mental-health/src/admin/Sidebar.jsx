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
  { 
    label: "Dashboard", 
    icon: <Home size={18} />, 
    key: "dashboard",
    description: "Overview & Analytics",
    badge: null
  },
  { 
    label: "User Management", 
    icon: <Users size={18} />, 
    key: "users",
    description: "Manage Platform Users",
    badge: "new"
  },
  { 
    label: "Appointments", 
    icon: <CalendarCheck size={18} />, 
    key: "appointments",
    description: "Session Scheduling",
    badge: null
  },
  { 
    label: "Analytics", 
    icon: <TrendingUp size={18} />, 
    key: "analytics",
    description: "Data & Insights",
    badge: null
  },
  { 
    label: "Schools", 
    icon: <BarChart3 size={18} />, 
    key: "schools",
    description: "Educational Institutions",
    badge: null
  },
  { 
    label: "Peer Support", 
    icon: <MessageSquare size={18} />, 
    key: "peer",
    description: "Community Management",
    badge: null
  },
  { 
    label: "Careers", 
    icon: <Briefcase size={18} />, 
    key: "career",
    description: "Job Opportunities",
    badge: null
  },
  { 
    label: "Forms", 
    icon: <IoIosPaper size={18} />, 
    key: "form",
    description: "Assessment Tools",
    badge: null
  },
  { 
    label: "Content Management", 
    icon: <FileText size={18} />, 
    key: "content",
    description: "Platform Content",
    badge: null
  },
  { 
    label: "System Settings", 
    icon: <FiSettings size={18} />, 
    key: "manage",
    description: "Platform Configuration",
    badge: null
  }
];

const quickActions = [
  { icon: Shield, label: "Security", key: "security" },
  { icon: Bell, label: "Notifications", key: "notifications" },
  { icon: Database, label: "Backup", key: "backup" },
  { icon: Activity, label: "Monitoring", key: "monitoring" }
];

const Sidebar = ({ setActiveSection, activeSection, onSidebarToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Notify parent component when sidebar toggles
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(collapsed);
    }
  }, [collapsed, onSidebarToggle]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      signOut(getAuth());
    }
  };

  const SidebarContent = () => (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col z-30 shadow-2xl border-r border-slate-700 overflow-hidden ${
        collapsed ? "w-20" : "w-80"
      } transition-all duration-300`}
    >
      {/* Scrollable Content Container */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          {/* Brand & Collapse Button */}
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    MindMates
                  </h1>
                  <p className="text-xs text-slate-400">Admin Panel</p>
                </div>
              </motion.div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-slate-300 hover:text-white"
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
          <div className="p-6 space-y-6">
            {/* Navigation */}
            <nav className="space-y-2">
              <div className={`${collapsed ? 'text-center' : 'text-left'} mb-4`}>
                {!collapsed && <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Main Navigation</p>}
              </div>
              
              {navItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setActiveSection(item.key);
                    setMobileOpen(false);
                  }}
                  className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeSection === item.key
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "hover:bg-slate-700 text-slate-300 hover:text-white"
                  }`}
                  title={collapsed ? item.label : ""}
                >
                  <div className={`flex-shrink-0 ${activeSection === item.key ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                    {item.icon}
                  </div>
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            <p className="text-xs text-slate-400 truncate">{item.description}</p>
                          </div>
                          {item.badge && (
                            <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active indicator */}
                  {activeSection === item.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                    />
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Quick Actions */}
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Quick Actions</p>
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {showQuickActions ? "Hide" : "Show"}
                  </button>
                </div>
                
                <AnimatePresence>
                  {showQuickActions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-2"
                    >
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.key}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors group"
                        >
                          <action.icon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                          <span className="text-xs text-slate-400 group-hover:text-white">{action.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-6 border-t border-slate-700 space-y-4">
          {/* Notifications */}
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">System Status</h4>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs text-slate-300">All systems operational</p>
              {notifications > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <Bell className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-400">{notifications} new notifications</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Controls */}
          <div className="space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-yellow-300 hover:text-yellow-100 hover:bg-slate-700 transition-all duration-200 group"
              title={collapsed ? (darkMode ? "Light Mode" : "Dark Mode") : ""}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {!collapsed && (
                <span className="text-sm font-medium">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>

            {!collapsed && (
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-300 hover:text-blue-100 hover:bg-slate-700 transition-all duration-200 group">
                <HelpCircle size={18} />
                <span className="text-sm font-medium">Help & Support</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-900/20 transition-all duration-200 group border border-red-800/50 hover:border-red-600/50"
              title={collapsed ? "Logout" : ""}
            >
              <LogOut size={18} />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>

          {/* Version Info */}
          {!collapsed && (
            <div className="text-center pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500">v2.1.0 • Admin Panel</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="p-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700"
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="relative z-50"
            >
              <div className="bg-slate-900 text-white w-80 h-screen p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold">MindMates Admin</h1>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setActiveSection(item.key);
                        setMobileOpen(false);
                      }}
                      className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        activeSection === item.key
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "hover:bg-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      <div className={`flex-shrink-0 ${activeSection === item.key ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            <p className="text-xs text-slate-400 truncate">{item.description}</p>
                          </div>
                          {item.badge && (
                            <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
