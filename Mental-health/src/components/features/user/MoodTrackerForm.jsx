import React, { useState } from 'react';
import { toast } from 'react-toastify';

const questions = [
  {
    id: 'mood',
    text: 'How would you rate your overall mood today?',
    type: 'scale',
    scale: [1, 10]
  },
  {
    id: 'energy',
    text: 'How energized do you feel?',
    type: 'scale',
    scale: [1, 10]
  },
  {
    id: 'sleep',
    text: 'How well did you sleep last night?',
    type: 'scale',
    scale: [1, 10]
  },
  {
    id: 'stress',
    text: 'How stressed are you feeling?',
    type: 'scale',
    scale: [1, 10]
  },
  {
    id: 'focus',
    text: 'How focused did you feel today?',
    type: 'scale',
    scale: [1, 10]
  },
  {
    id: 'positiveActivities',
    text: 'Did you engage in any positive activities today (exercise, talking to friends, hobbies)?',
    type: 'yesno'
  },
  {
    id: 'negativeThoughts',
    text: 'Did you have frequent negative thoughts?',
    type: 'yesno'
  },
  {
    id: 'journalEntry',
    text: 'Want to write anything about your day or emotions?',
    type: 'text'
  }
];

const MoodTrackerForm = ({ onSave }) => {
  const [responses, setResponses] = useState({});

  const handleChange = (id, value) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!responses.mood) {
      toast.error('Please answer the mood question');
      return;
    }

    const moodScore = calculateMoodScore(responses);

    onSave({ date: new Date().toLocaleDateString(), mood: moodScore });
    toast.success('Mood entry saved!');
    setResponses({});
  };

  const calculateMoodScore = (answers) => {
    let score = 0;
    const weights = {
      mood: 2,
      energy: 1.5,
      sleep: 1,
      stress: -1.5,
      focus: 1,
      positiveActivities: 1.5,
      negativeThoughts: -1.5
    };

    for (const key in weights) {
      if (answers[key] !== undefined && answers[key] !== '') {
        if (key === 'positiveActivities' || key === 'negativeThoughts') {
          score += (answers[key] === 'yes' ? 1 : 0) * weights[key];
        } else {
          score += Number(answers[key]) * weights[key];
        }
      }
    }

    return Math.max(1, Math.min(10, Math.round(score / 3))); // Normalize and bound score between 1–10
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md space-y-6"
    >
      <h3 className="text-xl font-semibold text-[#8f71ff]">🧠 Daily Mood Check-In</h3>

      {questions.map(q => (
        <div key={q.id} className="flex flex-col">
          <label className="mb-1 text-gray-700">{q.text}</label>
          {q.type === 'scale' && (
            <input
              type="range"
              min={q.scale[0]}
              max={q.scale[1]}
              value={responses[q.id] || 5}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="accent-[#8f71ff]"
            />
          )}
          {q.type === 'yesno' && (
            <select
              value={responses[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="border border-gray-300 p-2 rounded-lg"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          )}
          {q.type === 'text' && (
            <textarea
              value={responses[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              rows="3"
              className="border border-gray-300 p-2 rounded-lg resize-none"
              placeholder="Write here..."
            ></textarea>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-[#8f71ff] hover:bg-[#7b5fff] text-white px-6 py-2 rounded-xl"
      >
        Submit Mood
      </button>
    </form>
  );
};

export default MoodTrackerForm;

