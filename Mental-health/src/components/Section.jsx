import React, { useEffect, useState } from "react";

export default function Section({ sectionKey, questions, scale, scaleLabels, onScore }) {
  const [responses, setResponses] = useState(Array(questions.length).fill(null));

  useEffect(() => {
    setResponses(Array(questions.length).fill(null));
  }, [sectionKey, questions.length]);

  useEffect(() => {
    const allAnswered = responses.every((r) => r !== null);
    if (allAnswered) {
      const total = responses.reduce((sum, val) => sum + val, 0);
      onScore(sectionKey, total);
    }
  }, [responses, sectionKey, onScore]);

  const handleChange = (questionIndex, value) => {
    const updated = [...responses];
    updated[questionIndex] = parseInt(value, 10);
    setResponses(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {questions.map((question, index) => (
        <div
          key={index}
          className="bg-white/80 p-6 rounded-2xl shadow-lg border border-purple-200"
        >
          <p className="text-lg font-semibold mb-4 text-gray-800">{question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {scale.map((val) => {
              const isChecked = responses[index] === val;
              return (
                <label
                  key={val}
                  className={`flex items-center p-2 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                    isChecked
                      ? "bg-purple-100 border-purple-500 text-purple-700"
                      : "bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-purple-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${sectionKey}-${index}`}
                    value={val}
                    checked={isChecked}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="hidden"
                  />
                  <span className="ml-2">{scaleLabels[val]}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
