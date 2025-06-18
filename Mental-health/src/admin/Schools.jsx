import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Schools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      const snapshot = await getDocs(collection(db, "schools"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchools(data);
    };
    fetchSchools();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">School Workshops</h2>
      <div className="overflow-auto rounded-md shadow border dark:border-zinc-700">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
              <th className="px-4 py-2">School Name</th>
              <th className="px-4 py-2">Students Reached</th>
              <th className="px-4 py-2">Last Workshop</th>
              <th className="px-4 py-2">Feedback Score</th>
            </tr>
          </thead>
          <tbody>
            {schools.map(school => (
              <tr key={school.id} className="border-b dark:border-zinc-700">
                <td className="px-4 py-2">{school.name}</td>
                <td className="px-4 py-2">{school.students || "—"}</td>
                <td className="px-4 py-2">{school.lastWorkshop || "—"}</td>
                <td className="px-4 py-2">{school.feedbackScore || "--"} / 5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
