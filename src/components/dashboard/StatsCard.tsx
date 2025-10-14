import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  positive?: boolean;
}

export const StatsCard = ({ title, value, change, icon: Icon, positive = true }: StatsCardProps) => {
  return (
    <div className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-12 h-12 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <span className={`text-sm font-semibold ${positive ? "text-accent" : "text-destructive"}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
};
