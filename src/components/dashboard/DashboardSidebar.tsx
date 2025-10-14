import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp, 
  Lightbulb, 
  Target,
  Settings,
  User,
  FileText,
  BarChart3,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Trade Journal", path: "/dashboard/journal", icon: BookOpen },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { name: "Performance", path: "/dashboard/performance", icon: TrendingUp },
  { name: "Playbooks", path: "/dashboard/playbooks", icon: FileText },
  { name: "AI Insights", path: "/dashboard/insights", icon: Brain },
  { name: "Goals", path: "/dashboard/goals", icon: Target },
  { name: "Learning", path: "/dashboard/learning", icon: Lightbulb },
  { name: "Profile", path: "/dashboard/profile", icon: User },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export const DashboardSidebar = () => {
  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 glass-card border-r border-border/50 pt-20 overflow-y-auto z-10">
      <div className="px-4 py-6">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-primary/10 hover:text-primary group",
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        "group-hover:scale-110",
                        isActive && "text-primary"
                      )} 
                    />
                    <span className="font-medium">{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
