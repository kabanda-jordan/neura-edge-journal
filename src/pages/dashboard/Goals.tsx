import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus } from "lucide-react";

export const Goals = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Trading Goals</span>
          </h1>
          <p className="text-muted-foreground">Set and track your trading objectives</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>Track progress towards your trading milestones</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Target className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No goals set</h3>
            <p className="text-muted-foreground mb-6">Set your first trading goal to start tracking progress</p>
            <Button>Set First Goal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
