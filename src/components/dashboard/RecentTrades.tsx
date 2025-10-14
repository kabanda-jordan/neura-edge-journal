import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const trades = [
  { id: 1, symbol: "AAPL", type: "Long", entry: 178.50, exit: 182.30, pnl: 380, status: "win" },
  { id: 2, symbol: "TSLA", type: "Short", entry: 245.80, exit: 241.20, pnl: 460, status: "win" },
  { id: 3, symbol: "NVDA", type: "Long", entry: 485.30, exit: 480.10, pnl: -520, status: "loss" },
  { id: 4, symbol: "SPY", type: "Long", entry: 455.20, exit: 458.90, pnl: 370, status: "win" },
  { id: 5, symbol: "AMZN", type: "Short", entry: 152.40, exit: 154.60, pnl: -220, status: "loss" },
];

export const RecentTrades = () => {
  return (
    <Card className="glass-card p-6 rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">Recent Trades</h3>
        <p className="text-sm text-muted-foreground">Your latest trading activity</p>
      </div>

      <div className="space-y-3">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{trade.symbol}</span>
                    <Badge 
                      variant="outline" 
                      className={trade.type === "Long" ? "border-accent text-accent" : "border-primary text-primary"}
                    >
                      {trade.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${trade.entry} → ${trade.exit}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${trade.status === "win" ? "text-accent" : "text-destructive"}`}>
                  {trade.pnl > 0 ? "+" : ""}${trade.pnl}
                </div>
                <div className="text-xs text-muted-foreground">P&L</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
