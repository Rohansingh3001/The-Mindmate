import { useNavigate } from "react-router-dom";

export default function AppointmentsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#1a0f40] via-[#1d123f] to-[#0d071e] text-white">
      <button
        className="mb-6 text-purple-300 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-4">Your Appointments</h1>
      <p className="text-gray-300">Manage or book your therapy and counseling sessions here.</p>
    </div>
  );
}
