import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { motion } from 'framer-motion';
import { AlertCircle, Shield, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import '../styles/auth.css';

const RegisterAdmin: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        admin_verification_code: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Extra frontend verification step to deter random registrants
        if (formData.admin_verification_code !== 'SUPER_ADMIN_2026') {
            setError('Invalid Admin Verification Code');
            setIsLoading(false);
            return;
        }

        try {
            await authService.register({
                ...formData,
                role: 'admin'
            });
            navigate('/login', { state: { message: 'Admin Registration successful! Please sign in.' } });
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ background: 'var(--color-surface)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
                style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 20px rgba(var(--color-primary), 0.1)' }}
            >
                <div className="auth-header">
                    <Shield size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                    <h2>Admin Setup</h2>
                    <p>Register as a system administrator</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Admin" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="User" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Admin Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@system.com" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Secure Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength={8} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>System Verification Code</label>
                        <div className="input-with-icon">
                            <ShieldCheck size={18} className="input-icon" />
                            <input
                                type="password"
                                name="admin_verification_code"
                                value={formData.admin_verification_code}
                                onChange={handleChange}
                                placeholder="Required for admin access"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                        {isLoading ? 'Registering Admin...' : 'Register Administrator Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Return to <Link to="/login">Sign In</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterAdmin;
