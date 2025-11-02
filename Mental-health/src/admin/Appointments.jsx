import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Trash2 } from "lucide-react";
import emailjs from 'emailjs-com';
import { format } from "date-fns";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [meetLinks, setMeetLinks] = useState({}); // store temporary input
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "appointments"));
      const rawData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || null,
      }));

      // Fetch user full name and email
      const enrichedData = await Promise.all(
        rawData.map(async (app) => {
          if (app.userId) {
            const userDoc = await getDoc(doc(db, "users", app.userId));
            const userData = userDoc.exists() ? userDoc.data() : {};
            return {
              ...app,
              fullName: userData.fullName || userData.displayName || "Anonymous",
              email: userData.email || "N/A",
            };
          }
          return {
            ...app,
            fullName: app.user || "Anonymous",
            email: "N/A",
          };
        })
      );

      setAppointments(enrichedData);
    };

    fetchData();
  }, []);

  const cancelAppointment = async (id) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;
    await deleteDoc(doc(db, "appointments", id));
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  const handleSendMeetLink = async (id) => {
    const link = meetLinks[id]?.trim();
    if (!link) return alert("Please enter a Google Meet link.");

    await updateDoc(doc(db, "appointments", id), {
      meetLink: link,
    });

    // Use callback to ensure we use the latest appointments state
    setAppointments(prev => {
      const updated = prev.map(app => (app.id === id ? { ...app, meetLink: link } : app));

      // Send email using EmailJS with the updated appointment data
      const appData = updated.find(app => app.id === id);
      if (appData && appData.email && appData.email !== "N/A") {
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: appData.email,
            to_name: appData.fullName,
            meet_link: link,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        ).then(() => {
          alert("Meet link updated and email sent to user.");
        }).catch((e) => {
          console.error('EmailJS error:', e);
          alert("Meet link updated, but failed to send email.");
        });
      } else {
        alert("Meet link updated successfully.");
      }
      return updated;
    });
  };

  const formatDateTime = (ts) => {
    if (!ts) return "Invalid date";
    try {
      return {
        date: format(ts, "MMM d, yyyy"),
        time: format(ts, "hh:mm a"),
      };
    } catch {
      return { date: "Invalid", time: "Invalid" };
    }
  };

  // Filter appointments based on filter state
  const now = new Date();
  const filteredAppointments = appointments.filter(app => {
    if (!app.timestamp) return false;
    if (filter === "upcoming") {
      return app.timestamp >= now;
    } else {
      return app.timestamp < now;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
            Scheduled Appointments
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage client appointments and meeting schedules
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg px-4 py-2 border border-zinc-200 dark:border-zinc-700">
          <label htmlFor="appt-filter" className="mr-2 font-medium text-zinc-700 dark:text-zinc-300 text-sm">Show:</label>
          <select
            id="appt-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-3 py-1 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm"
          >
            <option value="upcoming">Upcoming Appointments</option>
            <option value="past">Past Appointments</option>
          </select>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 text-center border border-zinc-200 dark:border-zinc-700">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">No Appointments Found</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            {filter === 'upcoming' ? 'No upcoming appointments scheduled.' : 'No past appointments found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments.map((app) => {
            const { date, time } = formatDateTime(app.timestamp);
            return (
              <div
                key={app.id}
                className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {app.fullName?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{app.fullName}</h3>
                        <p className="text-purple-100 text-sm">{app.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => cancelAppointment(app.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 transition-colors"
                      title="Cancel Appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Appointment Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">Date:</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">Time:</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{time}</span>
                    </div>
                    {app.doctor && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">Doctor:</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{app.doctor}</span>
                      </div>
                    )}
                    {app.mode && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">Mode:</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{app.mode}</span>
                      </div>
                    )}
                    {app.purpose && (
                      <div className="space-y-1">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300 text-sm">Purpose:</span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-700 p-2 rounded-md">
                          {app.purpose}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Meet Link Section */}
                  <div className="border-t border-gray-200 dark:border-zinc-600 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300 text-sm">Google Meet:</span>
                    </div>
                    {app.meetLink ? (
                      <a
                        href={app.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Join Meeting
                      </a>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="https://meet.google.com/..."
                          value={meetLinks[app.id] || ""}
                          onChange={(e) =>
                            setMeetLinks({ ...meetLinks, [app.id]: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
                        />
                        <button
                          onClick={() => handleSendMeetLink(app.id)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Send Meet Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
