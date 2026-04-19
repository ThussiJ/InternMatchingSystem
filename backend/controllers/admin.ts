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

export const getAnalytics = async (req: AuthRequest, res: Response) => {
    console.log('[getAnalytics] Fetching statistics...');
    try {
        // Users counts
        console.log('[getAnalytics] Querying users...');
        const { count: totalUsers, error: err1 } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true });
        if (err1) console.error('[getAnalytics] Error totalUsers:', err1);
        
        const { count: studentCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
        const { count: employerCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer');
        const { count: supervisorCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'supervisor');

        // Internships counts
        console.log('[getAnalytics] Querying internships...');
        const { count: totalInternships, error: err2 } = await supabase.from('internships').select('*', { count: 'exact', head: true });
        if (err2) console.error('[getAnalytics] Error totalInternships:', err2);
        
        const { count: openInternships } = await supabase.from('internships').select('*', { count: 'exact', head: true }).eq('status', 'open');
        const { count: featuredInternships } = await supabase.from('internships').select('*', { count: 'exact', head: true }).eq('is_featured', true);

        // Applications counts
        console.log('[getAnalytics] Querying applications...');
        const { count: totalApplications, error: err3 } = await supabase.from('applications').select('*', { count: 'exact', head: true });
        if (err3) console.error('[getAnalytics] Error totalApplications:', err3);
        
        const { count: pendingApplications } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const { count: acceptedApplications } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'accepted');
        const { count: rejectedApplications } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected');
        const { count: selectedApplications } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'selected');

        console.log('[getAnalytics] Success!');
        res.status(200).json({
            users: {
                total: totalUsers || 0,
                students: studentCount || 0,
                employers: employerCount || 0,
                supervisors: supervisorCount || 0
            },
            internships: {
                total: totalInternships || 0,
                open: openInternships || 0,
                featured: featuredInternships || 0
            },
            applications: {
                total: totalApplications || 0,
                pending: pendingApplications || 0,
                accepted: acceptedApplications || 0,
                rejected: rejectedApplications || 0,
                selected: selectedApplications || 0
            }
        });
    } catch (error: any) {
        console.error('[getAnalytics] Catch Block Error:', error);
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};
