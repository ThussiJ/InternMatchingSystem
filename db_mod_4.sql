-- ========================================================
-- DATABASE MODIFICATION 4: EMPLOYER CONTACTS
-- ========================================================

-- Table to track which students want to "Be in touch" with which employers
CREATE TABLE IF NOT EXISTS public.employer_contacts (
  student_id uuid NOT NULL,
  employer_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employer_contacts_pkey PRIMARY KEY (student_id, employer_id),
  CONSTRAINT employer_contacts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT employer_contacts_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employers(id) ON DELETE CASCADE
);

-- Disable RLS for this table as per the project's current pattern
ALTER TABLE public.employer_contacts DISABLE ROW LEVEL SECURITY;

-- Grant permissions for authenticated and service_role users
GRANT ALL ON public.employer_contacts TO authenticated;
GRANT ALL ON public.employer_contacts TO service_role;

-- Add comment for documentation
COMMENT ON TABLE public.employer_contacts IS 'Stores connections between students and employers for follow-up notifications.';
