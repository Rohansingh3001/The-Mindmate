import React, { useEffect, useState, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

export default function Schools() {
  const [hasAccess, setHasAccess] = useState(() => localStorage.getItem("schools_access") === "true");
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [adminPassword, setAdminPassword] = useState("");
  const inputRefs = useRef([]);

  const [schools, setSchools] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editSchool, setEditSchool] = useState(null);

  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    students: "",
    lastWorkshop: "",
    feedbackScore: "",
  });

  useEffect(() => {
    if (hasAccess) fetchSchools();
  }, [hasAccess]);

  const checkCode = () => {
    const fullCode = codeDigits.join("");
    const validPassword = adminPassword === "mindmates@admin";

    if (fullCode === "066066" && validPassword) {
      localStorage.setItem("schools_access", "true");
      setHasAccess(true);
    } else {
      alert("Incorrect code or password. Please try again.");
      setCodeDigits(["", "", "", "", "", ""]);
      setAdminPassword("");
      inputRefs.current[0]?.focus();
    }
  };

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fetchSchools = async () => {
    const snapshot = await getDocs(collection(db, "schools"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSchools(data);
  };

  const formatDate = (date) => {
    try {
      if (date instanceof Timestamp) date = date.toDate();
      else if (typeof date === "object" && date.seconds)
        date = new Timestamp(date.seconds, date.nanoseconds).toDate();
      return format(new Date(date), "MMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const handleExportCSV = () => {
    const headers = ["School Name", "Students Reached", "Last Workshop", "Feedback Score"];
    const rows = filteredSchools.map((s) => [
      s.name,
      s.students || "-",
      s.lastWorkshop ? formatDate(s.lastWorkshop) : "-",
      s.feedbackScore || "-"
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schools.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        students: Number(formData.students),
        lastWorkshop: formData.lastWorkshop,
        feedbackScore: Number(formData.feedbackScore),
      };

      if (editSchool) {
        await updateDoc(doc(db, "schools", editSchool.id), data);
      } else {
        await addDoc(collection(db, "schools"), data);
      }

      fetchSchools();
      resetForm();
    } catch (error) {
      alert("Error saving school: " + error.message);
    }
  };

  const handleDelete = async (schoolId) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      await deleteDoc(doc(db, "schools", schoolId));
      fetchSchools();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", students: "", lastWorkshop: "", feedbackScore: "" });
    setShowForm(false);
    setEditSchool(null);
  };

  const filteredSchools = schools
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "students") return (b.students || 0) - (a.students || 0);
      if (sortBy === "score") return (b.feedbackScore || 0) - (a.feedbackScore || 0);
      if (sortBy === "latest") return new Date(b.lastWorkshop) - new Date(a.lastWorkshop);
      return 0;
    });

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="bg-white dark:bg-zinc-900 border border-purple-300 dark:border-zinc-700 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-6">
          <h2 className="text-xl font-bold text-center text-zinc-800 dark:text-white">
            Admin Access Required
          </h2>
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">
            Enter your 6-digit access code & admin password
          </p>
          <div className="flex justify-center gap-2">
            {codeDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleBackspace(idx, e)}
                className="w-10 h-12 text-2xl text-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-zinc-800 dark:text-white"
          />
          <button
            onClick={checkCode}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-1">
            Schools & Workshops
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Educational partnerships
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm bg-zinc-900 dark:bg-zinc-700 text-white px-3 py-2 rounded-lg hover:bg-zinc-800"
          >
            <PlusCircle size={16} /> Add
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 text-sm border border-zinc-300 dark:border-zinc-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search schools..."
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:bg-zinc-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm dark:bg-zinc-700 dark:text-white"
          >
            <option value="latest">Latest</option>
            <option value="score">Score</option>
            <option value="students">Students</option>
          </select>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-700">
              <tr className="text-left text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                <th className="px-6 py-3">School Name</th>
                <th className="px-6 py-3">Students Reached</th>
                <th className="px-6 py-3">Last Workshop</th>
                <th className="px-6 py-3">Feedback Score</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedSchools.length > 0 ? (
                paginatedSchools.map((school) => (
                  <tr
                    key={school.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                      {school.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{school.students || "—"}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {school.lastWorkshop ? formatDate(school.lastWorkshop) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        school.feedbackScore >= 4.5 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : school.feedbackScore >= 3.5
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {school.feedbackScore ? `${school.feedbackScore} / 5` : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditSchool(school);
                            setFormData({
                              name: school.name,
                              students: school.students,
                              lastWorkshop: school.lastWorkshop,
                              feedbackScore: school.feedbackScore,
                            });
                            setShowForm(true);
                          }}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(school.id)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No schools found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page <strong className="text-purple-600 dark:text-purple-400">{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-gray-300"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-md relative border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              {editSchool ? "Edit School" : "Add School"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  placeholder="Enter school name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Students Reached
                </label>
                <input
                  type="number"
                  placeholder="Number of students"
                  value={formData.students}
                  onChange={(e) =>
                    setFormData({ ...formData, students: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Workshop Date
                </label>
                <input
                  type="date"
                  value={formData.lastWorkshop}
                  onChange={(e) =>
                    setFormData({ ...formData, lastWorkshop: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Feedback Score (0-5)
                </label>
                <input
                  type="number"
                  placeholder="Rating out of 5"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.feedbackScore}
                  onChange={(e) =>
                    setFormData({ ...formData, feedbackScore: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors shadow-md mt-6"
              >
                {editSchool ? "Update School" : "Add School"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
