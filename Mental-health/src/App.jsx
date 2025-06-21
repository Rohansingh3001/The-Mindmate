import { Routes, Route, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import LoginSignup from './components/Authpage';
import Home from './pages/Home';
import User from './pages/User';
import AppointmentsPage from "./components/AppointmentsPage";
import AnalysisPage from "./components/AnalysisPage";
import JournalsPage from "./components/JournalsPage";
import Footer from './components/Footer';
import AdminPanel from './pages/AdminPanel';
import ConnectPeer from './components/ConnectPeer';
import ChatPage from "./pages/ChatPage";
import AssessmentForm from "./components/AssessmentForm";
import PeerDashboard from './pages/PeerDashboard'; 
import { Toaster } from 'react-hot-toast';

function App() {
  const { pathname } = useLocation();

  // Define routes where footer should be hidden
  const hideFooter = useMemo(() => {
    return ["/login", "/signup", "/admin"].some((route) =>
      pathname.startsWith(route)
    );
  }, [pathname]);

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/user/*" element={<User />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/analytics" element={<AnalysisPage />} />
        <Route path="/journals" element={<JournalsPage />} />
        <Route path="/admin/*" element={<AdminPanel />} /> 
        <Route path="/connect-peer" element={<ConnectPeer />} />
        <Route path="/chat/:peerId" element={<ChatPage />} />
         <Route path="/peer" element={<PeerDashboard />} />
        <Route path="/assessment" element={<AssessmentForm />} /> 
      </Routes>

      {/* Conditionally Render Footer */}
      {!hideFooter && <Footer />}
    </>
  );
}

export default App;
