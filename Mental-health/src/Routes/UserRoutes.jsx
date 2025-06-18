import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Dashboard from "../components/Dashboard";
import FullChat from "../components/FullChat";
import AssessmentForm from "../components/AssessmentForm";
import MentalHealthChart from "../components/MentalHealthChart";
import AppointmentsPage from "../components/AppointmentsPage";
import AnalysisPage from "../components/AnalysisPage";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/fullchat" element={<FullChat />} />
      <Route path="/assessment" element={<AssessmentForm />} />
      <Route path="/chart" element={<MentalHealthChart />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/analytics" element={<AnalysisPage />} />
    </Routes>
  );
}

export default UserRoutes;
