// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRegSmile,
} from "react-icons/fa";
import {
  IoMdCalendar,
  IoIosStats,
  IoIosPeople,
  IoIosSettings,
  IoIosGlobe,
  IoIosFitness,
  IoIosPaper,
} from "react-icons/io";
import {
  BarChart2,
  CalendarDays,
  Clock,
  MapPin,
  UserCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import AssessmentForm from "../components/AssessmentForm";
import Chatbot from "../components/ChatBot";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import STORAGE_KEYS, { getFromStorage } from "../utils/storage";
import { getJournals } from "../utils/journalStorage";

const greetings = ["Hey", "Welcome", "Namaste", "How are you?", "Peace ✌️"];


export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [theme, setTheme] = useState(() =>
    localStorage.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const [greeting, setGreeting] = useState(greetings[0]);
  const [quote, setQuote] = useState("");
  const [mood, setMood] = useState(() => getFromStorage(STORAGE_KEYS.MOOD, ""));
  const [nextAppointment, setNextAppointment] = useState(null);
  const [stats, setStats] = useState({ moodLogs: 0, journals: 0, sessions: 0 });
  const [user, setUser] = useState(null);
  const [showIraBubble, setShowIraBubble] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
        setUserName(name);
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetch("https://api.quotable.io/random?tags=inspirational|wisdom")
      .then((res) => res.ok ? res.json() : Promise.reject("API error"))
      .then((data) => {
        if (data.content && data.author) {
          setQuote(`"${data.content}" — ${data.author}`);
        } else {
          throw new Error("Malformed quote");
        }
      })
      .catch(() => {
        setQuote("You're doing your best, and that’s enough.");
      });
  }, []);

  useEffect(() => {
    const moodLogs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const journals = JSON.parse(localStorage.getItem("mindmates.journals") || "[]");
    if (moodLogs.length > 0) setMood(moodLogs[moodLogs.length - 1].mood);

    setStats((prev) => ({
      ...prev,
      moodLogs: moodLogs.length,
      journals: journals.length,
    }));

    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  useEffect(() => {
    const fetchNextAppointment = async () => {
      if (!user) return;

      const apptQuery = query(collection(db, "appointments"), where("userId", "==", user.uid));
      const snapshot = await getDocs(apptQuery);

      const futureAppointments = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp?.toDate?.();
          return {
            id: doc.id,
            ...data,
            timestamp,
            date: format(timestamp, "MMM dd, yyyy"),
            time: format(timestamp, "hh:mm a"),
          };
        })
        .filter((appt) => appt.timestamp > new Date())
        .sort((a, b) => a.timestamp - b.timestamp);

      setNextAppointment(futureAppointments[0] || null);
      setStats((prev) => ({ ...prev, sessions: snapshot.size }));
    };

    fetchNextAppointment();
  }, [user]);


  const handleMoodClick = (emoji) => {
    const logs = JSON.parse(localStorage.getItem("mindmates.moodLogs") || "[]");
    const updatedLogs = [...logs, { mood: emoji, timestamp: new Date().toISOString() }];
    localStorage.setItem("mindmates.moodLogs", JSON.stringify(updatedLogs));
    setMood(emoji);
    setStats((prev) => ({ ...prev, moodLogs: updatedLogs.length }));
    toast.success(`Mood logged: ${emoji}`, { position: "top-right", theme });
  };

  // Handler for under development features: navigate and show toast
  const handleDevFeature = (path) => {
    navigate(path);
    toast("🚧 This feature is under development.", { position: "top-center" });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-white via-purple-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 space-y-10 relative">
      {/* IRA Chat Assistant Floating Bubble */}
      {showIraBubble && (
        <div className="fixed bottom-8 right-8 z-50 flex items-end animate-fade-in">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl px-5 py-3 max-w-xs text-base text-gray-800 dark:text-gray-100 border border-purple-300 dark:border-purple-700 flex items-center gap-3" style={{boxShadow: '0 8px 32px rgba(128,0,255,0.12)'}}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold mr-2 shadow-md">🤖</span>
            <span>Hi, I am <span className="font-semibold text-purple-600 dark:text-purple-300">IRA</span>, your chat assistant!</span>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-300">
            {greeting}, <span className="text-purple-500 dark:text-purple-200">{userName}</span> 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Hope you're having a calm day.</p>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Daily Quote */}
      <blockquote className="border-l-4 border-purple-400 pl-4 italic text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        {quote}
      </blockquote>

      {/* Dashboard Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Mood Tracker */}
        <Card className="p-6 dark:bg-gray-800">
          <CardContent>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Today's Mood</h2>
              <FaRegSmile size={22} className="text-purple-400" />
            </div>
            <p className="text-sm mb-2">How are you feeling?</p>
            <div className="flex justify-between text-2xl">
              {["😊", "😐", "😢", "😠", "😴"].map((emoji) => (
                <button key={emoji} onClick={() => handleMoodClick(emoji)} className={`transition-transform ${mood === emoji ? "scale-125" : "hover:scale-110"}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Card */}
        <Card className="p-6">
          <CardContent>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Next Appointment</h2>
              <IoMdCalendar size={22} className="text-purple-400" />
            </div>
            {nextAppointment ? (
              <div className="space-y-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4 text-sm">
                <p className="flex items-center gap-2"><UserCircle2 size={16} /> <strong>{nextAppointment.doctor}</strong></p>
                <p className="flex items-center gap-2"><CalendarDays size={16} /> {nextAppointment.date}</p>
                <p className="flex items-center gap-2"><Clock size={16} /> {nextAppointment.time}</p>
                <p className="flex items-center gap-2"><MapPin size={16} /> {nextAppointment.mode}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-300">No upcoming appointments.</p>
            )}
            <Button onClick={() => handleDevFeature("/appointments")}>Manage Appointments</Button>
          </CardContent>
        </Card>

        {/* Wellness Stats */}
        <Card className="p-6">
          <CardContent>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Wellness Stats</h2>
              <IoIosStats size={22} className="text-purple-400" />
            </div>
            <ul className="text-sm space-y-1">
              <li>✔️ {stats.moodLogs} mood logs</li>
              <li>✔️ {stats.journals} journal entries</li>
              <li>✔️ {stats.sessions} session{stats.sessions !== 1 ? "s" : ""} booked</li>
            </ul>
            <Button className="mt-4 w-full" onClick={() => handleDevFeature("/analytics")}>View Analytics</Button>
          </CardContent>
        </Card>

        {/* Assessment */}
        <Card className="p-6">
          <CardContent>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Wanna Check Your Mood?</h2>
              <IoIosGlobe size={22} className="text-purple-400" />
            </div>
            <ul className="text-sm space-y-1">
              <li>✔️ Mood Check – PHQ-9</li>
              <li>✔️ Anxiety Check – GAD-7</li>
              <li>✔️ Stress Levels</li>
            </ul>
            <Button className="mt-4 w-full" onClick={() => handleDevFeature("/assessment")}>Give it a Try!</Button>
          </CardContent>
        </Card>

{/* Feedback */}
        <Card className="p-6">
          <CardContent>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
               Please share the feedback
              </h2>
              <IoIosPaper size={22} className="text-purple-400" />
            </div>
            <ul className="text-sm space-y-1">
              <li>✔️ Feedback & Suggestions</li>
              {/* <li>✔️ Well-being Survey</li>
              <li>✔️ Contribute to MindMates</li> */}
            </ul>
            <Button className="mt-4 w-full" onClick={() => navigate("/form")}>
              Fill a Form
            </Button>
          </CardContent>
        </Card>

        {/* Chatbot */}
        <div className="xl:col-span-2" onClick={() => setShowIraBubble(false)} style={{cursor: 'pointer'}}>
          <Chatbot userName={userName} />
        </div>

        {/* Journals */}
        <Card className="xl:col-span-2 p-6">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Recent Journals</h2>
              <Link to="/journals">
                <Button variant="outline" className="text-xs sm:text-sm" onClick={() => handleDevFeature("/journals")}>View All</Button>
              </Link>
            </div>
            {getJournals().length > 0 ? (
              <ul className="space-y-4">
                {getJournals().slice(-3).reverse().map((journal, i) => (
                  <li key={i} className="border-l-4 border-purple-400 pl-3 bg-purple-50/20 dark:bg-gray-700/30 rounded-md">
                    <p className="text-sm text-gray-800 dark:text-gray-100 italic line-clamp-3">{journal.entry}</p>
                    {journal.date && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{journal.date}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-600 dark:text-gray-300">No journal entries yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="p-6">
          <CardContent>
            <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4">Quick Access</h2>
            <div className="flex flex-col gap-2">
              {[
                [<IoIosFitness />, "Mental Exercises", "/exercises"],
                [<IoIosPeople />, "Connect with Peers", "/connect-peer"],
                [<IoMdCalendar />, "Book a Session", "/appointments"],
                [<BarChart2 />, "View Progress", "/analytics"],
                [<IoIosSettings />, "Settings", "/settings"],
              ].map(([icon, label, path]) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="w-full text-left flex items-center gap-3"
                  onClick={() => handleDevFeature(path)}
                >
                  {icon}
                  <span className="text-sm font-semibold">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
