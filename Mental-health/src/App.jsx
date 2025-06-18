import { Routes, Route, useLocation } from 'react-router-dom';
import LoginSignup from './components/Authpage';
import User from './pages/User'; // Make sure this path is correct
import Home from './pages/Home';
import Footer from './components/Footer';
import AppointmentsPage from "./components/AppointmentsPage";
import AnalysisPage from "./components/AnalysisPage";
import JournalsPage from "./components/JournalsPage";
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/signup'];

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/user/*" element={<User />} /> {/* ✅ Fixed line */}
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/analytics" element={<AnalysisPage />} />
        <Route path="/journals" element={<JournalsPage />} />
      </Routes>

      {/* Footer (conditionally hidden on login/signup) */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
