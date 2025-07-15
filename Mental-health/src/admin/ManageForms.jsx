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

import { deleteDoc } from "firebase/firestore";

const ManageForms = () => {
  const [forms, setForms] = useState([]);
  const [expandedFormId, setExpandedFormId] = useState(null);
  const [responses, setResponses] = useState({}); // { [formId]: [responses] }

  const deleteForm = async (formId) => {
    try {
      await deleteDoc(doc(db, "form_templates", formId));
      toast.success("Form deleted!");
      setForms(prev => prev.filter(f => f.id !== formId));
    } catch (e) {
      toast.error("Error deleting form!");
    }
  };

  useEffect(() => {
    const fetchForms = async () => {
      const snap = await getDocs(collection(db, "form_templates"));
      const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setForms(data);
    };
    fetchForms();
  }, []);

  // Fetch responses for a form when expanded
  const handleExpand = async (formId) => {
    setExpandedFormId(expandedFormId === formId ? null : formId);
    if (expandedFormId !== formId && !responses[formId]) {
      try {
        const q = query(collection(db, "form_responses"), where("formId", "==", formId));
        const snap = await getDocs(q);
        setResponses(prev => ({ ...prev, [formId]: snap.docs.map(doc => doc.data()) }));
      } catch (err) {
        toast.error("Failed to fetch responses");
      }
    }
  };

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
          className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg mb-4"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => handleExpand(form.id)}
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
                onClick={e => { e.stopPropagation(); toggleActive(form.id, form.isActive); }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
              >
                {form.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={e => { e.stopPropagation(); downloadCSV(form.id); }}
                className="text-purple-600 hover:text-purple-800"
              >
                <FaDownload size={18} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); deleteForm(form.id); }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
          {/* Expanded: show questions and responses */}
          {expandedFormId === form.id && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2 text-purple-700">Questions</h4>
              <ol className="list-decimal ml-6 space-y-1">
                {form.questions && form.questions.length > 0 ? (
                  form.questions.map((q, i) => (
                    <li key={i} className="text-gray-800 dark:text-gray-100">
                      {q.label} {q.required && <span className="text-red-500" title="Mandatory">*</span>}
                      {q.type === 'radio' || q.type === 'checkbox' ? (
                        <span className="ml-2 text-xs text-gray-500">[{q.type === 'radio' ? 'Options' : 'Checkboxes'}: {q.options?.join(', ')}]</span>
                      ) : null}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No questions found.</li>
                )}
              </ol>
              <h4 className="font-semibold mt-6 mb-2 text-purple-700">Responses</h4>
              {responses[form.id] && responses[form.id].length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-xs">
                    <thead>
                      <tr>
                        {form.questions.map((q, i) => (
                          <th key={i} className="border px-2 py-1 bg-gray-100 dark:bg-gray-700">{q.label}</th>
                        ))}
                        <th className="border px-2 py-1 bg-gray-100 dark:bg-gray-700">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses[form.id].map((resp, idx) => (
                        <tr key={idx}>
                          {form.questions.map((q, i) => (
                            <td key={i} className="border px-2 py-1">
                              {Array.isArray(resp.answers[q.field])
                                ? resp.answers[q.field].join(', ')
                                : resp.answers[q.field] || "-"}
                            </td>
                          ))}
                          <td className="border px-2 py-1">{resp.timestamp?.toDate?.().toLocaleString?.() || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No responses yet.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageForms;
