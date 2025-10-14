import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import trademindLogo from "@/assets/trademind-logo.png";

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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    ...(session ? [{ name: "Dashboard", path: "/dashboard" }] : []),
    { name: "Pricing", path: "/#pricing" },
    { name: "Resources", path: "/#resources" },
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
            <span className="text-2xl font-bold text-gradient">Trademind</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
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
                  <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up border-t border-border/40">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 transition-colors ${
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="space-y-4 mt-6">
              {session ? (
                <>
                  <Link to="/dashboard" className="block">
                    <Button variant="outline" className="w-full border-primary/50 text-primary">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full text-muted-foreground"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block">
                    <Button variant="outline" className="w-full border-primary/50 text-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" className="block">
                    <Button className="w-full bg-gradient-to-r from-primary to-accent text-background">
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
