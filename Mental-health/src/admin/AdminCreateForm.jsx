import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { addDoc, setDoc, doc, collection, getDocs, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const defaultQuestion = {
  field: "",
  label: "",
  type: "text",
  required: true,
  options: []
};


const AdminCreateForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [formList, setFormList] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [loadingForms, setLoadingForms] = useState(false);
  // Fetch all forms for editing
  useEffect(() => {
    const fetchForms = async () => {
      setLoadingForms(true);
      const snap = await getDocs(collection(db, "form_templates"));
      const forms = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFormList(forms);
      setLoadingForms(false);
    };
    fetchForms();
  }, []);

  // Load selected form for editing
  useEffect(() => {
    if (!selectedFormId) return;
    const form = formList.find(f => f.id === selectedFormId);
    if (form) {
      setTitle(form.title || "");
      setDescription(form.description || "");
      setQuestions(form.questions && form.questions.length > 0 ? form.questions : [defaultQuestion]);
    }
  }, [selectedFormId, formList]);

  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;

    // Auto-generate field name
    if (key === "label") {
      updated[index].field = value.toLowerCase().replace(/\s+/g, "_").slice(0, 30);
    }

    setQuestions(updated);
  };

  const handleAddOption = (index) => {
    const updated = [...questions];
    updated[index].options.push("");
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { ...defaultQuestion, options: [] }
    ]);
  };
  const handleRemoveOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || questions.length === 0) {
      toast.error("Title and at least one question are required.");
      return;
    }

    try {
      if (selectedFormId) {
        // Update existing form
        await setDoc(doc(db, "form_templates", selectedFormId), {
          title,
          description,
          isActive: true,
          questions,
          updatedAt: Timestamp.now(),
        }, { merge: true });
        toast.success("✅ Form updated successfully!");
      } else {
        // Create new form
        await addDoc(collection(db, "form_templates"), {
          title,
          description,
          isActive: true,
          questions,
          createdAt: Timestamp.now(),
        });
        toast.success("🎉 Form saved successfully!");
      }
      setTitle("");
      setDescription("");
      setQuestions([defaultQuestion]);
      setSelectedFormId("");
    } catch (err) {
      toast.error("Failed to save form!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-purple-800 tracking-tight drop-shadow">🛠️ Create Feedback Form</h2>
        <p className="text-gray-500 text-base">Design beautiful feedback forms for your users. Edit, add, and customize questions with ease.</p>
      </div>

      {/* Form Selector for Editing */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-gradient-to-r from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-sm border border-purple-100 dark:border-gray-700">
        <div>
          <label className="font-semibold mr-2 text-purple-700">Edit Existing Form:</label>
          <select
            className="border rounded p-2 focus:ring-2 focus:ring-purple-400 bg-white dark:bg-gray-800 dark:text-white"
            value={selectedFormId}
            onChange={e => setSelectedFormId(e.target.value)}
            disabled={loadingForms || formList.length === 0}
          >
            <option value="">-- Select a form to edit --</option>
            {formList.map(f => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        </div>
        {selectedFormId && (
          <button
            type="button"
            className="text-xs text-red-500 underline font-semibold"
            onClick={() => {
              setSelectedFormId("");
              setTitle("");
              setDescription("");
              setQuestions([defaultQuestion]);
            }}
          >
            Clear Selection
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-purple-700">Form Title</label>
            <input
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-400 bg-purple-50 dark:bg-gray-900 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter form title..."
            />
          </div>
          <div>
            <label className="font-semibold text-purple-700">Form Description <span className="text-xs text-gray-400">(optional)</span></label>
            <textarea
              rows={2}
              className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-purple-400 bg-purple-50 dark:bg-gray-900 dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this form..."
            />
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="border border-purple-200 dark:border-purple-700 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm relative group transition-all">
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-lg text-purple-800 dark:text-purple-200">Question {index + 1}</label>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                  className="text-red-500 text-xs px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition"
                >
                  Remove
                </button>
              </div>

              <input
                className="w-full border rounded-lg p-3 mb-2 focus:ring-2 focus:ring-purple-400 bg-white dark:bg-gray-900 dark:text-white"
                placeholder="Question label"
                value={q.label}
                onChange={(e) => handleQuestionChange(index, "label", e.target.value)}
                required
              />
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={e => handleQuestionChange(index, "required", e.target.checked)}
                  id={`required-${index}`}
                  className="accent-purple-600 w-4 h-4"
                />
                <label htmlFor={`required-${index}`} className="text-sm text-purple-700">Mandatory</label>
              </div>

              <select
                className="w-full border p-2 rounded-lg mb-2 focus:ring-2 focus:ring-purple-400 bg-white dark:bg-gray-900 dark:text-white"
                value={q.type}
                onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
              >
                <option value="text">Short Answer</option>
                <option value="textarea">Paragraph</option>
                <option value="radio">Multiple Choice (Radio)</option>
                <option value="checkbox">Checkboxes</option>
              </select>

              {(q.type === "radio" || q.type === "checkbox") && (
                <div className="bg-purple-50 dark:bg-gray-900 p-3 rounded-lg border border-purple-100 dark:border-purple-700">
                  <p className="text-sm font-medium mb-2 text-purple-700 dark:text-purple-300">Options:</p>
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <input
                        className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:text-white"
                        value={opt}
                        onChange={(e) => handleOptionChange(index, i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index, i)}
                        className="text-red-500 text-xs px-2 py-1 border rounded hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(index)}
                    className="text-blue-600 text-xs mt-1 font-semibold hover:underline"
                  >
                    ➕ Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold shadow-lg hover:from-purple-700 hover:to-purple-600 transition text-lg"
        >
          ➕ Add Another Question
        </button>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-700 to-purple-600 text-white font-bold py-4 rounded-2xl mt-6 shadow-xl hover:from-purple-800 hover:to-purple-700 transition text-lg tracking-wide"
        >
          Save Form
        </button>
      </form>
    </div>
  );
};

export default AdminCreateForm;
