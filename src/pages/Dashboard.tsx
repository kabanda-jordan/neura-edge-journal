import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Overview } from "./dashboard/Overview";
import { Journal } from "./dashboard/Journal";
import { Analytics } from "./dashboard/Analytics";
import { Performance } from "./dashboard/Performance";
import { Playbooks } from "./dashboard/Playbooks";
import { Insights } from "./dashboard/Insights";
import { Goals } from "./dashboard/Goals";
import { Learning } from "./dashboard/Learning";
import { Profile } from "./dashboard/Profile";
import { Settings } from "./dashboard/Settings";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardSidebar />
      
      <main className="lg:ml-64 pt-24 pb-12 px-4 sm:px-6 md:px-8">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/playbooks" element={<Playbooks />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
