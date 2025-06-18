import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "appointments"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    };
    fetchData();
  }, []);

  const cancelAppointment = async (id) => {
    await deleteDoc(doc(db, "appointments", id));
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Therapy Appointments</h2>
      <div className="space-y-4">
        {appointments.map(app => (
          <div
            key={app.id}
            className="border rounded-lg p-4 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <p className="font-semibold text-purple-700 dark:text-purple-300">
              {app.user || "Anonymous"} — {app.date} @ {app.time}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">With: {app.therapist || "Therapist"}</p>
            <button
              onClick={() => cancelAppointment(app.id)}
              className="mt-2 text-sm text-red-600 hover:underline flex items-center gap-1"
            >
              <Trash2 size={14} /> Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
