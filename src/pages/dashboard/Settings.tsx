import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export const Settings = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-muted-foreground">Configure your trading preferences</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>Customize your Trademind experience</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <SettingsIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Settings options will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
