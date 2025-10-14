import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { TradeForm } from "./TradeForm";
import { TradesList } from "./TradesList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Journal = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Trade Journal</span>
          </h1>
          <p className="text-muted-foreground">Track and analyze all your trades in one place</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Trade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Trade</DialogTitle>
            </DialogHeader>
            <TradeForm onSuccess={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <TradesList />
    </div>
  );
};
