import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { FaRegSmile } from "react-icons/fa";
import { IoMdCalendar, IoIosStats } from "react-icons/io";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import AssessmentForm from "./AssessmentForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const greetings = ["Hey", "Welcome", "Namaste", "How are you?", "Peace ✌️"];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [mood, setMood] = useState(localStorage.getItem("userMood") || "");
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState(greetings[0]);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Get current user from Firebase Auth
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email?.split("@")[0] || "User";
        setUserName(displayName);
      } else {
        navigate("/login"); // Redirect if not logged in
      }
    });

    // Set greeting
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

    // Fetch motivational quote
    fetch("https://api.quotable.io/random?tags=inspirational|wisdom")
      .then((res) => res.json())
      .then((data) => setQuote(`${data.content} — ${data.author}`));

    return () => unsubscribe();
  }, []);

  const handleMoodClick = (emoji) => {
    setMood(emoji);
    localStorage.setItem("userMood", emoji);
    toast.success(`Mood logged: ${emoji}`, {
      position: "top-right",
      theme: theme === "dark" ? "dark" : "light",
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-white via-purple-100 to-purple-200 text-gray-900 space-y-10 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-purple-800">
            {greeting}, <span className="text-purple-500">{userName}</span> 👋
          </h1>
          <p className="text-sm text-gray-600 mt-2">Hope you're having a calm day. 🌿</p>
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
      <div className="bg-white border border-purple-200 rounded-xl px-6 py-4 text-center italic text-sm text-purple-900 shadow">
        🌟 <span className="text-purple-600 font-semibold">Quote of the Day:</span> {quote || "Loading..."}
      </div>

      {/* Cards Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Mood Tracker */}
        <Card className="bg-white border border-purple-300 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700">Today's Mood</h2>
              <FaRegSmile className="text-purple-400" size={22} />
            </div>
            <p className="text-sm text-gray-600">How are you feeling?</p>
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
        <Card className="bg-white border border-purple-300 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700">Upcoming Session</h2>
              <IoMdCalendar className="text-purple-400" size={22} />
            </div>
            <p className="text-sm text-gray-600">Next appointment:</p>
            <p className="text-base font-medium text-purple-900">Dr. Rathi – Jun 10, 4:00 PM</p>
            <Button className="mt-4 w-full bg-purple-500 hover:bg-purple-600" onClick={() => navigate("/appointment")}>
              Manage Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Wellness Stats */}
        <Card className="bg-white border border-purple-300 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700">Wellness Stats</h2>
              <IoIosStats className="text-purple-400" size={22} />
            </div>
            <p className="text-sm text-gray-600 mb-2">This week:</p>
            <ul className="text-sm space-y-1 text-gray-700">
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

        {/* Journals */}
        <Card className="xl:col-span-2 bg-white border border-purple-300 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <h2 className="text-lg font-semibold text-purple-700 mb-3">Recent Journals</h2>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
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
        <Card className="bg-white border border-purple-300 p-6 rounded-2xl transition hover:shadow-lg">
          <CardContent>
            <h2 className="text-lg font-semibold text-purple-700 mb-3">Quick Access</h2>
            <div className="flex flex-col space-y-2 text-left">
              {[
                ["🧠 Mental Exercises", "/exercises"],
                ["🌐 Connect with Peers", "/community"],
                ["📅 Book a Session", "/book-session"],
                ["📊 View Progress", "/progress"],
                ["⚙️ Settings", "/settings"],
              ].map(([label, path]) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="text-purple-700 hover:bg-purple-100"
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
