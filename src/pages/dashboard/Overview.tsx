import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { TrendingUp, Target, DollarSign, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Overview = () => {
  const [stats, setStats] = useState({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (trades) {
        const closedTrades = trades.filter(t => t.status === 'closed');
        const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
        const winningTrades = closedTrades.filter(t => (t.profit_loss || 0) > 0);
        const winRate = closedTrades.length > 0 
          ? (winningTrades.length / closedTrades.length) * 100 
          : 0;

        // Calculate best streak
        let currentStreak = 0;
        let bestStreak = 0;
        closedTrades.forEach(trade => {
          if ((trade.profit_loss || 0) > 0) {
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });

        setStats({
          totalProfit,
          winRate,
          totalTrades: trades.length,
          bestStreak,
        });
      }
    };

    fetchStats();

    // Real-time subscription
    const channel = supabase
      .channel('trades-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Welcome back to <span className="text-gradient">Trademind</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Here's your trading performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Profit"
          value={`$${stats.totalProfit.toFixed(2)}`}
          change={stats.totalProfit > 0 ? `+${((stats.totalProfit / 10000) * 100).toFixed(1)}%` : '0%'}
          icon={DollarSign}
          positive={stats.totalProfit > 0}
        />
        <StatsCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          change={stats.winRate > 50 ? `+${(stats.winRate - 50).toFixed(1)}%` : `${(stats.winRate - 50).toFixed(1)}%`}
          icon={Target}
          positive={stats.winRate > 50}
        />
        <StatsCard
          title="Total Trades"
          value={stats.totalTrades.toString()}
          change={`${stats.totalTrades} trades`}
          icon={TrendingUp}
          positive={true}
        />
        <StatsCard
          title="Best Streak"
          value={`${stats.bestStreak} Wins`}
          change={stats.bestStreak > 0 ? "Great!" : "Start trading"}
          icon={Award}
          positive={true}
        />
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
