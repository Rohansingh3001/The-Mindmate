import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value="1,342" />
        <StatCard label="Sessions Today" value="42" />
        <StatCard label="Avg Mood Score" value="68%" />
        <StatCard label="Flagged Users" value="2" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
    <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
    <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">{value}</h3>
  </div>
);

export default Dashboard;
