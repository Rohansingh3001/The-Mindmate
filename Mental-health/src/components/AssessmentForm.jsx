import React, { useState } from "react";
import Section from "./Section";
import jsPDF from "jspdf";
import "jspdf-autotable";

const sections = [
 {
  key: "phq9",
  title: "Feeling Sad or Unhappy – PHQ-9",
  maxScore: 27,
  questions: [
    "I don’t enjoy things like I used to.",
    "I feel sad or unhappy a lot.",
    "I have trouble sleeping or I sleep too much.",
    "I feel tired and have no energy.",
    "I don’t feel like eating, or I eat too much.",
    "I feel like I’m not good enough or a failure.",
    "I can’t focus or pay attention easily.",
    "I move or talk slowly, or I feel very restless.",
    "Sometimes I feel like I don’t want to be here."
  ],
  scale: [0, 1, 2, 3],
  scaleLabels: {
    0: "Not at all",
    1: "Sometimes",
    2: "Many days",
    3: "Almost every day"
  }
},
 {
  key: "anxiety",
  title: "Feeling Nervous or Worried – GAD-7",
  maxScore: 21,
  questions: [
    "I feel nervous or scared a lot.",
    "I can’t stop worrying, even if I try.",
    "I worry about lots of things.",
    "I find it hard to relax or calm down.",
    "I feel like I always have to move around.",
    "I get upset or angry easily.",
    "I feel like something bad might happen."
  ],
  scale: [0, 1, 2, 3],
  scaleLabels: {
    0: "Not at all",
    1: "Sometimes",
    2: "Many days",
    3: "Almost every day"
  }
},
 {
  key: "stress",
  title: "Feeling Stressed or Overwhelmed",
  maxScore: 21,
  questions: [
    "I find it hard to calm down when I’m upset.",
    "I get really upset or angry over small things.",
    "I feel like I’m always worried or tense.",
    "I get angry or annoyed easily.",
    "It’s hard for me to feel relaxed.",
    "I don’t like being stopped or interrupted.",
    "Sometimes I feel like life doesn’t make sense."
  ],
  scale: [0, 1, 2, 3],
  scaleLabels: {
    0: "Never",
    1: "Sometimes",
    2: "Often",
    3: "Almost Always"
  }
}
];

const interpretScore = (key, score) => {
  if (key === "phq9") {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    if (score <= 19) return "Moderately Severe";
    return "Severe";
  }
  if (key === "anxiety") {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    return "Severe";
  }
  if (key === "stress") {
    if (score <= 7) return "Normal";
    if (score <= 9) return "Mild";
    if (score <= 12) return "Moderate";
    return "Severe";
  }
  return "Unknown";
};

export default function AssessmentForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [answered, setAnswered] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentSection = sections[currentIndex];
  const totalScore = Object.values(scores).reduce((acc, val) => acc + val, 0);

  const handleScoreUpdate = (key, score) => {
    setScores((prev) => ({ ...prev, [key]: score }));
    setAnswered((prev) => ({ ...prev, [key]: true }));
  };

  const handleNext = () => {
    if (!answered[currentSection.key]) {
      alert("Please complete this section before proceeding.");
      return;
    }
    if (currentIndex < sections.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const allAnswered = sections.every((section) => scores[section.key] !== undefined);
    if (allAnswered) {
      setSubmitted(true);
    } else {
      alert("Please complete all sections before submitting.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(128, 0, 128); // MindMates purple
    doc.text(" The MindMates", 14, 20);

    // Tagline & date
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Empowering Youth Mental Well-being – themindmate2025.vercel.app", 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

    // Section scores
    let yOffset = 46;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    sections.forEach((section) => {
      doc.text(
        `${section.title}: ${scores[section.key]} / ${section.maxScore} – ${interpretScore(
          section.key,
          scores[section.key]
        )}`,
        14,
        yOffset
      );
      yOffset += 10;
    });

    // Total score
    doc.setTextColor(91, 55, 183);
    doc.text(`Total Score: ${totalScore}`, 14, yOffset + 10);

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Disclaimer: This is a self-assessment tool provided by The MindMates.", 14, yOffset + 25);
    doc.text("It is not intended to replace professional diagnosis or treatment.", 14, yOffset + 30);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text("© The MindMates – All rights reserved", 14, 290);

    doc.save("MindMates_Mental_Health_Report.pdf");
  };

  const handleRetake = () => {
    setScores({});
    setAnswered({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
        🧠 Take a 5-Minute Self Assessment
      </h1>

      <div className="bg-white/10 text-black border border-white/20 rounded-xl p-6 backdrop-blur-md shadow-lg">
        {!submitted ? (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                {currentSection.title} ({currentIndex + 1} of {sections.length})
              </h2>
            </div>

            <Section
              sectionKey={currentSection.key}
              title={currentSection.title}
              questions={currentSection.questions}
              scale={currentSection.scale}
              scaleLabels={currentSection.scaleLabels}
              onScore={handleScoreUpdate}
            />

            <div className="mt-6 flex justify-between">
              {currentIndex > 0 ? (
                <button
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded"
                >
                  Go Back
                </button>
              ) : (
                <span />
              )}
              {currentIndex < sections.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
                >
                  Submit
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Assessment Result</h2>
            <ul className="text-left list-disc pl-6 text-lg">
              {sections.map((section) => (
                <li key={section.key}>
                  <strong>{section.title}</strong>: {scores[section.key]} / {section.maxScore} –{" "}
                  <span className="text-blue-700 font-semibold">
                    {interpretScore(section.key, scores[section.key])}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xl font-semibold">
              <span className="text-purple-700">Total Score:</span> {totalScore}
            </p>

            <button
              onClick={handleDownloadPDF}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
            >
              Download Report as PDF
            </button>

            <button
              onClick={handleRetake}
              className="mt-2 bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-6 rounded transition"
            >
              Retake Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
