import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Target, Users, TrendingUp, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-center">
              About <span className="text-gradient">TradeMind</span>
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-xl text-muted-foreground text-center mb-12">
                Empowering traders worldwide with intelligent journaling and analytics
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-12">
                <div className="glass-card p-6 rounded-xl">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To democratize professional-grade trading analytics and make them accessible to every trader, 
                    regardless of experience level. We believe that with the right tools and insights, anyone can 
                    improve their trading performance.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <Sparkles className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become the world's leading trading journal platform, powered by cutting-edge AI technology 
                    that helps traders understand their psychology, refine their strategies, and achieve consistent 
                    profitability.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Our Team</h3>
                  <p className="text-muted-foreground">
                    Founded by experienced traders and software engineers, TradeMind combines deep market knowledge 
                    with innovative technology. Our diverse team is passionate about helping traders succeed through 
                    data-driven insights and intuitive design.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-xl">
                  <TrendingUp className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Our Approach</h3>
                  <p className="text-muted-foreground">
                    We leverage artificial intelligence and advanced analytics to provide traders with actionable 
                    insights. Our platform automatically identifies patterns, tracks performance metrics, and suggests 
                    improvements based on your unique trading style.
                  </p>
                </div>
              </div>

              <div className="glass-card p-8 rounded-xl mt-12">
                <h2 className="text-3xl font-bold mb-4">Why TradeMind?</h2>
                <p className="text-muted-foreground mb-4">
                  Traditional trading journals are time-consuming and offer limited insights. TradeMind automates 
                  the journaling process while providing deep analytics that help you understand what truly drives 
                  your trading success.
                </p>
                <p className="text-muted-foreground">
                  Whether you're a day trader, swing trader, or long-term investor, our platform adapts to your 
                  style and provides personalized recommendations. Join thousands of traders who are already using 
                  TradeMind to level up their game and achieve consistent results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
