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
  const { darkMode, toggleTheme } = useTheme();

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
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            My Journal Entries
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/user"
              className="flex items-center text-sm text-purple-600 hover:underline dark:text-purple-400"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Write new journal */}
        <Card className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-4 rounded-xl">
          <CardContent className="space-y-3">
            <Textarea
              rows={4}
              placeholder="Write about your day..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full text-sm"
            />
            <Button
              onClick={handleSave}
              className="bg-purple-600 text-white hover:bg-purple-700 transition w-full"
            >
              Save Journal Entry
            </Button>
          </CardContent>
        </Card>

        {/* Display saved journals */}
        {journals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center mt-6">
            No journal entries yet.
          </p>
        ) : (
          journals.map((journal) => (
            <Card
              key={journal.id}
              className="bg-white dark:bg-gray-800 border border-purple-300 dark:border-gray-600 p-4 rounded-xl transition hover:shadow-md"
            >
              <CardContent className="space-y-2">
                {editingId === journal.id ? (
                  <>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(journal.id)}
                        className="bg-green-600 text-white hover:bg-green-700"
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
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm italic text-gray-800 dark:text-gray-200">"{journal.entry}"</p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(journal.timestamp?.toDate?.()).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(journal.id);
                            setEditText(journal.entry);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(journal.id)}
                          className="text-red-600 hover:text-red-800"
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
