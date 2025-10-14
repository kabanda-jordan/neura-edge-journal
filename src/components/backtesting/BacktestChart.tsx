import React, { useEffect, useMemo, useRef, useState } from "react";
import { createChart, ISeriesApi, Time, CandlestickSeriesOptions, CrosshairMode } from "lightweight-charts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, Target, FastForward, Rewind, SkipForward, SkipBack } from "lucide-react";

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
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const { toast } = useToast();

  // Replay and trading state
  const [data, setData] = useState<Candle[]>([]);
  const [idx, setIdx] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // multiplier
  const timerRef = useRef<number | null>(null);

  const [position, setPosition] = useState<PositionType>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [tp, setTp] = useState<number | null>(null);
  const [sl, setSl] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Price lines
  const entryLineRef = useRef<ReturnType<ISeriesApi<'Candlestick'>['createPriceLine']> | null>(null);
  const tpLineRef = useRef<ReturnType<ISeriesApi<'Candlestick'>['createPriceLine']> | null>(null);
  const slLineRef = useRef<ReturnType<ISeriesApi<'Candlestick'>['createPriceLine']> | null>(null);

  // Dragging
  const dragTargetRef = useRef<'tp' | 'sl' | null>(null);
  const isMouseDownRef = useRef(false);

  const mappedSymbol = useMemo(() => mapSymbolToBinance(symbol), [symbol]);
  const mappedTf = useMemo(() => mapTimeframe(timeframe), [timeframe]);
  const startMs = useMemo(() => new Date(startDate).getTime(), [startDate]);

  const currentCandle = data[Math.max(0, Math.min(idx - 1, data.length - 1))];
  const currentPrice = currentCandle?.close ?? 0;
  const currentTime = currentCandle?.time ?? Math.floor(new Date(startDate).getTime() / 1000);

  // Init chart
  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: 'hsl(215 20% 65%)',
      },
      grid: {
        vertLines: { color: 'hsl(215 16% 22%)' },
        horzLines: { color: 'hsl(215 16% 22%)' },
      },
      crosshair: { mode: CrosshairMode.Magnet },
      rightPriceScale: { borderVisible: false },
      timeScale: { rightOffset: 2, secondsVisible: true, borderVisible: false },
    });

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e', downColor: '#ef4444', borderDownColor: '#ef4444', borderUpColor: '#22c55e', wickDownColor: '#ef4444', wickUpColor: '#22c55e',
    } as CandlestickSeriesOptions);

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [mappedSymbol, mappedTf, startMs]);

  // Load data
  useEffect(() => {
    let cancelled = false;
    setIsPlaying(false);
    setIdx(1);
    setTrades([]);
    setPosition(null);
    setEntryPrice(null);
    setTp(null);
    setSl(null);
    setBalance(initialBalance);

    (async () => {
      try {
        const klines = await fetchKlines(mappedSymbol, mappedTf, startMs, 2000);
        if (cancelled) return;
        setData(klines);
        if (seriesRef.current) {
          seriesRef.current.setData(klines.slice(0, 1) as any);
          chartRef.current?.timeScale().fitContent();
        }
        toast({ title: 'Loaded historical data', description: `${mappedSymbol} • ${mappedTf} • ${new Date(startMs).toLocaleDateString()}` });
      } catch (e) {
        console.error(e);
        toast({ title: 'Data Error', description: 'Failed to load historical candles', variant: 'destructive' });
      }
    })();

    return () => { cancelled = true; };
  }, [mappedSymbol, mappedTf, startMs, initialBalance]);

  // Replay timer
  useEffect(() => {
    if (!isPlaying || data.length === 0) return;
    const stepMs = Math.max(100, 800 / speed);
    timerRef.current = window.setInterval(() => {
      setIdx(prev => {
        const next = Math.min(prev + 1, data.length);
        if (seriesRef.current) {
          seriesRef.current.setData(data.slice(0, next) as any);
        }
        return next;
      });
    }, stepMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, data]);

  // Update price lines and auto-close on TP/SL
  useEffect(() => {
    if (!seriesRef.current) return;

    // Update price lines visuals
    if (entryPrice != null) {
      if (!entryLineRef.current) {
        entryLineRef.current = seriesRef.current.createPriceLine({ price: entryPrice, color: '#60a5fa', lineWidth: 2, lineStyle: 0, axisLabelVisible: true, title: 'ENTRY' });
      } else {
        seriesRef.current.removePriceLine(entryLineRef.current);
        entryLineRef.current = seriesRef.current.createPriceLine({ price: entryPrice, color: '#60a5fa', lineWidth: 2, lineStyle: 0, axisLabelVisible: true, title: 'ENTRY' });
      }
    } else if (entryLineRef.current) {
      seriesRef.current.removePriceLine(entryLineRef.current);
      entryLineRef.current = null;
    }

    if (tp != null) {
      if (!tpLineRef.current) {
        tpLineRef.current = seriesRef.current.createPriceLine({ price: tp, color: '#22c55e', lineWidth: 2, lineStyle: 2, axisLabelVisible: true, title: 'TP' });
      } else {
        seriesRef.current.removePriceLine(tpLineRef.current);
        tpLineRef.current = seriesRef.current.createPriceLine({ price: tp, color: '#22c55e', lineWidth: 2, lineStyle: 2, axisLabelVisible: true, title: 'TP' });
      }
    } else if (tpLineRef.current) {
      seriesRef.current.removePriceLine(tpLineRef.current);
      tpLineRef.current = null;
    }

    if (sl != null) {
      if (!slLineRef.current) {
        slLineRef.current = seriesRef.current.createPriceLine({ price: sl, color: '#ef4444', lineWidth: 2, lineStyle: 2, axisLabelVisible: true, title: 'SL' });
      } else {
        seriesRef.current.removePriceLine(slLineRef.current);
        slLineRef.current = seriesRef.current.createPriceLine({ price: sl, color: '#ef4444', lineWidth: 2, lineStyle: 2, axisLabelVisible: true, title: 'SL' });
      }
    } else if (slLineRef.current) {
      seriesRef.current.removePriceLine(slLineRef.current);
      slLineRef.current = null;
    }
  }, [entryPrice, tp, sl]);

  // Auto-close logic when candle completes
  useEffect(() => {
    if (!position || entryPrice == null || data.length === 0) return;
    const c = currentCandle;
    if (!c) return;

    // check tp/sl against candle range
    if (tp != null) {
      if ((position === 'long' && c.high >= tp) || (position === 'short' && c.low <= tp)) {
        closePosition(tp);
        return;
      }
    }
    if (sl != null) {
      if ((position === 'long' && c.low <= sl) || (position === 'short' && c.high >= sl)) {
        closePosition(sl);
        return;
      }
    }
    // otherwise unrealized pnl only
    publishState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

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

  useEffect(() => { publishState(); }, [currentPrice, currentTime, position, entryPrice, balance, trades, speed]);

  // Dragging TP/SL with mouse
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !chartRef.current || !seriesRef.current) return;

    const series = seriesRef.current;
    const priceScale = chartRef.current.priceScale('right');

    const onMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      if (!series || !chartRef.current) return;
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const priceAtY = series.coordinateToPrice(y);
      if (priceAtY == null) return;
      if (tp != null && Math.abs(tp - priceAtY) / priceAtY < 0.002) {
        dragTargetRef.current = 'tp';
      } else if (sl != null && Math.abs(sl - priceAtY) / priceAtY < 0.002) {
        dragTargetRef.current = 'sl';
      }
    };
    const onMouseUp = () => {
      isMouseDownRef.current = false;
      dragTargetRef.current = null;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current || !dragTargetRef.current) return;
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const priceAtY = series.coordinateToPrice(y);
      if (priceAtY == null) return;
      if (dragTargetRef.current === 'tp') setTp(Number(priceAtY));
      if (dragTargetRef.current === 'sl') setSl(Number(priceAtY));
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [tp, sl]);

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
  const togglePlay = () => setIsPlaying(p => !p);
  const reset = () => { setIsPlaying(false); setIdx(1); if (seriesRef.current) seriesRef.current.setData(data.slice(0, 1) as any); };
  const skipForward = () => setIdx(v => Math.min(v + 30, data.length));
  const skipBack = () => setIdx(v => Math.max(v - 30, 1));
  const incSpeed = () => setSpeed(s => Math.min(s * 2, 16));
  const decSpeed = () => setSpeed(s => Math.max(s / 2, 0.5));

  // When idx changes, update series
  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(data.slice(0, idx) as any);
    chartRef.current?.timeScale().scrollToPosition(1, true);
  }, [idx, data]);

  return (
    <div className="relative w-full rounded-lg bg-card">
      <div ref={containerRef} className="w-full h-[600px] rounded-lg" />

      {/* Overlay controls inside chart area */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3">
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
          <div className="text-xs text-muted-foreground ml-2">Speed: {speed}x</div>
        </div>

        {/* Bottom-left trading controls */}
        <div className="pointer-events-auto flex items-center gap-2">
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
            <div className="ml-4 flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">Drag TP/SL lines on chart</span>
              <span>TP: {tp ? `$${tp.toFixed(2)}` : '-'}</span>
              <span>SL: {sl ? `$${sl.toFixed(2)}` : '-'}</span>
            </div>
          )}
        </div>

        {/* Top-right info */}
        <div className="pointer-events-none self-end text-right text-xs bg-background/60 backdrop-blur rounded px-2 py-1">
          <div>{new Date(currentTime * 1000).toLocaleString()}</div>
          <div className="font-mono font-bold text-primary">${currentPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default BacktestChart;
