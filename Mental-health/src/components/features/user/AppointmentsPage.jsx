// AppointmentsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,  
  MapPin, 
  XCircle,
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPin as MapPinIcon,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Home,
  Heart,
  MessageCircle,
  Settings as SettingsIcon
} from "lucide-react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../../../firebase";
import {
  collection, addDoc, getDocs, Timestamp, deleteDoc, doc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import doctorsList from "../../../constants/doctors";
import { useTheme } from "../../../context/ThemeContext";
import DashboardSidebar from "../../dashboard/DashboardSidebar";
import DashboardTopHeader from "../../dashboard/DashboardTopHeader";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Custom calendar styles - Light Mode
const calendarStyles = `
  .rbc-calendar {
    background: white;
    color: #1e293b;
  }
  .rbc-header {
    background: #f8fafc;
    color: #1e293b;
    border-bottom: 1px solid #e2e8f0;
    padding: 12px;
    font-weight: 600;
  }
  .rbc-month-view {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }
  .rbc-month-row {
    border-top: 1px solid #e2e8f0;
  }
  .rbc-day-bg {
    background: white;
    border-left: 1px solid #e2e8f0;
  }
  .rbc-off-range-bg {
    background: #f8fafc;
  }
  .rbc-today {
    background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;
  }
  .rbc-date-cell {
    padding: 8px;
  }
  .rbc-date-cell button {
    color: #1e293b;
    font-weight: 600;
  }
  .rbc-today button {
    color: #ffffff !important;
    font-weight: 800;
  }
  .rbc-off-range button {
    color: #94a3b8;
  }
  .rbc-current-time-indicator {
    background-color: #a855f7;
  }
`;

export default function AppointmentsPage() {
  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = calendarStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [newAppt, setNewAppt] = useState({ dateTime: null, doctor: "", mode: "Online" });
  const [toastType, setToastType] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedView, setSelectedView] = useState("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");

  // Get current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch appointments - only for current user
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser?.uid) return;
      
      const apptRef = collection(db, "appointments");
      const snapshot = await getDocs(apptRef);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        const dt = d.timestamp?.toDate?.();
        return {
          id: doc.id,
          ...d,
          timestamp: dt,
          date: format(dt, "yyyy-MM-dd"),
          time: format(dt, "HH:mm"),
        };
      });
      // Filter by current user's ID and future appointments only
      setAppointments(data.filter((appt) => appt.userId === currentUser.uid && appt.timestamp > new Date()));
    };
    fetchAppointments();
  }, [currentUser]);

  // Handle booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dateTime, doctor, mode } = newAppt;

    if (!dateTime || !doctor || !currentUser) return;
    if (dateTime <= new Date()) {
      setToastType("error");
      return;
    }

    const newEntry = {
      doctor,
      mode,
      timestamp: Timestamp.fromDate(dateTime),
      userId: currentUser.uid,
      userName: currentUser.name,
      userEmail: currentUser.email,
    };

    const docRef = await addDoc(collection(db, "appointments"), newEntry);

    setAppointments((prev) => [
      ...prev,
      {
        id: docRef.id,
        ...newEntry,
        timestamp: dateTime,
        date: format(dateTime, "yyyy-MM-dd"),
        time: format(dateTime, "HH:mm"),
      },
    ]);

    setNewAppt({ dateTime: null, doctor: "", mode: "Online" });
    setShowBookingForm(false);
    setToastType("booked");
  };

  // Cancel appointment
  const handleCancelAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, "appointments", id));
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      setToastType("cancelled");
    } catch (error) {
      setToastType("error");
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (toastType) {
      const timer = setTimeout(() => setToastType(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastType]);

  // Calendar data
  const calendarEvents = appointments.map((appt) => ({
    title: `${appt.doctor} (${appt.mode})`,
    start: appt.timestamp,
    end: new Date(appt.timestamp.getTime() + 30 * 60000),
    allDay: false,
    mode: appt.mode,
  }));

  const customEventStyleGetter = (event) => {
    const backgroundColor = event.mode === "Online" ? "#9333ea" : "#10b981";
    return {
      style: {
        backgroundColor,
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "10px",
        fontWeight: 700,
        border: "none",
        fontSize: "13px",
        boxShadow: "0 2px 8px rgba(147, 51, 234, 0.3)",
      },
    };
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appt.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === "all" || appt.mode.toLowerCase() === filterMode.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: appointments.length,
    online: appointments.filter(a => a.mode === "Online").length,
    offline: appointments.filter(a => a.mode === "Offline").length,
    thisWeek: appointments.filter(a => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return a.timestamp >= weekStart && a.timestamp <= weekEnd;
    }).length
  };

  const location = useLocation();

  const bottomNavItems = [
    { icon: Home, label: 'Dashboard', path: '/user/dashboard' },
    { icon: Heart, label: 'Mood', path: '/user/mood' },
    { icon: MessageCircle, label: 'AI Chat', path: '/user/fullchat' },
    { icon: CalendarIcon, label: 'Sessions', path: '/user/appointments' },
    { icon: SettingsIcon, label: 'Settings', path: '/user/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex flex-col">
      {/* 3-Column Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Desktop Only */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen w-full">
          {/* Top Header - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <DashboardTopHeader />
          </div>

          {/* Mobile Header - Visible only on mobile - Premium Clean Design */}
          <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <CalendarClock className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900">Your Sessions</h1>
                  <p className="text-xs text-gray-600">Manage your appointments</p>
                </div>
              </div>
              {/* Stats indicator on mobile header */}
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                  <p className="text-xs font-bold text-purple-600">{stats.total} Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto pb-20 lg:pb-6">
            <div className="max-w-[1600px] mx-auto">
              
              {/* Page Header - Desktop Only */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 md:mb-6 hidden lg:block"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <CalendarClock className="text-white" size={24} />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Your Sessions
                      </h1>
                      <p className="text-sm text-gray-600">
                        Manage your therapy appointments
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    <span>Book Session</span>
                  </button>
                </div>
              </motion.div>

              {/* Mobile Book Button - Fixed at bottom */}
              <div className="lg:hidden fixed bottom-20 right-4 z-30">
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center border-2 border-white"
                >
                  <Plus size={24} />
                </button>
              </div>

              {/* Stats Cards - Mobile Optimized */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
                {[
                  { 
                    label: "Total", 
                    fullLabel: "Total Sessions",
                    value: stats.total, 
                    icon: CalendarIcon, 
                    textColor: "text-purple-400",
                    bgColor: "bg-purple-500/20",
                    iconColor: "text-purple-400"
                  },
                  { 
                    label: "Online", 
                    fullLabel: "Online Sessions",
                    value: stats.online, 
                    icon: Video, 
                    textColor: "text-cyan-400",
                    bgColor: "bg-cyan-500/20",
                    iconColor: "text-cyan-400"
                  },
                  { 
                    label: "In-Person", 
                    fullLabel: "In-Person",
                    value: stats.offline, 
                    icon: MapPinIcon, 
                    textColor: "text-emerald-400",
                    bgColor: "bg-emerald-500/20",
                    iconColor: "text-emerald-400"
                  },
                  { 
                    label: "Week", 
                    fullLabel: "This Week",
                    value: stats.thisWeek, 
                    icon: Clock, 
                    textColor: "text-orange-400",
                    bgColor: "bg-orange-500/20",
                    iconColor: "text-orange-400"
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-200 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">
                          <span className="lg:hidden">{stat.label}</span>
                          <span className="hidden lg:inline">{stat.fullLabel}</span>
                        </p>
                        <p className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${stat.textColor}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl ${stat.bgColor} flex items-center justify-center border border-purple-200`}>
                        <stat.icon className={`${stat.iconColor} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7`} strokeWidth={2.5} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View Toggle & Search - Mobile Optimized */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-3 mb-4 md:mb-6"
              >
                {/* View Toggle */}
                <div className="bg-white rounded-xl p-1 border border-purple-200 inline-flex">
                  {["calendar", "list"].map((view) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(view)}
                      className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                        selectedView === view
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {view === "calendar" ? "Calendar" : "List"}
                    </button>
                  ))}
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-purple-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Sessions</option>
                    <option value="online">Online Only</option>
                    <option value="offline">In-Person Only</option>
                  </select>
                </div>
              </motion.div>

              {/* Main Content */}
              <AnimatePresence mode="wait">
                {selectedView === "calendar" ? (
                  <motion.section
                    key="calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl p-6 border border-purple-200"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <CalendarIcon className="text-white" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Calendar View</h2>
                    </div>
                    <div className="rounded-xl overflow-hidden">
                      <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        eventPropGetter={customEventStyleGetter}
                  views={["month", "week", "day"]}
                  tooltipAccessor={(event) => `${event.title} at ${format(event.start, "PPpp")}`}
                />
              </div>
            </motion.section>
                ) : (
                  <motion.section
                    key="list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {filteredAppointments.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-12 border border-purple-200 text-center"
                      >
                        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon className="text-purple-600" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          No Sessions Found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {searchTerm || filterMode !== "all" ? "Try adjusting your filters" : "Book your first therapy session to get started"}
                        </p>
                        {!searchTerm && filterMode === "all" && (
                          <button
                            onClick={() => setShowBookingForm(true)}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
                          >
                            Book Your First Session
                          </button>
                        )}
                      </motion.div>
                    ) : (
                      filteredAppointments
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .map((appt, index) => (
                          <motion.div
                            key={appt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl p-6 border border-purple-200 hover:border-purple-300 transition-all"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  appt.mode === "Online" 
                                    ? "bg-gradient-to-br from-cyan-500 to-blue-600" 
                                    : "bg-gradient-to-br from-emerald-500 to-green-600"
                                }`}>
                                  {appt.mode === "Online" 
                                    ? <Video className="text-white" size={28} strokeWidth={2.5} /> 
                                    : <MapPinIcon className="text-white" size={28} strokeWidth={2.5} />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                      Dr. {appt.doctor}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                      appt.mode === "Online" 
                                        ? "bg-cyan-100 text-cyan-700 border border-cyan-200" 
                                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                    }`}>
                                      {appt.mode}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon size={16} className="text-gray-500" />
                                      <span className="font-medium">{format(appt.timestamp, "MMM dd, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock size={16} className="text-gray-500" />
                                      <span className="font-medium">{format(appt.timestamp, "hh:mm a")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User size={16} className="text-gray-500" />
                                      <span className="font-medium">{appt.userName}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {currentUser?.uid === appt.userId && (
                                <button
                                  onClick={() => handleCancelAppointment(appt.id)}
                                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all flex items-center gap-2 font-bold"
                                >
                                  <XCircle size={18} />
                                  <span>Cancel</span>
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))
                    )}
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Bottom Navigation - Mobile Only - Enhanced */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pointer-events-none">
            <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-xl border border-gray-200 dark:border-gray-700 pointer-events-auto backdrop-blur-xl bg-white/95 dark:bg-gray-800/95">
              <div className="flex items-center justify-around px-2 py-3">
                {bottomNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      whileTap={{ scale: 0.9 }}
                      className="relative flex flex-col items-center gap-1 min-w-[60px] px-2 py-1"
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="appointmentsActiveTab"
                          className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-purple-600 dark:bg-purple-400 rounded-full"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Icon Container */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-br from-purple-600 to-purple-500 dark:from-purple-500 dark:to-purple-600 shadow-lg scale-110'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-colors duration-200 ${
                            isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                          }`}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      </div>
                      
                      {/* Label */}
                      <span
                        className={`text-[10px] font-bold transition-colors duration-200 ${
                          isActive ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Plus className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Book Session
                  </h2>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Therapist
                  </label>
                  <select
                    value={newAppt.doctor}
                    onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Choose a therapist...</option>
                    {doctorsList.map((doc) => (
                      <option key={doc.name} value={doc.name}>
                        Dr. {doc.name} – {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date & Time
                  </label>
                  <DatePicker
                    selected={newAppt.dateTime}
                    onChange={(date) => setNewAppt({ ...newAppt, dateTime: date })}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    required
                    placeholderText="Select date and time"
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Mode Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Session Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewAppt({ ...newAppt, mode: "Online" })}
                      className={`p-5 rounded-xl border-2 transition-colors ${
                        newAppt.mode === "Online"
                          ? "border-mindmate-600 bg-gradient-to-br from-mindmate-50 to-purple-50 dark:from-mindmate-900/20 dark:to-purple-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Video className={`mx-auto mb-2 ${newAppt.mode === "Online" ? "text-mindmate-600 dark:text-mindmate-400" : "text-slate-400"}`} size={28} strokeWidth={2.5} />
                      <p className={`text-sm font-bold ${newAppt.mode === "Online" ? "text-mindmate-600 dark:text-mindmate-400" : "text-slate-600 dark:text-slate-400"}`}>
                        Online
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAppt({ ...newAppt, mode: "Offline" })}
                      className={`p-5 rounded-xl border-2 transition-colors ${
                        newAppt.mode === "Offline"
                          ? "border-emerald-600 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <MapPin className={`mx-auto mb-2 ${newAppt.mode === "Offline" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} size={28} strokeWidth={2.5} />
                      <p className={`text-sm font-bold ${newAppt.mode === "Offline" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>
                        In-Person
                      </p>
                    </button>
                  </div>
                </div>

                {/* Submit Button - Clean Premium */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-mindmate-600 to-purple-600 text-white font-bold hover:from-mindmate-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastType && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 lg:bottom-6 right-6 z-50"
          >
            <div className={`px-6 py-4 rounded-2xl border-2 flex items-center gap-3 ${
              toastType === "booked" 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white" 
                : toastType === "cancelled"
                ? "bg-gradient-to-r from-orange-500 to-amber-600 border-orange-400 text-white"
                : "bg-gradient-to-r from-red-500 to-pink-600 border-red-400 text-white"
            }`}>
              {toastType === "booked" && (
                <>
                  <CheckCircle size={24} strokeWidth={2.5} />
                  <span className="font-bold text-lg">Session booked successfully!</span>
                </>
              )}
              {toastType === "cancelled" && (
                <>
                  <AlertCircle size={24} strokeWidth={2.5} />
                  <span className="font-bold text-lg">Session cancelled</span>
                </>
              )}
              {toastType === "error" && (
                <>
                  <XCircle size={24} strokeWidth={2.5} />
                  <span className="font-bold text-lg">Please select a future date & time</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
