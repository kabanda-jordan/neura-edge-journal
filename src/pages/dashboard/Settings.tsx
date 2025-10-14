import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, DollarSign, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive trade updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Trade Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of trade milestones</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Performance Reports</Label>
              <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trading Preferences
          </CardTitle>
          <CardDescription>Set your default trading parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Risk Percentage</Label>
            <Select defaultValue="2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1% per trade</SelectItem>
                <SelectItem value="2">2% per trade</SelectItem>
                <SelectItem value="3">3% per trade</SelectItem>
                <SelectItem value="5">5% per trade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default Timeframe</Label>
            <Select defaultValue="1H">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5M">5 Minutes</SelectItem>
                <SelectItem value="15M">15 Minutes</SelectItem>
                <SelectItem value="1H">1 Hour</SelectItem>
                <SelectItem value="4H">4 Hours</SelectItem>
                <SelectItem value="1D">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Currency & Display
          </CardTitle>
          <CardDescription>Configure display preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Currency</Label>
            <Select defaultValue="USD">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
