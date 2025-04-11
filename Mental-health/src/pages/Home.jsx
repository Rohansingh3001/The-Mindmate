import React from 'react';
import HeroSection from '../components/HeroSection';
import Testimonial from '../components/Testimonial'; // ✅ Fixed import path
import HowItWorks from '../components/HowItWorks';
import DoctorsSection from '../components/DoctorsSection'; // Import DoctorsSection

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Doctors Section */}
      <DoctorsSection /> {/* Include DoctorsSection */}
      {/* Testimonial Section */}
      <Testimonial />


    </main>
  );
}

export default Home;
