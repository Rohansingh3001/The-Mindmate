import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Briefcase, MapPin, Clock, FileText, Link2, ChevronDown, ChevronUp } from "lucide-react";

const roleOptions = [
  "Software Engineer",
  "UI/UX Designer",
  "Content Writer",
  "Marketing Intern",
  "Counseling Assistant",
  "Community Manager",
];

const typeOptions = ["Internship", "Full-time", "Part-time", "Volunteer"];
const durationOptions = ["1 Month", "3 Months", "6 Months"];

export default function AdminCareer() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "",
    duration: "",
    description: "",
    deadline: "",
  });
  const [editId, setEditId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "careers"), async (snapshot) => {
      const jobsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);

      // Fetch applications count for each job
      const appsData = {};
      for (let job of jobsData) {
        const appsSnap = await getDocs(collection(db, "careers", job.id, "applications"));
        appsData[job.id] = appsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      setApplications(appsData);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title, location, type, description, deadline } = form;
    if (!title || !location || !type || !description || !deadline) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "careers", editId), form);
        alert("Career opportunity updated successfully.");
        setEditId(null);
      } else {
        await addDoc(collection(db, "careers"), form);
        alert("New career opportunity posted.");
      }
      setForm({
        title: "",
        location: "",
        type: "",
        duration: "",
        description: "",
        deadline: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save the career opportunity.");
    }
  };

  const handleEdit = (job) => {
    setForm(job);
    setEditId(job.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await deleteDoc(doc(db, "careers", id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 min-h-screen rounded-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-300">
        {editId ? "Edit Career Opportunity" : "Post a New Career Opportunity"}
      </h2>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mb-12">
        <select
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:text-white"
        >
          <option value="">Select Role *</option>
          {roleOptions.map((role, i) => (
            <option key={i} value={role}>
              {role}
            </option>
          ))}
        </select>

        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (e.g., Remote) *"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:text-white"
        >
          <option value="">Select Type *</option>
          {typeOptions.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>

        {form.type === "Internship" && (
          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border dark:bg-zinc-800 dark:text-white"
          >
            <option value="">Select Duration *</option>
            {durationOptions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}

        <Input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          placeholder="Application Deadline *"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Role Description *"
          className="col-span-2 p-3 border rounded-md dark:bg-zinc-800 dark:text-white h-28"
        />

        <div className="col-span-2">
          <Button onClick={handleSubmit} className="w-full">
            {editId ? "Update Opportunity" : "Post Opportunity"}
          </Button>
        </div>
      </div>

      {/* Posted Jobs */}
      <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-300 mb-4">
        Posted Openings
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow hover:shadow-lg transition-all border dark:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="text-purple-500" size={18} />
                {job.title}
              </h4>
              <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full">
                {job.type}
              </span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{job.description}</p>

            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> Deadline: {job.deadline}
              </span>
            </div>

            {job.type === "Internship" && job.duration && (
              <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Duration: {job.duration}
              </div>
            )}

            {/* Application Count & Toggle */}
            <div className="text-sm mt-4 flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">
                {applications[job.id]?.length || 0} application
                {applications[job.id]?.length !== 1 ? "s" : ""}
              </span>
              <button
                className="text-purple-600 hover:underline flex items-center gap-1"
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
              >
                {expandedJob === job.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{" "}
                View Applications
              </button>
            </div>

            {/* Applications List */}
            {expandedJob === job.id && (
              <ul className="mt-4 border-t pt-3 space-y-3">
                {applications[job.id]?.map((app) => (
                  <li key={app.id} className="text-sm border-b pb-2">
                    <p>
                      <strong>{app.name}</strong> — {app.email}
                    </p>
                    <div className="flex gap-4 text-xs mt-1">
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FileText size={14} /> Resume
                      </a>
                      {app.portfolio && (
                        <a
                          href={app.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline flex items-center gap-1"
                        >
                          <Link2 size={14} /> Portfolio
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Admin Controls */}
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => handleEdit(job)}>
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(job.id)}
                className="text-red-600 border-red-400 hover:bg-red-100 dark:hover:bg-red-800"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
