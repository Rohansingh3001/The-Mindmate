const JOURNAL_KEY = "mindmates.journals";

export const getJournals = () => {
  try {
    const stored = localStorage.getItem(JOURNAL_KEY);
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
    date: new Date().toLocaleDateString(), // You can customize format here
  };
  localStorage.setItem(JOURNAL_KEY, JSON.stringify([...journals, newJournal]));
};
