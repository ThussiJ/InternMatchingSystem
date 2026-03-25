import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const saveInternship = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        const { internshipId } = req.body;

        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { error } = await supabase
            .from('saved_internships')
            .upsert({ student_id: studentId, internship_id: internshipId }, { onConflict: 'student_id,internship_id' });

        if (error) throw error;
        res.status(201).json({ message: 'Internship saved successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error saving internship', error: error.message });
    }
};

export const unsaveInternship = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        const { internshipId } = req.params;

        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { error } = await supabase
            .from('saved_internships')
            .delete()
            .eq('student_id', studentId)
            .eq('internship_id', internshipId);

        if (error) throw error;
        res.status(200).json({ message: 'Internship unsaved successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error unsaving internship', error: error.message });
    }
};

export const getSavedInternships = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { data, error } = await supabase
            .from('saved_internships')
            .select(`
                internship_id,
                created_at,
                internships (*)
            `)
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Flatten the data for easier consumption on frontend
        const formattedData = data.map((item: any) => ({
            ...item.internships,
            saved_at: item.created_at
        }));

        res.status(200).json(formattedData);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching saved internships', error: error.message });
    }
};
