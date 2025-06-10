// Home.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import ConnectSection from "../components/ConnectSection";
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import DoctorsSection from '../components/DoctorsSection';
import Testimonial from '../components/Testimonial';
import HardwareSection from "../components/PriceSection";
import OurStory from '../components/OurStory';
function Home() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/signup'];

  return (
    <main>
      {/* Header (conditionally shown) */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      {/* Page Sections */}
      <HeroSection />
      <OurStory/>
      <HowItWorks />
      <DoctorsSection />
      <ConnectSection />
      <HardwareSection />
      
      
      <Testimonial />
    </main>
  );
}

export default Home;
