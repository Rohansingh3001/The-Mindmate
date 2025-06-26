import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";

const ManageForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      const snap = await getDocs(collection(db, "form_templates"));
      const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setForms(data);
    };
    fetchForms();
  }, []);

  const toggleActive = async (formId, current) => {
    try {
      const ref = doc(db, "form_templates", formId);
      await updateDoc(ref, { isActive: !current });
      toast.success("Form status updated!");
      setForms(prev =>
        prev.map(f => f.id === formId ? { ...f, isActive: !current } : f)
      );
    } catch (e) {
      toast.error("Error updating form!");
    }
  };

  const downloadCSV = async (formId) => {
    try {
      const q = query(collection(db, "form_responses"), where("formId", "==", formId));
      const snap = await getDocs(q);
      const rows = snap.docs.map(doc => doc.data());

      const csvData = rows.map(r => ({
        ...r.answers,
        timestamp: r.timestamp?.toDate().toLocaleString()
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form-${formId}-responses.csv`;
      a.click();
    } catch (err) {
      toast.error("Failed to download responses.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Manage Feedback Forms</h2>
      {forms.map((form) => (
        <div
          key={form.id}
          className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg mb-4 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{form.title}</h3>
            <p className="text-sm text-gray-500">{form.description}</p>
            <p className={`mt-1 text-sm font-medium ${form.isActive ? "text-green-600" : "text-red-500"}`}>
              {form.isActive ? "Active" : "Inactive"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleActive(form.id, form.isActive)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
            >
              {form.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => downloadCSV(form.id)}
              className="text-purple-600 hover:text-purple-800"
            >
              <FaDownload size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageForms;
