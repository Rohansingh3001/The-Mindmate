import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    q: "Is The MindMates free?",
    a: "Yes! The basic version including the AI chatbot and journaling features is 100% free forever. No hidden costs.",
  },
  {
    q: "Is it confidential?",
    a: "Absolutely. Your entries and mood logs are private and secure. We only share them with therapists if YOU explicitly choose to.",
  },
  {
    q: "Can I talk to a real person?",
    a: "Yes. You can book 1:1 sessions with verified mental health professionals directly through the platform.",
  },
  {
    q: "How secure is my data?",
    a: "We use industry-standard encryption both at rest and in transit. Your data stays yours — always.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-gray-900 dark:text-gray-100">
      {/* Go Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-600 hover:underline mb-8"
      >
        <ArrowLeft size={16} /> Go Back
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-purple-700 dark:text-purple-300 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Everything you want to know about using The MindMates platform.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-5">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`transition-all duration-300 bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-700 rounded-xl shadow-sm ${
              openIndex === i ? "ring-2 ring-purple-300 dark:ring-purple-600" : ""
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center text-left text-lg font-medium px-6 py-4 text-purple-800 dark:text-purple-300"
            >
              <span>{faq.q}</span>
              {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {openIndex === i && (
              <div className="px-6 pb-4 pt-0 text-sm text-gray-700 dark:text-gray-300 transition-all duration-300">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
        Still have questions?{" "}
        <a href="/contact" className="underline text-purple-600 dark:text-purple-300">
          Contact us
        </a>{" "}
        and we’ll help you out.
      </div>
    </div>
  );
}
