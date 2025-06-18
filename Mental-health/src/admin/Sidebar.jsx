import React from "react";
import { LogOut, Users, CalendarCheck, BarChart3, Home } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

const Sidebar = ({ setActiveSection, activeSection }) => {
  const handleLogout = () => {
    signOut(getAuth());
  };

  const linkClasses = (section) =>
    `flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer ${
      activeSection === section
        ? "bg-purple-700 text-white font-bold"
        : "text-white hover:bg-purple-600"
    }`;

  return (
    <div className="w-64 bg-purple-800 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <nav className="space-y-2">
        <div className={linkClasses("dashboard")} onClick={() => setActiveSection("dashboard")}>
          <Home size={18} /> Dashboard
        </div>
        <div className={linkClasses("users")} onClick={() => setActiveSection("users")}>
          <Users size={18} /> Users
        </div>
        <div className={linkClasses("appointments")} onClick={() => setActiveSection("appointments")}>
          <CalendarCheck size={18} /> Appointments
        </div>
        <div className={linkClasses("schools")} onClick={() => setActiveSection("schools")}>
          <BarChart3 size={18} /> Schools
        </div>
      </nav>
      <hr className="border-white/30" />
      <button
        onClick={handleLogout}
        className="text-sm text-red-200 hover:text-red-100 flex items-center gap-2"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
