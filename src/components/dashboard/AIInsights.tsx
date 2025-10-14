import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const insights = [
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Overtrading Pattern Detected",
    message: "You tend to take more trades after 2 consecutive losses. Consider setting a daily trade limit.",
    color: "text-yellow-500",
  },
  {
    type: "success",
    icon: TrendingUp,
    title: "Strong Morning Performance",
    message: "Your win rate is 15% higher during the first 2 hours of market open. Focus on this time window.",
    color: "text-accent",
  },
  {
    type: "tip",
    icon: Lightbulb,
    title: "Risk Management Improvement",
    message: "Trades with risk-reward ratio above 1:2 have 67% win rate. Aim for better setups.",
    color: "text-primary",
  },
];

export const AIInsights = () => {
  const [question, setQuestion] = useState("");
  const [showChat, setShowChat] = useState(false);

  return (
    <Card className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-10 h-10 rounded-lg flex items-center justify-center animate-glow">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI Insights</h3>
            <p className="text-sm text-muted-foreground">Personalized trading analysis</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-primary/50 text-primary hover:bg-primary/10"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? "Hide Chat" : "Ask AI"}
        </Button>
      </div>

      {showChat && (
        <div className="mb-6 space-y-3 animate-slide-up">
          <Textarea
            placeholder="Ask me anything about your trading performance..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="bg-background/50 border-border resize-none"
            rows={3}
          />
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Get AI Analysis
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
