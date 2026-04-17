-- ========================================================
-- COMPREHENSIVE RLS POLICIES FOR ALL TABLES (FIX VERSION)
-- Run this script in your Supabase SQL Editor
-- ========================================================

-- 1. DISABLE FORCE RLS on all tables to allow service_role bypass
ALTER TABLE public.user_profiles NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.students NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.employers NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.supervisors NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.skills NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.internships NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.internship_skills NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.applications NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_assignments NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.internship_evaluations NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.notifications NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.saved_internships NO FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs NO FORCE ROW LEVEL SECURITY;

-- 2. ENABLE RLS (standard practice)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. CATCH-ALL SERVICE ROLE POLICIES (to be absolutely sure)
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Service role bypass %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Service role bypass %I" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;

-- 4. INDIVIDUAL TABLE POLICIES (for authenticated users)

-- USER PROFILES
DROP POLICY IF EXISTS "Profiles viewable" ON public.user_profiles;
CREATE POLICY "Profiles viewable" ON public.user_profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Profiles updateable" ON public.user_profiles;
CREATE POLICY "Profiles updateable" ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Profiles insertable" ON public.user_profiles;
CREATE POLICY "Profiles insertable" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (true);

-- STUDENTS
DROP POLICY IF EXISTS "Students viewable" ON public.students;
CREATE POLICY "Students viewable" ON public.students FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Students updateable" ON public.students;
CREATE POLICY "Students updateable" ON public.students FOR UPDATE TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Students insertable" ON public.students;
CREATE POLICY "Students insertable" ON public.students FOR INSERT TO authenticated WITH CHECK (true);

-- EMPLOYERS
DROP POLICY IF EXISTS "Employers viewable" ON public.employers;
CREATE POLICY "Employers viewable" ON public.employers FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Employers updateable" ON public.employers;
CREATE POLICY "Employers updateable" ON public.employers FOR UPDATE TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Employers insertable" ON public.employers;
CREATE POLICY "Employers insertable" ON public.employers FOR INSERT TO authenticated WITH CHECK (true);

-- SUPERVISORS
DROP POLICY IF EXISTS "Supervisors viewable" ON public.supervisors;
CREATE POLICY "Supervisors viewable" ON public.supervisors FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Supervisors manageable" ON public.supervisors;
CREATE POLICY "Supervisors manageable" ON public.supervisors FOR ALL TO authenticated USING (employer_id = auth.uid()) WITH CHECK (employer_id = auth.uid());

-- SKILLS
DROP POLICY IF EXISTS "Skills viewable" ON public.skills;
CREATE POLICY "Skills viewable" ON public.skills FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Skills insertable" ON public.skills;
CREATE POLICY "Skills insertable" ON public.skills FOR INSERT TO authenticated WITH CHECK (true);

-- INTERNSHIPS
DROP POLICY IF EXISTS "Internships viewable" ON public.internships;
CREATE POLICY "Internships viewable" ON public.internships FOR SELECT TO authenticated USING (status = 'open' OR employer_id = auth.uid());
DROP POLICY IF EXISTS "Internships manageable" ON public.internships;
CREATE POLICY "Internships manageable" ON public.internships FOR ALL TO authenticated USING (employer_id = auth.uid()) WITH CHECK (employer_id = auth.uid());

-- INTERNSHIP SKILLS
DROP POLICY IF EXISTS "Internship skills viewable" ON public.internship_skills;
CREATE POLICY "Internship skills viewable" ON public.internship_skills FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Internship skills manageable" ON public.internship_skills;
CREATE POLICY "Internship skills manageable" ON public.internship_skills FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.internships WHERE id = internship_id AND employer_id = auth.uid()));

-- APPLICATIONS
DROP POLICY IF EXISTS "Applications viewable student" ON public.applications;
CREATE POLICY "Applications viewable student" ON public.applications FOR SELECT TO authenticated USING (student_id = auth.uid());
DROP POLICY IF EXISTS "Applications viewable employer" ON public.applications;
CREATE POLICY "Applications viewable employer" ON public.applications FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.internships WHERE id = internship_id AND employer_id = auth.uid()));
DROP POLICY IF EXISTS "Applications insertable student" ON public.applications;
CREATE POLICY "Applications insertable student" ON public.applications FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Notifications viewable" ON public.notifications;
CREATE POLICY "Notifications viewable" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Notifications manageable" ON public.notifications;
CREATE POLICY "Notifications manageable" ON public.notifications FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- SAVED INTERNSHIPS
DROP POLICY IF EXISTS "Saved internships manageable" ON public.saved_internships;
CREATE POLICY "Saved internships manageable" ON public.saved_internships FOR ALL TO authenticated USING (student_id = auth.uid());

-- GRANTS
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
