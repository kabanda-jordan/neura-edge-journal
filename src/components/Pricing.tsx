import { useState } from "react";
import { Check, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CryptoPaymentDialog } from "./CryptoPaymentDialog";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Up to 15 trades per month",
      "Basic analytics & reports",
      "Manual trade entry",
      "7-day trade history",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$3.99",
    description: "For serious traders",
    features: [
      "Unlimited trades",
      "Advanced analytics & 50+ reports",
      "Automated broker imports",
      "Unlimited trade history",
      "AI-powered insights",
      "Trading playbooks",
      "Backtesting tools",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
];

export const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [cryptoDialogOpen, setCryptoDialogOpen] = useState(false);

  const handleCryptoPayment = (plan: { name: string; price: string }) => {
    setSelectedPlan(plan);
    setCryptoDialogOpen(true);
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your trading journey. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`glass-card relative ${
                plan.popular ? "border-2 border-primary shadow-lg shadow-primary/20 scale-105" : ""
              } hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent text-background px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4">
                  {plan.description}
                </CardDescription>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <Link to="/auth" className="block">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background"
                          : "border-primary/30 hover:bg-primary/10"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  
                  <Button
                    onClick={() => handleCryptoPayment(plan)}
                    variant="outline"
                    className="w-full border-primary/20 hover:border-primary/40 hover:bg-primary/5 group transition-all"
                  >
                    <Wallet className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                    Pay with Crypto
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-12 text-sm">
          All plans include 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>

      {selectedPlan && (
        <CryptoPaymentDialog
          open={cryptoDialogOpen}
          onOpenChange={setCryptoDialogOpen}
          plan={selectedPlan}
        />
      )}
    </section>
  );
};
