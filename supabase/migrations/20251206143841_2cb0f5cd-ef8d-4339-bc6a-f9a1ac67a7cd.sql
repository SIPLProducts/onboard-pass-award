-- Create app_settings table for storing dynamic settings like logo
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can view settings"
ON public.app_settings
FOR SELECT
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings"
ON public.app_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create branding storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true);

-- Allow admins to upload branding assets
CREATE POLICY "Admins can upload branding assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'branding' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update branding assets
CREATE POLICY "Admins can update branding assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'branding' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete branding assets
CREATE POLICY "Admins can delete branding assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'branding' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow public read access to branding assets
CREATE POLICY "Public can view branding assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'branding');

-- Insert default sidebar_logo setting
INSERT INTO public.app_settings (key, value)
VALUES ('sidebar_logo', NULL);