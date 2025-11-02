import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { ArrowLeft, Moon, Sun, Pencil, Trash2, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { useTheme } from "../context/ThemeContext";

const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [entry, setEntry] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const auth = getAuth();

  // Load user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch journals for this user
  useEffect(() => {
    if (user) fetchJournals();
  }, [user]);

  const fetchJournals = async () => {
    const q = query(
      collection(db, "journals"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJournals(list);
  };

  const handleSave = async () => {
    if (!entry.trim()) return;
    await addDoc(collection(db, "journals"), {
      uid: user.uid,
      entry: entry.trim(),
      timestamp: serverTimestamp(),
    });
    setEntry("");
    fetchJournals();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this journal entry?")) {
      await deleteDoc(doc(db, "journals", id));
      fetchJournals();
    }
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    await updateDoc(doc(db, "journals", id), {
      entry: editText.trim(),
    });
    setEditingId(null);
    setEditText("");
    fetchJournals();
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xl">📓</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Journal Entries
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" /> : <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
            </button>
            <Link
              to="/user"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Write new journal */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <CardContent className="space-y-3">
            <Textarea
              rows={4}
              placeholder="Write about your day..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
            <Button
              onClick={handleSave}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition w-full rounded-lg py-2"
            >
              Save Journal Entry
            </Button>
          </CardContent>
        </Card>

        {/* Display saved journals */}
        {journals.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm italic text-center mt-6">
            No journal entries yet.
          </p>
        ) : (
          journals.map((journal) => (
            <Card
              key={journal.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <CardContent className="space-y-2">
                {editingId === journal.id ? (
                  <>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(journal.id)}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm italic text-slate-800 dark:text-slate-200">"{journal.entry}"</p>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(journal.timestamp?.toDate?.()).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(journal.id);
                            setEditText(journal.entry);
                          }}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(journal.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalsPage;
