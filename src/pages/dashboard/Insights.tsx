import { AIInsights } from "@/components/dashboard/AIInsights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

export const Insights = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">AI Insights</span>
        </h1>
        <p className="text-muted-foreground">Get personalized trading insights powered by AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AIInsights />
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Pattern Recognition</CardTitle>
            <CardDescription>AI-detected trading patterns</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
              <p className="text-muted-foreground">Pattern analysis will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
