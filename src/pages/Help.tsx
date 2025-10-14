import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, MessageCircle, FileText, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const helpCategories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    articles: 12,
  },
  {
    icon: FileText,
    title: "Trading Journal",
    description: "How to track and analyze your trades",
    articles: 18,
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step visual guides",
    articles: 8,
  },
  {
    icon: MessageCircle,
    title: "FAQ",
    description: "Answers to common questions",
    articles: 24,
  },
];

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              How Can We <span className="text-gradient">Help You</span>?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Search our knowledge base or browse categories below
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help articles..." 
                className="pl-12 h-14 text-lg glass-card border-primary/20"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index} 
                  className="glass-card hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.articles} articles
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="glass-card border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Still Need Help?</CardTitle>
              <CardDescription className="text-base">
                Our support team is here to assist you
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-4">
              <Button className="bg-gradient-to-r from-primary to-accent">
                Contact Support
              </Button>
              <Button variant="outline" className="border-primary/30">
                Join Discord Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
