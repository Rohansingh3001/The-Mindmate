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

// Custom calendar styles
const calendarStyles = `
  .rbc-calendar {
    background: transparent;
    color: #e2e8f0;
  }
  .rbc-header {
    background: #475569;
    color: #f1f5f9;
    border-bottom: 1px solid #64748b;
    padding: 12px;
    font-weight: 600;
  }
  .rbc-month-view {
    background: transparent;
    border: 1px solid #475569;
    border-radius: 12px;
    overflow: hidden;
  }
  .rbc-month-row {
    border-top: 1px solid #475569;
  }
  .rbc-day-bg {
    background: #334155;
    border-left: 1px solid #475569;
  }
  .rbc-off-range-bg {
    background: #1e293b;
  }
  .rbc-today {
    background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%) !important;
  }
  .rbc-date-cell {
    padding: 8px;
  }
  .rbc-date-cell button {
    color: #f1f5f9;
    font-weight: 600;
  }
  .rbc-today button {
    color: #ffffff !important;
    font-weight: 800;
  }
  .rbc-off-range button {
    color: #64748b;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex flex-col">
      {/* 3-Column Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Desktop Only */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <DashboardTopHeader />

          {/* Appointments Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-6">
            <div className="max-w-[1600px] mx-auto">
              
              {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <CalendarClock className="text-white" size={24} />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Your Sessions
                      </h1>
                      <p className="text-sm text-slate-300">
                        Manage your therapy appointments
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Plus size={20} />
                    <span>Book Session</span>
                  </button>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { 
                    label: "Total Sessions", 
                    value: stats.total, 
                    icon: CalendarIcon, 
                    textColor: "text-purple-400",
                    bgColor: "bg-purple-500/20",
                    iconColor: "text-purple-400"
                  },
                  { 
                    label: "Online Sessions", 
                    value: stats.online, 
                    icon: Video, 
                    textColor: "text-cyan-400",
                    bgColor: "bg-cyan-500/20",
                    iconColor: "text-cyan-400"
                  },
                  { 
                    label: "In-Person", 
                    value: stats.offline, 
                    icon: MapPinIcon, 
                    textColor: "text-emerald-400",
                    bgColor: "bg-emerald-500/20",
                    iconColor: "text-emerald-400"
                  },
                  { 
                    label: "This Week", 
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
                    className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-lg hover:shadow-xl hover:bg-slate-700 transition-all hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-300 mb-2 font-medium">{stat.label}</p>
                        <p className={`text-4xl font-extrabold ${stat.textColor}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg border border-slate-600/30`}>
                        <stat.icon className={stat.iconColor} size={28} strokeWidth={2.5} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View Toggle & Search */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6"
              >
                {/* View Toggle */}
                <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-1 border border-slate-600/50 shadow-lg inline-flex">
                  {["calendar", "list"].map((view) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(view)}
                      className={`px-6 py-2.5 rounded-lg font-bold transition-all ${
                        selectedView === view
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                          : "text-slate-300 hover:text-white hover:bg-slate-600/50"
                      }`}
                    >
                      {view === "calendar" ? "Calendar" : "List"}
                    </button>
                  ))}
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg"
                    />
                  </div>
                  
                  <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-700/80 backdrop-blur-sm border border-slate-600/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg"
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
                    className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-xl"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <CalendarIcon className="text-white" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Calendar View</h2>
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
                        className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-12 border border-slate-600/50 shadow-xl text-center"
                      >
                        <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-purple-500/30">
                          <CalendarIcon className="text-purple-400" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          No Sessions Found
                        </h3>
                        <p className="text-slate-300 mb-6">
                          {searchTerm || filterMode !== "all" ? "Try adjusting your filters" : "Book your first therapy session to get started"}
                        </p>
                        {!searchTerm && filterMode === "all" && (
                          <button
                            onClick={() => setShowBookingForm(true)}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all shadow-lg"
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
                            className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 shadow-lg hover:shadow-xl hover:border-slate-500 transition-all hover:scale-[1.02]"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
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
                                    <h3 className="text-lg font-bold text-white">
                                      Dr. {appt.doctor}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-md ${
                                      appt.mode === "Online" 
                                        ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" 
                                        : "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                                    }`}>
                                      {appt.mode}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon size={16} className="text-slate-400" />
                                      <span className="font-medium">{format(appt.timestamp, "MMM dd, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock size={16} className="text-slate-400" />
                                      <span className="font-medium">{format(appt.timestamp, "hh:mm a")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User size={16} className="text-slate-400" />
                                      <span className="font-medium">{appt.userName}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {currentUser?.uid === appt.userId && (
                                <button
                                  onClick={() => handleCancelAppointment(appt.id)}
                                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all flex items-center gap-2 font-bold shadow-lg"
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

          {/* Bottom Navigation - Mobile Only */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40">
            <div className="flex items-center justify-around py-3 px-4">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-mindmate-600 to-purple-600 text-white shadow-lg scale-110'
                        : 'text-slate-600 dark:text-slate-400 hover:text-mindmate-600 dark:hover:text-mindmate-400'
                    }`}
                  >
                    <Icon size={20} strokeWidth={2.5} />
                    <span className="text-[10px] font-semibold">{item.label}</span>
                  </button>
                );
              })}
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-slate-200/50 dark:border-slate-700/50 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mindmate-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Plus className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Book Session
                  </h2>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:scale-110"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select Therapist
                  </label>
                  <select
                    value={newAppt.doctor}
                    onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-mindmate-500 focus:border-transparent transition-all shadow-sm"
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-mindmate-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                {/* Mode Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Session Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewAppt({ ...newAppt, mode: "Online" })}
                      className={`p-5 rounded-xl border-2 transition-all shadow-sm ${
                        newAppt.mode === "Online"
                          ? "border-mindmate-600 bg-gradient-to-br from-mindmate-50 to-purple-50 dark:from-mindmate-900/20 dark:to-purple-900/20 shadow-md scale-105"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:scale-105"
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
                      className={`p-5 rounded-xl border-2 transition-all shadow-sm ${
                        newAppt.mode === "Offline"
                          ? "border-emerald-600 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-md scale-105"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:scale-105"
                      }`}
                    >
                      <MapPin className={`mx-auto mb-2 ${newAppt.mode === "Offline" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} size={28} strokeWidth={2.5} />
                      <p className={`text-sm font-bold ${newAppt.mode === "Offline" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>
                        In-Person
                      </p>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-mindmate-600 to-purple-600 text-white font-bold hover:shadow-xl hover:scale-105 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg"
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
            <div className={`px-6 py-4 rounded-2xl shadow-2xl border-2 flex items-center gap-3 backdrop-blur-xl ${
              toastType === "booked" 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white shadow-green-500/50" 
                : toastType === "cancelled"
                ? "bg-gradient-to-r from-orange-500 to-amber-600 border-orange-400 text-white shadow-orange-500/50"
                : "bg-gradient-to-r from-red-500 to-pink-600 border-red-400 text-white shadow-red-500/50"
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
