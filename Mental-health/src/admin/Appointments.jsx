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
import { format } from "date-fns";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [meetLinks, setMeetLinks] = useState({}); // store temporary input

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

    setAppointments(prev =>
      prev.map(app => (app.id === id ? { ...app, meetLink: link } : app))
    );

    alert("Meet link updated successfully.");
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

  return (
    <div className="space-y-6 px-4 py-8">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
        All Scheduled Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-300">No appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((app) => {
            const { date, time } = formatDateTime(app.timestamp);
            return (
              <div
                key={app.id}
                className="p-5 bg-white dark:bg-zinc-900/80 border border-purple-200 dark:border-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* User */}
                <div className="mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                  <p className="text-md font-semibold text-purple-700 dark:text-purple-300">
                    {app.fullName}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-300">
                    {app.email}
                  </p>
                </div>

                {/* Doctor */}
                <div className="mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                  <p className="text-sm text-zinc-800 dark:text-zinc-100">
                    {app.doctor || "Not assigned"}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">
                    {date} at {time}
                  </p>
                </div>

                {/* Mode */}
                {app.mode && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mode</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">{app.mode}</p>
                  </div>
                )}

                {/* Purpose */}
                {app.purpose && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Purpose</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">{app.purpose}</p>
                  </div>
                )}

                {/* Notes */}
                {app.notes && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">{app.notes}</p>
                  </div>
                )}

                {/* Google Meet Link */}
                <div className="mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Google Meet Link</p>
                  {app.meetLink ? (
                    <a
                      href={app.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 underline"
                    >
                      Join Meet
                    </a>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="https://meet.google.com/..."
                        value={meetLinks[app.id] || ""}
                        onChange={(e) =>
                          setMeetLinks({ ...meetLinks, [app.id]: e.target.value })
                        }
                        className="px-3 py-1 text-sm border rounded"
                      />
                      <button
                        onClick={() => handleSendMeetLink(app.id)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Send Meet Link
                      </button>
                    </div>
                  )}
                </div>

                {/* Cancel Button */}
                <button
                  onClick={() => cancelAppointment(app.id)}
                  className="mt-3 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:underline transition-all"
                >
                  <Trash2 size={14} /> Cancel Appointment
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
