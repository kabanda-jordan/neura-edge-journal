import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const data = [
  { date: "Jan", profit: 2400 },
  { date: "Feb", profit: 1398 },
  { date: "Mar", profit: 9800 },
  { date: "Apr", profit: 3908 },
  { date: "May", profit: 4800 },
  { date: "Jun", profit: 3800 },
  { date: "Jul", profit: 8430 },
  { date: "Aug", profit: 6543 },
  { date: "Sep", profit: 7823 },
  { date: "Oct", profit: 9821 },
];

export const ProfitChart = () => {
  return (
    <Card className="glass-card p-6 rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">Profit & Loss</h3>
        <p className="text-sm text-muted-foreground">Your trading performance over time</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--neon-green))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--neon-green))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="profit" 
            stroke="hsl(var(--neon-green))" 
            strokeWidth={2}
            fill="url(#profitGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
