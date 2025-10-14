import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const Analytics = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Analytics</span>
        </h1>
        <p className="text-muted-foreground">Deep dive into your trading patterns and metrics</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Win Rate Analysis</CardTitle>
            <CardDescription>Track your success rate over time</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chart will display here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Profit Factor</CardTitle>
            <CardDescription>Analyze your risk vs reward ratio</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-accent mx-auto mb-4" />
              <p className="text-muted-foreground">Chart will display here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
