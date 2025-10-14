import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const Legal = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-center">
              Privacy & <span className="text-gradient">Terms</span>
            </h1>
            
            <div className="space-y-12">
              {/* Privacy Policy */}
              <section className="glass-card p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">Privacy Policy</h2>
                </div>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h3>
                    <p>
                      We collect information that you provide directly to us, including your name, email address, 
                      and trading data that you choose to input into our platform. This information is used solely 
                      to provide you with our services and improve your trading journal experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h3>
                    <p>
                      Your trading data is used to generate analytics, insights, and performance reports. We use 
                      AI technology to analyze patterns in your trading behavior and provide personalized recommendations. 
                      Your data is never shared with third parties or used for any purpose other than providing our services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Data Security</h3>
                    <p>
                      We implement industry-standard security measures to protect your data. All data is encrypted 
                      in transit and at rest. We regularly update our security protocols to ensure your trading 
                      information remains safe and confidential.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Your Rights</h3>
                    <p>
                      You have the right to access, modify, or delete your personal data at any time. You can 
                      export your trading journal data or close your account whenever you wish. We respect your 
                      privacy and give you full control over your information.
                    </p>
                  </div>
                </div>
              </section>

              {/* Terms of Service */}
              <section className="glass-card p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">Terms of Service</h2>
                </div>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Acceptance of Terms</h3>
                    <p>
                      By accessing and using TradeMind, you accept and agree to be bound by these Terms of Service. 
                      If you do not agree to these terms, please do not use our platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Use of Service</h3>
                    <p>
                      TradeMind is a trading journal and analytics platform. We provide tools to help you track 
                      and analyze your trading performance. Our platform does not provide investment advice, and 
                      all trading decisions are your own responsibility.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Subscription and Payments</h3>
                    <p>
                      We offer both free and paid subscription tiers. Paid subscriptions are billed monthly or 
                      annually as selected. You can cancel your subscription at any time. Refunds are provided 
                      in accordance with our refund policy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Disclaimer</h3>
                    <p>
                      TradeMind is provided "as is" without any warranties. We do not guarantee trading profits 
                      or specific results. Past performance does not indicate future results. Trading involves 
                      risk, and you should only trade with capital you can afford to lose.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Modifications to Service</h3>
                    <p>
                      We reserve the right to modify, suspend, or discontinue any part of our service at any time. 
                      We will provide notice of significant changes to these terms or our service.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="glass-card p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">Questions?</h2>
                </div>
                
                <p className="text-muted-foreground">
                  If you have any questions about our Privacy Policy or Terms of Service, please contact us at{" "}
                  <a 
                    href="mailto:contact.trademindjournal@gmail.com"
                    className="text-primary hover:underline"
                  >
                    contact.trademindjournal@gmail.com
                  </a>
                </p>
                
                <p className="text-muted-foreground mt-4 text-sm">
                  Last updated: January 2025
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
