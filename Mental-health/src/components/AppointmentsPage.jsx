// AppointmentsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, Moon, ArrowLeft, CalendarClock, UserPlus, Stethoscope, MapPin, XCircle
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
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("appt_theme") === "dark");
  const [currentUser, setCurrentUser] = useState(null);

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("appt_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

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
      alert("Cannot book an appointment in the past.");
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
    setToastType("booked");
  };

  // Cancel appointment
  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await deleteDoc(doc(db, "appointments", id));
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      setToastType("cancelled");
    } catch (error) {
      alert("Failed to cancel appointment.");
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
    const backgroundColor = event.mode === "Online" ? "#6366f1" : "#16a34a";
    return {
      style: {
        backgroundColor,
        color: "#fff",
        padding: "4px",
        borderRadius: "6px",
        fontWeight: 500,
      },
    };
  };

  return (
    <div className="min-h-screen px-4 sm:px-10 py-10 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-500 hover:underline"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* 📝 Booking Form */}
        <section>
  <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
    📝 Book a New Appointment
  </h2>

  <form
    onSubmit={handleSubmit}
    className={`space-y-6 rounded-2xl p-6 md:p-8 shadow-lg border transition-all duration-300 ${
      darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}
  >
    {/* Doctor Selection */}
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        👩‍⚕️ Select Doctor
      </label>
      <select
        value={newAppt.doctor}
        onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">-- Choose Doctor --</option>
        {doctorsList.map((doc) => (
          <option key={doc.name} value={doc.name}>
            {doc.name} – {doc.specialty}
          </option>
        ))}
      </select>
    </div>

    {/* Date & Time Picker */}
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        📅 Select Date & Time
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
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>

    {/* Mode Selection */}
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        📍 Choose Mode
      </label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="radio"
            name="mode"
            value="Online"
            checked={newAppt.mode === "Online"}
            onChange={(e) => setNewAppt({ ...newAppt, mode: e.target.value })}
            className="accent-indigo-600"
          />
          Online
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="radio"
            name="mode"
            value="Offline"
            checked={newAppt.mode === "Offline"}
            onChange={(e) => setNewAppt({ ...newAppt, mode: e.target.value })}
            className="accent-indigo-600"
          />
          In-person
        </label>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full py-2 text-center text-white font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 transition-all"
    >
      ✅ Book Appointment
    </button>
  </form>
</section>

        {/* 📅 Calendar */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-500 dark:text-indigo-300">📅 Appointment Calendar</h2>
          <div className={`rounded-lg p-4 border shadow ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              eventPropGetter={customEventStyleGetter}
              views={["month", "week", "day"]}
              tooltipAccessor={(event) => `${event.title} at ${format(event.start, "PPpp")}`}
            />
          </div>
        </section>

        {/* 🗂️ Upcoming Appointments */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-500 dark:text-indigo-400">🗂️ Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No upcoming appointments. Book one above!</p>
          ) : (
            <div className={`overflow-x-auto rounded-xl shadow border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr className="text-left font-semibold text-gray-700 dark:text-gray-200">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Booked By</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((appt) => (
                      <tr key={appt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700">
                        <td className="px-4 py-2">{format(appt.timestamp, "MMM dd, yyyy")}</td>
                        <td className="px-4 py-2">{format(appt.timestamp, "hh:mm a")}</td>
                        <td className="px-4 py-2">{appt.doctor}</td>
                        <td className="px-4 py-2">{appt.mode}</td>
                        <td className="px-4 py-2">
                          {appt.userName}<br />
                          <span className="text-xs text-gray-500">{appt.userEmail}</span>
                        </td>
                        <td className="px-4 py-2">
                          {currentUser?.uid === appt.userId && (
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 hover:underline"
                            >
                              <XCircle size={16} /> Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Toasts */}
      {toastType === "booked" && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg">
          ✅ Appointment booked successfully!
        </div>
      )}
      {toastType === "cancelled" && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded shadow-lg">
          ❌ Appointment cancelled.
        </div>
      )}
    </div>
  );
}
