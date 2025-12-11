import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const mockData = [
  { day: 'Mon', sessions: 2, mood: 7 },
  { day: 'Tue', sessions: 3, mood: 8 },
  { day: 'Wed', sessions: 1, mood: 6 },
  { day: 'Thu', sessions: 4, mood: 9 },
  { day: 'Fri', sessions: 2, mood: 7 },
  { day: 'Sat', sessions: 3, mood: 8 },
  { day: 'Sun', sessions: 2, mood: 7 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-xl shadow-lg border-2 border-purple-300">
        <p className="text-sm font-bold text-gray-900">{payload[0].payload.day}</p>
        <p className="text-xs text-purple-700 font-semibold">Sessions: {payload[0].value}</p>
        {payload[1] && <p className="text-xs text-purple-600 font-semibold">Mood: {payload[1].value}/10</p>}
      </div>
    );
  }
  return null;
};

function PatientActivitiesChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Weekly Activities</h3>
          <p className="text-sm text-gray-700 font-medium mt-1">Your wellness engagement this week</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-600"></div>
            <span className="text-gray-800 font-semibold">Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-400"></div>
            <span className="text-gray-800 font-semibold">Mood</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={mockData} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#9333ea" opacity={0.2} vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#e9d5ff', opacity: 0.5 }} />
          <Bar dataKey="sessions" fill="#9333ea" radius={[8, 8, 0, 0]} />
          <Bar dataKey="mood" fill="#a855f7" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-purple-100 rounded-xl border border-purple-200">
          <p className="text-2xl font-bold text-gray-900">17</p>
          <p className="text-xs text-gray-700 font-semibold">Total Sessions</p>
        </div>
        <div className="text-center p-3 bg-purple-100 rounded-xl border border-purple-200">
          <p className="text-2xl font-bold text-gray-900">7.4</p>
          <p className="text-xs text-gray-700 font-semibold">Avg Mood</p>
        </div>
        <div className="text-center p-3 bg-purple-100 rounded-xl border border-purple-200">
          <p className="text-2xl font-bold text-gray-900">+12%</p>
          <p className="text-xs text-gray-700 font-semibold">Improvement</p>
        </div>
      </div>
    </motion.div>
  );
}

export default PatientActivitiesChart;
