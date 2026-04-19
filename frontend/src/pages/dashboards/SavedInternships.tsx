import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, Star, LogOut, Code, MapPin, DollarSign, Clock, Search, User, Building2, Bookmark, Trash2 } from 'lucide-react';
import { savedInternshipService } from '../../services/api';
import DashboardHeader from '../../components/layout/DashboardHeader';
import '../../styles/dashboard.css';

const SavedInternships: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [savedList, setSavedList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedList();
    }, []);

    const fetchSavedList = async () => {
        try {
            const data = await savedInternshipService.getSavedInternships();
            setSavedList(data);
        } catch (error) {
            console.error('Failed to fetch saved internships:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (internshipId: string) => {
        try {
            await savedInternshipService.unsaveInternship(internshipId);
            setSavedList(prev => prev.filter(item => item.id !== internshipId));
        } catch (error) {
            console.error('Failed to unsave internship:', error);
            alert('Error unsaving internship');
        }
    };

    return (
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
            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem', width: '100%' }}>
                <DashboardHeader 
                    title="Saved Internships ⭐" 
                    subtitle="Keep track of opportunities you're interested in" 
                />

                <div className="dashboard-content">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>Loading your saved internships...</p>
                        </div>
                    ) : savedList.length === 0 ? (
                        <div style={{ 
                            background: 'var(--color-surface)', 
                            padding: '4rem', 
                            borderRadius: '16px', 
                            border: '1px dashed var(--color-border)', 
                            textAlign: 'center' 
                        }}>
                            <Bookmark size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1.5rem', opacity: 0.5 }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>No Saved Internships</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>You haven't bookmarked any internships yet. Browse available jobs to get started!</p>
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                            gap: '2rem' 
                        }}>
                            <AnimatePresence>
                                {savedList.map((internship, index) => (
                                    <motion.div 
                                        key={internship.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{
                                            background: 'var(--color-surface)',
                                            borderRadius: '16px',
                                            border: '1px solid var(--color-border)',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            position: 'relative'
                                        }}
                                        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    >
                                        <div style={{ height: '140px', background: 'var(--color-border)', overflow: 'hidden' }}>
                                            <img 
                                                src={internship.cover_image ? `http://localhost:5005${internship.cover_image}` : 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80'} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                alt={internship.title}
                                            />
                                        </div>
                                        
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{internship.title}</h3>
                                            
                                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <MapPin size={16} /> {internship.location || 'Remote'}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock size={16} /> {internship.duration_weeks} weeks
                                                </span>
                                            </div>

                                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                                    ${internship.stipend_amount || internship.stipend}/mo
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button 
                                                        onClick={() => handleUnsave(internship.id)}
                                                        style={{ 
                                                            padding: '0.6rem', 
                                                            borderRadius: '8px', 
                                                            background: 'rgba(239, 68, 68, 0.1)', 
                                                            color: '#ef4444', 
                                                            border: 'none', 
                                                            cursor: 'pointer' 
                                                        }}
                                                        title="Remove from saved"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <button 
                                                        className="btn-primary"
                                                        style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SavedInternships;
