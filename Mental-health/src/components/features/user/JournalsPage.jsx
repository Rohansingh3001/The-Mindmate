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
import { db } from "../../../firebase";
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  BookOpen, 
  Calendar,
  Sparkles,
  Save,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

const JournalsPage = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [entry, setEntry] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
    try {
      await addDoc(collection(db, "journals"), {
        uid: user.uid,
        entry: entry.trim(),
        timestamp: serverTimestamp(),
      });
      setEntry("");
      setIsWriting(false);
      await fetchJournals();
    } catch (error) {
      console.error("Error saving journal:", error);
    } finally {
      setSaving(false);
    }
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

  // Filter journals based on search
  const filteredJournals = journals.filter(journal => 
    journal.entry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindmate-50 via-white to-lavender-100/50 flex flex-col">
      <div className="flex flex-1">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg border-b border-purple-200 sticky top-0 z-10 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/user/dashboard')}
                    className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-purple-600" />
                  </motion.button>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        My Journals
                      </h1>
                      <p className="text-sm text-gray-600">
                        {journals.length} {journals.length === 1 ? 'entry' : 'entries'}
                      </p>
                    </div>
                  </div>
                </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-purple-100 dark:bg-slate-800 hover:bg-purple-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === "dark" ? 
                  <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" /> : 
                  <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                }
              </motion.button>
              
              {!isWriting && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsWriting(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  New Entry
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Write/Search */}
          <div className="lg:col-span-1 space-y-6">
            {/* Write New Journal */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-purple-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isWriting ? 'Write Entry' : 'Quick Write'}
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {isWriting ? (
                  <motion.div
                    key="writing"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <textarea
                      value={entry}
                      onChange={(e) => setEntry(e.target.value)}
                      placeholder="What's on your mind today? 💭"
                      rows={8}
                      className="w-full px-4 py-3 rounded-2xl bg-purple-50 dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-700 focus:border-purple-400 dark:focus:border-purple-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none transition-all"
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={!entry.trim() || saving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Entry'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsWriting(false);
                          setEntry("");
                        }}
                        className="px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsWriting(true)}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-purple-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-medium"
                  >
                    Click to start writing...
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-purple-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Search</h2>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your journals..."
                className="w-full px-4 py-3 rounded-2xl bg-purple-50 dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-700 focus:border-purple-400 dark:focus:border-purple-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 shadow-xl text-white"
            >
              <h3 className="text-sm font-semibold opacity-90 mb-2">Total Words Written</h3>
              <p className="text-3xl font-bold">
                {journals.reduce((total, j) => total + j.entry.split(' ').length, 0).toLocaleString()}
              </p>
              <p className="text-sm opacity-80 mt-1">Keep expressing yourself! ✨</p>
            </motion.div>
          </div>

          {/* Right Column - Journal Entries */}
          <div className="lg:col-span-2 space-y-4">
            {filteredJournals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-xl border border-purple-200 dark:border-slate-700 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? 'No matching entries' : 'No journal entries yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm ? 'Try a different search term' : 'Start your journaling journey today!'}
                </p>
                {!searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsWriting(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Write Your First Entry
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredJournals.map((journal, index) => (
                  <motion.div
                    key={journal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-purple-200 dark:border-slate-700 hover:shadow-2xl transition-all"
                  >
                    {editingId === journal.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={6}
                          className="w-full px-4 py-3 rounded-2xl bg-purple-50 dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-700 focus:border-purple-400 dark:focus:border-purple-500 outline-none text-gray-900 dark:text-white resize-none"
                        />
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleEdit(journal.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg"
                          >
                            <Check className="w-4 h-4" />
                            Save Changes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingId(null);
                              setEditText("");
                            }}
                            className="px-4 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {journal.timestamp?.toDate?.() ? 
                                  new Date(journal.timestamp.toDate()).toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  }) : 
                                  'Recent'
                                }
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {journal.entry.split(' ').length} words
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setEditingId(journal.id);
                                setEditText(journal.entry);
                              }}
                              className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(journal.id)}
                              className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="prose prose-purple dark:prose-invert max-w-none">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {journal.entry}
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      {!isWriting && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsWriting(true)}
          className="sm:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      )}
        </div>
      </div>
    </div>
  );
};

export default JournalsPage;
