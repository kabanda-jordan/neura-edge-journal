import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import alexRivera from "@/assets/testimonials/alex-rivera.jpg";
import sarahChen from "@/assets/testimonials/sarah-chen.jpg";
import marcusThompson from "@/assets/testimonials/marcus-thompson.jpg";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Day Trader",
    content: "This AI changed my trading game. I finally understand my patterns and weaknesses. My win rate improved by 30% in just 2 months.",
    image: alexRivera,
  },
  {
    name: "Sarah Chen",
    role: "Swing Trader",
    content: "The discipline tracker is a game-changer. It keeps me accountable and helps me avoid emotional trading. Best tool I've ever used.",
    image: sarahChen,
  },
  {
    name: "Marcus Thompson",
    role: "Options Trader",
    content: "The AI insights are incredibly accurate. It's like having a trading coach available 24/7. Absolutely worth it.",
    image: marcusThompson,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by{" "}
            <span className="text-gradient">Professional Traders</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our users are saying
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="border-t border-border pt-4 flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
