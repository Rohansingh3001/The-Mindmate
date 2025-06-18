import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import STORAGE_KEYS, { getFromStorage, saveToStorage } from "../utils/storage";
import doctorsList from "../constants/doctors";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";

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
  const [newAppt, setNewAppt] = useState(() => {
    const saved = getFromStorage("DRAFT_APPT", null);
    return saved || { dateTime: null, doctor: "", mode: "Online" };
  });

  const [showToast, setShowToast] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("appt_theme");
    return savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("appt_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => {
    const saved = getFromStorage(STORAGE_KEYS.APPOINTMENTS, []);
    const now = new Date();
    const filtered = saved.filter(appt => new Date(`${appt.date}T${appt.time}`) >= now);
    setAppointments(filtered);
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    saveToStorage("DRAFT_APPT", newAppt);
  }, [newAppt]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setAppointments(prev =>
        prev.filter(appt => new Date(`${appt.date}T${appt.time}`) >= now)
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { dateTime, doctor, mode } = newAppt;
    if (!dateTime || !doctor) return;
    if (dateTime <= new Date()) {
      alert("You cannot book an appointment in the past.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: format(dateTime, "yyyy-MM-dd"),
      time: format(dateTime, "HH:mm"),
      doctor,
      mode,
    };

    setAppointments(prev => [...prev, newEntry]);
    setNewAppt({ dateTime: null, doctor: "", mode: "Online" });
    saveToStorage("DRAFT_APPT", null);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const calendarEvents = appointments.map((appt) => ({
    title: `${appt.doctor} (${appt.mode})`,
    start: new Date(`${appt.date}T${appt.time}`),
    end: new Date(new Date(`${appt.date}T${appt.time}`).getTime() + 30 * 60000),
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
          <ArrowLeft size={18} />
          Go Back
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Appointment Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-gray-800 shadow rounded-xl border dark:border-gray-700 space-y-4"
        >
          <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            👩‍⚕️ Book Your Appointment
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            We know reaching out isn't always easy — just fill what you can. 💙
          </p>

          <div>
            <label className="block text-sm mb-1">🕐 Date & Time</label>
            <DatePicker
              selected={newAppt.dateTime}
              onChange={(date) => setNewAppt({ ...newAppt, dateTime: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
              placeholderText="Select when you'd like to talk"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">👩‍⚕️ Choose a Doctor</label>
            <select
              value={newAppt.doctor}
              onChange={(e) => setNewAppt({ ...newAppt, doctor: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
              required
            >
              <option value="">Select a doctor</option>
              {doctorsList.map((doc) => (
                <option key={doc.name} value={doc.name}>
                  {doc.name} – {doc.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">📍 Mode</label>
            <select
              value={newAppt.mode}
              onChange={(e) => setNewAppt({ ...newAppt, mode: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
          >
            ✅ Confirm Appointment
          </button>
        </form>

        {/* Calendar */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-500 dark:text-indigo-300">
            📅 Appointment Calendar
          </h2>
          <div
            className={`rounded-lg p-4 border shadow ${
              darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-black"
            }`}
          >
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              eventPropGetter={customEventStyleGetter}
              views={["month", "week", "day"]}
              tooltipAccessor={(event) =>
                `${event.title} at ${format(event.start, "PPpp")}`
              }
            />
          </div>
        </section>

        {/* Appointment List */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-indigo-500 dark:text-indigo-400">
            🗂️ Upcoming Appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming appointments. Book one above!
            </p>
          ) : (
            <div
              className={`overflow-x-auto rounded-lg shadow border ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b dark:border-gray-600">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Doctor</th>
                    <th className="px-4 py-2">Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments
                    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
                    .map((appt) => (
                      <tr key={appt.id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-2">{format(new Date(`${appt.date}T${appt.time}`), "MMM dd, yyyy")}</td>
                        <td className="px-4 py-2">{format(new Date(`${appt.date}T${appt.time}`), "hh:mm a")}</td>
                        <td className="px-4 py-2">{appt.doctor}</td>
                        <td className="px-4 py-2">{appt.mode}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
          ✅ Appointment booked successfully!
        </div>
      )}
    </div>
  );
}
