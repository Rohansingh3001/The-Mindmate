import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { FaRegSmile } from "react-icons/fa";
import { IoMdCalendar, IoIosStats } from "react-icons/io";
import { toast } from "react-toastify";
import { Sun, Moon } from "lucide-react";
import AssessmentForm from "./AssessmentForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Chatbot from "./ChatBot";

const greetings = ["Hey", "Welcome", "Namaste", "How are you?", "Peace ✌️"];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [mood, setMood] = useState(localStorage.getItem("userMood") || "");
  const [theme, setTheme] = useState(() => {
    if (localStorage.theme) return localStorage.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [greeting, setGreeting] = useState(greetings[0]);
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  // Auth + Greeting + Quote Fetch
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

    fetch("https://api.quotable.io/random?tags=inspirational|wisdom")
      .then((res) => res.json())
      .then((data) => setQuote(`${data.content} — ${data.author}`))
      .catch(() => setQuote("Stay positive and keep moving forward."));

    return () => unsubscribe();
  }, [navigate]);

  // Theme Handling
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleMoodClick = (emoji) => {
    setMood(emoji);
    localStorage.setItem("userMood", emoji);
    toast.success(`Mood logged: ${emoji}`, {
      position: "top-right",
      theme: theme === "dark" ? "dark" : "light",
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-white via-purple-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 space-y-10 animate-fade-in">
      
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-purple-800 dark:text-purple-300">
            {greeting}, <span className="text-purple-500 dark:text-purple-200">{userName}</span> 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Hope you're having a calm day. 🌿</p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white shadow transition"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </header>

      {/* Quote of the Day */}
      <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-700 rounded-xl px-6 py-4 text-center italic text-sm text-purple-900 dark:text-purple-100 shadow">
        🌟 <span className="text-purple-600 dark:text-purple-300 font-semibold">Quote of the Day:</span> {quote || "Loading..."}
      </div>

      {/* Dashboard Cards */}
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

        {/* Appointments */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Upcoming Session</h2>
              <IoMdCalendar className="text-purple-400" size={22} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Next appointment:</p>
            <p className="text-base font-medium text-purple-900 dark:text-purple-100">Dr. Rathi – Jun 10, 4:00 PM</p>
            <Button className="mt-4 w-full bg-purple-500 hover:bg-purple-600" onClick={() => navigate("/appointment")}>
              Manage Appointments
            </Button>
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
              <li>✔️ 3 mood logs</li>
              <li>✔️ 2 journal entries</li>
              <li>✔️ 1 session booked</li>
            </ul>
            <Button variant="outline" className="mt-4 w-full text-purple-600 border-purple-400" onClick={() => navigate("/analytics")}>
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Self Assessment */}
        <div className="xl:col-span-2">
          <AssessmentForm />
        </div>

        {/* Chatbot Section */}
        <div className="xl:col-span-2">
          <Chatbot />
          
        </div>

        {/* Journals */}
        <Card className="xl:col-span-2 bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">Recent Journals</h2>
            <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-2 list-disc pl-5">
              <li><em>Felt anxious before my viva but handled it better.</em></li>
              <li><em>Talked to people today, felt heard and seen.</em></li>
              <li><em>Skipped meditation, need to restart tomorrow.</em></li>
            </ul>
            <Button variant="outline" className="mt-4 text-purple-600 border-purple-400" onClick={() => navigate("/journals")}>
              View All Journals
            </Button>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">Quick Access</h2>
            <div className="flex flex-col space-y-2 text-left">
              {[["🧠 Mental Exercises", "/exercises"], ["🌐 Connect with Peers", "/community"], ["📅 Book a Session", "/book-session"], ["📊 View Progress", "/progress"], ["⚙️ Settings", "/settings"]].map(([label, path]) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="text-purple-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-gray-700"
                  onClick={() => navigate(path)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

      </section>
    </div>
  );
}
