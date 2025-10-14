import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Code, Webhook, Key, Database } from "lucide-react";

const apiSections = [
  {
    icon: Code,
    title: "API Reference",
    description: "Complete documentation for all API endpoints",
  },
  {
    icon: Key,
    title: "Authentication",
    description: "Learn how to authenticate your API requests",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Set up real-time notifications for your app",
  },
  {
    icon: Database,
    title: "Data Models",
    description: "Understand the structure of our data",
  },
];

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              API <span className="text-gradient">Documentation</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Build powerful integrations with Trademind's API
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {apiSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card 
                  key={index} 
                  className="glass-card p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {section.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <Card className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
            <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm">
              <code className="text-primary">
                curl -X GET https://api.trademind.com/v1/trades \<br />
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                &nbsp;&nbsp;-H "Content-Type: application/json"
              </code>
            </div>
            <p className="text-muted-foreground mt-4">
              Get started by making your first API request. Visit our{" "}
              <a href="#" className="text-primary hover:underline">
                authentication guide
              </a>{" "}
              to obtain your API key.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Docs;
