import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Dashboard from "../components/Dashboard";
import TopupWrapper from "../components/TopupWrapper";
import FullChat from "../components/FullChat";
import AssessmentForm from "../components/AssessmentForm";
import MentalHealthChart from "../components/MentalHealthChart";
import AppointmentsPage from "../components/AppointmentsPage";
import AnalysisPage from "../components/AnalysisPage";
import JournalsPage from "../components/JournalsPage";
import ConnectPeer from "../components/ConnectPeer";
function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/fullchat" element={<FullChat />} />
      <Route path="/assessment" element={<AssessmentForm />} />
      <Route path="/chart" element={<MentalHealthChart />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/analytics" element={<AnalysisPage />} />
      <Route path="/journals" element={<JournalsPage />} />
      <Route path="/connect-peer" element={<ConnectPeer />} />
      <Route path="/topup" element={<TopupWrapper />} />
    </Routes>
  );
}

export default UserRoutes;
