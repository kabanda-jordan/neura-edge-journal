import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, FileText, TrendingUp, Target, Brain, ExternalLink } from "lucide-react";

const learningCategories = [
  {
    icon: Brain,
    title: "Trading Psychology",
    description: "Master the mental game of trading",
    lessons: [
      { title: "Managing Emotions in Trading", duration: "15 min", type: "Article" },
      { title: "Building Discipline and Patience", duration: "20 min", type: "Video" },
      { title: "Overcoming Fear and Greed", duration: "12 min", type: "Article" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Technical Analysis",
    description: "Learn chart patterns and indicators",
    lessons: [
      { title: "Understanding Support & Resistance", duration: "18 min", type: "Video" },
      { title: "Moving Averages Explained", duration: "10 min", type: "Article" },
      { title: "RSI and Momentum Indicators", duration: "14 min", type: "Video" },
    ],
  },
  {
    icon: Target,
    title: "Risk Management",
    description: "Protect your capital and maximize returns",
    lessons: [
      { title: "Position Sizing Fundamentals", duration: "16 min", type: "Article" },
      { title: "Setting Stop Losses Effectively", duration: "12 min", type: "Video" },
      { title: "The 2% Rule Explained", duration: "8 min", type: "Article" },
    ],
  },
];

export const Learning = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Learning Center</span>
        </h1>
        <p className="text-muted-foreground">Improve your trading skills with educational resources</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card key={index} className="glass-card hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {lesson.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                      </div>
                      {lesson.type === "Video" ? (
                        <Video className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-primary/30 hover:bg-primary/10"
                  asChild
                >
                  <a 
                    href={
                      category.title === "Trading Psychology" 
                        ? "https://www.youtube.com/watch?v=cdsDagmrnLI"
                        : category.title === "Technical Analysis"
                        ? "https://www.youtube.com/watch?v=pWkwxYR0eZY"
                        : "https://www.youtube.com/watch?v=qN0-ltRAcV4"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View All Lessons
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Trading Journal Best Practices</CardTitle>
              <CardDescription>Learn how to maximize your journal for better results</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Discover proven techniques for documenting your trades, analyzing patterns, and 
            continuously improving your trading strategy through journaling.
          </p>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90" asChild>
            <a 
              href="https://www.youtube.com/watch?v=gW45JtNcFHc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Learning
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
