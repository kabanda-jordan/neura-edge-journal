import { Brain, LineChart, Target, TrendingUp } from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Auto Trade Journaling",
    description: "Automatically log and categorize your trades with intelligent pattern recognition.",
  },
  {
    icon: Brain,
    title: "AI Trade Analysis",
    description: "Get personalized insights and improvement suggestions powered by advanced AI.",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Track your progress with comprehensive metrics and beautiful visualizations.",
  },
  {
    icon: Target,
    title: "Discipline Tracking",
    description: "Monitor your emotional patterns and build consistency with behavioral insights.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Level Up</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to help traders master their craft
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
