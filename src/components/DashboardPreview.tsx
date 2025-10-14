import dashboardImage from "@/assets/dashboard-preview.jpg";

export const DashboardPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-glow" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-glow" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Command Center for{" "}
            <span className="text-gradient">Trading Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful dashboard that puts all your insights at your fingertips
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-4 rounded-2xl glow-blue">
            <img
              src={dashboardImage}
              alt="Trading Dashboard Preview"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
