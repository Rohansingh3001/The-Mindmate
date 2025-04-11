import React, { useEffect, useState } from 'react';

function ESPDashboard() {
  const [data, setData] = useState({
    heartRate: 72,
    temperature: 36.5
  });

  useEffect(() => {
    // Simulate sensor update
    const interval = setInterval(() => {
      setData({
        heartRate: Math.floor(60 + Math.random() * 20),
        temperature: parseFloat((36 + Math.random()).toFixed(1))
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="p-4 max-w-xl mx-auto my-6 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">ESP32 Health Monitor</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-500">Heart Rate</p>
          <p className="text-2xl font-bold">{data.heartRate} bpm</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-gray-500">Body Temp</p>
          <p className="text-2xl font-bold">{data.temperature} °C</p>
        </div>
      </div>
    </section>
  );
}

export default ESPDashboard;
