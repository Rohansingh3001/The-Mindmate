import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // adjust path as needed

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Student Users</h2>
      <div className="overflow-x-auto rounded-lg shadow border dark:border-zinc-700">
        <table className="min-w-full bg-white dark:bg-zinc-900">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-300 border-b dark:border-zinc-700">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nickname</th>
              <th className="px-4 py-3">Mood Score</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="text-sm border-b dark:border-zinc-700">
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{user.id.slice(0, 8)}...</td>
                <td className="px-4 py-2">{user.nickname || "Anonymous"}</td>
                <td className="px-4 py-2">{user.moodScore || "--"}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
