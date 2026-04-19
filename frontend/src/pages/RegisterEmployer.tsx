import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { motion } from 'framer-motion';
import { AlertCircle, User, Mail, Lock, Phone, Building, Briefcase, Users, Link as LinkIcon } from 'lucide-react';
import '../styles/auth.css';

const RegisterEmployer: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        company_name: '',
        industry: '',
        company_size: '',
        website: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.register({
                ...formData,
                role: 'employer'
            });
            navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card register-card"
            >
                <div className="auth-header">
                    <h2>Employer Registration</h2>
                    <p>Create an account to post internships and hire top talent</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form two-col-form">
                    {/* Representative Info */}
                    <div className="form-group full-width" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Representative Information</h3>
                    </div>

                    <div className="form-group">
                        <label>First Name</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <div className="input-with-icon">
                            <User size={18} className="input-icon" />
                            <input type="text" name="lastName" value={formData.lastName} placeholder="Doe" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="employer@company.com" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength={6} />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Phone Number</label>
                        <div className="input-with-icon">
                            <Phone size={18} className="input-icon" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="form-group full-width" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Company Details</h3>
                    </div>

                    <div className="form-group full-width">
                        <label>Company/Organization Name</label>
                        <div className="input-with-icon">
                            <Building size={18} className="input-icon" />
                            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Acme Corp" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Industry</label>
                        <div className="input-with-icon">
                            <Briefcase size={18} className="input-icon" />
                            <select name="industry" value={formData.industry} onChange={handleChange} required>
                                <option value="">Select an industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Retail">Retail</option>
                                <option value="Education">Education</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Company Size</label>
                        <div className="input-with-icon">
                            <Users size={18} className="input-icon" />
                            <select name="company_size" value={formData.company_size} onChange={handleChange} required>
                                <option value="">Select size</option>
                                <option value="1-10">1-10 Employees</option>
                                <option value="11-50">11-50 Employees</option>
                                <option value="51-200">51-200 Employees</option>
                                <option value="201-500">201-500 Employees</option>
                                <option value="500+">500+ Employees</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Company Website</label>
                        <div className="input-with-icon">
                            <LinkIcon size={18} className="input-icon" />
                            <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://company.com" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit full-width" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Employer Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterEmployer;
