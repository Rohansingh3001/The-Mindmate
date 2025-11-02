// AppointmentsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, 
  Moon, 
  ArrowLeft, 
  CalendarClock, 
  UserPlus, 
  Stethoscope, 
  MapPin, 
  XCircle,
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  MapPinIcon,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Download,
  Bell,
  Star,
  Heart,
  Shield,
  Zap
} from "lucide-react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";
import {
  collection, addDoc, getDocs, Timestamp, deleteDoc, doc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import doctorsList from "../constants/doctors";
import { useTheme } from "../context/ThemeContext";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [newAppt, setNewAppt] = useState({ dateTime: null, doctor: "", mode: "Online" });
  const [toastType, setToastType] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
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

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
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
      setAppointments(data.filter((appt) => appt.timestamp > new Date()));
    };
    fetchAppointments();
  }, []);

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
    const backgroundColor = event.mode === "Online" ? "#8b5cf6" : "#10b981";
    return {
      style: {
        backgroundColor,
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "8px",
        fontWeight: 600,
        border: "none",
        fontSize: "12px",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(147 51 234 / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-purple-200 dark:border-gray-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all shadow-lg"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Appointments
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Manage your mental health sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-purple-200 dark:border-gray-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all shadow-lg"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingForm(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Book Session
            </motion.button>
          </div>
        </motion.header>

        {/* Statistics Cards */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "Total Sessions", value: stats.total, icon: CalendarIcon, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Online Sessions", value: stats.online, icon: Video, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
            { label: "In-Person", value: stats.offline, icon: MapPinIcon, color: "from-green-500 to-green-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
            { label: "This Week", value: stats.thisWeek, icon: Clock, color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className={`p-6 rounded-2xl ${stat.bgColor} border border-white/50 dark:border-gray-700/50 backdrop-blur-lg shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* View Toggle & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
        >
          {/* View Toggle */}
          <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-1 border border-purple-200 dark:border-gray-700 shadow-lg">
            {["calendar", "list"].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedView === view
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                {view === "calendar" ? "Calendar View" : "List View"}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-purple-200 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-purple-200 dark:border-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Sessions</option>
              <option value="online">Online Only</option>
              <option value="offline">In-Person Only</option>
            </select>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {selectedView === "calendar" ? (
              <motion.section
                key="calendar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-purple-200 dark:border-gray-700 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Calendar View</h2>
                </div>
                <div className="rounded-xl overflow-hidden border border-purple-100 dark:border-gray-700">
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600, background: 'transparent' }}
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
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Upcoming Sessions</h2>
                </div>

                {filteredAppointments.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-purple-200 dark:border-gray-700"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No sessions found</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Book your first mental health session to get started</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowBookingForm(true)}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Book Session
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid gap-4">
                    {filteredAppointments
                      .sort((a, b) => a.timestamp - b.timestamp)
                      .map((appt, index) => (
                        <motion.div
                          key={appt.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-purple-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                                appt.mode === "Online" 
                                  ? "bg-gradient-to-r from-purple-500 to-purple-600" 
                                  : "bg-gradient-to-r from-green-500 to-green-600"
                              }`}>
                                {appt.mode === "Online" ? <Video className="w-6 h-6 text-white" /> : <MapPinIcon className="w-6 h-6 text-white" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Dr. {appt.doctor}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    appt.mode === "Online" 
                                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" 
                                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                  }`}>
                                    {appt.mode}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon size={14} />
                                    {format(appt.timestamp, "MMM dd, yyyy")}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {format(appt.timestamp, "hh:mm a")}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  <User size={14} />
                                  {appt.userName}
                                </div>
                              </div>
                            </div>
                            
                            {currentUser?.uid === appt.userId && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCancelAppointment(appt.id)}
                                className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center gap-2 font-medium"
                              >
                                <XCircle size={16} />
                                Cancel
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-purple-200 dark:border-gray-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <CalendarClock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Book Session</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <XCircle size={20} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor Selection */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Stethoscope size={16} />
                    Select Therapist
                  </label>
                  <select
                    value={newAppt.doctor}
                    onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-purple-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all dark:bg-gray-700 dark:text-white bg-white/80 backdrop-blur-lg"
                  >
                    <option value="">Choose your therapist...</option>
                    {doctorsList.map((doc) => (
                      <option key={doc.name} value={doc.name}>
                        Dr. {doc.name} – {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Picker */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Clock size={16} />
                    Select Date & Time
                  </label>
                  <DatePicker
                    selected={newAppt.dateTime}
                    onChange={(date) => setNewAppt({ ...newAppt, dateTime: date })}
                    showTimeSelect
                    timeIntervals={30}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    required
                    placeholderText="Choose your preferred time"
                    className="w-full px-4 py-3 border border-purple-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all dark:bg-gray-700 dark:text-white bg-white/80 backdrop-blur-lg"
                  />
                </div>

                {/* Mode Selection */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MapPin size={16} />
                    Session Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Online", "Offline"].map((mode) => (
                      <label key={mode} className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        newAppt.mode === mode
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400"
                      }`}>
                        <input
                          type="radio"
                          name="mode"
                          value={mode}
                          checked={newAppt.mode === mode}
                          onChange={(e) => setNewAppt({ ...newAppt, mode: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-center">
                          {mode === "Online" ? <Video size={20} className="mx-auto mb-2 text-purple-600" /> : <MapPinIcon size={20} className="mx-auto mb-2 text-green-600" />}
                          <span className="text-sm font-medium text-gray-800 dark:text-white">{mode === "Online" ? "Video Call" : "In-Person"}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 text-center text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Book Session
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toastType && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`p-4 rounded-xl shadow-lg backdrop-blur-lg border flex items-center gap-3 ${
              toastType === "booked" 
                ? "bg-green-50/90 dark:bg-green-900/50 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200" 
                : toastType === "cancelled"
                ? "bg-orange-50/90 dark:bg-orange-900/50 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-200"
                : "bg-red-50/90 dark:bg-red-900/50 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
            }`}>
              {toastType === "booked" && (
                <>
                  <CheckCircle size={20} />
                  <span className="font-medium">Session booked successfully!</span>
                </>
              )}
              {toastType === "cancelled" && (
                <>
                  <AlertCircle size={20} />
                  <span className="font-medium">Session cancelled successfully</span>
                </>
              )}
              {toastType === "error" && (
                <>
                  <XCircle size={20} />
                  <span className="font-medium">Please select a future date & time</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
