import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { createNotification } from './notification';

export const getStudentSkills = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { data, error } = await supabase
            .from('student_skills')
            .select(`
                proficiency_level,
                years_of_experience,
                skill_id,
                skills (name, category)
            `)
            .eq('student_id', studentId);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching student skills', error: error.message });
    }
};

export const addStudentSkill = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { skill_id, proficiency_level, years_of_experience } = req.body;

        const { data, error } = await supabase
            .from('student_skills')
            .insert({
                student_id: studentId,
                skill_id,
                proficiency_level: proficiency_level || 3,
                years_of_experience: years_of_experience || 0
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ message: 'Skill already added to profile' });
            }
            throw error;
        }

        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding skill', error: error.message });
    }
};

export const removeStudentSkill = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { skillId } = req.params;

        const { error } = await supabase
            .from('student_skills')
            .delete()
            .match({ student_id: studentId, skill_id: skillId });

        if (error) throw error;

        res.status(200).json({ message: 'Skill removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error removing skill', error: error.message });
    }
};

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', studentId)
            .single();

        if (profileError) throw profileError;

        const { data: studentDetails, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .maybeSingle();

        if (studentError && studentError.code !== 'PGRST116') throw studentError;

        res.status(200).json({
            ...userProfile,
            ...studentDetails
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { first_name, last_name, phone, university_id, degree_program, specialization, gpa, graduation_year, preferred_location, preferred_mode, bio } = req.body;
        
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let cv_path = undefined;
        let profile_picture = undefined;
        
        if (files && files['cv'] && files['cv'].length > 0) {
            cv_path = '/uploads/cvs/' + files['cv'][0].filename;
        }
        if (files && files['profile_picture'] && files['profile_picture'].length > 0) {
            profile_picture = '/uploads/' + files['profile_picture'][0].filename;
        }

        if (first_name || last_name || phone) {
            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({ 
                    ...(first_name && { first_name }), 
                    ...(last_name && { last_name }), 
                    ...(phone && { phone }) 
                })
                .eq('id', studentId);
            if (profileError) throw profileError;
        }

        const studentUpdateData: any = {};
        if (university_id !== undefined) studentUpdateData.university_id = university_id;
        if (degree_program !== undefined) studentUpdateData.degree_program = degree_program;
        if (specialization !== undefined) studentUpdateData.specialization = specialization;
        if (gpa !== undefined) studentUpdateData.gpa = gpa ? parseFloat(gpa) : null;
        if (graduation_year !== undefined) studentUpdateData.graduation_year = graduation_year ? parseInt(graduation_year) : null;
        if (preferred_location !== undefined) studentUpdateData.preferred_location = preferred_location;
        if (preferred_mode !== undefined) studentUpdateData.preferred_mode = preferred_mode;
        if (bio !== undefined) studentUpdateData.bio = bio;
        if (cv_path !== undefined) studentUpdateData.cv_path = cv_path;
        if (profile_picture !== undefined) studentUpdateData.profile_picture = profile_picture;

        if (Object.keys(studentUpdateData).length > 0) {
            const { error: upsertError } = await supabase
                .from('students')
                .update(studentUpdateData)
                .eq('id', studentId);
            if (upsertError) throw upsertError;
        }

        // Notify Student
        try {
            await createNotification(
                studentId,
                'Profile Updated',
                'Your student profile has been updated successfully.',
                'profile_update',
                '/student/profile'
            );

            if (cv_path) {
                await createNotification(
                    studentId,
                    'CV Uploaded',
                    'Your new CV has been uploaded and processed successfully.',
                    'cv_update',
                    '/student/profile'
                );
            }
        } catch (notifierr) {
            console.error('Failed to send profile update notifications:', notifierr);
        }

        res.status(200).json({ message: 'Profile updated successfully', cv_path, profile_picture });
    } catch (error: any) {
        console.error("Profile update error", error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};
