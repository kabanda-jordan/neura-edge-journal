import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts";

export const Analytics = () => {
  const [winRateData, setWinRateData] = useState<any[]>([]);
  const [profitFactorData, setProfitFactorData] = useState<any[]>([]);
  const [tradesByStrategy, setTradesByStrategy] = useState<any[]>([]);
  const [dailyPnL, setDailyPnL] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: trades } = await supabase
        .from('trades')
        .select('*')
        .order('entry_date', { ascending: true });

      if (trades && trades.length > 0) {
        // Win Rate Over Time (by month)
        const monthlyData: { [key: string]: { wins: number; total: number } } = {};
        trades.forEach(trade => {
          if (trade.status === 'closed') {
            const month = new Date(trade.entry_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (!monthlyData[month]) monthlyData[month] = { wins: 0, total: 0 };
            monthlyData[month].total++;
            if ((trade.profit_loss || 0) > 0) monthlyData[month].wins++;
          }
        });
        const winRate = Object.keys(monthlyData).map(month => ({
          month,
          winRate: (monthlyData[month].wins / monthlyData[month].total) * 100
        }));
        setWinRateData(winRate);

        // Profit Factor by Strategy
        const strategyStats: { [key: string]: { gross_profit: number; gross_loss: number } } = {};
        trades.forEach(trade => {
          if (trade.status === 'closed' && trade.strategy_type) {
            if (!strategyStats[trade.strategy_type]) {
              strategyStats[trade.strategy_type] = { gross_profit: 0, gross_loss: 0 };
            }
            const pnl = trade.profit_loss || 0;
            if (pnl > 0) strategyStats[trade.strategy_type].gross_profit += pnl;
            else strategyStats[trade.strategy_type].gross_loss += Math.abs(pnl);
          }
        });
        const profitFactor = Object.keys(strategyStats).map(strategy => ({
          strategy,
          profitFactor: strategyStats[strategy].gross_loss > 0 
            ? (strategyStats[strategy].gross_profit / strategyStats[strategy].gross_loss).toFixed(2)
            : strategyStats[strategy].gross_profit > 0 ? 10 : 0
        }));
        setProfitFactorData(profitFactor);

        // Trades by Strategy
        const strategyCounts: { [key: string]: number } = {};
        trades.forEach(trade => {
          const strategy = trade.strategy_type || 'Unknown';
          strategyCounts[strategy] = (strategyCounts[strategy] || 0) + 1;
        });
        setTradesByStrategy(
          Object.keys(strategyCounts).map(strategy => ({
            strategy,
            count: strategyCounts[strategy]
          }))
        );

        // Daily P&L
        const dailyPnL: { [key: string]: number } = {};
        trades.forEach(trade => {
          if (trade.status === 'closed' && trade.exit_date) {
            const day = new Date(trade.exit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dailyPnL[day] = (dailyPnL[day] || 0) + (trade.profit_loss || 0);
          }
        });
        setDailyPnL(
          Object.keys(dailyPnL).map(day => ({
            day,
            pnl: dailyPnL[day]
          })).slice(-14) // Last 14 days
        );
      }
    };

    fetchAnalytics();

    const channel = supabase
      .channel('analytics-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, fetchAnalytics)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient">Analytics</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Deep dive into your trading patterns and metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Win Rate Analysis */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Win Rate Over Time</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Track your success rate month by month</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            {winRateData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={winRateData}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="winRate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Win Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">No data yet. Start trading!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profit Factor by Strategy */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Profit Factor by Strategy</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Compare risk/reward across strategies</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            {profitFactorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitFactorData}>
                  <XAxis dataKey="strategy" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="profitFactor" fill="hsl(var(--accent))" name="Profit Factor" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">No data yet. Start trading!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trades by Strategy */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Trades by Strategy</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribution of your trading strategies</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            {tradesByStrategy.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradesByStrategy}>
                  <XAxis dataKey="strategy" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Trades" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">No data yet. Start trading!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily P&L */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Daily P&L (Last 14 Days)</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your daily profit and loss performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            {dailyPnL.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyPnL}>
                  <defs>
                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorPnL)" 
                    name="P&L ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">No data yet. Start trading!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};