import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, firstName, lastName, phone, ...specificData } = req.body;

        // 1. Create user in Supabase Auth via Admin API
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true // Auto-confirm for this implementation
        });

        if (authError) {
            return res.status(400).json({ message: authError.message });
        }

        const userId = authData.user.id;
        console.log('User created in Auth:', userId);

        // 2. Insert into public.user_profiles
        const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .insert({
                id: userId,
                role,
                first_name: firstName,
                last_name: lastName,
                phone
            })
            .select()
            .single();

        if (profileError) {
            console.error('Profile creation error:', profileError);
            return res.status(400).json({ message: profileError.message });
        }
        console.log('Profile created:', profileData);

        // 3. Insert into Role-Specific Tables
        if (role === 'student') {
            const { university_id, degree_program, specialization, graduation_year } = specificData;
            const { error: studentError } = await supabase
                .from('students')
                .insert({
                    id: userId,
                    university_id,
                    degree_program,
                    specialization,
                    graduation_year
                });

            if (studentError) {
                return res.status(400).json({ message: studentError.message });
            }
        } else if (role === 'employer') {
            const { company_name, industry, company_size, website } = specificData;
            const { error: employerError } = await supabase
                .from('employers')
                .insert({
                    id: userId,
                    company_name,
                    industry,
                    company_size,
                    website
                });

            if (employerError) {
                return res.status(400).json({ message: employerError.message });
            }
        }
        // Supervisor and Admin logic would go here similarly if they need dedicated tables

        res.status(201).json({ message: "User registered successfully", userId });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Sign in via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError || !authData.user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Fetch User Profile to get Role
        console.log('Fetching profile for user ID:', authData.user.id);
        const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('role, first_name, last_name')
            .eq('id', authData.user.id)
            .single();

        if (profileError || !profileData) {
            console.error('Profile fetch error or no profile found:', profileError);
            return res.status(404).json({ message: 'User profile not found' });
        }
        console.log('Profile found:', profileData);

        // 3. Generate internal JWT with role
        const token = jwt.sign(
            {
                id: authData.user.id,
                email: authData.user.email,
                role: profileData.role,
                firstName: profileData.first_name,
                lastName: profileData.last_name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: authData.user.id,
                email: authData.user.email,
                role: profileData.role,
                firstName: profileData.first_name,
                lastName: profileData.last_name
            }
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMe = async (req: any, res: Response) => {
    // Returns user info based on token
    res.status(200).json({ user: req.user });
};
