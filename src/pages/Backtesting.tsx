import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, Pause, RotateCcw, TrendingUp, TrendingDown, 
  Settings, Calendar, DollarSign, Target 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Backtesting = () => {
  const { toast } = useToast();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [position, setPosition] = useState<'long' | 'short' | null>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [pnl, setPnl] = useState(0);
  const [balance, setBalance] = useState(10000);

  const [settings, setSettings] = useState({
    symbol: "BTCUSD",
    timeframe: "1h",
    startDate: "2024-01-01",
    speed: "1x",
    initialBalance: "10000"
  });

  useEffect(() => {
    // Initialize TradingView widget
    if (chartContainerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            container_id: "tradingview_chart",
            autosize: true,
            symbol: settings.symbol,
            interval: settings.timeframe,
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            studies: [
              "MASimple@tv-basicstudies",
              "RSI@tv-basicstudies"
            ]
          });
        }
      };
      document.head.appendChild(script);
    }
  }, [settings.symbol, settings.timeframe]);

  const handleLongPosition = () => {
    if (position) {
      toast({
        title: "Position Active",
        description: "Close your current position first",
        variant: "destructive"
      });
      return;
    }
    setPosition('long');
    setEntryPrice(currentPrice || 50000);
    toast({
      title: "Long Position Opened",
      description: `Entry: $${(currentPrice || 50000).toFixed(2)}`
    });
  };

  const handleShortPosition = () => {
    if (position) {
      toast({
        title: "Position Active",
        description: "Close your current position first",
        variant: "destructive"
      });
      return;
    }
    setPosition('short');
    setEntryPrice(currentPrice || 50000);
    toast({
      title: "Short Position Opened",
      description: `Entry: $${(currentPrice || 50000).toFixed(2)}`
    });
  };

  const handleClosePosition = () => {
    if (!position || !entryPrice) return;
    
    const exitPrice = currentPrice || 50000;
    let profit = 0;
    
    if (position === 'long') {
      profit = exitPrice - entryPrice;
    } else {
      profit = entryPrice - exitPrice;
    }
    
    const newBalance = balance + profit;
    setBalance(newBalance);
    setPnl(pnl + profit);
    
    toast({
      title: "Position Closed",
      description: `P&L: $${profit.toFixed(2)}`,
      variant: profit >= 0 ? "default" : "destructive"
    });
    
    setPosition(null);
    setEntryPrice(null);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Paused" : "Playing",
      description: isPlaying ? "Chart replay paused" : "Chart replay started"
    });
  };

  const handleReset = () => {
    setBalance(parseFloat(settings.initialBalance));
    setPnl(0);
    setPosition(null);
    setEntryPrice(null);
    setIsPlaying(false);
    toast({
      title: "Reset Complete",
      description: "All positions closed and balance reset"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gradient">Chart Replay & Backtesting</span>
            </h1>
            <p className="text-muted-foreground">
              Practice trading with real TradingView charts - replay historical data and test your strategies
            </p>
          </div>

          {/* Settings Panel */}
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Replay Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    value={settings.symbol}
                    onChange={(e) => setSettings({...settings, symbol: e.target.value})}
                    placeholder="BTCUSD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select
                    value={settings.timeframe}
                    onValueChange={(value) => setSettings({...settings, timeframe: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1D">1 Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={settings.startDate}
                    onChange={(e) => setSettings({...settings, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speed">Replay Speed</Label>
                  <Select
                    value={settings.speed}
                    onValueChange={(value) => setSettings({...settings, speed: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5x">0.5x</SelectItem>
                      <SelectItem value="1x">1x</SelectItem>
                      <SelectItem value="2x">2x</SelectItem>
                      <SelectItem value="5x">5x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Initial Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={settings.initialBalance}
                    onChange={(e) => setSettings({...settings, initialBalance: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-3">
              <Card className="glass-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Live Chart</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    id="tradingview_chart" 
                    ref={chartContainerRef}
                    className="w-full h-[600px] rounded-lg"
                  />
                </CardContent>
              </Card>

              {/* Trading Controls */}
              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle>Trading Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      onClick={handleLongPosition}
                      disabled={!!position}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Long
                    </Button>
                    <Button
                      onClick={handleShortPosition}
                      disabled={!!position}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Short
                    </Button>
                    <Button
                      onClick={handleClosePosition}
                      disabled={!position}
                      variant="outline"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Close Position
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Panel */}
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5" />
                    Account Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gradient">
                    ${balance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Total P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              {position && (
                <Card className="glass-card border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Active Position</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className={`font-semibold ${position === 'long' ? 'text-green-500' : 'text-red-500'}`}>
                        {position?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entry:</span>
                      <span className="font-semibold">${entryPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-semibold">${(currentPrice || entryPrice || 0).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span className="font-semibold">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trades:</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Win:</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Loss:</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Add TradingView types to window
declare global {
  interface Window {
    TradingView: any;
  }
}

export default Backtesting;
