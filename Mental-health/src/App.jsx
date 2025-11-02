import { Routes, Route, useLocation } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { updateLastActive } from "./firebaseAuth";

// Auth & Home
import LoginSignup from "./components/Authpage";
import Home from "./pages/Home";

// User & Features
import User from "./pages/User";
import AppointmentsPage from "./components/AppointmentsPage";
import AnalysisPage from "./components/AnalysisPage";
import JournalsPage from "./components/JournalsPage";
import Exercises from "./components/Exercises";
import SettingsPage from "./components/Settings";
import AssessmentForm from "./components/AssessmentForm";
import Topup from "./components/Topup";
// Peer & Admin
import PeerConnect from "./components/PeerConnect";
import ConnectPeer from "./components/ConnectPeer";
import ChatPage from "./pages/ChatPage";
import PeerDashboard from "./pages/PeerDashboard";
import AdminPanel from "./pages/AdminPanel";
import PeerChatDemo from "./components/PeerChatDemo";

// Company Info Pages
import About from "./components/company/About";
import Careers from "./components/company/Career";
import PrivacyPolicy from "./components/company/PrivacyPolicy";
import Contact from "./components/company/Contact";

// Resources
import FAQs from "./components/resources/FAQs";
import MeditationGuides from "./components/resources/MeditationGuides";
import WellnessBlog from "./components/resources/WellnessBlog";
import MentalHealthTips from "./components/resources/MentalHealthTips";

// Gamification Features
import GamifiedDashboard from "./components/GamifiedDashboard";
import GamifiedJournal from "./components/GamifiedJournal";
import MentalHealthQuests from "./components/MentalHealthQuests";
import MoodGarden from "./components/MoodGarden";
import MindfulnessChallenges from "./components/MindfulnessChallenges";
import MentalHealthProgress from "./components/MentalHealthProgress";
import MentalHealthScratchCard from "./components/MentalHealthScratchCard";

// Footer
import Footer from "./components/Footer";
import FormViewer from "./components/FormViewer";

function App() {
  const { pathname } = useLocation();

  // Track user activity and update lastActive
  useEffect(() => {
    let activityTimeout;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !user.email?.includes('mindmates@gmail.com')) {
        // Update last active on mount
        updateLastActive(user.uid);
        
        // Update last active every 5 minutes of activity
        const updateActivity = () => {
          updateLastActive(user.uid);
        };
        
        // Set up activity tracking
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        const handleActivity = () => {
          clearTimeout(activityTimeout);
          activityTimeout = setTimeout(updateActivity, 5 * 60 * 1000); // 5 minutes
        };
        
        events.forEach(event => window.addEventListener(event, handleActivity));
        
        return () => {
          events.forEach(event => window.removeEventListener(event, handleActivity));
          clearTimeout(activityTimeout);
        };
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Hide footer on specific pages
  const hideFooter = useMemo(() => {
    const hiddenPaths = ["/login", "/signup", "/admin" ,"/about", "/careers", "/privacy-policy", "/contact" , "/faqs", "/meditation", "/wellness", "/tips"];
    return hiddenPaths.some((path) => pathname.startsWith(path));
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />

          {/* User */}
          <Route path="/user/*" element={<User />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/analytics" element={<AnalysisPage />} />
          <Route path="/journals" element={<JournalsPage />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/assessment" element={<AssessmentForm />} />
          <Route path="/form" element={<FormViewer />} />
          <Route path="/topup" element={<Topup />} />
          {/* Peer & Community */}
          <Route path="/connect-peer" element={<PeerConnect />} />
          <Route path="/chat/:peerId" element={<ConnectPeer />} />
          <Route path="/peer" element={<PeerDashboard />} />
          <Route path="/demo" element={<PeerChatDemo />} />

          {/* Admin */}
          <Route path="/admin/*" element={<AdminPanel />} />

          {/* Company Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />

          {/* Resources */}
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/meditation" element={<MeditationGuides />} />
          <Route path="/wellness" element={<WellnessBlog />} />
          <Route path="/tips" element={<MentalHealthTips />} />

          {/* Gamification Features */}
          <Route path="/gamification" element={<GamifiedDashboard />} />
          <Route path="/gamified-journal" element={<GamifiedJournal />} />
          <Route path="/mental-health-quests" element={<MentalHealthQuests />} />
          <Route path="/mood-garden" element={<MoodGarden />} />
          <Route path="/mindfulness-challenges" element={<MindfulnessChallenges />} />
          <Route path="/mental-health-progress" element={<MentalHealthProgress />} />
          <Route path="/scratch-card" element={<MentalHealthScratchCard />} />
        </Routes>
      </div>
      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
