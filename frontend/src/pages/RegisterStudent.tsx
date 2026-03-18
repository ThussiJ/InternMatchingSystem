import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const RegisterStudent: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        university_id: '',
        degree_program: '',
        specialization: '',
        graduation_year: new Date().getFullYear() + 1
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
                role: 'student'
            });
            // Automatically navigate to login or auto-login
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
                    <h2>Student Registration</h2>
                    <p>Join to find exclusive internship opportunities</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form two-col-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
                    </div>

                    <div className="form-group full-width">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>University ID</label>
                        <input type="text" name="university_id" value={formData.university_id} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Graduation Year</label>
                        <input type="number" name="graduation_year" value={formData.graduation_year} onChange={handleChange} required />
                    </div>

                    <div className="form-group full-width">
                        <label>Degree Program</label>
                        <input type="text" name="degree_program" value={formData.degree_program} onChange={handleChange} placeholder="e.g. BSc Computer Science" required />
                    </div>

                    <div className="form-group full-width">
                        <label>Specialization (Optional)</label>
                        <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Artificial Intelligence" />
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit full-width" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Student Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterStudent;
