import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";

export const Playbooks = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Trading Playbooks</span>
          </h1>
          <p className="text-muted-foreground">Create and manage your trading strategies</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Playbook
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Playbooks</CardTitle>
          <CardDescription>Document your proven trading strategies</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No playbooks yet</h3>
            <p className="text-muted-foreground mb-6">Create your first playbook to document trading strategies</p>
            <Button>Create Playbook</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
