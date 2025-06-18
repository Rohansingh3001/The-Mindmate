// utils/storage.js

const STORAGE_KEYS = {
  MOOD: "mindmates.mood",
  MOOD_LOGS: "mindmates.moodLogs",
  APPOINTMENTS: "mindmates.appointments",
  JOURNALS: "mindmates.journals",
  PREFERENCES: "mindmates.preferences",
};

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

export default STORAGE_KEYS;
