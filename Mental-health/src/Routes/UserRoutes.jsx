import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Dashboard from "../components/Dashboard";
import TopupWrapper from "../components/TopupWrapper";
import FullChatPage from "../components/FullChatPage";
import AssessmentForm from "../components/AssessmentForm";
import MentalHealthChart from "../components/MentalHealthChart";
import AppointmentsPage from "../components/AppointmentsPage";
import AnalysisPage from "../components/AnalysisPage";
import JournalsPage from "../components/JournalsPage";
import ConnectPeer from "../components/ConnectPeer";
import Settings from "../components/Settings";

// Gamification Components
import GamifiedDashboard from "../components/GamifiedDashboard";
import GamifiedJournal from "../components/GamifiedJournal";
import MentalHealthQuests from "../components/MentalHealthQuests";
import MoodGarden from "../components/MoodGarden";
import MindfulnessChallenges from "../components/MindfulnessChallenges";
import MentalHealthProgress from "../components/MentalHealthProgress";
import MentalHealthScratchCard from "../components/MentalHealthScratchCard";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/fullchat" element={<FullChatPage />} />
      <Route path="/assessment" element={<AssessmentForm />} />
      <Route path="/chart" element={<MentalHealthChart />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/analytics" element={<AnalysisPage />} />
      <Route path="/journals" element={<JournalsPage />} />
      <Route path="/connect-peer" element={<ConnectPeer />} />
      <Route path="/topup" element={<TopupWrapper />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Gamification Routes */}
      <Route path="/gamification" element={<GamifiedDashboard />} />
      <Route path="/gamified-journal" element={<GamifiedJournal />} />
      <Route path="/mental-health-quests" element={<MentalHealthQuests />} />
      <Route path="/mood-garden" element={<MoodGarden />} />
      <Route path="/mindfulness-challenges" element={<MindfulnessChallenges />} />
      <Route path="/mental-health-progress" element={<MentalHealthProgress />} />
      <Route path="/scratch-card" element={<MentalHealthScratchCard />} />
    </Routes>
  );
}

export default UserRoutes;
