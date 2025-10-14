import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing as PricingSection } from "@/components/Pricing";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
