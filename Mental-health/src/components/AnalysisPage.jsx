import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosStats } from "react-icons/io";
import { Sun, Moon } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { format, isThisWeek, parseISO } from "date-fns";

export default function AnalysisPage() {
  const [moodLogs, setMoodLogs] = useState([]);
  const [journals, setJournals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [theme, setTheme] = useState(() =>
    localStorage.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  const navigate = useNavigate();

  useEffect(() => {
    const moodData = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const journalData = JSON.parse(localStorage.getItem("mindmates.journals") || "[]");
    const appointmentData = JSON.parse(localStorage.getItem("mindmates.appointments") || "[]");

    setMoodLogs(Array.isArray(moodData) ? moodData : []);
    setJournals(Array.isArray(journalData) ? journalData : []);
    setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Filter entries from this week
  const isEntryThisWeek = (entry) => {
    const dateStr = entry?.date || entry?.createdAt || entry?.timestamp;
    try {
      const date = new Date(dateStr);
      return isThisWeek(date, { weekStartsOn: 1 });
    } catch {
      return false;
    }
  };

  const weeklyMoods = moodLogs.filter(isEntryThisWeek);
  const weeklyJournals = journals.filter(isEntryThisWeek);
  const weeklyAppointments = appointments.filter(isEntryThisWeek);

  const recentMoods = moodLogs.slice(-5).map((log) => log.mood).filter(Boolean);
  const moodSummary = recentMoods.length
    ? [...new Set(recentMoods)].join(", ")
    : "No recent mood entries";

  const journalWords = journals
    .map((entry) => entry.text || "")
    .join(" ")
    .toLowerCase()
    .split(/\W+/);

  const frequentTopics = [...new Set(journalWords.filter((w) =>
    ["stress", "exams", "friendship", "anxiety", "lonely", "tired", "overwhelmed"].includes(w)
  ))];

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-white via-purple-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-purple-300 rounded-lg shadow"
          >
            ← Go Back
          </button>
          <IoIosStats className="text-purple-600 dark:text-purple-300" size={28} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Wellness Analysis</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Weekly Summary */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl shadow-md hover:shadow-lg transition">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">This Week's Activity</h2>
            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
              <li>🧠 Mood logs this week: <strong>{weeklyMoods.length}</strong></li>
              <li>📓 Journals written: <strong>{weeklyJournals.length}</strong></li>
              <li>🗓️ Sessions booked: <strong>{weeklyAppointments.length}</strong></li>
            </ul>
          </CardContent>
        </Card>

        {/* Mood Trend */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl shadow-md hover:shadow-lg transition">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Mood Trend</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {recentMoods.length > 0 ? (
                <>
                  You've recently felt:{" "}
                  <span className="text-purple-500 font-medium">{moodSummary}</span>. Keep tracking your emotions regularly.
                </>
              ) : (
                "You haven’t logged any moods yet. Try reflecting on your day!"
              )}
            </div>
          </CardContent>
        </Card>

        {/* Journal Insights */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl shadow-md hover:shadow-lg transition xl:col-span-1 md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Journal Reflections</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {frequentTopics.length > 0 ? (
                <>
                  Topics frequently mentioned:{" "}
                  <span className="font-medium text-purple-500">
                    {frequentTopics.join(", ")}
                  </span>. Consider exploring relaxation exercises, journaling prompts, or talking to a professional.
                </>
              ) : (
                "Your journals are unique or haven’t been analyzed yet. Keep writing to uncover insights!"
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
