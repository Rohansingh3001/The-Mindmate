import React from "react";
import {
  Sparkles,
  Eye,
  Handshake,
  HeartCrack,
  Users,
  Bot,
  Languages,
  ShieldCheck,
  BookOpenText,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const coreValues = [
    {
      title: "Multilingual Access",
      icon: <Languages className="text-indigo-600 w-6 h-6" />,
      desc: "We speak your language — Hindi, Tamil, English — to make support feel personal.",
    },
    {
      title: "AI + Human Touch",
      icon: <Bot className="text-indigo-600 w-6 h-6" />,
      desc: "Instant help from Ira, our AI buddy, with real therapists just a click away.",
    },
    {
      title: "Community-Driven",
      icon: <Users className="text-indigo-600 w-6 h-6" />,
      desc: "A space built by students, for students. You’re not alone here.",
    },
    {
      title: "Privacy First",
      icon: <ShieldCheck className="text-indigo-600 w-6 h-6" />,
      desc: "Anonymous. Secure. Judgement-free. Always.",
    },
  ];

  return (
    <section className="min-h-screen px-6 py-16 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      {/* Intro */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300">
          <BookOpenText className="w-7 h-7" /> About The MindMates
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          We’re more than a platform — we’re a movement to make mental health
          accessible, stigma-free, and empowering for young minds across India.
        </p>
      </div>

      {/* Main Sections */}
      <div className="max-w-5xl mx-auto space-y-16">
        {[
          {
            title: "A Generation Under Pressure",
            icon: <HeartCrack className="w-5 h-5" />,
            content:
              "Teenagers are dealing with pressure from all sides — exams, society, social media. College students battle identity crises and loneliness. Working professionals suffer silently in toxic work cultures. We saw the pain. We felt it too. That’s why we built The MindMates — a digital friend, a safe community, a bridge to healing.",
          },
          {
            title: "Our Mission",
            icon: <Sparkles className="w-5 h-5" />,
            content:
              "To democratize mental health care through a blend of technology, empathy, and community. Our chatbot, Ira, isn’t here to replace therapists — she’s here to help you reach them faster, in your language, without fear.",
          },
          {
            title: "Our Vision",
            icon: <Eye className="w-5 h-5" />,
            content:
              "We imagine a world where asking for help feels as normal as asking for water. Where no student is ever alone with their thoughts. Where tech can listen, guide, and heal — responsibly.",
          },
          {
            title: "What We Promise",
            icon: <Handshake className="w-5 h-5" />,
            content:
              "We will always prioritize your mental health, your privacy, and your dignity. Every decision we make is for the users — for you. For your peace of mind, for your growth, for your healing.",
          },
        ].map(({ title, icon, content }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-purple-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex gap-2 items-center">
              {icon}
              {title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{content}</p>
          </div>
        ))}
      </div>

      {/* Core Values Grid */}
      <div className="max-w-6xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center text-purple-700 dark:text-purple-300 mb-12">
          Why Choose The MindMates?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {coreValues.map((val) => (
            <div
              key={val.title}
              className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                {val.icon}
                <h3 className="font-semibold">{val.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
