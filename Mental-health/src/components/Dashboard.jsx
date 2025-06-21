import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { FaRegSmile } from "react-icons/fa";
import {
  IoMdCalendar,
  IoIosStats,
  IoIosPeople,
  IoIosSettings,
  IoIosGlobe,
  IoIosFitness,
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
import { toast } from "react-toastify";
import AssessmentForm from "./AssessmentForm";
import Chatbot from "./ChatBot";
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

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Auth & user setup
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
        setUserName(name);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Daily quote
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
        setQuote("You're doing your best, and that’s enough.");
      });
  }, []);

  // Local mood/journal stats
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

  // Firestore: fetch next appointment
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

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-white via-purple-100 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 space-y-10">
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
      <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-700 rounded-xl px-6 py-4 text-center italic text-sm text-purple-900 dark:text-purple-100 shadow">
        🌟 <span className="font-semibold">Quote of the Day:</span> {quote}
      </div>

      {/* Dashboard Grid */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Mood Tracker */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl">
          <CardContent>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Today's Mood</h2>
              <FaRegSmile size={22} className="text-purple-400" />
            </div>
            <p className="text-sm mb-2">How are you feeling?</p>
            <div className="flex justify-between text-2xl">
              {["😊", "😐", "😢", "😠", "😴"].map((emoji) => (
                <button key={emoji} onClick={() => handleMoodClick(emoji)} className={mood === emoji ? "scale-125" : ""}>
                  {emoji}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Appointment */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl">
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
            <Button onClick={() => navigate("/appointments")}>Manage Appointments</Button>
          </CardContent>
        </Card>

        {/* Wellness Stats */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl">
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
            <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate("/analytics")}>
              View Analytics
            </Button>
          </CardContent>
        </Card>

       <Card className="p-6 bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl">
          <CardContent>
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Wanna Check Your Mode?</h2>
              <IoIosGlobe size={22} className="text-purple-400" />
            </div>
            <ul className="text-sm space-y-1">
              <li>✔️  Mood Check – PHQ-9</li>
              <li>✔️  Anxiety Check – GAD-7</li>
              <li>✔️  Stress Levels </li>
            </ul>
            <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate("/assessment")}>
              Give it a Try!
            </Button>
          </CardContent>
        </Card>

        {/* Chatbot */}
        <div className="xl:col-span-2"><Chatbot userName={userName} /></div>
{/* Journals */}
<Card className="xl:col-span-2 p-6 bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 rounded-2xl shadow-sm">
  <CardContent>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
        Recent Journals
      </h2>
      <Link to="/journals">
        <Button
          variant="outline"
          className="text-xs sm:text-sm border-purple-400 text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700"
        >
          View All
        </Button>
      </Link>
    </div>

    {getJournals().length > 0 ? (
      <ul className="space-y-4">
        {getJournals()
          .slice(-3)
          .reverse()
          .map((journal, i) => (
            <li
              key={i}
              className="border-l-4 border-purple-400 pl-3 bg-purple-50/20 dark:bg-gray-700/30 rounded-md"
            >
              <p className="text-sm text-gray-800 dark:text-gray-100 line-clamp-3">
                <em>{journal.entry}</em>
              </p>
              {journal.date && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {journal.date}
                </p>
              )}
            </li>
          ))}
      </ul>
    ) : (
      <p className="italic text-gray-600 dark:text-gray-300">
        No journal entries yet.
      </p>
    )}
  </CardContent>
</Card>

        {/* Quick Access */}
{/* Quick Access */}
<Card className="p-6 bg-white dark:bg-gray-900 border border-purple-200 dark:border-gray-700 rounded-2xl shadow-sm">
  <CardContent>
    <h2 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4">Quick Access</h2>
    <div className="flex flex-col gap-2">
      {[
        [<IoIosFitness size={18} className="text-purple-600 dark:text-purple-300" />, "Mental Exercises", "/exercises"],
        [<IoIosPeople size={18} className="text-purple-600 dark:text-purple-300" />, "Connect with Peers", "/connect-peer"],
        [<IoMdCalendar size={18} className="text-purple-600 dark:text-purple-300" />, "Book a Session", "/appointments"],
        [<BarChart2 size={18} className="text-purple-600 dark:text-purple-300" />, "View Progress", "/analytics"],
        [<IoIosSettings size={18} className="text-purple-600 dark:text-purple-300" />, "Settings", "/settings"],
      ].map(([icon, label, path]) => (
        <Link to={path} key={label}>
          <Button
            variant="ghost"
            className="text-left w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all
              text-gray-900 dark:text-gray-200
              hover:bg-purple-50 dark:hover:bg-purple-800/30"
          >
            {icon}
            <span className="text-sm font-semibold">{label}</span>
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
