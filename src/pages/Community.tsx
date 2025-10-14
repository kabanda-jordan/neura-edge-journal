import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const communityStats = [
  { label: "Active Members", value: "15,000+", icon: Users },
  { label: "Daily Discussions", value: "500+", icon: MessageSquare },
  { label: "Success Stories", value: "2,300+", icon: Trophy },
  { label: "Expert Mentors", value: "150+", icon: Sparkles },
];

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              Join The <span className="text-gradient">Trading Community</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with thousands of traders, share strategies, and grow together
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-gradient-to-r from-primary to-accent" size="lg">
                Join Discord Server
              </Button>
              <Button variant="outline" className="border-primary/30" size="lg">
                Browse Forums
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {communityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-card text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl text-gradient">{stat.value}</CardTitle>
                    <CardDescription>{stat.label}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Weekly Trading Challenges</CardTitle>
                <CardDescription>
                  Compete with other traders in weekly challenges and win prizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-primary/30">
                  View Current Challenge
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Live Trading Sessions</CardTitle>
                <CardDescription>
                  Join daily live sessions with experienced traders and mentors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-primary/30">
                  See Schedule
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Strategy Library</CardTitle>
                <CardDescription>
                  Access hundreds of trading strategies shared by the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-primary/30">
                  Explore Strategies
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
