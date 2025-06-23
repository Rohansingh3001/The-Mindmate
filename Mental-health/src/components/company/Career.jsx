import React, { useEffect, useState } from "react";
import {
  Heart,
  Rocket,
  Users,
  ArrowLeft,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Careers = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume: "",
    portfolio: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "careers"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(data);
    });
    return () => unsubscribe();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      const appsRef = collection(db, `careers/${selectedJob.id}/applications`);
      const snapshot = await getDocs(appsRef);
      const alreadyApplied = snapshot.docs.some(
        (doc) =>
          doc.data().email.toLowerCase() === formData.email.toLowerCase()
      );

      if (alreadyApplied) {
        toast.warn("You've already applied for this role with this email.");
        return;
      }

      await addDoc(appsRef, {
        ...formData,
        appliedAt: new Date().toISOString(),
      });

      toast.success("Application submitted successfully!");
      setSelectedJob(null);
      setFormData({
        name: "",
        email: "",
        resume: "",
        portfolio: "",
      });
    } catch (err) {
      console.error("Error submitting application:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-gray-800 dark:text-gray-100">
      <ToastContainer position="bottom-center" autoClose={3000} />
      
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-purple-600 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-300 mb-3">
          Join The MindMates
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Help us build the future of mental health — one conversation at a time.
        </p>
      </header>

      {/* Jobs List */}
      <section className="grid gap-8 md:grid-cols-2">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-xl shadow-sm p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                  {job.title}
                </h2>
                <span className="text-sm text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-800/30 px-3 py-1 rounded-full">
                  {job.type}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{job.description}</p>
              {job.duration && job.type === "Internship" && (
                <p className="mt-2 text-xs text-purple-500 dark:text-purple-300">
                  Duration: {job.duration}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">Deadline: {job.deadline}</p>

              <button
                onClick={() => setSelectedJob(job)}
                className="mt-4 px-4 py-2 border border-purple-600 text-purple-600 rounded-md text-sm hover:bg-purple-600 hover:text-white transition"
              >
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-600 dark:text-gray-400">
            No openings available currently. Please check back later.
          </p>
        )}
      </section>

      {/* Why Join Us */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-purple-700 dark:text-purple-300">
          Why Join Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-6 text-left mt-6">
          {[
            {
              icon: <Heart className="text-purple-500 mb-2" />,
              title: "Purpose-Driven",
              desc: "Every feature or workshop helps someone feel less alone.",
            },
            {
              icon: <Rocket className="text-purple-500 mb-2" />,
              title: "Start-Up Spirit",
              desc: "Take ownership and grow fast with a mission-led team.",
            },
            {
              icon: <Users className="text-purple-500 mb-2" />,
              title: "Inclusive Culture",
              desc: "We welcome folks of all backgrounds — just be real.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-purple-50 dark:bg-gray-700/20 p-6 rounded-xl">
              {item.icon}
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Invite */}
      <div className="text-center mt-16">
        <p className="text-lg font-medium">
          Don’t see a role that fits? Email us at{" "}
          <a
            href="mailto:careers@themindmates.in"
            className="underline text-purple-600 dark:text-purple-300"
          >
            careers@themindmates.in
          </a>{" "}
          — we’d love to hear from you.
        </p>
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">
              Apply for:{" "}
              <span className="text-purple-600">{selectedJob.title}</span>
            </h2>
            <form className="space-y-4" onSubmit={handleApply}>
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded border dark:bg-zinc-800"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded border dark:bg-zinc-800"
              />
              <input
                type="url"
                required
                placeholder="Resume Link (Google Drive, etc.)"
                value={formData.resume}
                onChange={(e) =>
                  setFormData({ ...formData, resume: e.target.value })
                }
                className="w-full px-4 py-2 rounded border dark:bg-zinc-800"
              />
              <input
                type="url"
                placeholder="Portfolio / Website (optional)"
                value={formData.portfolio}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio: e.target.value })
                }
                className="w-full px-4 py-2 rounded border dark:bg-zinc-800"
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
