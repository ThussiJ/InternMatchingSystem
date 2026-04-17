-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  internship_id uuid NOT NULL,
  status text DEFAULT 'pending'::application_status,
  compatibility_score numeric,
  applied_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  supervisor_id uuid,
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT applications_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(id),
  CONSTRAINT applications_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action character varying,
  entity_type character varying,
  entity_id uuid,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.employer_contacts (
  student_id uuid NOT NULL,
  employer_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employer_contacts_pkey PRIMARY KEY (student_id, employer_id),
  CONSTRAINT employer_contacts_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.user_profiles(id),
  CONSTRAINT employer_contacts_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employers(id)
);
CREATE TABLE public.employers (
  id uuid NOT NULL,
  company_name character varying NOT NULL,
  industry character varying,
  company_size character varying,
  website text,
  company_description text,
  location character varying,
  verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  cover_image text,
  is_featured boolean DEFAULT false,
  CONSTRAINT employers_pkey PRIMARY KEY (id),
  CONSTRAINT employers_id_fkey FOREIGN KEY (id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.internship_evaluations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  internship_id uuid,
  student_id uuid,
  employer_feedback text,
  supervisor_feedback text,
  performance_score integer CHECK (performance_score >= 1 AND performance_score <= 100),
  completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT internship_evaluations_pkey PRIMARY KEY (id),
  CONSTRAINT internship_evaluations_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(id),
  CONSTRAINT internship_evaluations_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
CREATE TABLE public.internship_skills (
  internship_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  required_level integer CHECK (required_level >= 1 AND required_level <= 5),
  weight numeric DEFAULT 1.0,
  mandatory boolean DEFAULT true,
  CONSTRAINT internship_skills_pkey PRIMARY KEY (internship_id, skill_id),
  CONSTRAINT internship_skills_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(id),
  CONSTRAINT internship_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.internships (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL,
  title character varying NOT NULL,
  description text NOT NULL,
  department character varying,
  duration_weeks integer,
  stipend numeric,
  currency character varying,
  location character varying,
  mode USER-DEFINED,
  minimum_gpa numeric,
  application_deadline date,
  start_date date,
  end_date date,
  status USER-DEFINED DEFAULT 'draft'::internship_status,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  cover_image text,
  is_featured boolean DEFAULT false,
  CONSTRAINT internships_pkey PRIMARY KEY (id),
  CONSTRAINT internships_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employers(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  title character varying,
  message text,
  type character varying,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  link text,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.saved_internships (
  student_id uuid NOT NULL,
  internship_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT saved_internships_pkey PRIMARY KEY (student_id, internship_id),
  CONSTRAINT saved_internships_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT saved_internships_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(id)
);
CREATE TABLE public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  category character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT skills_pkey PRIMARY KEY (id)
);
CREATE TABLE public.student_skills (
  student_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  proficiency_level integer NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  years_of_experience numeric,
  CONSTRAINT student_skills_pkey PRIMARY KEY (student_id, skill_id),
  CONSTRAINT student_skills_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id)
);
CREATE TABLE public.students (
  id uuid NOT NULL,
  university_id character varying NOT NULL UNIQUE,
  degree_program character varying NOT NULL,
  specialization character varying,
  gpa numeric,
  graduation_year integer,
  preferred_location character varying,
  preferred_mode USER-DEFINED,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  cv_path text,
  profile_picture text,
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_id_fkey FOREIGN KEY (id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.supervisor_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  supervisor_id uuid,
  student_id uuid,
  internship_id uuid,
  approval_status USER-DEFINED DEFAULT 'pending'::approval_status,
  approved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT supervisor_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT supervisor_assignments_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.user_profiles(id),
  CONSTRAINT supervisor_assignments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT supervisor_assignments_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(id)
);
CREATE TABLE public.supervisors (
  id uuid NOT NULL,
  employer_id uuid,
  designation text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT supervisors_pkey PRIMARY KEY (id),
  CONSTRAINT supervisors_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT supervisors_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.employers(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  role USER-DEFINED NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  phone character varying,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);