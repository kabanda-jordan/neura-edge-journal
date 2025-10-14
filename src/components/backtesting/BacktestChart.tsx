import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Target, FastForward, Rewind } from "lucide-react";
import { createChart, IChartApi, CandlestickData, UTCTimestamp, CandlestickSeries } from 'lightweight-charts';

export type PositionType = 'long' | 'short' | null;

export interface Trade {
  id: number;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  entryTime: number;
  exitTime?: number;
  pnl?: number;
}

interface BacktestChartProps {
  symbol: string;
  timeframe: string;
  startDate: string;
  initialBalance: number;
  market: string;
  onStateChange?: (state: {
    currentTime: number;
    currentPrice: number;
    position: PositionType;
    entryPrice: number | null;
    pnl: number;
    balance: number;
    trades: Trade[];
    speed: number;
  }) => void;
}

// Generate sample candlestick data
const generateCandlestickData = (startDate: string, timeframe: string): CandlestickData[] => {
  const data: CandlestickData[] = [];
  let currentTime = new Date(startDate).getTime() / 1000;
  
  const timeframeMinutes: Record<string, number> = {
    '1m': 1, '5m': 5, '15m': 15, '1h': 60, '4h': 240, '1d': 1440
  };
  const minutes = timeframeMinutes[timeframe] || 60;
  
  let price = 50000;
  for (let i = 0; i < 500; i++) {
    const open = price;
    const change = (Math.random() - 0.5) * price * 0.02;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * price * 0.01;
    const low = Math.min(open, close) - Math.random() * price * 0.01;
    
    data.push({
      time: currentTime as UTCTimestamp,
      open,
      high,
      low,
      close
    });
    
    price = close;
    currentTime += minutes * 60;
  }
  
  return data;
};

