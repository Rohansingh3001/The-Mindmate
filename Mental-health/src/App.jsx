import { Routes, Route, useLocation } from 'react-router-dom';
import LoginSignup from './components/Authpage';
import Home from './pages/Home';
import User from './pages/User';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];

  return (
    <>
      {/* Header */}
      {!hideNavbarRoutes.includes(location.pathname) && <Header />}
      
      {/* Toast Notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/user" element={<User />} />
      </Routes>
      
      {/* Footer */}
      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
