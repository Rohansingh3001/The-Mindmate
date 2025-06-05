import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/Card";
  // fixed import path
import { Button } from "./ui/Button";            // fixed import path
import { FaRegSmile } from "react-icons/fa";
import { IoMdCalendar, IoIosStats } from "react-icons/io";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState("Rohan");
  const [mood, setMood] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // TODO: Fetch user data here if needed
  }, []);

  const handleMoodClick = (emoji) => {
    setMood(emoji);
    toast.success(`Mood logged: ${emoji}`, {
      position: "top-right",
      theme: theme === "dark" ? "dark" : "light",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-6 space-y-8 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-purple-400">{userName}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your personal wellness companion</p>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          Toggle to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </header>

      {/* Grid of Cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Mood Tracker */}
        <Card className="hover:shadow-purple-800 transition-shadow duration-300 dark:bg-gray-800">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Today's Mood</h2>
              <FaRegSmile size={24} />
            </div>
            <p className="text-sm text-gray-400 mb-2">How are you feeling today?</p>
            <div className="mt-3 flex justify-between">
              {["😊", "😐", "😢", "😠", "😴"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleMoodClick(emoji)}
                  className={`text-2xl hover:scale-125 transition-transform duration-150 ${
                    mood === emoji ? "scale-125" : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="hover:shadow-purple-800 transition-shadow duration-300 dark:bg-gray-800">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Upcoming Session</h2>
              <IoMdCalendar size={24} />
            </div>
            <p className="text-sm text-gray-400 mb-1">Your next appointment:</p>
            <p className="font-medium text-white">Dr. Rathi - Jun 10, 4:00 PM</p>
            <Button className="mt-4 w-full">Manage Appointments</Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="hover:shadow-purple-800 transition-shadow duration-300 dark:bg-gray-800">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Wellness Stats</h2>
              <IoIosStats size={24} />
            </div>
            <p className="text-sm text-gray-400 mb-1">This week:</p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>3 mood logs</li>
              <li>2 journal entries</li>
              <li>1 session booked</li>
            </ul>
            <Button variant="outline" className="mt-4 w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <Card className="xl:col-span-2 hover:shadow-purple-800 transition-shadow duration-300 dark:bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Recent Journal Entries</h2>
            <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
              <li>
                <em>Felt anxious before my viva but handled it better.</em>
              </li>
              <li>
                <em>Talked to people today, felt heard and seen.</em>
              </li>
              <li>
                <em>Skipped meditation, need to restart tomorrow.</em>
              </li>
            </ul>
            <Button variant="outline" className="mt-4">
              View All Journals
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="hover:shadow-purple-800 transition-shadow duration-300 dark:bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Quick Access</h2>
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="text-left">
                🧠 Mental Exercises
              </Button>
              <Button variant="ghost" className="text-left">
                🌐 Connect with Peers
              </Button>
              <Button variant="ghost" className="text-left">
                📅 Book a Session
              </Button>
              <Button variant="ghost" className="text-left">
                📊 View Progress
              </Button>
              <Button variant="ghost" className="text-left">
                ⚙️ Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
