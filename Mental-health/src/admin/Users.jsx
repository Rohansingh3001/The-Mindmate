import React, { useState, useEffect } from "react";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = user.fullName || user.displayName || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const toggleExpand = (id) =>
    setExpandedUser(expandedUser === id ? null : id);

  const getMoodColor = (score) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 0) return "text-red-600 dark:text-red-400";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Student Users</h2>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-lg bg-white/80 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const name = user.fullName || user.displayName || "Anonymous";

          return (
            <div
              key={user.id}
              className="bg-white dark:bg-zinc-900/80 border border-purple-100 dark:border-purple-700 rounded-xl p-5 shadow-lg hover:shadow-purple-300/30 dark:hover:shadow-purple-800/20 transition-all duration-300 relative"
            >
              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                  {name}
                </p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Mood Score</p>
                <p className={`text-md font-medium ${getMoodColor(user.moodScore)}`}>
                  {user.moodScore ?? "--"}
                </p>
              </div>

              {expandedUser === user.id && (
                <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">User ID:</span>{" "}
                    <span className="font-mono break-all">{user.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 dark:text-gray-400">Email:</span>{" "}
                    {user.email || "N/A"}
                  </div>
                </div>
              )}

              <button
                onClick={() => toggleExpand(user.id)}
                className="absolute top-4 right-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {expandedUser === user.id ? (
                  <>
                    <ChevronUp size={16} /> Hide
                  </>
                ) : (
                  <>
                    <Eye size={16} /> View
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
