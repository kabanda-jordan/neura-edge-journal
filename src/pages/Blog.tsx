import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "10 Common Trading Mistakes and How to Avoid Them",
    excerpt: "Learn from the most common pitfalls that traders face and discover strategies to overcome them.",
    category: "Trading Psychology",
    date: "Dec 10, 2024",
    readTime: "5 min read",
  },
  {
    title: "The Power of Trading Journals: A Complete Guide",
    excerpt: "Why every successful trader keeps a detailed journal and how you can use yours to improve performance.",
    category: "Education",
    date: "Dec 8, 2024",
    readTime: "7 min read",
  },
  {
    title: "Using AI to Analyze Your Trading Patterns",
    excerpt: "Discover how artificial intelligence can help identify hidden patterns in your trading behavior.",
    category: "Technology",
    date: "Dec 5, 2024",
    readTime: "6 min read",
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
                  <Button variant="ghost" className="group/btn text-primary">
                    Read More 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
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
