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
  Briefcase, // New icon
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

const navItems = [
  { label: "Dashboard", icon: <Home size={18} />, key: "dashboard" },
  { label: "Users", icon: <Users size={18} />, key: "users" },
  { label: "Appointments", icon: <CalendarCheck size={18} />, key: "appointments" },
  { label: "Schools", icon: <BarChart3 size={18} />, key: "schools" },
  { label: "Peer Support", icon: <Users size={18} />, key: "peer" },
  { label: "Careers", icon: <Briefcase size={18} />, key: "career" }, // ✅ Career tab added
];

const Sidebar = ({ setActiveSection, activeSection }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() =>
    localStorage.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    signOut(getAuth());
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.theme = newTheme;
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const SidebarContent = () => (
    <div
      className={`h-screen bg-purple-800 text-white p-4 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 text-white flex items-center gap-2"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          {!collapsed && <span className="text-sm font-semibold">Collapse</span>}
        </button>

        {!collapsed && <h1 className="text-xl font-bold mb-6 px-2">Admin Panel</h1>}

        <nav className="space-y-2">
          {navItems.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                setActiveSection(item.key);
                setMobileOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer group transition ${
                activeSection === item.key
                  ? "bg-purple-700 font-bold"
                  : "hover:bg-purple-600"
              }`}
              title={collapsed ? item.label : ""}
            >
              {item.icon}
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-yellow-300 hover:text-yellow-100 transition px-2 py-2 rounded-md hover:bg-purple-700"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && (
            <span className="text-sm">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-300 hover:text-red-100 transition px-2 py-2 rounded-md hover:bg-purple-700"
        >
          <LogOut size={16} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileOpen(true)} className="text-purple-700 dark:text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 transition-transform transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setMobileOpen(false)} />
        <div className="relative z-50">
          <div className="bg-purple-800 text-white w-64 h-screen p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <button onClick={() => setMobileOpen(false)} className="text-white">
                <X size={24} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
