import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getAllSkills = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('skills')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
};

export const createSkill = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category } = req.body;
        const { data, error } = await supabase
            .from('skills')
            .insert({ name, category })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                return res.status(400).json({ message: 'Skill already exists' });
            }
            throw error;
        }
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating skill', error: error.message });
    }
};

export const createInternship = async (req: AuthRequest, res: Response) => {
    try {
        const {
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
            end_date,
            skills // Array of { skill_id: string, required_level: number, weight: number, mandatory: boolean }
        } = req.body;

        const cover_image = req.file ? `/uploads/${req.file.filename}` : null;

        const employerId = req.user?.id;

        if (!employerId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // 1. Create Internship
        const { data: internship, error: internshipError } = await supabase
            .from('internships')
            .insert({
                employer_id: employerId,
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
                end_date,
                cover_image,
                status: 'open'
            })
            .select()
            .single();

        if (internshipError) throw internshipError;

        // 2. Associate Skills if provided
        let parsedSkills = skills;
        if (typeof skills === 'string') {
            try { parsedSkills = JSON.parse(skills); } catch (e) {}
        }

        if (parsedSkills && Array.isArray(parsedSkills) && parsedSkills.length > 0) {
            const internshipSkills = parsedSkills.map((s: any) => ({
                internship_id: internship.id,
                skill_id: s.skill_id,
                required_level: s.required_level || 3,
                weight: s.weight || 1.0,
                mandatory: s.mandatory !== undefined ? s.mandatory : true
            }));

            const { error: skillsError } = await supabase
                .from('internship_skills')
                .insert(internshipSkills);

            if (skillsError) throw skillsError;
        }

        res.status(201).json({ message: 'Internship published successfully', internship });
    } catch (error: any) {
        console.error('Create internship error:', error);
        res.status(500).json({ message: 'Error creating internship', error: error.message });
    }
};

export const getMyInternships = async (req: AuthRequest, res: Response) => {
    try {
        const employerId = req.user?.id;

        if (!employerId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                employers (company_name, cover_image),
                internship_skills (
                    *,
                    skills (name)
                )
            `)
            .eq('employer_id', employerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching internships', error: error.message });
    }
};

export const getOpenInternships = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                employers (company_name, cover_image),
                internship_skills (
                    *,
                    skills (name)
                )
            `)
            .eq('status', 'open')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching open internships', error: error.message });
    }
};

export const getFeaturedInternships = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                employers (company_name, cover_image),
                internship_skills (
                    *,
                    skills (name)
                )
            `)
            .eq('status', 'open')
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching featured internships', error: error.message });
    }
};
