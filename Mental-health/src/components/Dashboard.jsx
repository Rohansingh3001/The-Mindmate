import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/button";
import { FaRegSmile } from "react-icons/fa";
import { IoMdCalendar, IoIosStats } from "react-icons/io";
import { toast } from "react-toastify";
import { Sun, Moon } from "lucide-react";
import AssessmentForm from "./AssessmentForm";
import Chatbot from "./ChatBot";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import STORAGE_KEYS, { getFromStorage } from "../utils/storage";
import { getJournals } from "../utils/journalStorage";

const greetings = ["Hey", "Welcome", "Namaste", "How are you?", "Peace ✌️"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [mood, setMood] = useState(() => getFromStorage(STORAGE_KEYS.MOOD, ""));
  const [theme, setTheme] = useState(() =>
    localStorage.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const [greeting, setGreeting] = useState(greetings[0]);
  const [quote, setQuote] = useState("");
  const [nextAppointment, setNextAppointment] = useState(null);
  const [stats, setStats] = useState({ moodLogs: 0, journals: 0, sessions: 0 });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email?.split("@")[0] || "User";
        setUserName(displayName);
      } else {
        navigate("/login");
      }
    });

    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

    // Mood
    const moodData = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    if (moodData.length) setMood(moodData[moodData.length - 1].mood);

    // Appointment
    const storedAppointments = localStorage.getItem("mindmates.appointments");
    if (storedAppointments) {
      try {
        const parsed = JSON.parse(storedAppointments);
        const sorted = parsed.sort(
          (a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
        );
        setNextAppointment(sorted[0]);
        setStats((prev) => ({ ...prev, sessions: parsed.length }));
      } catch (e) {
        console.error("Invalid appointment data", e);
      }
    }

    // Journals
    const journalData = JSON.parse(localStorage.getItem("mindmates.journals") || "[]");
    setStats((prev) => ({ ...prev, journals: journalData.length }));

    // Mood Stats
    setStats((prev) => ({ ...prev, moodLogs: moodData.length }));

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.theme = theme;
  }, [theme]);

  useEffect(() => {
    fetch("https://api.quotable.io/random?tags=inspirational|wisdom")
      .then((res) => res.ok ? res.json() : Promise.reject("API error"))
      .then((data) => {
        if (data.content && data.author) {
          setQuote(`${data.content} — ${data.author}`);
        } else {
          throw new Error("Malformed quote");
        }
      })
      .catch(() => {
        setQuote("You're doing your best, and that’s enough. 💜");
      });
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleMoodClick = (emoji) => {
    const logs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const updatedLogs = [...logs, { mood: emoji, timestamp: new Date().toISOString() }];
    localStorage.setItem("mindmates.moodLogs", JSON.stringify(updatedLogs));
    setMood(emoji);
    setStats((prev) => ({ ...prev, moodLogs: updatedLogs.length }));
    toast.success(`Mood logged: ${emoji}`, {
      position: "top-right",
      theme,
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-white via-purple-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 space-y-10 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-300">
            {greeting}, <span className="text-purple-500 dark:text-purple-200">{userName}</span> 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Hope you're having a calm day. 🌿</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Daily Quote */}
      <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-700 rounded-xl px-6 py-4 text-center italic text-sm text-purple-900 dark:text-purple-100 shadow">
        🌟 <span className="text-purple-600 dark:text-purple-300 font-semibold">Quote of the Day:</span> {quote}
      </div>

      {/* Main Dashboard Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Mood Tracker */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Today's Mood</h2>
              <FaRegSmile className="text-purple-400" size={22} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">How are you feeling?</p>
            <div className="flex justify-between mt-4 text-2xl">
              {["😊", "😐", "😢", "😠", "😴"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleMoodClick(emoji)}
                  className={`transition-transform duration-300 hover:scale-125 ${mood === emoji ? "scale-125" : ""}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Card */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Appointments</h2>
              <IoMdCalendar className="text-purple-400" size={22} />
            </div>
            {nextAppointment ? (
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{nextAppointment.doctor}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📅 {nextAppointment.date} ⏰ {nextAppointment.time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">🧑‍⚕️ Mode: {nextAppointment.mode}</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mb-4">No appointments scheduled yet.</p>
            )}
            <Button onClick={() => navigate("/appointments")}>Manage Appointments</Button>
          </CardContent>
        </Card>

        {/* Wellness Stats */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Wellness Stats</h2>
              <IoIosStats className="text-purple-400" size={22} />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">This week:</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-200">
              <li>✔️ {stats.moodLogs} mood logs</li>
              <li>✔️ {stats.journals} journal entries</li>
              <li>✔️ {stats.sessions} session{stats.sessions !== 1 ? "s" : ""} booked</li>
            </ul>

            <Button
              onClick={() => navigate("/analytics")}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>


        {/* Self Assessment */}
        <div className="xl:col-span-2">
          <AssessmentForm />
        </div>

        {/* AI Chatbot */}
        <div className="xl:col-span-2">
          <Chatbot userName={userName} />
        </div>
{/* Journals */}
<Card className="xl:col-span-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
  <CardContent>
    <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">Recent Journals</h2>
    {getJournals().length > 0 ? (
      <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-2 list-disc pl-5">
        {getJournals()
          .slice(-3)
          .reverse()
          .map((journal, index) => (
            <li key={index}>
              <em>{journal.entry}</em>
              {journal.date && (
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">{journal.date}</span>
              )}
            </li>
          ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">No journal entries yet.</p>
    )}
    <Link to="/journals">
      <Button variant="outline" className="mt-4 text-purple-600 border-purple-400">
        View All Journals
      </Button>
    </Link>
  </CardContent>
</Card>




        {/* Quick Access */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">Quick Access</h2>
            <div className="flex flex-col space-y-2 text-left">
              {[
                ["🧠 Mental Exercises", "/exercises"],
                ["🌐 Connect with Peers", "/community"],
                ["📅 Book a Session", "/book-session"],
                ["📊 View Progress", "/progress"],
                ["⚙️ Settings", "/settings"],
              ].map(([label, path]) => (
                <Link key={label} to={path}>
                  <Button
                    variant="ghost"
                    className="text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
