import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { createNotification } from './notification';

export const applyToInternship = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        const { internshipId } = req.body;

        if (!studentId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // 1. Handle CV update if provided
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files && files['cv'] && files['cv'].length > 0) {
            const cv_path = '/uploads/cvs/' + files['cv'][0].filename;
            const { error: updateError } = await supabase
                .from('students')
                .update({ cv_path })
                .eq('id', studentId);
            
            if (updateError) throw updateError;
        }

        // 2. Create Application
        const { data, error } = await supabase
            .from('applications')
            .insert({
                internship_id: internshipId,
                student_id: studentId,
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ message: 'You have already applied for this internship' });
            }
            throw error;
        }

        // 3. Notify Employer and Student
        try {
            const { data: internship } = await supabase
                .from('internships')
                .select('employer_id, title, employers(company_name)')
                .eq('id', internshipId)
                .single();

            const { data: student } = await supabase
                .from('user_profiles')
                .select('first_name, last_name')
                .eq('id', studentId)
                .single();

            if (internship && student) {
                // Notify Employer
                await createNotification(
                    internship.employer_id,
                    'New Application Received',
                    `${student.first_name} ${student.last_name} has applied for ${internship.title}`,
                    'application',
                    `/employer/applications`
                );

                // Notify Student
                const companyName = (internship.employers as any)?.company_name || 'the employer';
                await createNotification(
                    studentId,
                    'Application Submitted',
                    `Your application for "${internship.title}" at ${companyName} has been submitted successfully.`,
                    'application_status',
                    '/student/applications'
                );
            }
        } catch (notifierr) {
            console.error('Failed to send notification:', notifierr);
        }

        res.status(201).json({ message: 'Application submitted successfully', application: data });
    } catch (error: any) {
        console.error('Apply error:', error);
        res.status(500).json({ message: 'Error submitting application', error: error.message });
    }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'User not authenticated' });

        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                internships (
                    title,
                    employers (company_name)
                )
            `)
            .eq('student_id', studentId)
            .order('applied_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
};

export const getEmployerApplications = async (req: AuthRequest, res: Response) => {
    try {
        const employerId = req.user?.id;
        if (!employerId) return res.status(401).json({ message: 'User not authenticated' });

        console.log('[getEmployerApplications] Querying for employer:', employerId);

        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                internships!inner (
                    title,
                    employer_id
                ),
                students (
                    id,
                    cv_path,
                    profile_picture,
                    gpa,
                    university_id,
                    user_profiles (
                        first_name,
                        last_name
                    )
                ),
                supervisor:user_profiles!supervisor_id (
                    first_name,
                    last_name
                )
            `)
            .eq('internships.employer_id', employerId);

        if (error) {
            console.error('[getEmployerApplications] Supabase Error:', error);
            return res.status(error.code === 'PGRST116' ? 404 : 500).json({ message: error.message });
        }

        console.log(`[getEmployerApplications] Found ${data?.length || 0} applications`);
        res.status(200).json(data);
    } catch (error: any) {
        console.error('[getEmployerApplications] Exception:', error.message);
        res.status(500).json({ message: 'Error fetching employer applications', error: error.message });
    }
};

export const getSupervisorApplications = async (req: AuthRequest, res: Response) => {
    try {
        const supervisorId = req.user?.id;
        if (!supervisorId) return res.status(401).json({ message: 'User not authenticated' });

        console.log('[getSupervisorApplications] Querying for supervisor:', supervisorId);

        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                internships (
                    title,
                    employers (company_name)
                ),
                students (
                    id,
                    cv_path,
                    profile_picture,
                    gpa,
                    university_id,
                    user_profiles (
                        first_name,
                        last_name
                    )
                )
            `)
            .eq('supervisor_id', supervisorId);

        if (error) {
            console.error('[getSupervisorApplications] Supabase Error:', error);
            throw error;
        }

        console.log(`[getSupervisorApplications] Found ${data?.length || 0} applications`);
        res.status(200).json(data);
    } catch (error: any) {
        console.error('[getSupervisorApplications] Exception:', error.message);
        res.status(500).json({ message: 'Error fetching supervisor applications', error: error.message });
    }
};

export const assignSupervisor = async (req: AuthRequest, res: Response) => {
    try {
        const employerId = req.user?.id;
        const { id } = req.params;
        const { supervisorId } = req.body;

        if (!employerId) return res.status(401).json({ message: 'User not authenticated' });

        // Verify application belongs to employer
        const { data: app, error: appError } = await supabase
            .from('applications')
            .select('*, internships(employer_id)')
            .eq('id', id)
            .single();

        if (appError || (app.internships as any).employer_id !== employerId) {
            return res.status(403).json({ message: 'Unauthorized to assign supervisor' });
        }

        const { error: updateError } = await supabase
            .from('applications')
            .update({ supervisor_id: supervisorId })
            .eq('id', id);

        if (updateError) throw updateError;

        // Notify Student
        try {
            const { data: supervisor } = await supabase
                .from('user_profiles')
                .select('first_name, last_name')
                .eq('id', supervisorId)
                .single();

            if (app && supervisor) {
                await createNotification(
                    app.student_id,
                    'Supervisor Assigned',
                    `${supervisor.first_name} ${supervisor.last_name} has been assigned as your supervisor for your application to "${(app.internships as any).title}".`,
                    'supervisor_assigned',
                    '/student/applications'
                );
            }
        } catch (notifierr) {
            console.error('Failed to notify student of supervisor assignment:', notifierr);
        }

        res.status(200).json({ message: 'Supervisor assigned successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error assigning supervisor', error: error.message });
    }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!userId) return res.status(401).json({ message: 'User not authenticated' });

        const { error: updateError } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', id);

        if (updateError) throw updateError;

        // Notify Student based on status change
        try {
            const { data: app } = await supabase
                .from('applications')
                .select('student_id, internships(title, employer_id, employers(company_name))')
                .eq('id', id)
                .single();

            if (app) {
                const companyName = (app.internships as any).employers.company_name;
                const internshipTitle = (app.internships as any).title;
                
                let title = '';
                let message = '';
                let type = 'application_status';

                if (status === 'selected') {
                    title = 'Congratulations! You are Selected';
                    message = `You have been selected for the internship: ${internshipTitle} at ${companyName}. Please check your email for further instructions.`;
                    type = 'selection';
                } else if (status === 'accepted') {
                    title = 'Application Accepted';
                    message = `Your application for "${internshipTitle}" at ${companyName} has been accepted.`;
                } else if (status === 'rejected') {
                    title = 'Application Update';
                    message = `Thank you for your interest in the "${internshipTitle}" position at ${companyName}. Unfortunately, your application was not selected at this time.`;
                }

                if (title && message) {
                    await createNotification(
                        app.student_id,
                        title,
                        message,
                        type,
                        '/student/applications'
                    );
                }
            }
        } catch (notifierr) {
            console.error('Failed to send notification to student:', notifierr);
        }

        res.status(200).json({ message: 'Application status updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};
