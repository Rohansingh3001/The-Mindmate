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
//import OurStory from '../components/OurStory';

function Home() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/signup'];

  return (
    <main className="bg-white text-gray-900 w-full overflow-x-hidden">
      {/* Conditionally render Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      {/* Hero */}
      <section className="w-full min-h-screen px-4 sm:px-6 md:px-8 py-8 flex flex-col justify-center items-center">
        <HeroSection />
      </section>


      {/* How it Works */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-white">
        <HowItWorks />
      </section>

      {/* Doctors */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-gray-50">
        <DoctorsSection />
      </section>

      {/* Connect */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-white">
        <ConnectSection />
      </section>

      {/* Pricing */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-gradient-to-b from-white to-purple-50">
        <HardwareSection />
      </section>

      {/* Testimonials */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-white">
        <Testimonial />
      </section>
    </main>
  );
}

export default Home;
