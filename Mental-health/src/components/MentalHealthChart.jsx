// components/MentalHealthChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MentalHealthChart = ({ moodData }) => {
  const data = {
    labels: moodData.map(entry => entry.date),
    datasets: [
      {
        label: 'Mood Level (1 - 10)',
        data: moodData.map(entry => entry.mood),
        borderColor: '#8f71ff',
        backgroundColor: '#c6b8ff88',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Mental Health Projection (Mood Over Time)',
        color: '#8f71ff',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 1 },
        title: {
          display: true,
          text: 'Mood Level',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MentalHealthChart;
