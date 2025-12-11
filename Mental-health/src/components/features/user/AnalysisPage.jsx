import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosStats } from "react-icons/io";
import { Sun, Moon } from "lucide-react";
import { Card, CardContent } from "../../ui/Card";
import { format, isThisWeek, parseISO } from "date-fns";
import { useTheme } from "../../../context/ThemeContext";

export default function AnalysisPage() {
  const [moodLogs, setMoodLogs] = useState([]);
  const [journals, setJournals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    const moodData = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const journalData = JSON.parse(localStorage.getItem("mindmates.journals") || "[]");
    const appointmentData = JSON.parse(localStorage.getItem("mindmates.appointments") || "[]");

    setMoodLogs(Array.isArray(moodData) ? moodData : []);
    setJournals(Array.isArray(journalData) ? journalData : []);
    setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
  }, []);

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
    <div className="min-h-screen px-4 py-8 bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm transition-colors"
          >
            ← Go Back
          </button>
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
            <IoIosStats className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Wellness Analysis</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" /> : <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
        </button>
      </header>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Weekly Summary */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 space-y-3">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">This Week's Activity</h2>
            <ul className="text-slate-700 dark:text-slate-300 text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">🧠</span> Mood logs this week: <strong>{weeklyMoods.length}</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">📓</span> Journals written: <strong>{weeklyJournals.length}</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">🗓️</span> Sessions booked: <strong>{weeklyAppointments.length}</strong>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Mood Trend */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Mood Trend</h2>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {recentMoods.length > 0 ? (
                <>
                  You've recently felt:{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{moodSummary}</span>. Keep tracking your emotions regularly.
                </>
              ) : (
                "You haven't logged any moods yet. Try reflecting on your day!"
              )}
            </div>
          </CardContent>
        </Card>

        {/* Journal Insights */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition xl:col-span-1 md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Journal Reflections</h2>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {frequentTopics.length > 0 ? (
                <>
                  Topics frequently mentioned:{" "}
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {frequentTopics.join(", ")}
                  </span>. Consider exploring relaxation exercises, journaling prompts, or talking to a professional.
                </>
              ) : (
                "Your journals are unique or haven't been analyzed yet. Keep writing to uncover insights!"
              )}
            </div>
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
