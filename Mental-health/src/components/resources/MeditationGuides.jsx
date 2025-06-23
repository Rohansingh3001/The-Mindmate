import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const guides = [
  {
    title: "Mindful Breathing (5 min)",
    steps: [
      "Find a quiet, comfortable spot.",
      "Close your eyes and take slow breaths.",
      "If your mind wanders, gently bring it back.",
    ],
  },
  {
    title: "Body Scan (7 min)",
    steps: [
      "Lie down comfortably.",
      "Focus on each body part, from toes to head.",
      "Release tension as you go upwards.",
    ],
  },
  {
    title: "Gratitude Meditation (4 min)",
    steps: [
      "Sit with a pleasant posture.",
      "Visualize a positive memory.",
      "Let the warmth fill your body and stay there.",
    ],
  },
];

export default function MeditationGuides() {
  const navigate = useNavigate();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-gray-900 dark:text-gray-100">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back to previous page"
        className="flex items-center gap-2 text-sm text-purple-600 hover:underline mb-8"
      >
        <ArrowLeft size={16} /> Go Back
      </button>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight mb-4">
          🧘‍♀️ Meditation Guides
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover simple step-by-step practices to help you feel calm, present, and emotionally balanced — anytime, anywhere.
        </p>
      </header>

      {/* Guides Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        {guides.map((g, idx) => (
          <article
            key={g.title}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-700 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="mb-4">
              <span className="text-sm text-purple-500 dark:text-purple-300 font-medium">
                Guide {idx + 1}
              </span>
              <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-400 mt-1">
                {g.title}
              </h2>
            </div>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 pl-1">
              {g.steps.map((s, i) => (
                <li key={i} className="leading-relaxed">
                  {s}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      {/* Footer Note */}
      <footer className="mt-16 text-center">
        <p className="text-md text-gray-500 dark:text-gray-400">
          Practice daily — even a few minutes can make a big difference 🌿
        </p>
      </footer>
    </main>
  );
}
