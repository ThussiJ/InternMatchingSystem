-- ========================================================
-- DISABLE RLS ON ALL TABLES
-- Run this script in your Supabase SQL Editor
-- ========================================================

ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs DISABLE ROW LEVEL SECURITY;

-- Explicitly grant permissions to ensure roles can access tables without RLS
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