const BacktestChart: React.FC<BacktestChartProps> = ({ 
  symbol, 
  timeframe, 
  startDate, 
  initialBalance, 
  market,
  onStateChange 
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const { toast } = useToast();

  // Backtesting state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [currentPrice, setCurrentPrice] = useState(50000);

  // Position and trading state
  const [position, setPosition] = useState<PositionType>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [tp, setTp] = useState<number | null>(null);
  const [sl, setSl] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Initialize lightweight chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { color: '#0a0a0a' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#1F2937' },
        horzLines: { color: '#1F2937' },
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    const chartData = generateCandlestickData(startDate, timeframe);
    candlestickSeries.setData(chartData);

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, timeframe, startDate]);

  // Simulated price updates for backtesting
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * (prev * 0.002); // 0.2% volatility
        return Math.max(1000, prev + change);
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Auto-close on TP/SL
  useEffect(() => {
    if (!position || entryPrice == null) return;
    
    if (tp != null) {
      if (position === 'long' && currentPrice >= tp) {
        closePosition(tp);
        return;
      }
      if (position === 'short' && currentPrice <= tp) {
        closePosition(tp);
        return;
      }
    }
    if (sl != null) {
      if (position === 'long' && currentPrice <= sl) {
        closePosition(sl);
        return;
      }
      if (position === 'short' && currentPrice >= sl) {
        closePosition(sl);
        return;
      }
    }
  }, [currentPrice, position, tp, sl]);

  // Publish state to parent
  useEffect(() => {
    let unrealized = 0;
    if (position && entryPrice != null) {
      unrealized = position === 'long' ? currentPrice - entryPrice : entryPrice - currentPrice;
    }
    
    onStateChange?.({
      currentTime: Date.now() / 1000,
      currentPrice,
      position,
      entryPrice,
      pnl: unrealized,
      balance,
      trades,
      speed,
    });
  }, [currentPrice, position, entryPrice, balance, trades, speed]);

  // Trading actions
  const openLong = () => {
    if (position) {
      toast({ title: 'Position Active', description: 'Close your current position first', variant: 'destructive' });
      return;
    }
    setPosition('long');
    setEntryPrice(currentPrice);
    setTp(currentPrice * 1.02);
    setSl(currentPrice * 0.98);
    toast({ title: 'Long Opened', description: `Entry: $${currentPrice.toFixed(2)}` });
  };

  const openShort = () => {
    if (position) {
      toast({ title: 'Position Active', description: 'Close your current position first', variant: 'destructive' });
      return;
    }
    setPosition('short');
    setEntryPrice(currentPrice);
    setTp(currentPrice * 0.98);
    setSl(currentPrice * 1.02);
    toast({ title: 'Short Opened', description: `Entry: $${currentPrice.toFixed(2)}` });
  };

  const closePosition = (exitAt?: number) => {
    if (!position || entryPrice == null) return;
    const exitPrice = exitAt ?? currentPrice;
    const profit = position === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;
    setBalance(b => b + profit);
    setTrades(t => [
      ...t,
      { 
        id: t.length + 1, 
        type: position, 
        entryPrice, 
        exitPrice, 
        entryTime: Date.now() / 1000, 
        exitTime: Date.now() / 1000, 
        pnl: profit 
      }
    ]);
    toast({ 
      title: 'Position Closed', 
      description: `P&L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`, 
      variant: profit >= 0 ? 'default' : 'destructive' 
    });
    setPosition(null);
    setEntryPrice(null);
    setTp(null);
    setSl(null);
  };

  // Replay controls
  const togglePlay = () => setIsPlaying(p => !p);
  
  const reset = () => {
    setIsPlaying(false);
    setPosition(null);
    setEntryPrice(null);
    setTp(null);
    setSl(null);
    setBalance(initialBalance);
    setTrades([]);
    setCurrentPrice(50000);
    toast({ title: 'Reset', description: 'Backtesting reset' });
  };

  const updateTp = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) setTp(num);
  };

  const updateSl = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) setSl(num);
  };

  return (
    <div className="relative w-full rounded-lg bg-card overflow-hidden border border-border">
      {/* Chart Container */}
      <div ref={chartContainerRef} className="w-full h-[600px]" />

      {/* Overlay controls */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 pointer-events-none">
        {/* Top controls */}
        <div className="flex items-start justify-between">
          {/* Left: Replay controls */}
          <div className="pointer-events-auto flex items-center gap-2 bg-background/90 backdrop-blur rounded px-3 py-2 border border-border">
            <Button variant="outline" size="sm" onClick={() => setSpeed(s => Math.max(s / 2, 0.25))}>
              <Rewind className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={togglePlay} className="min-w-[80px]">
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
            <Button variant="outline" size="sm" onClick={() => setSpeed(s => Math.min(s * 2, 16))}>
              <FastForward className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 ml-2 border-l border-border pl-2">
              <span className="text-xs text-muted-foreground">Speed:</span>
              <Input 
                type="number" 
                value={speed} 
                onChange={(e) => setSpeed(Math.max(0.25, Math.min(16, parseFloat(e.target.value) || 1)))}
                className="w-16 h-7 text-xs"
                step="0.25"
                min="0.25"
                max="16"
              />
              <span className="text-xs text-muted-foreground">x</span>
            </div>
          </div>

          {/* Right: Price info */}
          <div className="pointer-events-none text-right text-xs bg-background/90 backdrop-blur rounded px-3 py-2 border border-border">
            <div className="font-mono font-bold text-primary text-lg">${currentPrice.toFixed(2)}</div>
            <div className="text-muted-foreground">{symbol}</div>
          </div>
        </div>

        {/* Bottom: Trading controls */}
        <div className="pointer-events-auto flex items-center gap-2 flex-wrap bg-background/90 backdrop-blur rounded px-3 py-2 border border-border">
          <Button onClick={openLong} disabled={!!position} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
            <TrendingUp className="w-4 h-4 mr-2" />
            Long
          </Button>
          <Button onClick={openShort} disabled={!!position} className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
            <TrendingDown className="w-4 h-4 mr-2" />
            Short
          </Button>
          <Button onClick={() => closePosition()} disabled={!position} variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Close
          </Button>
          
          {position && (
            <div className="ml-4 flex items-center gap-3 text-xs border-l border-border pl-4">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-semibold">TP:</span>
                <Input 
                  type="number" 
                  value={tp || ''} 
                  onChange={(e) => updateTp(e.target.value)}
                  className="w-28 h-7 text-xs"
                  step="0.01"
                  placeholder="Take Profit"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-semibold">SL:</span>
                <Input 
                  type="number" 
                  value={sl || ''} 
                  onChange={(e) => updateSl(e.target.value)}
                  className="w-28 h-7 text-xs"
                  step="0.01"
                  placeholder="Stop Loss"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestChart;
