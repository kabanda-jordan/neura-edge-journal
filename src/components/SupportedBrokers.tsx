import { Card } from "@/components/ui/card";

const brokers = [
  { name: "Interactive Brokers", logo: "🏦" },
  { name: "TD Ameritrade", logo: "📊" },
  { name: "E*TRADE", logo: "📈" },
  { name: "Charles Schwab", logo: "💼" },
  { name: "Robinhood", logo: "🦅" },
  { name: "Webull", logo: "🐂" },
  { name: "Fidelity", logo: "🎯" },
  { name: "Tastytrade", logo: "🎨" },
  { name: "TradeStation", logo: "🚂" },
  { name: "NinjaTrader", logo: "🥷" },
  { name: "ThinkOrSwim", logo: "💭" },
  { name: "MetaTrader 4/5", logo: "📉" },
];

export const SupportedBrokers = () => {
  return (
    <section id="brokers" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Works With <span className="text-gradient">Your Broker</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly connect with all major trading platforms. Automatic imports make journaling effortless.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {brokers.map((broker, index) => (
            <Card
              key={broker.name}
              className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 hover:border-primary/30 transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">
                {broker.logo}
              </div>
              <p className="text-sm font-medium text-center">{broker.name}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Don't see your broker?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Request integration
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
