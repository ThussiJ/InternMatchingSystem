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
        let { data, error } = await supabase
            .from('employers')
            .select('*')
            .eq('is_featured', true)
            .limit(8);

        if (error) throw error;

        // Fallback: If no featured companies found, get the latest ones
        if (!data || data.length === 0) {
            const { data: latestData, error: latestError } = await supabase
                .from('employers')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);
            
            if (latestError) throw latestError;
            data = latestData;
        }

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching featured employers', error: error.message });
    }
};

export const getAllEmployersForStudent = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        // 1. Fetch all employers
        const { data: employers, error: empError } = await supabase
            .from('employers')
            .select('*');

        if (empError) {
            console.error('Error fetching employers:', empError);
            throw empError;
        }

        // 2. Fetch student's contacts to identify who they followed
        const { data: contacts, error: contactError } = await supabase
            .from('employer_contacts')
            .select('employer_id')
            .eq('student_id', studentId);

        if (contactError) {
            console.error('Error fetching student contacts:', contactError);
            // Non-blocking, just proceed with no contacts
        }

        const contactedIds = new Set(contacts?.map(c => c.employer_id) || []);

        // 3. Format results
        const formatted = (employers || []).map(emp => ({
            ...emp,
            isContacted: contactedIds.has(emp.id)
        }));

        res.status(200).json(formatted);
    } catch (error: any) {
        console.error('getAllEmployersForStudent failed:', error);
        res.status(500).json({ message: 'Error fetching employers', error: error.message });
    }
};

export const toggleBeInTouch = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        const { employerId } = req.body;

        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        // Check if exists
        const { data: existing, error: checkError } = await supabase
            .from('employer_contacts')
            .select('*')
            .eq('student_id', studentId)
            .eq('employer_id', employerId)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existing) {
            // Remove
            const { error: deleteError } = await supabase
                .from('employer_contacts')
                .delete()
                .eq('student_id', studentId)
                .eq('employer_id', employerId);
            
            if (deleteError) throw deleteError;
            return res.status(200).json({ message: 'Removed from contacts', isContacted: false });
        } else {
            // Add
            const { error: insertError } = await supabase
                .from('employer_contacts')
                .insert({ student_id: studentId, employer_id: employerId });
            
            if (insertError) throw insertError;
            return res.status(201).json({ message: 'Added to contacts', isContacted: true });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error toggling contact', error: error.message });
    }
};

export const getPublicEmployerById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('employers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ message: 'Company not found' });

        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching company profile', error: error.message });
    }
};

export const getAllPublicEmployers = async (req: any, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('employers')
            .select('*')
            .order('company_name', { ascending: true });

        if (error) throw error;
        res.status(200).json(data || []);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching companies', error: error.message });
    }
};
