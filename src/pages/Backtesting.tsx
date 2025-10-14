import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, DollarSign } from "lucide-react";
import BacktestChart, { Trade, PositionType } from "@/components/backtesting/BacktestChart";

const CRYPTO_PAIRS = [
  "BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "DOTUSDT", "MATICUSDT", "AVAXUSDT"
];

const FOREX_PAIRS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD", "EURJPY", "GBPJPY", "EURGBP"
];

const STOCK_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX", "AMD", "PYPL"
];

const Backtesting = () => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [position, setPosition] = useState<PositionType>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [pnl, setPnl] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [speed, setSpeed] = useState(1);

  const [settings, setSettings] = useState({
    symbol: "BTCUSDT",
    timeframe: "60",
    startDate: "2024-01-01",
    initialBalance: "10000",
    market: "crypto" as "crypto" | "forex" | "stocks"
  });

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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="market">Market</Label>
                  <Select
                    value={settings.market}
                    onValueChange={(value: "crypto" | "forex" | "stocks") => {
                      const defaultSymbol = value === "crypto" ? "BTCUSDT" : value === "forex" ? "EURUSD" : "AAPL";
                      setSettings({...settings, market: value, symbol: defaultSymbol});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="stocks">Stocks</SelectItem>
                    </SelectContent>
                  </Select>
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
              
              {/* Market-specific symbol selector */}
              <div className="space-y-2">
                <Label>Select Trading Pair / Symbol</Label>
                <Tabs value={settings.market} className="w-full">
                  <TabsContent value="crypto" className="mt-2">
                    <div className="grid grid-cols-5 gap-2">
                      {CRYPTO_PAIRS.map((pair) => (
                        <button
                          key={pair}
                          onClick={() => setSettings({...settings, symbol: pair})}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            settings.symbol === pair
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {pair}
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="forex" className="mt-2">
                    <div className="grid grid-cols-5 gap-2">
                      {FOREX_PAIRS.map((pair) => (
                        <button
                          key={pair}
                          onClick={() => setSettings({...settings, symbol: pair})}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            settings.symbol === pair
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {pair}
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="stocks" className="mt-2">
                    <div className="grid grid-cols-5 gap-2">
                      {STOCK_SYMBOLS.map((symbol) => (
                        <button
                          key={symbol}
                          onClick={() => setSettings({...settings, symbol})}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            settings.symbol === symbol
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary hover:bg-secondary/80'
                          }`}
                        >
                          {symbol}
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-3">
              <BacktestChart
                symbol={settings.symbol}
                timeframe={settings.timeframe}
                startDate={settings.startDate}
                initialBalance={parseFloat(settings.initialBalance)}
                onStateChange={(state) => {
                  setCurrentTime(state.currentTime);
                  setCurrentPrice(state.currentPrice);
                  setPosition(state.position);
                  setEntryPrice(state.entryPrice);
                  setPnl(state.pnl);
                  setBalance(state.balance);
                  setTrades(state.trades);
                  setSpeed(state.speed);
                }}
              />
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
                      {position?.toUpperCase() || 'NONE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry:</span>
                    <span className="font-semibold">${entryPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-semibold">${currentPrice > 0 ? currentPrice.toFixed(2) : '0.00'}</span>
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

export default Backtesting;
