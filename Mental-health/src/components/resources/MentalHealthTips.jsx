import React from "react";
import { Smile, Sun, Moon, BookOpen, Users } from "lucide-react";


const tips = [
  {
    icon: <Smile className="text-purple-500 w-5 h-5" />,
    title: "Talk to Someone",
    description: "You don’t have to go through it alone. Talking to a friend, family member, or counselor can really help.",
  },
  {
    icon: <Sun className="text-yellow-500 w-5 h-5" />,
    title: "Get Some Sun",
    description: "Sunlight helps your body produce serotonin — a mood stabilizer. A short walk in the sun can do wonders.",
  },
  {
    icon: <Moon className="text-blue-500 w-5 h-5" />,
    title: "Prioritize Sleep",
    description: "Good sleep is crucial for mental clarity and emotional balance. Try to keep a consistent routine.",
  },
  {
    icon: <BookOpen className="text-green-500 w-5 h-5" />,
    title: "Journal Your Thoughts",
    description: "Write out how you're feeling. It helps you reflect and release what’s on your mind.",
  },
  {
    icon: <Users className="text-pink-500 w-5 h-5" />,
    title: "Connect With Community",
    description: "Spend time with people who uplift you. Positive social connections are a huge mental health booster.",
  },
];

const MentalHealthTips = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-700 dark:text-purple-300">
        Daily Mental Health Tips
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-800 border border-purple-100 dark:border-zinc-700 rounded-xl p-5 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2 mb-3">
              {tip.icon}
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                {tip.title}
              </h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentalHealthTips;
