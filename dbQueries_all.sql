-- SQL Queries for InternTalentConnect Application

-- ==========================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ==========================================

-- Register New User Profile (Public Schema)
-- Used in: backend/src/controllers/auth.ts
INSERT INTO public.user_profiles (id, role, first_name, last_name, phone)
VALUES ($1, $2, $3, $4, $5);

-- Register Student Specific Data
-- Used in: backend/src/controllers/auth.ts
INSERT INTO public.students (id, university_id, degree_program, specialization, graduation_year)
VALUES ($1, $2, $3, $4, $5);

-- Register Employer Specific Data
-- Used in: backend/src/controllers/auth.ts
INSERT INTO public.employers (id, company_name, industry, company_size, website)
VALUES ($1, $2, $3, $4, $5);

-- Get User Profile by ID (Login/Session)
-- Used in: backend/src/controllers/auth.ts
SELECT role, first_name, last_name FROM public.user_profiles
WHERE id = $1;

-- Toggle User Active Status
-- Used in: backend/src/controllers/admin.ts
UPDATE public.user_profiles
SET is_active = $1
WHERE id = $2;

-- ==========================================
-- 2. INTERNSHIPS & POSTINGS
-- ==========================================

-- Create New Internship Listing
-- Used in: backend/src/controllers/internship.ts
INSERT INTO public.internships (
    employer_id, title, description, department, duration_weeks, 
    stipend, currency, location, mode, minimum_gpa, 
    application_deadline, start_date, end_date, cover_image, status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'open');

-- Link Skill to Internship
-- Used in: backend/src/controllers/internship.ts
INSERT INTO public.internship_skills (internship_id, skill_id, required_level, weight, mandatory)
VALUES ($1, $2, $3, $4, $5);

-- List All Open Internships
-- Used in: backend/src/controllers/internship.ts
SELECT i.*, e.company_name, e.cover_image
FROM public.internships i
JOIN public.employers e ON i.employer_id = e.id
WHERE i.status = 'open'
ORDER BY i.created_at DESC;

-- Get Featured Internships for Home Page
-- Used in: backend/src/controllers/internship.ts
SELECT i.*, e.company_name
FROM public.internships i
JOIN public.employers e ON i.employer_id = e.id
WHERE i.status = 'open' AND i.is_featured = true
LIMIT 6;

-- Update Internship Featured Status
-- Used in: backend/src/controllers/admin.ts
UPDATE public.internships
SET is_featured = $1
WHERE id = $2;

-- ==========================================
-- 3. STUDENT PROFILE & SKILLS
-- ==========================================

-- Fetch Student Skills
-- Used in: backend/src/controllers/student.ts
SELECT ss.proficiency_level, ss.years_of_experience, s.name, s.category
FROM public.student_skills ss
JOIN public.skills s ON ss.skill_id = s.id
WHERE ss.student_id = $1;

-- Add Skill to Student Profile
-- Used in: backend/src/controllers/student.ts
INSERT INTO public.student_skills (student_id, skill_id, proficiency_level, years_of_experience)
VALUES ($1, $2, $3, $4);

-- Update Student Detailed Profile (Bio, CV, etc.)
-- Used in: backend/src/controllers/student.ts
UPDATE public.students
SET university_id = $1, degree_program = $2, specialization = $3, 
    gpa = $4, graduation_year = $5, bio = $6, cv_path = $7, profile_picture = $8
WHERE id = $9;

-- Save Internship to Watchlist
-- Used in: backend/src/controllers/savedInternship.ts
INSERT INTO public.saved_internships (student_id, internship_id) 
VALUES ($1, $2)
ON CONFLICT (student_id, internship_id) DO NOTHING;

-- Fetch Saved Internships
-- Used in: backend/src/controllers/savedInternship.ts
SELECT i.*, si.created_at as saved_at
FROM public.saved_internships si
JOIN public.internships i ON si.internship_id = i.id
WHERE si.student_id = $1;

-- ==========================================
-- 4. APPLICATIONS
-- ==========================================

-- Submit Internship Application
-- Used in: backend/src/controllers/application.ts
INSERT INTO public.applications (internship_id, student_id, status)
VALUES ($1, $2, 'pending');

-- Employer View: Get All Applications for Their Postings
-- Used in: backend/src/controllers/application.ts
SELECT a.*, i.title, s.cv_path, up.first_name, up.last_name
FROM public.applications a
JOIN public.internships i ON a.internship_id = i.id
JOIN public.students s ON a.student_id = s.id
JOIN public.user_profiles up ON s.id = up.id
WHERE i.employer_id = $1;

-- Assign Supervisor to Application
-- Used in: backend/src/controllers/application.ts
UPDATE public.applications
SET supervisor_id = $1
WHERE id = $2;

-- Update Application Status (Accept/Reject)
-- Used in: backend/src/controllers/application.ts
UPDATE public.applications
SET status = $1
WHERE id = $2;
