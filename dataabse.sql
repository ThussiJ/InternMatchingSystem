-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('student','employer','admin','supervisor');
CREATE TYPE internship_mode AS ENUM ('remote','onsite','hybrid');
CREATE TYPE internship_status AS ENUM ('draft','open','closed','cancelled');
CREATE TYPE application_status AS ENUM ('pending','shortlisted','selected','rejected','withdrawn');
CREATE TYPE approval_status AS ENUM ('pending','approved','rejected');

-- ============================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================

CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STUDENTS
-- ============================================

CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    university_id VARCHAR(50) UNIQUE NOT NULL,
    degree_program VARCHAR(150) NOT NULL,
    specialization VARCHAR(150),
    gpa NUMERIC(3,2),
    graduation_year INT,
    preferred_location VARCHAR(150),
    preferred_mode internship_mode,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EMPLOYERS
-- ============================================

CREATE TABLE public.employers (
    id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(150),
    company_size VARCHAR(50),
    website TEXT,
    company_description TEXT,
    location VARCHAR(150),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SKILLS MASTER TABLE
-- ============================================

CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_name ON public.skills(name);

-- ============================================
-- STUDENT SKILLS (MANY TO MANY)
-- ============================================

CREATE TABLE public.student_skills (
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level INT NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
    years_of_experience NUMERIC(4,1),
    PRIMARY KEY (student_id, skill_id)
);

CREATE INDEX idx_student_skills_skill ON public.student_skills(skill_id);

-- ============================================
-- INTERNSHIPS
-- ============================================

CREATE TABLE public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    department VARCHAR(150),
    duration_weeks INT,
    stipend NUMERIC(10,2),
    currency VARCHAR(10),
    location VARCHAR(150),
    mode internship_mode,
    minimum_gpa NUMERIC(3,2),
    application_deadline DATE,
    start_date DATE,
    end_date DATE,
    status internship_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_internships_status ON public.internships(status);
CREATE INDEX idx_internships_deadline ON public.internships(application_deadline);

-- ============================================
-- INTERNSHIP REQUIRED SKILLS (WEIGHTED)
-- ============================================

CREATE TABLE public.internship_skills (
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    required_level INT CHECK (required_level BETWEEN 1 AND 5),
    weight NUMERIC(4,2) DEFAULT 1.0,
    mandatory BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (internship_id, skill_id)
);

CREATE INDEX idx_internship_skills_skill ON public.internship_skills(skill_id);

-- ============================================
-- APPLICATIONS
-- ============================================

CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    compatibility_score NUMERIC(5,2),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, internship_id)
);

CREATE INDEX idx_applications_student ON public.applications(student_id);
CREATE INDEX idx_applications_internship ON public.applications(internship_id);

-- ============================================
-- SUPERVISOR ASSIGNMENTS
-- ============================================

CREATE TABLE public.supervisor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supervisor_id UUID REFERENCES public.user_profiles(id),
    student_id UUID REFERENCES public.students(id),
    internship_id UUID REFERENCES public.internships(id),
    approval_status approval_status DEFAULT 'pending',
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INTERNSHIP EVALUATIONS
-- ============================================

CREATE TABLE public.internship_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    employer_feedback TEXT,
    supervisor_feedback TEXT,
    performance_score INT CHECK (performance_score BETWEEN 1 AND 100),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200),
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id),
    action VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUTO UPDATE updated_at FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach triggers
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_employers_updated_at
BEFORE UPDATE ON public.employers
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_internships_updated_at
BEFORE UPDATE ON public.internships
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();