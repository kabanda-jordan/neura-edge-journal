import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";

export const RecentTrades = () => {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrades = async () => {
      const { data } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setTrades(data);
    };

    fetchTrades();

    // Real-time WebSocket subscription
    const channel = supabase
      .channel('recent-trades')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        () => fetchTrades()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <Card className="glass-card p-6 rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">Recent Trades</h3>
        <p className="text-sm text-muted-foreground">Your latest trading activity</p>
      </div>

      <div className="space-y-3">
        {trades.length > 0 ? (
          trades.map((trade) => (
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
                        className={trade.trade_type === "long" ? "border-accent text-accent" : "border-primary text-primary"}
                      >
                        {trade.trade_type}
                      </Badge>
                      <Badge variant={trade.status === 'closed' ? 'default' : 'secondary'}>
                        {trade.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${trade.entry_price} {trade.exit_price ? `→ $${trade.exit_price}` : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {trade.profit_loss !== null && (
                    <>
                      <div className={`text-lg font-bold ${trade.profit_loss > 0 ? "text-accent" : "text-destructive"}`}>
                        {trade.profit_loss > 0 ? "+" : ""}${trade.profit_loss.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">P&L</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">No trades yet. Start trading to see your activity here.</p>
          </div>
        )}
      </div>
    </Card>
  );
};
