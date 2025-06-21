import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { User, BarChart2, Smile, AlertTriangle } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    sessionsToday: 0,
    avgMoodScore: "—",
    flaggedUsers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [usersSnap, sessionsSnap, moodsSnap, flaggedSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(query(
          collection(db, "sessions"),
          where("timestamp", ">=", Timestamp.fromDate(startOfDay(new Date()))),
          where("timestamp", "<=", Timestamp.fromDate(endOfDay(new Date())))
        )),
        getDocs(collection(db, "moodLogs")),
        getDocs(query(collection(db, "users"), where("isFlagged", "==", true)))
      ]);

      const moods = moodsSnap.docs.map(doc => doc.data().score).filter(Boolean);
      const avgMood = moods.length > 0
        ? `${Math.round(moods.reduce((sum, s) => sum + s, 0) / moods.length)}%`
        : "—";

      setStats({
        totalUsers: usersSnap.size,
        sessionsToday: sessionsSnap.size,
        avgMoodScore: avgMood,
        flaggedUsers: flaggedSnap.size,
      });
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <User className="text-purple-500" /> },
    { label: "Sessions Today", value: stats.sessionsToday, icon: <BarChart2 className="text-green-500" /> },
    { label: "Avg Mood Score", value: stats.avgMoodScore, icon: <Smile className="text-yellow-500" /> },
    { label: "Flagged Users", value: stats.flaggedUsers, icon: <AlertTriangle className="text-red-500" /> },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
        Admin Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="relative p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-purple-100 dark:border-purple-600 shadow-lg backdrop-blur-lg transition hover:scale-[1.025] hover:shadow-xl duration-300 ease-in-out">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">{icon}</div>
    </div>
    <h3 className="text-3xl font-bold text-zinc-800 dark:text-white">{value}</h3>
  </div>
);

export default Dashboard;
