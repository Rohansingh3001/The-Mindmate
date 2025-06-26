import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { IoIosPaper, IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const FormViewer = () => {
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveForm = async () => {
      const q = query(collection(db, "form_templates"), where("isActive", "==", true));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const activeForm = snapshot.docs[0].data();
        activeForm.id = snapshot.docs[0].id;
        setForm(activeForm);
      }
      setLoading(false);
    };
    fetchActiveForm();
  }, []);

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, option) => {
    setAnswers((prev) => {
      const prevArr = prev[field] || [];
      return {
        ...prev,
        [field]: prevArr.includes(option)
          ? prevArr.filter((o) => o !== option)
          : [...prevArr, option],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    try {
      await addDoc(collection(db, "form_responses"), {
        formId: form.id,
        answers,
        timestamp: Timestamp.now(),
      });
      setSubmitted(true);
      toast.success("✅ Thank you for your feedback!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  if (loading) return <p className="text-center py-10">Loading form...</p>;

  if (!form) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto mt-20 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center"
      >
        <IoIosPaper size={48} className="text-purple-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          No Activities Right Now
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Check back soon for new reflections, feedback forms, or challenges!
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 text-purple-600 hover:underline"
        >
          <IoIosArrowBack />
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg mx-auto mt-20 bg-green-50 dark:bg-green-900 p-6 rounded-xl shadow-md"
      >
        <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
          Thank you for sharing 💚
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          You just helped make MindMates better for everyone.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 text-purple-600 hover:underline"
        >
          <IoIosArrowBack />
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-6 py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-8 mb-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-purple-600 hover:underline"
        >
          <IoIosArrowBack />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {form.title}
          </h1>
          <IoIosPaper size={24} className="text-purple-500" />
        </div>

        {form.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">{form.description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((q, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                {q.label}
              </label>

              {q.type === "text" && (
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  onChange={(e) => handleChange(q.field, e.target.value)}
                  required={q.required}
                />
              )}

              {q.type === "textarea" && (
                <textarea
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                  onChange={(e) => handleChange(q.field, e.target.value)}
                  required={q.required}
                />
              )}

              {q.type === "radio" && (
                <div className="space-y-2 mt-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={q.field}
                        value={opt}
                        onChange={() => handleChange(q.field, opt)}
                        required={q.required}
                        className="accent-purple-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "checkbox" && (
                <div className="space-y-2 mt-2">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={() => handleCheckboxChange(q.field, opt)}
                        className="accent-purple-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            Submit Feedback
          </button>
        </form>
      </motion.div>

      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 py-4">
        © {new Date().getFullYear()} MindMates — All rights reserved.
      </footer>
    </div>
  );
};

export default FormViewer;
