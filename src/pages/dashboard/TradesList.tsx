import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Plus, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { TradeDetailsDialog } from "@/components/dashboard/TradeDetailsDialog";

export const TradesList = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
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

  const getWinLossStatus = (profitLoss: number | null) => {
    if (profitLoss === null) return "OPEN";
    if (profitLoss > 0) return "Win";
    if (profitLoss < 0) return "LOSS";
    return "BREAKEVEN";
  };

  const getDayName = (date: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  };

  const handleViewDetails = (trade: any) => {
    setSelectedTrade(trade);
    setDetailsOpen(true);
  };

  if (trades.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Master Trade Log</CardTitle>
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
    <>
      <TradeDetailsDialog 
        trade={selectedTrade} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Master Trade Log</CardTitle>
        <CardDescription>Complete trading history with detailed analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="whitespace-nowrap">Day</TableHead>
                <TableHead className="whitespace-nowrap">Coin</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="whitespace-nowrap">TF</TableHead>
                <TableHead className="whitespace-nowrap">Position</TableHead>
                <TableHead className="whitespace-nowrap">Confidence</TableHead>
                <TableHead className="whitespace-nowrap">Risk %</TableHead>
                <TableHead className="whitespace-nowrap">Limit</TableHead>
                <TableHead className="whitespace-nowrap">PnL $</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => {
                const status = getWinLossStatus(trade.profit_loss);
                return (
                  <TableRow key={trade.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {getDayName(trade.entry_date)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {trade.symbol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trade.strategy_type ? (
                        <Badge variant="outline">{trade.strategy_type}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {trade.timeframe ? (
                        <Badge className="bg-accent/20 text-accent border-accent/50">
                          {trade.timeframe}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={trade.trade_type === 'long' ? 'default' : 'destructive'}
                        className={trade.trade_type === 'long' ? 'bg-accent text-accent-foreground' : ''}
                      >
                        {trade.trade_type === 'long' ? 'Long' : 'Short'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trade.confidence ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{trade.confidence}</span>
                          <Progress 
                            value={trade.confidence * 10} 
                            className="w-16 h-2"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {trade.risk_percentage ? (
                        <span className="font-medium">{trade.risk_percentage}%</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {trade.limit_order || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      {trade.profit_loss !== null ? (
                        <span className={`font-bold ${
                          trade.profit_loss > 0 ? 'text-accent' : 
                          trade.profit_loss < 0 ? 'text-destructive' : 
                          'text-muted-foreground'
                        }`}>
                          {trade.profit_loss > 0 ? '+' : ''}${trade.profit_loss.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          status === 'Win' ? 'default' : 
                          status === 'LOSS' ? 'destructive' : 
                          'outline'
                        }
                        className={
                          status === 'Win' ? 'bg-accent text-accent-foreground' : 
                          status === 'BREAKEVEN' ? 'bg-muted' : 
                          ''
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(trade)}
                          className="gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        {trade.profit_loss === null && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const exitPrice = prompt('Enter exit price:');
                              if (exitPrice) closeTrade(trade.id, parseFloat(exitPrice));
                            }}
                          >
                            Close
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </>
  );
};
