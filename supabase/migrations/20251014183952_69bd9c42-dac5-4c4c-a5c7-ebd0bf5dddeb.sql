-- Create payment submissions table
CREATE TABLE IF NOT EXISTS public.payment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  cryptocurrency TEXT NOT NULL CHECK (cryptocurrency IN ('USDT', 'TRX')),
  transaction_hash TEXT NOT NULL UNIQUE,
  plan_name TEXT NOT NULL,
  amount_usd DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view their own payment submissions"
ON public.payment_submissions
FOR SELECT
USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Anyone can insert payment submissions (for guest checkouts)
CREATE POLICY "Anyone can create payment submissions"
ON public.payment_submissions
FOR INSERT
WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX idx_payment_submissions_user_id ON public.payment_submissions(user_id);
CREATE INDEX idx_payment_submissions_email ON public.payment_submissions(email);
CREATE INDEX idx_payment_submissions_status ON public.payment_submissions(status);