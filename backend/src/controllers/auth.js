"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_production';
const register = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, phone, ...specificData } = req.body;
        // 1. Create user in Supabase Auth via Admin API
        const { data: authData, error: authError } = await supabase_1.supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true // Auto-confirm for this implementation
        });
        if (authError) {
            return res.status(400).json({ message: authError.message });
        }
        const userId = authData.user.id;
        // 2. Insert into public.user_profiles
        const { error: profileError } = await supabase_1.supabase
            .from('user_profiles')
            .insert({
            id: userId,
            role,
            first_name: firstName,
            last_name: lastName,
            phone
        });
        if (profileError) {
            // Rollback Auth user if profile creation fails? (Skipped here for brevity, ideal for prod)
            return res.status(400).json({ message: profileError.message });
        }
        // 3. Insert into Role-Specific Tables
        if (role === 'student') {
            const { university_id, degree_program, specialization, graduation_year } = specificData;
            const { error: studentError } = await supabase_1.supabase
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
        }
        else if (role === 'employer') {
            const { company_name, industry, company_size, website } = specificData;
            const { error: employerError } = await supabase_1.supabase
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Sign in via Supabase Auth
        const { data: authData, error: authError } = await supabase_1.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (authError || !authData.user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // 2. Fetch User Profile to get Role
        const { data: profileData, error: profileError } = await supabase_1.supabase
            .from('user_profiles')
            .select('role, first_name, last_name')
            .eq('id', authData.user.id)
            .single();
        if (profileError || !profileData) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        // 3. Generate internal JWT with role
        const token = jsonwebtoken_1.default.sign({
            id: authData.user.id,
            email: authData.user.email,
            role: profileData.role,
            firstName: profileData.first_name,
            lastName: profileData.last_name
        }, JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    // Returns user info based on token
    res.status(200).json({ user: req.user });
};
exports.getMe = getMe;
//# sourceMappingURL=auth.js.map