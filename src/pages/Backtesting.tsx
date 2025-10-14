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
  Settings, DollarSign, Target, FastForward, Rewind,
  SkipForward, SkipBack
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Trade {
  id: number;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  entryTime: Date;
  exitTime?: Date;
  pnl?: number;
}

const Backtesting = () => {
  const { toast } = useToast();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(50000);
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2024-01-01'));
  const [position, setPosition] = useState<'long' | 'short' | null>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [pnl, setPnl] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState({
    symbol: "BTCUSD",
    timeframe: "60",
    startDate: "2024-01-01",
    initialBalance: "10000"
  });

  // Initialize TradingView widget
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up existing widget
    if (widgetRef.current) {
      widgetRef.current = null;
    }

    const container = chartContainerRef.current;
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        try {
          widgetRef.current = new window.TradingView.widget({
            container_id: "tradingview_chart",
            width: "100%",
            height: 600,
            symbol: `BINANCE:${settings.symbol}`,
            interval: settings.timeframe,
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#1a1a1a",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            details: true,
            hotlist: true,
            calendar: true,
            studies: [
              "MASimple@tv-basicstudies",
              "RSI@tv-basicstudies",
              "MACD@tv-basicstudies"
            ],
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650"
          });

          toast({
            title: "Chart Loaded",
            description: "TradingView chart initialized successfully"
          });
        } catch (error) {
          console.error('TradingView widget error:', error);
          toast({
            title: "Chart Error",
            description: "Failed to load chart. Please refresh the page.",
            variant: "destructive"
          });
        }
      }
    };
    
    script.onerror = () => {
      toast({
        title: "Loading Error",
        description: "Failed to load TradingView library",
        variant: "destructive"
      });
    };

    document.head.appendChild(script);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.symbol, settings.timeframe]);

  // Chart replay simulation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        // Simulate price movement
        const priceChange = (Math.random() - 0.5) * 100 * replaySpeed;
        setCurrentPrice(prev => Math.max(100, prev + priceChange));
        
        // Move time forward
        setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setMinutes(newDate.getMinutes() + (parseInt(settings.timeframe) * replaySpeed));
          return newDate;
        });

        // Update unrealized P&L for open position
        if (position && entryPrice) {
          const exitPrice = currentPrice + priceChange;
          let unrealizedPnl = 0;
          
          if (position === 'long') {
            unrealizedPnl = exitPrice - entryPrice;
          } else {
            unrealizedPnl = entryPrice - exitPrice;
          }
          
          setPnl(unrealizedPnl);
        }
      }, 1000 / replaySpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, replaySpeed, position, entryPrice, settings.timeframe, currentPrice]);

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
    setEntryPrice(currentPrice);
    setPnl(0);
    toast({
      title: "Long Position Opened",
      description: `Entry: $${currentPrice.toFixed(2)}`
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
    setEntryPrice(currentPrice);
    setPnl(0);
    toast({
      title: "Short Position Opened",
      description: `Entry: $${currentPrice.toFixed(2)}`
    });
  };

  const handleClosePosition = () => {
    if (!position || !entryPrice) return;
    
    const exitPrice = currentPrice;
    let profit = 0;
    
    if (position === 'long') {
      profit = exitPrice - entryPrice;
    } else {
      profit = entryPrice - exitPrice;
    }
    
    const newBalance = balance + profit;
    setBalance(newBalance);
    
    // Record the trade
    const newTrade: Trade = {
      id: trades.length + 1,
      type: position,
      entryPrice: entryPrice,
      exitPrice: exitPrice,
      entryTime: new Date(currentDate.getTime() - 60000),
      exitTime: currentDate,
      pnl: profit
    };
    setTrades([...trades, newTrade]);
    
    toast({
      title: "Position Closed",
      description: `P&L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`,
      variant: profit >= 0 ? "default" : "destructive"
    });
    
    setPosition(null);
    setEntryPrice(null);
    setPnl(0);
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
    setTrades([]);
    setCurrentDate(new Date(settings.startDate));
    setCurrentPrice(50000);
    toast({
      title: "Reset Complete",
      description: "All positions closed and balance reset"
    });
  };

  const skipForward = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setHours(newDate.getHours() + 1);
      return newDate;
    });
    toast({ title: "Skip Forward", description: "Advanced 1 hour" });
  };

  const skipBackward = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setHours(newDate.getHours() - 1);
      return newDate;
    });
    toast({ title: "Skip Backward", description: "Went back 1 hour" });
  };

  const increaseSpeed = () => {
    setReplaySpeed(prev => Math.min(prev * 2, 16));
    toast({ title: "Speed Increased", description: `${replaySpeed * 2}x speed` });
  };

  const decreaseSpeed = () => {
    setReplaySpeed(prev => Math.max(prev / 2, 0.5));
    toast({ title: "Speed Decreased", description: `${replaySpeed / 2}x speed` });
  };

  const winningTrades = trades.filter(t => (t.pnl || 0) > 0).length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(1) : '0';
  const avgWin = trades.filter(t => (t.pnl || 0) > 0).reduce((sum, t) => sum + (t.pnl || 0), 0) / (winningTrades || 1);
  const avgLoss = trades.filter(t => (t.pnl || 0) < 0).reduce((sum, t) => sum + (t.pnl || 0), 0) / ((totalTrades - winningTrades) || 1);

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <SelectItem value="1">1 Minute</SelectItem>
                      <SelectItem value="5">5 Minutes</SelectItem>
                      <SelectItem value="15">15 Minutes</SelectItem>
                      <SelectItem value="60">1 Hour</SelectItem>
                      <SelectItem value="240">4 Hours</SelectItem>
                      <SelectItem value="D">1 Day</SelectItem>
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
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle>Live Chart - {settings.symbol}</CardTitle>
                      <CardDescription>
                        {currentDate.toLocaleString()} | Speed: {replaySpeed}x
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseSpeed}
                      >
                        <Rewind className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={skipBackward}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePlayPause}
                        className="min-w-[80px]"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Play
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={skipForward}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseSpeed}
                      >
                        <FastForward className="w-4 h-4" />
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
                    className="w-full rounded-lg bg-card"
                  />
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Price:</span>
                        <span className="font-mono font-bold text-primary">${currentPrice.toFixed(2)}</span>
                      </div>
                      {position && entryPrice && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Unrealized P&L:</span>
                            <span className={`font-mono font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Controls */}
              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle>Trading Controls</CardTitle>
                  <CardDescription>Open or close positions during replay</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      onClick={handleLongPosition}
                      disabled={!!position || !isPlaying}
                      className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Long
                    </Button>
                    <Button
                      onClick={handleShortPosition}
                      disabled={!!position || !isPlaying}
                      className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
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
                  {!isPlaying && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Press Play to start trading
                    </p>
                  )}
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
                  <div className={`text-sm mt-1 ${balance >= parseFloat(settings.initialBalance) ? 'text-green-500' : 'text-red-500'}`}>
                    {balance >= parseFloat(settings.initialBalance) ? '+' : ''}
                    ${(balance - parseFloat(settings.initialBalance)).toFixed(2)}
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
                      <span className="font-semibold">${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">P&L:</span>
                      <span className={`font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span className="font-semibold">{winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trades:</span>
                    <span className="font-semibold">{totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Winning:</span>
                    <span className="font-semibold text-green-500">{winningTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Losing:</span>
                    <span className="font-semibold text-red-500">{totalTrades - winningTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Win:</span>
                    <span className="font-semibold text-green-500">${isNaN(avgWin) ? '0.00' : avgWin.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Loss:</span>
                    <span className="font-semibold text-red-500">${isNaN(avgLoss) ? '0.00' : Math.abs(avgLoss).toFixed(2)}</span>
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
