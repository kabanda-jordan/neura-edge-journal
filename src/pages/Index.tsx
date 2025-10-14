import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
