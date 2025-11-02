import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";

import Sidebar from "../admin/Sidebar";
import Dashboard from "../admin/Dashboard";
import Users from "../admin/Users";
import Appointments from "../admin/Appointments";
import Schools from "../admin/Schools";
import AddPeer from "../admin/AddPeer";
import AdminCareer from "../admin/AdminCareers";
import Form from "../admin/AdminCreateForm";
import AdminCreateForm from "../admin/AdminCreateForm";
import ManageForms from "../admin/ManageForms";
export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    
    // Check if admin is authenticated via localStorage (hardcoded admin login)
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const adminEmail = localStorage.getItem('adminEmail');
    
    if (isAdminAuthenticated && adminEmail === 'mindmates@gmail.com') {
      // Admin logged in without Firebase
      setUser({ email: adminEmail, displayName: 'Admin' });
      setLoading(false);
      return;
    }
    
    // Regular Firebase authentication check
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const validAdmin = await isAdmin(u.email);
        if (!validAdmin) {
          alert("Access denied. You're not authorized as an admin.");
          navigate("/");
        } else {
          setUser(u);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600 dark:text-gray-300">
        Verifying admin access...
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <Users />;
      case "appointments":
        return <Appointments />;
      case "schools":
        return <Schools />;
      case "peer":
        return <AddPeer />;
      case "career": // ✅ Fixed key to match Sidebar
        return <AdminCareer />;
      case "form": // ✅ Fixed key to match Sidebar
        return <AdminCreateForm />;
      case "manage": // ✅ Fixed key to match Sidebar
        return <ManageForms />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Sidebar 
        setActiveSection={setActiveSection} 
        activeSection={activeSection}
        onSidebarToggle={handleSidebarToggle}
      />
      <main 
        className={`
          overflow-y-auto min-h-screen transition-all duration-300
          ${!isMobile ? (sidebarCollapsed ? 'ml-16 p-6' : 'ml-64 p-6') : 'ml-0 p-4 pt-20'}
        `}
      >
        {renderSection()}
      </main>
    </div>
  );
}
