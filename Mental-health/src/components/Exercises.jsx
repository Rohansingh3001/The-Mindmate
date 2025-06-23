import React, { useState, useEffect } from "react";
import { RefreshCw, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import exercisesData from "./ExercisesData";


export default function Exercises() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeExercise, setActiveExercise] = useState(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const userLang = navigator.language.startsWith("hi")
      ? "hi"
      : navigator.language.startsWith("ta")
      ? "ta"
      : "en";
    setLang(userLang);
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(exercisesData.flatMap((e) => e.tags))),
  ];

  const filtered =
    selectedCategory === "all"
      ? exercisesData
      : exercisesData.filter((e) => e.tags.includes(selectedCategory));

  const randomExercise = () => {
    const r = filtered[Math.floor(Math.random() * filtered.length)];
    setActiveExercise(r);
  };

  const getTitle = (ex) =>
    lang === "hi" ? ex.title_hi : lang === "ta" ? ex.title_ta : ex.title;

  const getDescription = (ex) =>
    lang === "hi"
      ? ex.description_hi
      : lang === "ta"
      ? ex.description_ta
      : ex.description;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Go Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-purple-600 dark:text-purple-300 hover:underline flex items-center gap-2"
        >
          ← Go Back
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-center text-purple-700 dark:text-purple-200">
        🧘 MindMates Exercises
      </h1>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-purple-200 border-purple-500 text-purple-800 dark:bg-purple-600 dark:text-white"
                : "bg-white border-gray-300 text-gray-600 hover:bg-purple-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={randomExercise}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm shadow transition"
        >
          <RefreshCw size={16} /> Try Random
        </button>
      </div>

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            lang={lang}
            onOpen={() => setActiveExercise(ex)}
          />
        ))}
      </div>

      {/* Modal */}
      {activeExercise && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setActiveExercise(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              <XCircle size={20} />
            </button>

            <h2 className="text-xl font-bold text-purple-700 dark:text-purple-200">
              {getTitle(activeExercise)}
            </h2>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>⏱️ {activeExercise.duration}</span>
              <span>🎯 {activeExercise.level}</span>
            </div>

            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {getDescription(activeExercise)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise, lang, onOpen }) {
  const title =
    lang === "hi" ? exercise.title_hi : lang === "ta" ? exercise.title_ta : exercise.title;

  return (
    <div
      onClick={onOpen}
      className="cursor-pointer p-5 rounded-2xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-all"
    >
      <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-200">
        {title}
      </h3>
      <p className="text-xs text-gray-500 mt-1 flex gap-2 flex-wrap">
        {exercise.tags.map((tag) => (
          <span key={tag} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </p>
    </div>
  );
}
