import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, TrendingUp, BookOpen, Target, Zap, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import trademindLogo from "@/assets/trademind-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const featuresDropdown = [
    { name: "Automated Journaling", icon: BookOpen, path: "/#features" },
    { name: "Performance Analytics", icon: TrendingUp, path: "/#features" },
    { name: "AI Insights", icon: Zap, path: "/#features" },
    { name: "Trading Playbooks", icon: Target, path: "/#features" },
  ];

  const resourcesDropdown = [
    { name: "Blog", path: "/blog" },
    { name: "Help Center", path: "/help" },
    { name: "API Docs", path: "/docs" },
    { name: "Community", path: "/community" },
  ];

  const isActive = (path: string) => {
    if (path.startsWith("/#")) return false;
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform">
            <img src={trademindLogo} alt="Trademind" className="w-10 h-10" />
            <span className="text-2xl font-bold text-gradient font-display tracking-wider">TRADEMIND</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5">
                Features
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-primary/20 z-50">
                {featuresDropdown.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-primary/10 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Supported Brokers */}
            <Link
              to="/#brokers"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
            >
              Supported Brokers
            </Link>

            {/* Discord */}
            <a
              href="https://discord.gg/R76uPD2n"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
            >
              Discord
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Pricing */}
            <Link
              to="/#pricing"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
            >
              Pricing
            </Link>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5">
                Resources
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card/95 backdrop-blur-xl border-primary/20 z-50">
                {resourcesDropdown.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.path}
                      className="px-3 py-2.5 cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button 
                    variant="ghost" 
                    className="text-foreground hover:text-primary hover:bg-primary/5 font-medium"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 text-background font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-6 space-y-2 animate-slide-up border-t border-border/40">
            {/* Mobile Features */}
            <div className="space-y-1">
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Features</p>
              {featuresDropdown.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/5 transition-colors rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Links */}
            <div className="space-y-1 pt-2">
              <Link
                to="/#brokers"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-primary/5 transition-colors rounded-lg"
              >
                Supported Brokers
              </Link>
              <a
                href="https://discord.gg/R76uPD2n"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/5 transition-colors rounded-lg"
              >
                Discord
                <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                to="/#pricing"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm hover:bg-primary/5 transition-colors rounded-lg"
              >
                Pricing
              </Link>
            </div>

            {/* Mobile Resources */}
            <div className="space-y-1 pt-2">
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resources</p>
              {resourcesDropdown.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-primary/5 transition-colors rounded-lg"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="space-y-3 pt-6 px-4">
              {session ? (
                <>
                  <Link to="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-primary/30 text-primary">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                    variant="ghost"
                    className="w-full text-muted-foreground"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full text-foreground font-medium">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent text-background font-semibold shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
