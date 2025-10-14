import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-bg.jpg";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center animate-slide-up">
        <div className="max-w-5xl mx-auto space-y-8">
          <p className="text-primary font-semibold mb-4 uppercase tracking-wide">Welcome to Trademind</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Everything you ever
            <span className="text-gradient block mt-2">wanted to know</span>
            <span className="block mt-2">about your trading...</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            ...but your spreadsheets never told you. Discover metrics that matter and behaviors that lead to profit with the power of journaling and analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-semibold group"
              >
                Get Started Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-primary/50 text-primary hover:bg-primary/10"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
