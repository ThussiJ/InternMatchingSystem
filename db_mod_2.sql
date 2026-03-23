-- db_mod_2.sql
-- Table for Students to bookmark internships
CREATE TABLE IF NOT EXISTS public.saved_internships (
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (student_id, internship_id)
);

-- Enable RLS (Optional, depending on project policy, but good practice)
-- ALTER TABLE public.saved_internships ENABLE ROW LEVEL SECURITY;
