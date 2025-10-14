import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export const Learning = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Learning Center</span>
        </h1>
        <p className="text-muted-foreground">Improve your trading skills with educational resources</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Educational Content</CardTitle>
          <CardDescription>Learn from your trades and improve your strategy</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Lightbulb className="w-16 h-16 text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Learning resources will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
