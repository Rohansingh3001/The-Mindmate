import React, { useState } from 'react';

const moods = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😴', label: 'Tired' }
];

function MoodTracker() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="p-4 max-w-xl mx-auto my-6 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">How are you feeling today?</h3>
      <div className="flex justify-around">
        {moods.map((mood, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(mood)}
            className={`text-3xl transition-transform ${selected?.label === mood.label ? 'scale-125' : 'hover:scale-110'}`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      {selected && (
        <p className="mt-4 text-center text-lg">You feel <strong>{selected.label}</strong> today.</p>
      )}
    </section>
  );
}

export default MoodTracker;
