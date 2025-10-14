import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, TrendingUp, BarChart3, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Playbook {
  id: string;
  title: string;
  description: string;
  strategy: string;
  win_rate: number | null;
  avg_profit: number | null;
  total_trades: number | null;
  created_at: string;
}

export const Playbooks = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [strategy, setStrategy] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPlaybooks();

    const channel = supabase
      .channel('playbooks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'playbooks' }, fetchPlaybooks)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPlaybooks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('playbooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error fetching playbooks", description: error.message });
    } else {
      setPlaybooks(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (editingPlaybook) {
        const { error } = await supabase
          .from('playbooks')
          .update({ title, description, strategy })
          .eq('id', editingPlaybook.id);

        if (error) throw error;
        toast({ title: "Playbook updated!", description: "Your playbook has been updated successfully." });
      } else {
        const { error } = await supabase
          .from('playbooks')
          .insert({
            user_id: user.id,
            title,
            description,
            strategy,
            total_trades: 0,
          });

        if (error) throw error;
        toast({ title: "Playbook created!", description: "Your new playbook has been created successfully." });
      }

      resetForm();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('playbooks').delete().eq('id', id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Playbook deleted", description: "Playbook removed successfully." });
    }
  };

  const handleEdit = (playbook: Playbook) => {
    setEditingPlaybook(playbook);
    setTitle(playbook.title);
    setDescription(playbook.description || "");
    setStrategy(playbook.strategy);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStrategy("");
    setEditingPlaybook(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Trading Playbooks</span>
          </h1>
          <p className="text-muted-foreground">Create and manage your trading strategies</p>
        </div>
        <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); else setShowForm(open); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Playbook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPlaybook ? "Edit Playbook" : "Create New Playbook"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Playbook Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Breakout Strategy"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this playbook..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="strategy">Strategy Details</Label>
                <Textarea
                  id="strategy"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="Detailed trading strategy, entry/exit rules, risk management..."
                  required
                  rows={6}
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : editingPlaybook ? "Update Playbook" : "Create Playbook"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {playbooks.length === 0 ? (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Your Playbooks</CardTitle>
            <CardDescription>Document your proven trading strategies</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No playbooks yet</h3>
              <p className="text-muted-foreground mb-6">Create your first playbook to document trading strategies</p>
              <Button onClick={() => setShowForm(true)}>Create Playbook</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {playbooks.map((playbook) => (
            <Card key={playbook.id} className="glass-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {playbook.title}
                    </CardTitle>
                    {playbook.description && (
                      <CardDescription className="mt-2">{playbook.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(playbook)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(playbook.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{playbook.strategy}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-xs">Trades</span>
                    </div>
                    <p className="font-semibold text-lg">{playbook.total_trades || 0}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Win Rate</span>
                    </div>
                    <p className="font-semibold text-lg">
                      {playbook.win_rate ? `${playbook.win_rate.toFixed(1)}%` : "N/A"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <span className="text-xs">Avg P/L</span>
                    </div>
                    <p className="font-semibold text-lg">
                      {playbook.avg_profit ? `$${playbook.avg_profit.toFixed(2)}` : "N/A"}
                    </p>
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
