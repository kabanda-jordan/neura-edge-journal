import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, AlertCircle, Image as ImageIcon } from "lucide-react";

interface TradeDetailsDialogProps {
  trade: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TradeDetailsDialog = ({ trade, open, onOpenChange }: TradeDetailsDialogProps) => {
  if (!trade) return null;

  const getDayName = (date: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {trade.trade_type === 'long' ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
            )}
            {trade.symbol} Trade Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trade Image */}
          {trade.image_url && (
            <div className="rounded-lg border border-border overflow-hidden bg-muted/30">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Trade Screenshot</span>
              </div>
              <div className="p-4">
                <img 
                  src={trade.image_url} 
                  alt="Trade screenshot" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Symbol</div>
              <Badge variant="secondary" className="font-mono text-base">
                {trade.symbol}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Position Type</div>
              <Badge 
                variant={trade.trade_type === 'long' ? 'default' : 'destructive'}
                className={`text-base ${trade.trade_type === 'long' ? 'bg-green-600' : 'bg-red-600'}`}
              >
                {trade.trade_type === 'long' ? 'Long' : 'Short'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Dates & Day */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Timeline</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Entry Date</div>
                <div className="font-medium">
                  {new Date(trade.entry_date).toLocaleDateString()}
                </div>
                <Badge variant="outline" className="font-normal">
                  {getDayName(trade.entry_date)}
                </Badge>
              </div>
              {trade.exit_date && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Exit Date</div>
                  <div className="font-medium">
                    {new Date(trade.exit_date).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {getDayName(trade.exit_date)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Price Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Price Details</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Entry Price</div>
                <div className="font-bold text-lg">${trade.entry_price}</div>
              </div>
              {trade.exit_price && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Exit Price</div>
                  <div className="font-bold text-lg">${trade.exit_price}</div>
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Quantity</div>
                <div className="font-bold text-lg">{trade.quantity}</div>
              </div>
            </div>
          </div>

          {trade.profit_loss !== null && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Result</span>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Profit & Loss</div>
                  <div className={`text-3xl font-bold ${
                    trade.profit_loss > 0 ? 'text-green-500' : 
                    trade.profit_loss < 0 ? 'text-red-500' : 
                    'text-muted-foreground'
                  }`}>
                    {trade.profit_loss > 0 ? '+' : ''}${trade.profit_loss.toFixed(2)}
                  </div>
                  <Badge 
                    variant={trade.profit_loss > 0 ? 'default' : trade.profit_loss < 0 ? 'destructive' : 'outline'}
                    className={`mt-2 ${trade.profit_loss > 0 ? 'bg-green-600' : ''}`}
                  >
                    {trade.profit_loss > 0 ? 'Win' : trade.profit_loss < 0 ? 'Loss' : 'Breakeven'}
                  </Badge>
                </div>
              </div>
            </>
          )}

          {/* Strategy & Risk Details */}
          {(trade.strategy_type || trade.timeframe || trade.confidence || trade.risk_percentage || trade.limit_order || trade.r_factor) && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Strategy & Risk</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {trade.strategy_type && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Strategy</div>
                      <Badge variant="outline">{trade.strategy_type}</Badge>
                    </div>
                  )}
                  {trade.timeframe && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Timeframe</div>
                      <Badge className="bg-accent/20 text-accent border-accent/50">
                        {trade.timeframe}
                      </Badge>
                    </div>
                  )}
                  {trade.confidence && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Confidence</div>
                      <div className="font-medium">{trade.confidence}/10</div>
                    </div>
                  )}
                  {trade.risk_percentage && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Risk %</div>
                      <div className="font-medium">{trade.risk_percentage}%</div>
                    </div>
                  )}
                  {trade.limit_order && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Limit Order</div>
                      <div className="font-medium">{trade.limit_order}</div>
                    </div>
                  )}
                  {trade.r_factor && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">R Factor</div>
                      <div className="font-medium">{trade.r_factor}</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notes & Tags */}
          {(trade.notes || (trade.tags && trade.tags.length > 0)) && (
            <>
              <Separator />
              <div className="space-y-3">
                {trade.notes && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Notes</div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border text-sm">
                      {trade.notes}
                    </div>
                  </div>
                )}
                {trade.tags && trade.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Tags</div>
                    <div className="flex gap-2 flex-wrap">
                      {trade.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Status */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Trade Status</div>
            <Badge 
              variant={trade.status === 'closed' ? 'default' : 'outline'}
              className={trade.status === 'closed' ? 'bg-primary' : ''}
            >
              {trade.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};