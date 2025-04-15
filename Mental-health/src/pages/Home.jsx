// Home.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import DoctorsSection from '../components/DoctorsSection';
import Testimonial from '../components/Testimonial';

function Home() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/signup'];

  return (
    <main>
      {/* Header (conditionally shown) */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      {/* Page Sections */}
      <HeroSection />
      <HowItWorks />
      <DoctorsSection />
      <Testimonial />
    </main>
  );
}

export default Home;
