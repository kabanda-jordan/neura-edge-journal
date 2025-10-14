import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Wallet, ExternalLink, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CryptoPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: {
    name: string;
    price: string;
  };
}

const WALLET_ADDRESS = "TLVu6dHaExHAVJkRmzXPDQ72E8TTACEwxc";

const CRYPTO_PRICES = {
  USDT: 3.99, // Direct USD equivalent
  TRX: 3.99,  // USD equivalent (actual amount will vary)
};

export const CryptoPaymentDialog = ({ open, onOpenChange, plan }: CryptoPaymentDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [cryptocurrency, setCryptocurrency] = useState<"USDT" | "TRX">("USDT");
  const [transactionHash, setTransactionHash] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      toast({
        title: "Address Copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the address manually",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionHash.trim()) {
      toast({
        title: "Transaction Hash Required",
        description: "Please enter your transaction hash to verify payment",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("payment_submissions")
        .insert({
          user_id: user?.id || null,
          email: email.trim(),
          cryptocurrency,
          transaction_hash: transactionHash.trim(),
          plan_name: plan.name,
          amount_usd: parseFloat(plan.price.replace("$", "")),
          status: "pending",
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Duplicate Transaction",
            description: "This transaction hash has already been submitted",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Payment Submitted! 🎉",
        description: "Your payment is being verified. You'll receive confirmation via email soon.",
      });

      setTransactionHash("");
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-primary/20">
        <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
          {/* Animated background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          
          <div className="relative z-10">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Wallet className="w-6 h-6 text-background" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">Pay with Crypto</DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    Direct wallet payment • Zero fees
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Plan Info */}
              <div className="p-4 rounded-lg bg-background/50 backdrop-blur border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Plan</p>
                    <p className="text-lg font-semibold text-gradient">{plan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold">{plan.price}</p>
                  </div>
                </div>
              </div>

              {/* Cryptocurrency Selection */}
              <div className="space-y-2">
                <Label htmlFor="crypto" className="text-sm font-medium">
                  Select Cryptocurrency
                </Label>
                <Select value={cryptocurrency} onValueChange={(value: "USDT" | "TRX") => setCryptocurrency(value)}>
                  <SelectTrigger className="bg-background/50 border-primary/20 hover:border-primary/40 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-green-500">₮</span>
                        </div>
                        <span>USDT (Tether)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TRX">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-red-500">T</span>
                        </div>
                        <span>TRX (Tron)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Send approximately ${CRYPTO_PRICES[cryptocurrency]} worth of {cryptocurrency}
                </p>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-sm font-medium">
                  Send {cryptocurrency} to this address
                </Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300" />
                  <div className="relative flex items-center gap-2 p-4 bg-background rounded-lg border border-primary/20">
                    <code className="flex-1 text-sm font-mono break-all text-primary">
                      {WALLET_ADDRESS}
                    </code>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyAddress}
                      className="flex-shrink-0 hover:bg-primary/10"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  TRC20 Network • Send exact amount to avoid delays
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Your Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary/40"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send your payment confirmation here
                </p>
              </div>

              {/* Transaction Hash */}
              <div className="space-y-2">
                <Label htmlFor="txHash" className="text-sm font-medium">
                  Transaction Hash (Required) *
                </Label>
                <Input
                  id="txHash"
                  type="text"
                  placeholder="Enter your transaction hash here..."
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary/40 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Find this in your wallet after sending the payment
                </p>
              </div>

              {/* Important Notice */}
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium flex items-start gap-2">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Without a valid transaction hash, your payment cannot be verified and will not be counted.
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Submit Payment
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-6">
              Your payment will be verified within 24 hours
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
