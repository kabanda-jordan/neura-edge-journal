import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const widgetRef = useRef<any>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
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

  // Init TradingView chart
  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined' && containerRef.current) {
        try {
          widgetRef.current = new (window as any).TradingView.widget({
            container_id: 'tv_chart_container',
            autosize: true,
            symbol: `BINANCE:${mappedSymbol}`,
            interval: mappedTf,
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#0a0a0a',
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            studies: []
          });
        } catch (e) {
          console.error('TradingView widget initialization error:', e);
        }
      }
    };
    
    scriptRef.current = script;
    document.head.appendChild(script);

    return () => {
      // Cleanup widget
      if (widgetRef.current) {
        try {
          if (typeof widgetRef.current.remove === 'function') {
            widgetRef.current.remove();
          }
        } catch (e) {
          console.error('Widget cleanup error:', e);
        }
        widgetRef.current = null;
      }
      
      // Cleanup script
      if (scriptRef.current && scriptRef.current.parentNode) {
        try {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        } catch (e) {
          console.error('Script cleanup error:', e);
        }
        scriptRef.current = null;
      }
    };
  }, [mappedSymbol, mappedTf]);

  // Initialize replay state
  useEffect(() => {
    setIsPlaying(false);
    setIdx(1);
    setTrades([]);
    setPosition(null);
    setEntryPrice(null);
    setTp(null);
    setSl(null);
    setBalance(initialBalance);
    setData([]);
    
    toast({ title: 'Chart Ready', description: `${mappedSymbol} • Interval: ${mappedTf}` });
  }, [mappedSymbol, mappedTf, initialBalance]);

  // Replay timer (simplified for TradingView)
  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = Math.max(100, 800 / speed);
    timerRef.current = window.setInterval(() => {
      setIdx(prev => prev + 1);
    }, stepMs);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  // Auto-close on TP/SL (simplified simulation)
  useEffect(() => {
    if (!position || entryPrice == null) return;
    
    // Simulate price movement
    const simulatedPrice = currentPrice + (Math.random() - 0.5) * currentPrice * 0.001;
    
    if (tp != null) {
      if ((position === 'long' && simulatedPrice >= tp) || (position === 'short' && simulatedPrice <= tp)) {
        closePosition(tp);
        return;
      }
    }
    if (sl != null) {
      if ((position === 'long' && simulatedPrice <= sl) || (position === 'short' && simulatedPrice >= sl)) {
        closePosition(sl);
        return;
      }
    }
    publishState();
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
  const togglePlay = () => setIsPlaying(p => !p);
  const reset = () => { setIsPlaying(false); setIdx(1); };
  const skipForward = () => setIdx(v => v + 30);
  const skipBack = () => setIdx(v => Math.max(v - 30, 1));
  const incSpeed = () => setSpeed(s => Math.min(s * 2, 16));
  const decSpeed = () => setSpeed(s => Math.max(s / 2, 0.5));

  return (
    <div className="relative w-full rounded-lg bg-card">
      <div id="tv_chart_container" ref={containerRef} className="w-full h-[600px] rounded-lg" />

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
