// src/pages/JournalsPage.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";

const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [entry, setEntry] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Load saved journals from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("journals")) || [];
    setJournals(saved.reverse()); // recent first
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Add new journal entry
  const handleSave = () => {
    if (!entry.trim()) return;

    const newJournal = {
      date: new Date().toISOString().split("T")[0],
      entry: entry.trim(),
    };

    const updatedJournals = [newJournal, ...journals];
    setJournals(updatedJournals);
    setEntry("");
    localStorage.setItem("journals", JSON.stringify(updatedJournals.reverse())); // save oldest first
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">My Journal Entries</h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              to="/user"
              className="flex items-center text-sm text-purple-600 hover:underline dark:text-purple-400"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Write new journal */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-4 rounded-xl">
          <CardContent className="space-y-3">
            <Textarea
              rows={4}
              placeholder="Write about your day..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full text-sm"
            />
            <Button
              onClick={handleSave}
              className="bg-purple-600 text-white hover:bg-purple-700 transition w-full"
            >
              Save Journal Entry
            </Button>
          </CardContent>
        </Card>

        {/* Display saved journals */}
        {journals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center mt-6">No journal entries yet.</p>
        ) : (
          journals.map((journal, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-4 rounded-xl transition hover:shadow-md"
            >
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-200 italic mb-1">"{journal.entry}"</p>
                <p className="text-xs text-right text-gray-500 dark:text-gray-400">{journal.date}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalsPage;
