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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Partner Schools & Workshops
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <PlusCircle size={16} /> Add School
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 text-sm bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search schools..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="text-sm flex items-center gap-2">
          <label className="font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="latest">Latest Workshop</option>
            <option value="score">Feedback Score</option>
            <option value="students">Students Reached</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700 shadow-md">
        <table className="min-w-full bg-white dark:bg-zinc-900 text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr className="text-left text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
              <th className="px-4 py-3">School Name</th>
              <th className="px-4 py-3">Students Reached</th>
              <th className="px-4 py-3">Last Workshop</th>
              <th className="px-4 py-3">Feedback Score</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSchools.length > 0 ? (
              paginatedSchools.map((school) => (
                <tr
                  key={school.id}
                  className="border-b dark:border-zinc-700 hover:bg-purple-50 dark:hover:bg-zinc-800 transition"
                >
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-white">
                    {school.name}
                  </td>
                  <td className="px-4 py-3">{school.students || "—"}</td>
                  <td className="px-4 py-3">
                    {school.lastWorkshop ? formatDate(school.lastWorkshop) : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    <span
                      className={
                        school.feedbackScore >= 4
                          ? "text-green-600"
                          : school.feedbackScore >= 3
                          ? "text-yellow-500"
                          : "text-red-500"
                      }
                    >
                      {school.feedbackScore ? `${school.feedbackScore} / 5` : "--"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
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
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(school.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No school data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 rounded border text-sm flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-sm">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 rounded border text-sm flex items-center gap-1 disabled:opacity-50"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative dark:bg-zinc-900 dark:text-white">
            <button
              onClick={resetForm}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editSchool ? "Edit School" : "Add School"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="School Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Students Reached"
                value={formData.students}
                onChange={(e) =>
                  setFormData({ ...formData, students: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="date"
                placeholder="Last Workshop"
                value={formData.lastWorkshop}
                onChange={(e) =>
                  setFormData({ ...formData, lastWorkshop: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Feedback Score"
                min="0"
                max="5"
                value={formData.feedbackScore}
                onChange={(e) =>
                  setFormData({ ...formData, feedbackScore: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
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
