-- db_mod_1.sql
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS cv_path TEXT;

ALTER TABLE public.internships 
ADD COLUMN IF NOT EXISTS cover_image TEXT;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

ALTER TABLE public.employers
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- db_mod_1.sql additions
-- Fix applications table
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- Fix application_status enum if it exists, or ensure status column can handle new values
-- It's safer to change status to TEXT if we want to avoid enum mismatch issues during development
ALTER TABLE public.applications ALTER COLUMN status TYPE TEXT;

-- Verify supervisors table exists (was already corrected in previous turns but ensuring here)
CREATE TABLE IF NOT EXISTS public.supervisors (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE,
    designation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
