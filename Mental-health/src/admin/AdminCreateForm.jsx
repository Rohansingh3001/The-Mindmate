import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
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
      await addDoc(collection(db, "form_templates"), {
        title,
        description,
        isActive: true,
        questions,
        createdAt: Timestamp.now()
      });
      toast.success("🎉 Form saved successfully!");
      setTitle("");
      setDescription("");
      setQuestions([defaultQuestion]);
    } catch (err) {
      toast.error("Failed to save form!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">🛠️ Create Feedback Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-semibold">Form Title</label>
          <input
            className="w-full border rounded p-2 mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Form Description (optional)</label>
          <textarea
            rows={3}
            className="w-full border rounded p-2 mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold">Question {index + 1}</label>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>

            <input
              className="w-full border rounded p-2 mb-2"
              placeholder="Question label"
              value={q.label}
              onChange={(e) => handleQuestionChange(index, "label", e.target.value)}
              required
            />

            <select
              className="w-full border p-2 mb-2"
              value={q.type}
              onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
            >
              <option value="text">Short Answer</option>
              <option value="textarea">Paragraph</option>
              <option value="radio">Multiple Choice (Radio)</option>
              <option value="checkbox">Checkboxes</option>
            </select>

            {(q.type === "radio" || q.type === "checkbox") && (
              <>
                <p className="text-sm font-medium mb-1">Options:</p>
                {q.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <input
                      className="w-full border rounded p-1"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index, i)}
                      className="text-red-500 text-xs px-2 py-1 border rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(index)}
                  className="text-blue-600 text-sm mt-1"
                >
                  ➕ Add Option
                </button>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="text-purple-700 underline"
        >
          ➕ Add Another Question
        </button>

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-3 rounded mt-4 hover:bg-purple-800"
        >
          Save Form
        </button>
      </form>
    </div>
  );
};

export default AdminCreateForm;
