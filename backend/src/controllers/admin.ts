import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getAllEmployers = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('employers')
            .select('*')
            .order('company_name', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching employers', error: error.message });
    }
};

export const toggleEmployerFeatured = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { is_featured } = req.body;

        const { data, error } = await supabase
            .from('employers')
            .update({ is_featured })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: `Employer ${is_featured ? 'featured' : 'unfeatured'} successfully`, employer: data });
    } catch (error: any) {
        res.status(500).json({ message: 'Error toggling featured status', error: error.message });
    }
};

export const getAllInternships = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                employers (company_name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching internships', error: error.message });
    }
};

export const toggleInternshipFeatured = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { is_featured } = req.body;

        const { data, error } = await supabase
            .from('internships')
            .update({ is_featured })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: `Internship ${is_featured ? 'featured' : 'unfeatured'} successfully`, internship: data });
    } catch (error: any) {
        res.status(500).json({ message: 'Error toggling featured status', error: error.message });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const { data, error } = await supabase
            .from('user_profiles')
            .update({ is_active })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: `User ${is_active ? 'activated' : 'deactivated'} successfully`, user: data });
    } catch (error: any) {
        res.status(500).json({ message: 'Error toggling user status', error: error.message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Note: In a real app, you might want to delete from auth.users too
        // but that requires admin privileges and is more complex.
        // For now, we'll just delete the profile.
        const { error } = await supabase
            .from('user_profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
