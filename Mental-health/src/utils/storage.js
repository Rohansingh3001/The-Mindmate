// utils/storage.js

const STORAGE_KEYS = {
  JOURNALS: "mindmates.journals",
  MOOD: "mindmates.mood",
  MOOD_LOGS: "mindmates.moodLogs",
  APPOINTMENTS: "mindmates.appointments",
  PREFERENCES: "mindmates.preferences",
};

// Generic Helpers
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Save error:", err);
  }
};

export const getFromStorage = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (err) {
    console.error("Read error:", err);
    return fallback;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Remove error:", err);
  }
};

// 📘 Journal Helpers
export const getJournals = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse journals from localStorage", e);
    return [];
  }
};

export const saveJournal = (entry) => {
  const journals = getJournals();
  const newJournal = {
    entry,
    date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
  try {
    localStorage.setItem(
      STORAGE_KEYS.JOURNALS,
      JSON.stringify([...journals, newJournal])
    );
  } catch (e) {
    console.error("Failed to save journal", e);
  }
};

export default STORAGE_KEYS;
