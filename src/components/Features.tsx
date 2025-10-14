import { BarChart3, BookOpen, TrendingUp, Zap, Users, Brain, Target, Activity } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Automated Journaling",
    description: "Connect your broker for automatic trade imports. Upload files or add trades manually with ease.",
  },
  {
    icon: Target,
    title: "Performance Analytics",
    description: "Access 50+ detailed reports to understand your trading behaviors, strengths, and weaknesses.",
  },
  {
    icon: BookOpen,
    title: "Trading Playbooks",
    description: "Create and track your strategy rules. Analyze performance over time and optimize your edge.",
  },
  {
    icon: TrendingUp,
    title: "Backtesting & Replay",
    description: "Test strategies with historical data. Replay your trades to identify patterns and improve.",
  },
  {
    icon: Brain,
    title: "AI Trade Analysis",
    description: "Get personalized insights powered by AI. Understand what drives your profitable trades.",
  },
  {
    icon: Activity,
    title: "Real-Time Statistics",
    description: "Track your progress with live stats. Monitor win rate, profit factor, and key metrics instantly.",
  },
  {
    icon: Users,
    title: "Mentor Mode",
    description: "Share your trades with mentors or friends. Get feedback and collaborate to level up faster.",
  },
  {
    icon: Zap,
    title: "Multi-Account Support",
    description: "Manage unlimited trading accounts seamlessly. Track performance across all your portfolios.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <p className="text-primary font-semibold mb-2 uppercase tracking-wide">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to <span className="text-gradient">master trading</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional-grade tools used by thousands of traders worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 group animate-slide-up border border-primary/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg w-fit group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-gradient transition-all">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
