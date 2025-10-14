-- Add new columns to trades table for comprehensive trade logging
ALTER TABLE public.trades 
ADD COLUMN IF NOT EXISTS strategy_type TEXT,
ADD COLUMN IF NOT EXISTS timeframe TEXT,
ADD COLUMN IF NOT EXISTS confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
ADD COLUMN IF NOT EXISTS risk_percentage NUMERIC,
ADD COLUMN IF NOT EXISTS limit_order TEXT,
ADD COLUMN IF NOT EXISTS r_factor NUMERIC;

-- Add computed column for win/loss status based on profit_loss
-- This will be calculated in the application layer for flexibility