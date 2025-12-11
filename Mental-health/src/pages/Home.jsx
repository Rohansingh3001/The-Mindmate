// Home.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/shared/SEO';
import ConnectSection from "../components/landing/ConnectSection";
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/landing/HowItWorks';
import DoctorsSection from '../components/landing/DoctorsSection';
import Testimonial from '../components/landing/Testimonial';
import HardwareSection from "../components/landing/PriceSection";
//import OurStory from '../components/landing/OurStory';

function Home() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/signup'];

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'The MindMates',
    url: 'https://themindmates.in',
    logo: 'https://themindmates.in/logo.svg',
    description: 'Professional mental health counseling, therapy, and peer support platform in India. Connect with licensed therapists for anxiety, depression, stress management, and emotional wellbeing.',
    medicalSpecialty: 'Psychiatry, Psychology, Mental Health Counseling',
    availableService: [
      {
        '@type': 'MedicalTherapy',
        name: 'Online Therapy',
        description: 'Professional online therapy sessions with licensed therapists'
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Mental Health Counseling',
        description: 'Expert counseling for anxiety, depression, and stress'
      },
      {
        '@type': 'Service',
        name: 'Peer Support Groups',
        description: 'Connect with supportive communities and peer counselors'
      },
      {
        '@type': 'Service',
        name: 'Mood Tracking',
        description: 'Track your mental health progress and mood patterns'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    }
  };

  return (
    <>
      <SEO 
        title="The MindMates - Online Mental Health Therapy & Counseling in India"
        description="Get professional mental health support from licensed therapists in India. The MindMates offers online therapy, counseling, peer support, mood tracking, and 24/7 mental wellness services. Start your journey to better mental health today."
        keywords="online therapy India, mental health counseling, therapist online India, depression help, anxiety treatment India, stress management, online psychologist, mental health app India, teletherapy, emotional support, peer counseling, mood tracker, mental wellness India, CBT therapy India, psychiatric help online"
        url="https://themindmates.in"
        schema={homeSchema}
      />
      <main className="bg-gradient-to-b from-white via-mindmate-50/30 to-white text-gray-900 w-full overflow-x-hidden">
      {/* Conditionally render Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      {/* Hero */}
      <section className="w-full min-h-screen px-4 sm:px-6 md:px-8 py-8 flex flex-col justify-center items-center bg-gradient-to-br from-mindmate-50 via-lavender-50 to-mindmate-100">
        <HeroSection />
      </section>


      {/* How it Works */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-white">
        <HowItWorks />
      </section>

      {/* Doctors */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-mindmate-50">
        <DoctorsSection />
      </section>

      {/* Connect */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-white">
        <ConnectSection />
      </section>

      {/* Pricing */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 bg-gradient-to-b from-white to-mindmate-50">
        <HardwareSection />
      </section>

      {/* Testimonials */}
      <section className="w-full px-4 sm:px-6 md:px-8 py-10 pb-0 bg-white">
        <Testimonial />
      </section>
    </main>
    </>
  );
}

export default Home;
