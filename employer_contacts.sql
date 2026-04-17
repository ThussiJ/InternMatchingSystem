-- ========================================================
-- NEW TABLE: EMPLOYER CONTACTS
-- Run this script in your Supabase SQL Editor
-- ========================================================

CREATE TABLE IF NOT EXISTS public.employer_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  employer_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employer_contacts_pkey PRIMARY KEY (id),
  CONSTRAINT employer_contacts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE,
  CONSTRAINT employer_contacts_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employers(id) ON DELETE CASCADE,
  CONSTRAINT employer_contacts_unique_pair UNIQUE (student_id, employer_id)
);

-- Ensure RLS is handled (Disabling for now as per user's previous request)
ALTER TABLE public.employer_contacts DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.employer_contacts TO authenticated;
GRANT ALL ON public.employer_contacts TO service_role;
