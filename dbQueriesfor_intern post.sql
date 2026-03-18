-- Database Queries for Publishing Internships
-- This file contains the SQL equivalents of the queries executed when an employer publishes a new internship.

-- 1. Create a new skill (if adding a missing skill)
-- Note: 'category' defaults to 'General' in the frontend service
INSERT INTO skills (name, category)
VALUES ('React Native', 'Mobile Development')
RETURNING id;

-- 2. Create the Internship Posting
-- The employer_id is obtained from the authenticated session
INSERT INTO internships (
    employer_id, 
    title, 
    description, 
    department, 
    duration_weeks, 
    stipend, 
    currency, 
    location, 
    mode, 
    minimum_gpa, 
    application_deadline, 
    start_date, 
    status
) 
VALUES (
    '23adc1ac-ef17-4d55-b18b-f63d312cb7c7', -- Example Employer UUID
    'Frontend Developer Intern', 
    'Join our team to build modern web applications using React and TypeScript.', 
    'Engineering', 
    12, 
    25000, 
    'LKR', 
    'Colombo, Sri Lanka', 
    'hybrid', 
    3.0, 
    '2024-04-15', 
    '2024-05-01', 
    'open'
)
RETURNING id;

-- 3. Associate Skills with the Internship
-- This query is executed for each skill selected in the form
-- Replace 'internship_uuid' and 'skill_uuid' with actual values from previous steps
INSERT INTO internship_skills (
    internship_id, 
    skill_id, 
    required_level, 
    weight, 
    mandatory
) 
VALUES 
    ('internship_uuid', 'skill_uuid_1', 4, 1.0, true),
    ('internship_uuid', 'skill_uuid_2', 3, 0.5, false);

-- 4. Fetching Employer's Active Postings (for the dashboard)
SELECT 
    i.*,
    json_agg(
        json_build_object(
            'skill_id', s.id,
            'name', s.name,
            'required_level', ish.required_level,
            'mandatory', ish.mandatory
        )
    ) as skills
FROM internships i
LEFT JOIN internship_skills ish ON i.id = ish.internship_id
LEFT JOIN skills s ON ish.skill_id = s.id
WHERE i.employer_id = '23adc1ac-ef17-4d55-b18b-f63d312cb7c7'
GROUP BY i.id
ORDER BY i.created_at DESC;
