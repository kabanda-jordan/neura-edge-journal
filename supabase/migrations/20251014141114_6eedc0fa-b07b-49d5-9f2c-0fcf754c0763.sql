-- Add image_url column to trades table for storing trade screenshots
ALTER TABLE trades ADD COLUMN IF NOT EXISTS image_url text;

-- Create storage bucket for trade images
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-images', 'trade-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow users to upload their own trade images
CREATE POLICY "Users can upload their own trade images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'trade-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own trade images
CREATE POLICY "Users can view their own trade images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'trade-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own trade images
CREATE POLICY "Users can delete their own trade images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'trade-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own trade images
CREATE POLICY "Users can update their own trade images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'trade-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);