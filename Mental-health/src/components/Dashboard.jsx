import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { FaRegSmile } from "react-icons/fa";
import { IoMdCalendar, IoIosStats } from "react-icons/io";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const [userName, setUserName] = useState("Rohan");
  const [mood, setMood] = useState(localStorage.getItem("userMood") || "");
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleMoodClick = (emoji) => {
    setMood(emoji);
    localStorage.setItem("userMood", emoji);
    toast.success(`Mood logged: ${emoji}`, {
      position: "top-right",
      theme: theme === "dark" ? "dark" : "light",
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#1a0f40] via-[#1d123f] to-[#0d071e] text-white space-y-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome, <span className="text-purple-400">{userName}</span> 👋
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Let’s check in with your mental wellness today.
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a1a5e] hover:bg-[#372a72] rounded-lg text-white shadow transition"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </header>

      {/* Cards Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Mood Tracker */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:shadow-lg transition">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Today's Mood</h2>
              <FaRegSmile className="text-purple-300" size={22} />
            </div>
            <p className="text-sm text-gray-400">How are you feeling?</p>
            <div className="flex justify-between mt-4 text-2xl">
              {["😊", "😐", "😢", "😠", "😴"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleMoodClick(emoji)}
                  className={`transition-transform duration-200 hover:scale-125 ${mood === emoji ? "scale-125" : ""}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:shadow-lg transition">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming Session</h2>
              <IoMdCalendar className="text-purple-300" size={22} />
            </div>
            <p className="text-sm text-gray-400">Next appointment:</p>
            <p className="text-base font-medium text-white">Dr. Rathi - Jun 10, 4:00 PM</p>
            <Button className="mt-4 w-full" onClick={() => navigate("/appointments")}>
              Manage Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:shadow-lg transition">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Wellness Stats</h2>
              <IoIosStats className="text-purple-300" size={22} />
            </div>
            <p className="text-sm text-gray-400 mb-2">This week:</p>
            <ul className="text-sm space-y-1 text-gray-300">
              <li>✔️ 3 mood logs</li>
              <li>✔️ 2 journal entries</li>
              <li>✔️ 1 session booked</li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate("/analytics")}>
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Journals */}
        <Card className="xl:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:shadow-lg transition">
          <CardContent>
            <h2 className="text-lg font-semibold mb-3">Recent Journals</h2>
            <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5">
              <li><em>Felt anxious before my viva but handled it better.</em></li>
              <li><em>Talked to people today, felt heard and seen.</em></li>
              <li><em>Skipped meditation, need to restart tomorrow.</em></li>
            </ul>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/journals")}>
              View All Journals
            </Button>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:shadow-lg transition">
          <CardContent>
            <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
            <div className="flex flex-col space-y-2 text-left">
              <Button variant="ghost" className="text-white hover:bg-purple-900/30" onClick={() => navigate("/exercises")}>
                🧠 Mental Exercises
              </Button>
              <Button variant="ghost" className="text-white hover:bg-purple-900/30" onClick={() => navigate("/community")}>
                🌐 Connect with Peers
              </Button>
              <Button variant="ghost" className="text-white hover:bg-purple-900/30" onClick={() => navigate("/book-session")}>
                📅 Book a Session
              </Button>
              <Button variant="ghost" className="text-white hover:bg-purple-900/30" onClick={() => navigate("/progress")}>
                📊 View Progress
              </Button>
              <Button variant="ghost" className="text-white hover:bg-purple-900/30" onClick={() => navigate("/settings")}>
                ⚙️ Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
