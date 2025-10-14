import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const TradeForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    symbol: "",
    trade_type: "long",
    entry_price: "",
    quantity: "",
    notes: "",
    strategy_type: "",
    timeframe: "5m",
    confidence: "5",
    risk_percentage: "",
    limit_order: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.from('trades').insert({
        user_id: user.id,
        symbol: formData.symbol.toUpperCase(),
        trade_type: formData.trade_type,
        entry_price: parseFloat(formData.entry_price),
        quantity: parseFloat(formData.quantity),
        notes: formData.notes,
        strategy_type: formData.strategy_type,
        timeframe: formData.timeframe,
        confidence: parseInt(formData.confidence),
        risk_percentage: formData.risk_percentage ? parseFloat(formData.risk_percentage) : null,
        limit_order: formData.limit_order,
        status: 'open',
        entry_date: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trade added successfully!",
      });

      setFormData({
        symbol: "",
        trade_type: "long",
        entry_price: "",
        quantity: "",
        notes: "",
        strategy_type: "",
        timeframe: "5m",
        confidence: "5",
        risk_percentage: "",
        limit_order: "",
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error adding trade:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add trade",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Add New Trade</CardTitle>
        <CardDescription>Record your trade details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="AAPL"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.trade_type}
                onValueChange={(value) => setFormData({ ...formData, trade_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry">Entry Price</Label>
              <Input
                id="entry"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={formData.entry_price}
                onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy Type</Label>
              <Input
                id="strategy"
                placeholder="Trend break, Break & retest, etc."
                value={formData.strategy_type}
                onChange={(e) => setFormData({ ...formData, strategy_type: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select
                value={formData.timeframe}
                onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1m</SelectItem>
                  <SelectItem value="5m">5m</SelectItem>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="30m">30m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="4h">4h</SelectItem>
                  <SelectItem value="1d">1d</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence (1-10)</Label>
              <Input
                id="confidence"
                type="number"
                min="1"
                max="10"
                placeholder="5"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk">Risk %</Label>
              <Input
                id="risk"
                type="number"
                step="0.01"
                placeholder="2.5"
                value={formData.risk_percentage}
                onChange={(e) => setFormData({ ...formData, risk_percentage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Limit Order</Label>
              <Input
                id="limit"
                placeholder="L0"
                value={formData.limit_order}
                onChange={(e) => setFormData({ ...formData, limit_order: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Trade setup, strategy, emotions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Trade...
              </>
            ) : (
              'Add Trade'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
