import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export const Journal = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Trade Journal</span>
          </h1>
          <p className="text-muted-foreground">Track and analyze all your trades in one place</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Trade
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Trading History</CardTitle>
          <CardDescription>All trades will appear here once you start journaling</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trades yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first trade to begin tracking</p>
            <Button>Add First Trade</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
