// AppointmentsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, 
  Moon, 
  ArrowLeft, 
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
  Search
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
    const backgroundColor = event.mode === "Online" ? "#4f46e5" : "#10b981";
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <CalendarClock className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Appointments
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Manage your therapy sessions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setShowBookingForm(true)}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Book Appointment</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Sessions", value: stats.total, icon: CalendarIcon, bgColor: "bg-indigo-100 dark:bg-indigo-900/30", iconColor: "text-indigo-600 dark:text-indigo-400" },
            { label: "Online Sessions", value: stats.online, icon: Video, bgColor: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
            { label: "In-Person", value: stats.offline, icon: MapPinIcon, bgColor: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400" },
            { label: "This Week", value: stats.thisWeek, icon: Clock, bgColor: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`${stat.iconColor}`} size={24} />
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
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
        >
          {/* View Toggle */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800 shadow-sm inline-flex">
            {["calendar", "list"].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === view
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <CalendarIcon className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar View</h2>
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
                  className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center"
                >
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No Appointments Found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {searchTerm || filterMode !== "all" ? "Try adjusting your filters" : "Book your first therapy session to get started"}
                  </p>
                  {!searchTerm && filterMode === "all" && (
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      Book Now
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
                      className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            appt.mode === "Online" 
                              ? "bg-indigo-100 dark:bg-indigo-900/30" 
                              : "bg-green-100 dark:bg-green-900/30"
                          }`}>
                            {appt.mode === "Online" 
                              ? <Video className="text-indigo-600 dark:text-indigo-400" size={24} /> 
                              : <MapPinIcon className="text-green-600 dark:text-green-400" size={24} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Dr. {appt.doctor}
                              </h3>
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                appt.mode === "Online" 
                                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" 
                                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              }`}>
                                {appt.mode}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <CalendarIcon size={14} />
                                {format(appt.timestamp, "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {format(appt.timestamp, "hh:mm a")}
                              </div>
                              <div className="flex items-center gap-1">
                                <User size={14} />
                                {appt.userName}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {currentUser?.uid === appt.userId && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2 font-medium"
                          >
                            <XCircle size={16} />
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Book Appointment
                </h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Doctor
                  </label>
                  <select
                    value={newAppt.doctor}
                    onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Choose a doctor...</option>
                    {doctorsList.map((doc) => (
                      <option key={doc.name} value={doc.name}>
                        Dr. {doc.name} – {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Session Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewAppt({ ...newAppt, mode: "Online" })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        newAppt.mode === "Online"
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Video className={`mx-auto mb-2 ${newAppt.mode === "Online" ? "text-indigo-600" : "text-slate-400"}`} size={24} />
                      <p className={`text-sm font-medium ${newAppt.mode === "Online" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}>
                        Online
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAppt({ ...newAppt, mode: "Offline" })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        newAppt.mode === "Offline"
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <MapPin className={`mx-auto mb-2 ${newAppt.mode === "Offline" ? "text-indigo-600" : "text-slate-400"}`} size={24} />
                      <p className={`text-sm font-medium ${newAppt.mode === "Offline" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"}`}>
                        In-Person
                      </p>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors shadow-sm"
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className={`p-4 rounded-lg shadow-lg border flex items-center gap-3 ${
              toastType === "booked" 
                ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200" 
                : toastType === "cancelled"
                ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-200"
                : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
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
                  <span className="font-medium">Session cancelled</span>
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
