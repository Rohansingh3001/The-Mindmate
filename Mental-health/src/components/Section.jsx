import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Section({
  sectionKey,
  questions,
  scale,
  scaleLabels,
  onScore,
  showBackButton = false,
  onBack = () => {},
}) {
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const lastScoreRef = useRef(null);

  useEffect(() => {
    setResponses(Array(questions.length).fill(null));
    lastScoreRef.current = null;
  }, [sectionKey, questions.length]);

  useEffect(() => {
    const allAnswered = responses.every((r) => r !== null);
    if (allAnswered) {
      const total = responses.reduce((sum, val) => sum + val, 0);
      if (total !== lastScoreRef.current) {
        lastScoreRef.current = total;
        onScore(sectionKey, total);
      }
    }
  }, [responses, sectionKey, onScore]);

  const handleChange = (questionIndex, value) => {
    const updated = [...responses];
    updated[questionIndex] = parseInt(value, 10);
    setResponses(updated);
  };

  const answeredCount = responses.filter((r) => r !== null).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="space-y-10 animate-fade-in">
      {showBackButton && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-300 hover:underline"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
        <div
          className="bg-purple-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-right text-sm text-gray-500 dark:text-gray-400">{progress}% completed</p>

      {/* Questions */}
      <AnimatePresence>
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-6 border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-900 shadow-md"
          >
            <p className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {question}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {scale.map((val) => {
                const isChecked = responses[index] === val;
                return (
                  <label
                    key={val}
                    title={scaleLabels[val]}
                    className={`flex items-center justify-center text-3xl p-4 rounded-full cursor-pointer transition-all duration-200 border-2
                      ${
                        isChecked
                          ? "bg-purple-200 border-purple-600 text-purple-800 dark:bg-purple-600 dark:text-white"
                          : "bg-white border-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-purple-500 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={`q-${sectionKey}-${index}`}
                      value={val}
                      checked={isChecked}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="hidden"
                    />
                    <span role="img" aria-label={scaleLabels[val]}>
                      {scaleLabels[val].match(/([\u{1F600}-\u{1F6FF}])/gu)?.[0] || "❓"}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
