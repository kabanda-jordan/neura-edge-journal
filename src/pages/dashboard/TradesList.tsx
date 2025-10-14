import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";

export const TradesList = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrades = async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trades:', error);
        return;
      }

      if (data) setTrades(data);
    };

    fetchTrades();

    // Real-time subscription
    const channel = supabase
      .channel('trades-list')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'trades' }, 
        () => fetchTrades()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const closeTrade = async (tradeId: string, exitPrice: number) => {
    try {
      const trade = trades.find(t => t.id === tradeId);
      if (!trade) return;

      const profitLoss = trade.trade_type === 'long'
        ? (exitPrice - trade.entry_price) * trade.quantity
        : (trade.entry_price - exitPrice) * trade.quantity;

      const { error } = await supabase
        .from('trades')
        .update({
          exit_price: exitPrice,
          profit_loss: profitLoss,
          status: 'closed',
          exit_date: new Date().toISOString(),
        })
        .eq('id', tradeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trade closed successfully!",
      });
    } catch (error: any) {
      console.error('Error closing trade:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to close trade",
        variant: "destructive",
      });
    }
  };

  if (trades.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Trading History</CardTitle>
          <CardDescription>All trades will appear here once you start journaling</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trades yet</h3>
            <p className="text-muted-foreground">Start by adding your first trade to begin tracking</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {trades.map((trade) => (
        <Card key={trade.id} className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{trade.symbol}</h3>
                  <Badge variant={trade.trade_type === 'long' ? 'default' : 'secondary'}>
                    {trade.trade_type}
                  </Badge>
                  <Badge variant={trade.status === 'closed' ? 'outline' : 'default'}>
                    {trade.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry</p>
                    <p className="font-semibold">${trade.entry_price}</p>
                  </div>
                  {trade.exit_price && (
                    <div>
                      <p className="text-muted-foreground">Exit</p>
                      <p className="font-semibold">${trade.exit_price}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{trade.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {new Date(trade.entry_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {trade.notes && (
                  <p className="text-sm text-muted-foreground">{trade.notes}</p>
                )}
              </div>

              <div className="text-right space-y-2">
                {trade.profit_loss !== null ? (
                  <div className={`flex items-center gap-2 ${
                    trade.profit_loss > 0 ? 'text-accent' : 'text-destructive'
                  }`}>
                    {trade.profit_loss > 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="text-2xl font-bold">
                      {trade.profit_loss > 0 ? '+' : ''}${trade.profit_loss.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      const exitPrice = prompt('Enter exit price:');
                      if (exitPrice) closeTrade(trade.id, parseFloat(exitPrice));
                    }}
                  >
                    Close Trade
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
