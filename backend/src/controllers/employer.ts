import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getEmployerProfile = async (req: AuthRequest, res: Response) => {
    try {
        const employerId = req.user?.id;
        if (!employerId) return res.status(401).json({ message: 'User not authenticated' });

        const { data: userProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', employerId)
            .single();

        if (profileError) throw profileError;

        const { data: employerDetails, error: employerError } = await supabase
            .from('employers')
            .select('*')
            .eq('id', employerId)
            .maybeSingle();

        if (employerError && employerError.code !== 'PGRST116') throw employerError;

        res.status(200).json({
            ...userProfile,
            ...employerDetails
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

export const updateEmployerProfile = async (req: AuthRequest, res: Response) => {
    try {
        const employerId = req.user?.id;
        if (!employerId) return res.status(401).json({ message: 'User not authenticated' });

        const { first_name, last_name, phone, company_name, industry, company_size, website, location } = req.body;
        
        // Single file upload via multer handles 'cover_image' seamlessly without complex iterations
        let cover_image = undefined;
        if (req.file) {
            cover_image = '/uploads/' + req.file.filename;
        }

        if (first_name || last_name || phone) {
            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({ 
                    ...(first_name && { first_name }), 
                    ...(last_name && { last_name }), 
                    ...(phone && { phone }) 
                })
                .eq('id', employerId);
            if (profileError) throw profileError;
        }

        const employerUpdateData: any = {};
        if (company_name !== undefined) employerUpdateData.company_name = company_name;
        if (industry !== undefined) employerUpdateData.industry = industry;
        if (company_size !== undefined) employerUpdateData.company_size = company_size;
        if (website !== undefined) employerUpdateData.website = website;
        if (location !== undefined) employerUpdateData.location = location;
        if (cover_image !== undefined) employerUpdateData.cover_image = cover_image;

        if (Object.keys(employerUpdateData).length > 0) {
            const { error: upsertError } = await supabase
                .from('employers')
                .upsert({ id: employerId, ...employerUpdateData }, { onConflict: 'id' });
            if (upsertError) throw upsertError;
        }

        res.status(200).json({ message: 'Profile updated successfully', cover_image });
    } catch (error: any) {
        console.error("Profile update error", error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

export const createSupervisor = async (req: AuthRequest, res: Response) => {
    try {
        const employerId = req.user?.id;
        if (!employerId) return res.status(401).json({ message: 'User not authenticated' });

        const { email, password, first_name, last_name, designation } = req.body;

        // 1. Create user in Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (authError) return res.status(400).json({ message: authError.message });

        const newUserId = authData.user.id;

        // 2. Insert into user_profiles
        const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
                id: newUserId,
                role: 'supervisor',
                first_name,
                last_name
            });

        if (profileError) {
            await supabase.auth.admin.deleteUser(newUserId);
            return res.status(400).json({ message: profileError.message });
        }

        // 3. Insert into supervisors
        const { error: supervisorError } = await supabase
            .from('supervisors')
            .insert({
                id: newUserId,
                employer_id: employerId,
                designation
            });

        if (supervisorError) {
            await supabase.auth.admin.deleteUser(newUserId);
            return res.status(400).json({ message: supervisorError.message });
        }

        res.status(201).json({ message: 'Supervisor created successfully', supervisorId: newUserId });
    } catch (error: any) {
        console.error('Supervisor creation error', error);
        res.status(500).json({ message: 'Error creating supervisor', error: error.message });
    }
};

export const getSupervisors = async (req: AuthRequest, res: Response) => {
    try {
        const employerId = req.user?.id;
        if (!employerId) return res.status(401).json({ message: 'User not authenticated' });

        const { data: supervisorsData, error: supervisorsError } = await supabase
            .from('supervisors')
            .select('*')
            .eq('employer_id', employerId)
            .order('created_at', { ascending: false });

        if (supervisorsError) throw supervisorsError;
        
        if (!supervisorsData || supervisorsData.length === 0) {
            return res.status(200).json([]);
        }

        const supervisorIds = supervisorsData.map(s => s.id);

        const { data: profilesData, error: profilesError } = await supabase
            .from('user_profiles')
            .select('id, first_name, last_name, phone')
            .in('id', supervisorIds);

        if (profilesError) throw profilesError;

        const formattedData = supervisorsData.map((item: any) => {
            const profile = profilesData.find(p => p.id === item.id);
            return {
                id: item.id,
                designation: item.designation,
                created_at: item.created_at,
                first_name: profile?.first_name,
                last_name: profile?.last_name,
                phone: profile?.phone
            };
        });

        res.status(200).json(formattedData);
    } catch (error: any) {
        console.error('Get supervisors error:', error);
        res.status(500).json({ message: 'Error fetching supervisors', error: error.message });
    }
};

export const getFeaturedEmployers = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('employers')
            .select('*')
            .eq('is_featured', true)
            .limit(8);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching featured employers', error: error.message });
    }
};
