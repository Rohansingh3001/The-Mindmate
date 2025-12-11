import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import MindMatesDashboard from "../pages/MindMatesDashboard";
import Dashboard from "../components/features/user/DashboardOld";
import TopupWrapper from "../components/features/user/TopupWrapper";
import FullChatPage from "../components/chat/FullChatPage";
import AssessmentForm from "../components/features/user/AssessmentForm";
import MentalHealthChart from "../components/features/gamification/MentalHealthChart";
import AppointmentsPage from "../components/features/user/AppointmentsPage";
import AnalysisPage from "../components/features/user/AnalysisPage";
import JournalsPage from "../components/features/user/JournalsPage";
import JournalViewer from "../pages/JournalViewer";
import ConnectPeer from "../components/features/peer/ConnectPeer";
import Settings from "../components/features/user/Settings";

// Gamification Components
import GamifiedDashboard from "../components/features/gamification/GamifiedDashboard";
import GamifiedJournal from "../components/features/gamification/GamifiedJournal";
import MentalHealthQuests from "../components/features/gamification/MentalHealthQuests";
import MoodGarden from "../components/features/gamification/MoodGarden";
import MindfulnessChallenges from "../components/features/gamification/MindfulnessChallenges";
import MentalHealthProgress from "../components/features/gamification/MentalHealthProgress";
import MentalHealthScratchCard from "../components/features/gamification/MentalHealthScratchCard";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MindMatesDashboard />} />
      <Route path="/dashboard" element={<MindMatesDashboard />} />
      <Route path="/old-dashboard" element={<Dashboard />} />
      <Route path="/fullchat" element={<FullChatPage />} />
      <Route path="/assessment" element={<AssessmentForm />} />
      <Route path="/chart" element={<MentalHealthChart />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/analytics" element={<AnalysisPage />} />
      <Route path="/journals" element={<JournalsPage />} />
      <Route path="/journal-viewer" element={<JournalViewer />} />
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
