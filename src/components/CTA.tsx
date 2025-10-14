import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-primary font-semibold uppercase tracking-wide">Community</p>
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Thousands of traders are using <span className="text-gradient">Trademind</span> to learn, collab, and improve.
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a vibrant community of traders, learn from webinars, and share with traders all over the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-semibold group"
              >
                Get Started Today
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-primary/50 text-primary hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            10k+ Community Members • 150+ Trader Communities • 100+ Webinars & Bootcamps
          </p>
        </div>
      </div>
    </section>
  );
};
