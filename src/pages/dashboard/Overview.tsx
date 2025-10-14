import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { TrendingUp, Target, DollarSign, Award } from "lucide-react";

export const Overview = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back to <span className="text-gradient">Trademind</span>
        </h1>
        <p className="text-muted-foreground">Here's your trading performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfitChart />
        </div>
        <div>
          <AIInsights />
        </div>
      </div>

      {/* Recent Trades */}
      <RecentTrades />
    </div>
  );
};
