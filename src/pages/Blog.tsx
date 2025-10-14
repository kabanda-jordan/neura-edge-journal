import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "10 Common Trading Mistakes and How to Avoid Them",
    excerpt: "Learn from the most common pitfalls that traders face and discover strategies to overcome them.",
    category: "Trading Psychology",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    link: "https://www.ig.com/en/trading-strategies/top-10-common-trading-mistakes-and-how-to-avoid-them-190123",
  },
  {
    title: "The Power of Trading Journals: Key to Consistent Success",
    excerpt: "Why every successful trader keeps a detailed journal and how you can use yours to improve performance.",
    category: "Education",
    date: "Jan 12, 2025",
    readTime: "6 min read",
    link: "http://tradingview.com/chart/GBPUSD/aq9Q9adz-The-Power-of-a-Trading-Journal-Key-to-Consistent-Success/",
  },
  {
    title: "Using AI to Analyze Your Trading Patterns",
    excerpt: "Discover how artificial intelligence can help identify hidden patterns in your trading behavior.",
    category: "Technology",
    date: "Jan 8, 2025",
    readTime: "10 min read",
    link: "https://docs.google.com/document/d/18ZCLv1YlKlwhhicZ8Iw3Y8DLwyLMB4xAjP32tNly2EA/edit?usp=sharing",
  },
  {
    title: "About TradeMind: Our Story and Mission",
    excerpt: "Learn about how TradeMind was founded to help traders succeed through intelligent journaling and AI-powered analytics.",
    category: "Company",
    date: "Jan 5, 2025",
    readTime: "5 min read",
    link: "/about",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient">Trading Insights</span> & Resources
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert tips, strategies, and guides to help you become a better trader
            </p>
          </div>

          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="glass-card hover:border-primary/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="text-primary font-medium">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a 
                    href={post.link}
                    target={post.link.startsWith('http') ? "_blank" : undefined}
                    rel={post.link.startsWith('http') ? "noopener noreferrer" : undefined}
                  >
                    <Button variant="ghost" className="group/btn text-primary">
                      Read More 
                      {post.link.startsWith('http') ? (
                        <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      )}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
