import { Routes, Route, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";

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

// Footer
import Footer from "./components/Footer";
import FormViewer from "./components/FormViewer";

function App() {
  const { pathname } = useLocation();

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
        </Routes>
      </div>
      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
