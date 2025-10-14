import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, TrendingUp } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for beginners starting their trading journey",
    icon: Zap,
    features: [
      "Up to 50 trades/month",
      "Basic analytics",
      "Trading journal",
      "Email support",
      "Mobile access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious traders who want advanced insights",
    icon: TrendingUp,
    features: [
      "Unlimited trades",
      "Advanced analytics",
      "AI-powered insights",
      "Custom playbooks",
      "Priority support",
      "Performance reports",
      "Goal tracking",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "$79",
    period: "/month",
    description: "Everything you need to trade like a professional",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Broker API integration",
      "Real-time sync",
      "Custom indicators",
      "White-glove support",
      "Advanced backtesting",
      "Portfolio optimization",
      "1-on-1 strategy sessions",
    ],
    popular: false,
  },
];

export const Subscription = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Subscription</span>
        </h1>
        <p className="text-muted-foreground">Choose the perfect plan for your trading needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <Card
              key={index}
              className={`glass-card relative ${
                plan.popular ? "border-primary/50 shadow-lg shadow-primary/10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-background font-semibold px-4">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      : "bg-muted/50 hover:bg-muted text-foreground"
                  }`}
                >
                  {plan.popular ? "Upgrade Now" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Manage your active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Free Trial</h3>
                <p className="text-sm text-muted-foreground">Active until you choose a plan</p>
              </div>
            </div>
            <Badge variant="secondary">Free</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
