-- db_admin_features.sql
-- Add is_featured column to employers and internships

ALTER TABLE public.employers 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

ALTER TABLE public.internships 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Ensure an admin user exists (Optional, but helpful for development)
-- UPDATE public.user_profiles SET role = 'admin' WHERE email = 'admin@example.com';
