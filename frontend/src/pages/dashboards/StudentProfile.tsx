import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Star, LogOut, Code, User, Upload, ArrowRight, Save, Search, Building2 } from 'lucide-react';
import '../../styles/dashboard.css';
import { studentService } from '../../services/api';
import DashboardHeader from '../../components/layout/DashboardHeader';

const StudentProfile: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>({});
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await studentService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            Object.keys(profile).forEach(key => {
                if (profile[key] !== null && profile[key] !== undefined && key !== 'cv_path' && key !== 'profile_picture' && key !== 'cv') {
                    formData.append(key, profile[key]);
                }
            });
            if (cvFile) {
                formData.append('cv', cvFile);
            }
            if (profilePictureFile) {
                formData.append('profile_picture', profilePictureFile);
            }
            
            const result = await studentService.updateProfile(formData);
            
            setProfile((prev: any) => ({
                ...prev,
                ...(result.cv_path && { cv_path: result.cv_path }),
                ...(result.profile_picture && { profile_picture: result.profile_picture })
            }));

            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error('Update failed', error);
            alert('Failed to update profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>Intern Portal</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/student/dashboard" className={location.pathname === '/student/dashboard' ? 'active' : ''}><Briefcase size={18} /> Recommendations</Link>
                    <Link to="/student/all-internships" className={location.pathname === '/student/all-internships' ? 'active' : ''}><Search size={18} /> All Internships</Link>
                    <Link to="/student/companies" className={location.pathname === '/student/companies' ? 'active' : ''}><Building2 size={18} /> Companies</Link>
                    <Link to="/student/profile" className={location.pathname === '/student/profile' ? 'active' : ''}><User size={18} /> My Profile</Link>
                    <Link to="/student/skills" className={location.pathname === '/student/skills' ? 'active' : ''}><Code size={18} /> Skill Profile</Link>
                    <Link to="/student/applications" className={location.pathname === '/student/applications' ? 'active' : ''}><FileText size={18} /> My Applications</Link>
                    <Link to="/student/saved" className={location.pathname === '/student/saved' ? 'active' : ''}><Star size={18} /> Saved Internships</Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem' }}>
                <DashboardHeader 
                    title="My Profile 👤" 
                    subtitle="Manage your personal information and resume" 
                />

                <div className="dashboard-content">
                    {loading ? (
                        <p>Loading profile...</p>
                    ) : (
                        <motion.form 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ 
                                    width: '100px', 
                                    height: '100px', 
                                    borderRadius: '50%', 
                                    background: 'var(--color-border)', 
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {profilePictureFile ? (
                                        <img src={URL.createObjectURL(profilePictureFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : profile.profile_picture ? (
                                        <img src={`http://localhost:5005${profile.profile_picture}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <User size={48} color="var(--color-text-muted)" />
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h4 style={{ margin: 0 }}>Profile Picture</h4>
                                    <label style={{ 
                                        padding: '0.5rem 1rem', 
                                        borderRadius: '8px', 
                                        border: '1px solid var(--color-border)', 
                                        background: 'var(--color-surface)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        textAlign: 'center'
                                    }}>
                                        Upload New
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setProfilePictureFile(e.target.files[0]);
                                            }
                                        }} />
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="first_name" value={profile.first_name || ''} onChange={handleChange} required className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="last_name" value={profile.last_name || ''} onChange={handleChange} required className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="tel" name="phone" value={profile.phone || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>University ID</label>
                                    <input type="text" name="university_id" value={profile.university_id || ''} onChange={handleChange} required className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Degree Program</label>
                                    <input type="text" name="degree_program" value={profile.degree_program || ''} onChange={handleChange} required className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <input type="text" name="specialization" value={profile.specialization || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>GPA</label>
                                    <input type="number" step="0.01" name="gpa" value={profile.gpa || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Graduation Year</label>
                                    <input type="number" name="graduation_year" value={profile.graduation_year || ''} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label>Preferred Mode</label>
                                    <select name="preferred_mode" value={profile.preferred_mode || ''} onChange={handleChange} className="form-input">
                                        <option value="">Select Mode</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="onsite">On-site</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Preferred Location</label>
                                    <input type="text" name="preferred_location" value={profile.preferred_location || ''} onChange={handleChange} className="form-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows={4} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}></textarea>
                            </div>

                            <div className="form-group" style={{ border: '1px dashed var(--color-border)', padding: '1.5rem', borderRadius: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <Upload size={18} /> Upload CV (PDF/Word)
                                </label>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="form-input" style={{ border: 'none', padding: 0 }} />
                                {profile.cv_path && (
                                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                                        Current CV: <button type="button" onClick={() => setShowPdfModal(true)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.875rem' }}>View File</button>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.75rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, background: 'var(--color-primary)', color: 'white' }}>
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>
            </main>
        </div>
            
            {showPdfModal && profile.cv_path && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', width: '80%', height: '80%', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>View CV</h3>
                            <button type="button" onClick={() => setShowPdfModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%' }}>&times;</button>
                        </div>
                        <iframe src={`http://localhost:5005${profile.cv_path}`} style={{ width: '100%', flex: 1, border: 'none', borderRadius: '8px', background: '#fff' }} title="CV Viewer" />
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentProfile;
