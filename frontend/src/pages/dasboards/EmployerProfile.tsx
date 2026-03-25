import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building2, LogOut, Plus, Upload, Image as ImageIcon, Users, FileText } from 'lucide-react';
import '../../styles/dashboard.css';
import { employerService } from '../../services/api';

const EmployerProfile: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>({});
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await employerService.getProfile();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            Object.keys(profile).forEach(key => {
                // Prevent appending the static string URL alongside the new file 
                if (profile[key] !== null && profile[key] !== undefined && key !== 'cover_image') {
                    formData.append(key, profile[key]);
                }
            });
            if (coverImageFile) {
                formData.append('cover_image', coverImageFile);
            }
            
            const result = await employerService.updateProfile(formData);
            
            setProfile((prev: any) => ({
                ...prev,
                ...(result.cover_image && { cover_image: result.cover_image })
            }));
            alert('Company profile updated successfully!');
        } catch (error: any) {
            console.error('Update failed', error);
            alert('Failed to update company profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>Employer Portal</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/employer/dashboard" className={location.pathname === '/employer/dashboard' ? 'active' : ''}><Briefcase size={18} /> Manage Postings</Link>
                    <Link to="/employer/applications" className={location.pathname === '/employer/applications' ? 'active' : ''}><FileText size={18} /> Manage Applications</Link>
                    <Link to="/employer/post-internship" className={location.pathname === '/employer/post-internship' ? 'active' : ''}><Plus size={18} /> Post Internship</Link>
                    <Link to="/employer/supervisors" className={location.pathname === '/employer/supervisors' ? 'active' : ''}><Users size={18} /> Manage Supervisors</Link>
                    <Link to="/employer/profile" className={location.pathname === '/employer/profile' ? 'active' : ''}><Building2 size={18} /> Company Profile</Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h2>Company Profile</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your organization's public details and branding</p>
                </header>

                <div className="dashboard-content" style={{ maxWidth: '800px' }}>
                    {loading ? (
                        <p>Loading profile...</p>
                    ) : (
                        <motion.form 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            {/* Banner Image Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                                <label style={{ fontSize: '1rem', fontWeight: 600 }}>Company Cover Banner</label>
                                <div style={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    borderRadius: '12px', 
                                    background: 'var(--color-background)', 
                                    border: '1px dashed var(--color-border)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {coverImageFile ? (
                                        <img src={URL.createObjectURL(coverImageFile)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : profile.cover_image ? (
                                        <img src={`http://localhost:5005${profile.cover_image}`} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text-muted)', gap: '0.5rem' }}>
                                            <ImageIcon size={48} />
                                            <span>No cover image uploaded</span>
                                        </div>
                                    )}
                                    <label style={{ 
                                        position: 'absolute',
                                        bottom: '1rem',
                                        right: '1rem',
                                        padding: '0.5rem 1rem', 
                                        borderRadius: '8px', 
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <Upload size={16} /> Upload New
                                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setCoverImageFile(e.target.files[0]);
                                            }
                                        }} />
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Company Name</label>
                                    <input type="text" name="company_name" value={profile.company_name || ''} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label>Industry</label>
                                    <input type="text" name="industry" value={profile.industry || ''} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label>Company Size (Employees)</label>
                                    <select name="company_size" value={profile.company_size || ''} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}>
                                        <option value="">Select Size</option>
                                        <option value="1-10">1-10</option>
                                        <option value="11-50">11-50</option>
                                        <option value="51-200">51-200</option>
                                        <option value="201-500">201-500</option>
                                        <option value="500+">500+</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Website</label>
                                    <input type="url" name="website" value={profile.website || ''} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label>Headquarters Location</label>
                                    <input type="text" name="location" value={profile.location || ''} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label>Representative First Name</label>
                                    <input type="text" name="first_name" value={profile.first_name || ''} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div className="form-group">
                                    <label>Representative Last Name</label>
                                    <input type="text" name="last_name" value={profile.last_name || ''} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
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
    );
};

export default EmployerProfile;
