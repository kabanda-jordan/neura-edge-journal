import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const Performance = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Performance</span>
        </h1>
        <p className="text-muted-foreground">Monitor your overall trading performance</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Your key performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Performance data will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
