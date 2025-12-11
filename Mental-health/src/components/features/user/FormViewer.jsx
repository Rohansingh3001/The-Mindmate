import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  Share2, 
  CheckCircle, 
  Star, 
  Heart, 
  Send,
  Sparkles,
  Clock,
  User,
  MessageCircle,
  ChevronRight,
  Award,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FormViewer = () => {
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
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

  const shareForm = () => {
    const url = `${window.location.origin}/form`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const progress = form ? ((currentStep + 1) / form.questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Loading your form...</h3>
          <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(147 51 234 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-lg w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-purple-200 dark:border-gray-700 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FileText className="w-10 h-10 text-purple-500" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 dark:text-white mb-3"
          >
            No Active Forms
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            There are no feedback forms or activities available right now. Check back soon for new reflections and challenges!
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-800 flex items-center justify-center p-4">
        {/* Celebration Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -10,
                opacity: 0 
              }}
              animate={{ 
                y: window.innerHeight + 10,
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2 
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-2xl w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-green-200 dark:border-green-800 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8, repeat: 3 }}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Thank You!
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-700 dark:text-gray-200 mb-3 font-medium"
          >
            Your feedback has been submitted successfully!
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            You just helped make <span className="font-bold text-purple-600">MindMates</span> better for everyone. 
            Your insights are valuable and contribute to our community's growth.
          </motion.p>

          <div className="flex items-center justify-center gap-4 mb-8">
            {[Award, Heart, Star].map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center"
              >
                <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </motion.div>
            ))}
          </div>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(147 51 234 / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-purple-200 dark:border-gray-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all shadow-lg"
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {form.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Share your thoughts and help us improve
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareForm}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Share2 size={18} />
                Share Form
              </motion.button>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Question {currentStep + 1} of {form.questions.length}
                </span>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-200 dark:border-gray-700"
            >
              {form.description && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Instructions</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{form.description}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <AnimatePresence mode="wait">
                  {form.questions.map((q, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            {q.label}
                            {q.required && (
                              <span className="text-red-500 ml-2" title="Required">*</span>
                            )}
                          </label>

                          {q.type === "text" && (
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              placeholder={q.placeholder || "Type your answer..."}
                              className="w-full p-4 border border-purple-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-lg text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg"
                              onChange={(e) => handleChange(q.field, e.target.value)}
                              required={q.required}
                            />
                          )}

                          {q.type === "textarea" && (
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                              rows="4"
                              placeholder={q.placeholder || "Share your thoughts..."}
                              className="w-full p-4 border border-purple-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-lg text-gray-800 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-lg resize-none"
                              onChange={(e) => handleChange(q.field, e.target.value)}
                              required={q.required}
                            />
                          )}

                          {q.type === "radio" && (
                            <div className="space-y-3">
                              {q.options.map((opt, optIndex) => (
                                <motion.label
                                  key={opt}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 + optIndex * 0.05 }}
                                  whileHover={{ scale: 1.02 }}
                                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all shadow-md ${
                                    answers[q.field] === opt
                                      ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-2 border-purple-500"
                                      : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-lg border border-purple-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={q.field}
                                    value={opt}
                                    onChange={() => handleChange(q.field, opt)}
                                    required={q.required}
                                    className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                                  />
                                  <span className="text-gray-800 dark:text-white font-medium flex-1">{opt}</span>
                                  {answers[q.field] === opt && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center"
                                    >
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </motion.div>
                                  )}
                                </motion.label>
                              ))}
                            </div>
                          )}

                          {q.type === "checkbox" && (
                            <div className="space-y-3">
                              {q.options.map((opt, optIndex) => (
                                <motion.label
                                  key={opt}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 + optIndex * 0.05 }}
                                  whileHover={{ scale: 1.02 }}
                                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all shadow-md ${
                                    answers[q.field]?.includes(opt)
                                      ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-2 border-purple-500"
                                      : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-lg border border-purple-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    value={opt}
                                    onChange={() => handleCheckboxChange(q.field, opt)}
                                    className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                                  />
                                  <span className="text-gray-800 dark:text-white font-medium flex-1">{opt}</span>
                                  {answers[q.field]?.includes(opt) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center"
                                    >
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </motion.div>
                                  )}
                                </motion.label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 border-t border-purple-200 dark:border-gray-700"
                >
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all text-lg"
                  >
                    <Send className="w-5 h-5" />
                    Submit Feedback
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-purple-500" />
            © {new Date().getFullYear()} MindMates — Building better mental health together
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default FormViewer;
