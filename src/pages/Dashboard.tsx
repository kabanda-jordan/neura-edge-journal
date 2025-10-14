import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { TrendingUp, Target, DollarSign, Award } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">Trader</span>
          </h1>
          <p className="text-muted-foreground">Here's your trading performance overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Profit"
            value="$12,847"
            change="+23.5%"
            icon={DollarSign}
            positive={true}
          />
          <StatsCard
            title="Win Rate"
            value="67.8%"
            change="+5.2%"
            icon={Target}
            positive={true}
          />
          <StatsCard
            title="Total Trades"
            value="142"
            change="+18"
            icon={TrendingUp}
            positive={true}
          />
          <StatsCard
            title="Best Streak"
            value="8 Wins"
            change="New Record!"
            icon={Award}
            positive={true}
          />
        </div>

        {/* Charts and Insights */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProfitChart />
          </div>
          <div>
            <AIInsights />
          </div>
        </div>

        {/* Recent Trades */}
        <RecentTrades />
      </main>
    </div>
  );
};

export default Dashboard;
