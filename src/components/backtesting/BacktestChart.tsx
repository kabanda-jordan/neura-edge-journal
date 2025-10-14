import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Target, FastForward, Rewind, SkipForward, SkipBack } from "lucide-react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType, CandlestickSeries, IPriceLine } from 'lightweight-charts';

export type PositionType = 'long' | 'short' | null;

export interface Trade {
  id: number;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  entryTime: number; // unix seconds
  exitTime?: number; // unix seconds
  pnl?: number;
}

interface BacktestChartProps {
  symbol: string; // e.g., BTCUSD or BTCUSDT
  timeframe: string; // '1','5','15','60','240','D'
  startDate: string; // YYYY-MM-DD
  initialBalance: number;
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

const BINANCE_BASE = 'https://api.binance.com';

function mapSymbolToBinance(symbol: string): string {
  const s = symbol.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (s.endsWith('USDT')) return s;
  if (s.endsWith('USD')) return s.replace(/USD$/, 'USDT');
  return s + 'USDT';
}

function mapTimeframe(tf: string): string {
  switch (tf) {
    case '1': return '1m';
    case '5': return '5m';
    case '15': return '15m';
    case '60': return '1h';
    case '240': return '4h';
    case 'D': return '1d';
    default: return '1h';
  }
}

interface Candle { time: number; open: number; high: number; low: number; close: number; }

const fetchKlines = async (symbol: string, interval: string, startTimeMs: number, maxCandles = 1500): Promise<Candle[]> => {
  const result: Candle[] = [];
  let from = startTimeMs;
  while (result.length < maxCandles) {
    const url = `${BINANCE_BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${from}&limit=1000`;
    const res = await fetch(url);
    if (!res.ok) break;
    const data: any[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    for (const k of data) {
      const openTime = k[0];
      const open = parseFloat(k[1]);
      const high = parseFloat(k[2]);
      const low = parseFloat(k[3]);
      const close = parseFloat(k[4]);
      result.push({ time: Math.floor(openTime / 1000), open, high, low, close });
    }
    const last = data[data.length - 1];
    from = last[0] + 1; // next ms after last open time
    if (data.length < 1000) break;
  }
  return result;
};

const BacktestChart: React.FC<BacktestChartProps> = ({ symbol, timeframe, startDate, initialBalance, onStateChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const tpLineRef = useRef<IPriceLine | null>(null);
  const slLineRef = useRef<IPriceLine | null>(null);
  const { toast } = useToast();

  // Replay and trading state
  const [data, setData] = useState<Candle[]>([]);
  const [idx, setIdx] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // multiplier
  const timerRef = useRef<number | null>(null);

  const [position, setPosition] = useState<PositionType>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [tp, setTp] = useState<number | null>(null);
  const [sl, setSl] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [trades, setTrades] = useState<Trade[]>([]);

  // TP/SL drag state
  const [dragging, setDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<'tp' | 'sl' | null>(null);

  const mappedSymbol = useMemo(() => {
    const s = symbol.replace(/[^a-zA-Z]/g, '').toUpperCase();
    return s.endsWith('USDT') ? s : s.endsWith('USD') ? s : s + 'USD';
  }, [symbol]);
  
  const mappedTf = useMemo(() => {
    const tfMap: Record<string, string> = { '1': '1', '5': '5', '15': '15', '60': '60', '240': '240', 'D': 'D' };
    return tfMap[timeframe] || '60';
  }, [timeframe]);

  const currentCandle = data[Math.max(0, Math.min(idx - 1, data.length - 1))];
  const currentPrice = currentCandle?.close ?? 0;
  const currentTime = currentCandle?.time ?? Math.floor(new Date(startDate).getTime() / 1000);

  // Load historical data
  useEffect(() => {
    const loadData = async () => {
      try {
        const binanceSymbol = mapSymbolToBinance(symbol);
        const binanceInterval = mapTimeframe(timeframe);
        const startMs = new Date(startDate).getTime();
        
        toast({ title: 'Loading Data...', description: `Fetching ${binanceSymbol} ${binanceInterval} candles` });
        
        const candles = await fetchKlines(binanceSymbol, binanceInterval, startMs, 1500);
        
        if (candles.length === 0) {
          toast({ title: 'No Data', description: 'No historical data found for this period', variant: 'destructive' });
          return;
        }
        
        setData(candles);
        setIdx(50); // Start from candle 50 to show some history
        toast({ title: 'Data Loaded', description: `${candles.length} candles ready to replay` });
      } catch (error) {
        console.error('Error loading data:', error);
        toast({ title: 'Error', description: 'Failed to load historical data', variant: 'destructive' });
      }
    };
    
    loadData();
  }, [symbol, timeframe, startDate]);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
        shiftVisibleRangeOnNewBar: false,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Handle resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update chart with visible data based on idx
  useEffect(() => {
    if (!candleSeriesRef.current || data.length === 0) return;
    
    // Show data from beginning up to current idx
    const visibleData = data.slice(0, idx).map(c => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    
    candleSeriesRef.current.setData(visibleData);
    
    // Auto-scroll to latest candle only during playback
    if (isPlaying && chartRef.current && visibleData.length > 0) {
      chartRef.current.timeScale().scrollToPosition(3, false);
    }
  }, [idx, data]);

  // Reset state on symbol/timeframe change
  useEffect(() => {
    setIsPlaying(false);
    setTrades([]);
    setPosition(null);
    setEntryPrice(null);
    setTp(null);
    setSl(null);
    setBalance(initialBalance);
  }, [mappedSymbol, mappedTf, initialBalance]);

  // Replay timer - advance candles
  useEffect(() => {
    if (!isPlaying || data.length === 0) return;
    
    if (idx >= data.length) {
      setIsPlaying(false);
      toast({ title: 'Replay Complete', description: 'Reached end of historical data' });
      return;
    }
    
    const stepMs = Math.max(50, 500 / speed);
    timerRef.current = window.setInterval(() => {
      setIdx(prev => {
        if (prev >= data.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, data.length, idx]);

  // Update TP/SL price lines on chart
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    // Remove old lines
    if (tpLineRef.current) {
      candleSeriesRef.current.removePriceLine(tpLineRef.current);
      tpLineRef.current = null;
    }
    if (slLineRef.current) {
      candleSeriesRef.current.removePriceLine(slLineRef.current);
      slLineRef.current = null;
    }

    // Add new lines if position is active
    if (position && tp != null) {
      tpLineRef.current = candleSeriesRef.current.createPriceLine({
        price: tp,
        color: '#10b981',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'TP',
      });
    }
    if (position && sl != null) {
      slLineRef.current = candleSeriesRef.current.createPriceLine({
        price: sl,
        color: '#ef4444',
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'SL',
      });
    }
  }, [position, tp, sl]);

  // Enable dragging for TP/SL price lines
  useEffect(() => {
    const el = containerRef.current;
    const series = candleSeriesRef.current;
    if (!el || !series) return;

    const getY = (e: PointerEvent | MouseEvent) => {
      const rect = el.getBoundingClientRect();
      return e.clientY - rect.top;
    };

    const threshold = 6; // px distance to "grab" the line

    const nearestLine = (y: number): 'tp' | 'sl' | null => {
      if (!position) return null;
      const tpY = tp != null ? series.priceToCoordinate(tp) : null;
      const slY = sl != null ? series.priceToCoordinate(sl) : null;
      let best: { target: 'tp' | 'sl' | null; dist: number } = { target: null, dist: Infinity };
      if (tpY != null) {
        const d = Math.abs(y - tpY);
        if (d < best.dist) best = { target: 'tp', dist: d };
      }
      if (slY != null) {
        const d = Math.abs(y - slY);
        if (d < best.dist) best = { target: 'sl', dist: d };
      }
      return best.dist <= threshold ? best.target : null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const y = getY(e);
      if (!dragging) {
        const near = nearestLine(y);
        (el as HTMLElement).style.cursor = near ? 'ns-resize' : 'default';
        return;
      }
      const price = series.coordinateToPrice(y);
      if (price == null) return;
      if (dragTarget === 'tp') setTp(price);
      else if (dragTarget === 'sl') setSl(price);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!position) return;
      const y = getY(e);
      const near = nearestLine(y);
      if (near) {
        setDragTarget(near);
        setDragging(true);
        e.preventDefault();
      }
    };

    const onPointerUp = () => {
      if (dragging) {
        setDragging(false);
        setDragTarget(null);
        (el as HTMLElement).style.cursor = 'default';
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      (el as HTMLElement).style.cursor = 'default';
    };
  }, [position, tp, sl, dragging, dragTarget]);

  // Auto-close on TP/SL using actual candle data
  useEffect(() => {
    if (!position || entryPrice == null || !currentCandle) return;
    
    // Check if TP/SL hit based on candle high/low
    if (tp != null) {
      if (position === 'long' && currentCandle.high >= tp) {
        closePosition(tp);
        return;
      }
      if (position === 'short' && currentCandle.low <= tp) {
        closePosition(tp);
        return;
      }
    }
    if (sl != null) {
      if (position === 'long' && currentCandle.low <= sl) {
        closePosition(sl);
        return;
      }
      if (position === 'short' && currentCandle.high >= sl) {
        closePosition(sl);
        return;
      }
    }
    publishState();
  }, [idx, position, entryPrice, tp, sl]);


  // Publish state up
  const publishState = () => {
    let unrealized = 0;
    if (position && entryPrice != null) {
      unrealized = position === 'long' ? currentPrice - entryPrice : entryPrice - currentPrice;
    }
    onStateChange?.({
      currentTime,
      currentPrice,
      position,
      entryPrice,
      pnl: unrealized,
      balance,
      trades,
      speed,
    });
  };

  useEffect(() => { publishState(); }, [currentPrice, position, entryPrice, balance, trades, speed]);


  // Trading actions
  const openLong = () => {
    if (position) { toast({ title: 'Position Active', description: 'Close your current position first', variant: 'destructive' }); return; }
    setPosition('long');
    setEntryPrice(currentPrice);
    setTp(currentPrice * 1.01);
    setSl(currentPrice * 0.99);
    toast({ title: 'Long Opened', description: `Entry: $${currentPrice.toFixed(2)}` });
  };
  const openShort = () => {
    if (position) { toast({ title: 'Position Active', description: 'Close your current position first', variant: 'destructive' }); return; }
    setPosition('short');
    setEntryPrice(currentPrice);
    setTp(currentPrice * 0.99);
    setSl(currentPrice * 1.01);
    toast({ title: 'Short Opened', description: `Entry: $${currentPrice.toFixed(2)}` });
  };

  const closePosition = (exitAt?: number) => {
    if (!position || entryPrice == null) return;
    const exitPrice = exitAt ?? currentPrice;
    const profit = position === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;
    setBalance(b => b + profit);
    setTrades(t => [
      ...t,
      { id: t.length + 1, type: position, entryPrice, exitPrice, entryTime: currentTime, exitTime: currentTime, pnl: profit }
    ]);
    toast({ title: 'Position Closed', description: `P&L: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`, variant: profit >= 0 ? 'default' : 'destructive' });
    setPosition(null);
    setEntryPrice(null);
    setTp(null);
    setSl(null);
  };

  // Replay controls
  const togglePlay = () => {
    if (data.length === 0) {
      toast({ title: 'No Data', description: 'Wait for data to load first', variant: 'destructive' });
      return;
    }
    setIsPlaying(p => !p);
  };
  
  const reset = () => { 
    setIsPlaying(false); 
    setIdx(50); 
    setPosition(null);
    setEntryPrice(null);
    setTp(null);
    setSl(null);
    setBalance(initialBalance);
    setTrades([]);
    toast({ title: 'Reset', description: 'Replay restarted' });
  };
  
  const skipForward = () => setIdx(v => Math.min(v + 50, data.length - 1));
  const skipBack = () => setIdx(v => Math.max(v - 50, 50));
  const incSpeed = () => setSpeed(s => Math.min(s * 2, 16));
  const decSpeed = () => setSpeed(s => Math.max(s / 2, 0.25));
  
  const updateTp = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) setTp(num);
  };
  
  const updateSl = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) setSl(num);
  };

  return (
    <div className="relative w-full rounded-lg bg-card overflow-hidden">
      <div ref={containerRef} className="w-full h-[600px]" />

      {/* Overlay controls inside chart area */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 pointer-events-none">
        {/* Top-left replay controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={decSpeed}><Rewind className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={skipBack}><SkipBack className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={togglePlay} className="min-w-[80px]">
            {isPlaying ? (<><Pause className="w-4 h-4 mr-2" />Pause</>) : (<><Play className="w-4 h-4 mr-2" />Play</>)}
          </Button>
          <Button variant="outline" size="sm" onClick={skipForward}><SkipForward className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={incSpeed}><FastForward className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-4 h-4" /></Button>
          <div className="flex items-center gap-2 ml-2">
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

        {/* Bottom-left trading controls */}
        <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
          <Button onClick={openLong} disabled={!!position} className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
            <TrendingUp className="w-4 h-4 mr-2" />Long
          </Button>
          <Button onClick={openShort} disabled={!!position} className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
            <TrendingDown className="w-4 h-4 mr-2" />Short
          </Button>
          <Button onClick={() => closePosition()} disabled={!position} variant="outline">
            <Target className="w-4 h-4 mr-2" />Close
          </Button>
          {position && (
            <div className="ml-4 flex items-center gap-3 text-xs bg-background/80 backdrop-blur rounded px-3 py-2 border border-border">
              <div className="flex items-center gap-2">
                <span className="text-green-500">TP:</span>
                <Input 
                  type="number" 
                  value={tp || ''} 
                  onChange={(e) => updateTp(e.target.value)}
                  className="w-24 h-7 text-xs"
                  step="0.01"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">SL:</span>
                <Input 
                  type="number" 
                  value={sl || ''} 
                  onChange={(e) => updateSl(e.target.value)}
                  className="w-24 h-7 text-xs"
                  step="0.01"
                />
              </div>
            </div>
          )}
        </div>

        {/* Top-right info */}
        <div className="pointer-events-none self-end text-right text-xs bg-background/80 backdrop-blur rounded px-3 py-2 border border-border">
          <div className="text-muted-foreground">{new Date(currentTime * 1000).toLocaleString()}</div>
          <div className="font-mono font-bold text-primary text-lg">${currentPrice.toFixed(2)}</div>
          <div className="text-muted-foreground mt-1">Candle {idx} / {data.length}</div>
        </div>
      </div>
    </div>
  );
};

export default BacktestChart;
