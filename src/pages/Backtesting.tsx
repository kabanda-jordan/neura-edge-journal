import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Backtesting = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">
                Backtest & <span className="text-gradient">Replay Trades</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Test your strategies with real market data from TradingView. Replay your trades and discover what works.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="glass-card">
                <CardHeader>
                  <PlayCircle className="w-12 h-12 text-primary mb-2" />
                  <CardTitle>Trade Replay</CardTitle>
                  <CardDescription>
                    Replay your historical trades with real chart data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Review your past trades with TradingView charts to understand exactly what happened 
                    at the time of entry and exit. Identify patterns and improve your decision-making.
                  </p>
                  <Link to="/auth">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent">
                      Start Replaying
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <BarChart3 className="w-12 h-12 text-primary mb-2" />
                  <CardTitle>Strategy Backtesting</CardTitle>
                  <CardDescription>
                    Test your trading strategies on historical data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Validate your trading ideas before risking real capital. Run your strategies against 
                    years of market data and see how they would have performed.
                  </p>
                  <Link to="/auth">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent">
                      Start Backtesting
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="glass-card p-8 rounded-xl mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Powerful Backtesting Features
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real Market Data</h3>
                  <p className="text-muted-foreground">
                    Access historical price data from TradingView for accurate backtesting results
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Custom Time Ranges</h3>
                  <p className="text-muted-foreground">
                    Test your strategies across any time period to validate their consistency
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Detailed Analytics</h3>
                  <p className="text-muted-foreground">
                    Get comprehensive performance metrics and visual reports for your backtests
                  </p>
                </div>
              </div>
            </div>

            {/* TradingView Integration */}
            <div className="glass-card p-8 rounded-xl text-center">
              <h2 className="text-3xl font-bold mb-4">
                Powered by TradingView
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Our backtesting and replay features use real chart data from TradingView, 
                giving you the most accurate and professional trading analysis tools available.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-lg px-8">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Backtesting;
