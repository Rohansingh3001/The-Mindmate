import React from 'react';

const Result = ({ scores, formStructure }) => {
  return (
    <div className="mt-8 p-6 border border-green-500 bg-white rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-green-700">📈 Your Self-Assessment Results</h2>
      
      <ul className="space-y-4">
        {Object.entries(scores).map(([key, val]) => {
          const interpretation = formStructure[key].scoring(val);
          return (
            <li key={key} className="bg-gray-50 p-4 rounded border border-gray-200 shadow-sm">
              <p className="text-lg font-medium text-gray-800">
                {formStructure[key].title}
              </p>
              <p className="text-sm mt-1">
                <strong className="text-gray-700">Score:</strong> {val} | 
                <span className="ml-2 text-blue-600 italic">{interpretation}</span>
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-sm text-red-600 bg-red-50 p-3 rounded">
        ⚠️ This is not a diagnosis. If you’re in the moderate or severe range, it’s important to consult a counselor or mental health professional.
      </p>
    </div>
  );
};

export default Result;
