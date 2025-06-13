import React, { useState } from "react";
import Section from "./Section";
import jsPDF from "jspdf";
import "jspdf-autotable";

const sections = [
  {
    key: "phq9",
    title: "Depression – PHQ-9",
    maxScore: 27,
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure",
      "Trouble concentrating on things",
      "Moving or speaking so slowly people notice or being fidgety",
      "Thoughts that you would be better off dead or hurting yourself"
    ],
    scale: [0, 1, 2, 3],
    scaleLabels: {
      0: "Not at all",
      1: "Several days",
      2: "More than half the days",
      3: "Nearly every day"
    }
  },
  {
    key: "anxiety",
    title: "Anxiety – GAD-7",
    maxScore: 21,
    questions: [
      "Feeling nervous, anxious or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it’s hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen"
    ],
    scale: [0, 1, 2, 3],
    scaleLabels: {
      0: "Not at all",
      1: "Several days",
      2: "More than half the days",
      3: "Nearly every day"
    }
  },
  {
    key: "stress",
    title: "Stress Assessment",
    maxScore: 21,
    questions: [
      "I find it hard to wind down",
      "I tend to over-react to situations",
      "I feel that I am using a lot of nervous energy",
      "I find myself getting agitated",
      "I find it difficult to relax",
      "I feel intolerant of interruptions",
      "I feel that life is meaningless"
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
    doc.setFontSize(18);
    doc.text("Mental Health Assessment Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.setFontSize(14);
    sections.forEach((section, index) => {
      const y = 40 + index * 20;
      doc.text(
        `${section.title}: ${scores[section.key]} / ${section.maxScore} – ${interpretScore(section.key, scores[section.key])}`,
        14,
        y
      );
    });

    doc.setFontSize(14);
    doc.setTextColor(91, 55, 183);
    doc.text(`Total Score: ${totalScore}`, 14, 40 + sections.length * 20);

    doc.save("Mental_Health_Report.pdf");
  };

  const handleRetake = () => {
    setScores({});
    setAnswered({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/10 text-black border border-white/20 rounded-xl p-6 backdrop-blur-md shadow-lg">
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
  );
}
