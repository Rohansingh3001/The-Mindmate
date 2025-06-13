import React, { useEffect, useState } from "react";

export default function Section({ sectionKey, questions, scale, scaleLabels, onScore }) {
  const [responses, setResponses] = useState(Array(questions.length).fill(null));

  useEffect(() => {
    // Reset responses when the sectionKey changes (new section)
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
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="bg-white/70 p-4 rounded shadow">
          <p className="font-medium mb-2">{question}</p>
          <div className="flex flex-wrap gap-4">
            {scale.map((val) => (
              <label key={val} className="flex items-center space-x-1">
                <input
                  type="radio"
                  name={`q-${sectionKey}-${index}`}
                  value={val}
                  checked={responses[index] === val}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
                <span>{scaleLabels[val]}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
