import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Trash2, Calendar, TrendingUp, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  target_date: string;
  status: string;
  created_at: string;
}

export const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();

    const channel = supabase
      .channel('goals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, fetchGoals)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchGoals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error fetching goals", description: error.message });
    } else {
      setGoals(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (editingGoal) {
        const { error } = await supabase
          .from('goals')
          .update({
            title,
            target_value: parseFloat(targetValue),
            target_date: targetDate,
          })
          .eq('id', editingGoal.id);

        if (error) throw error;
        toast({ title: "Goal updated!", description: "Your goal has been updated successfully." });
      } else {
        const { error } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            title,
            target_value: parseFloat(targetValue),
            current_value: 0,
            target_date: targetDate,
            status: 'active',
          });

        if (error) throw error;
        toast({ title: "Goal created!", description: "Your new goal has been created successfully." });
      }

      resetForm();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Goal deleted", description: "Goal removed successfully." });
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setTargetValue(goal.target_value.toString());
    setTargetDate(goal.target_date);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle("");
    setTargetValue("");
    setTargetDate("");
    setEditingGoal(null);
    setShowForm(false);
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Trading Goals</span>
          </h1>
          <p className="text-muted-foreground">Set and track your trading objectives</p>
        </div>
        <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); else setShowForm(open); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Reach $10,000 profit"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="targetValue">Target Value ($)</Label>
                <Input
                  id="targetValue"
                  type="number"
                  step="0.01"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="10000"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Your Goals</CardTitle>
            <CardDescription>Track progress towards your trading milestones</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Target className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No goals set</h3>
              <p className="text-muted-foreground mb-6">Set your first trading goal to start tracking progress</p>
              <Button onClick={() => setShowForm(true)}>Set First Goal</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="glass-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      {goal.title}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(goal.target_date).toLocaleDateString()}
                      </span>
                      <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                        {goal.status}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-semibold">{getProgress(goal).toFixed(1)}%</span>
                  </div>
                  <Progress value={getProgress(goal)} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Current</p>
                    <p className="font-semibold text-lg">${goal.current_value.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                  <div className="text-right">
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-semibold text-lg">${goal.target_value.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
