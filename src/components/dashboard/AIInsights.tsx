import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Insight {
  type: string;
  icon: any;
  title: string;
  message: string;
  color: string;
}

export const AIInsights = () => {
  const [question, setQuestion] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data: trades, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (tradesError) throw tradesError;

      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { trades, type: 'insights' }
      });

      if (error) throw error;

      if (data?.content) {
        try {
          const parsedInsights = JSON.parse(data.content);
          const formattedInsights = parsedInsights.map((insight: any) => ({
            ...insight,
            icon: insight.type === 'warning' ? AlertTriangle : 
                  insight.type === 'success' ? TrendingUp : Lightbulb
          }));
          setInsights(formattedInsights);
        } catch {
          console.error('Failed to parse AI insights');
        }
      }
    } catch (error: any) {
      console.error('Error fetching insights:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const { data: trades, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (tradesError) throw tradesError;

      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { trades, type: 'question', question }
      });

      if (error) throw error;

      if (data?.content) {
        setAnswer(data.content);
      }
    } catch (error: any) {
      console.error('Error asking question:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get answer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <Card className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-10 h-10 rounded-lg flex items-center justify-center animate-glow">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI Insights</h3>
            <p className="text-sm text-muted-foreground">Personalized trading analysis</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-primary/50 text-primary hover:bg-primary/10"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? "Hide Chat" : "Ask AI"}
        </Button>
      </div>

      {showChat && (
        <div className="mb-6 space-y-3 animate-slide-up">
          <Textarea
            placeholder="Ask me anything about your trading performance..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="bg-background/50 border-border resize-none"
            rows={3}
          />
          <Button 
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get AI Analysis'
            )}
          </Button>
          {answer && (
            <div className="bg-card/50 border border-border/50 rounded-lg p-4">
              <p className="text-sm">{answer}</p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {loading && insights.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : insights.length > 0 ? (
          insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="bg-card/50 border border-border/50 rounded-lg p-4 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">Start trading to get AI insights</p>
          </div>
        )}
      </div>
    </Card>
  );
};
