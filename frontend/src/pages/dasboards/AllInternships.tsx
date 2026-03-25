import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Star, LogOut, Code, MapPin, DollarSign, Clock, Search, User } from 'lucide-react';
import '../../styles/dashboard.css';
import { internshipService, savedInternshipService } from '../../services/api';
import ApplyModal from '../../components/internships/ApplyModal';
import { Bookmark } from 'lucide-react';

const AllInternships: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInternship, setSelectedInternship] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const data = await internshipService.getOpenInternships();
            setInternships(data);
        } catch (error) {
            console.error('Failed to fetch internships:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = (internship: any) => {
        setSelectedInternship(internship);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.MouseEvent, internshipId: string) => {
        e.stopPropagation();
        try {
            await savedInternshipService.saveInternship(internshipId);
            alert('Internship saved!');
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save internship');
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
                    <Link to="/student/profile" className={location.pathname === '/student/profile' ? 'active' : ''}><User size={18} /> My Profile</Link>
                    <Link to="/student/skills"><Code size={18} /> Skill Profile</Link>
                    <Link to="/student/applications" className={location.pathname === '/student/applications' ? 'active' : ''}><FileText size={18} /> My Applications</Link>
                    <Link to="/student/saved" className={location.pathname === '/student/saved' ? 'active' : ''}><Star size={18} /> Saved Internships</Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h2>All Opportunities 🌍</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Browse all currently open internship positions</p>
                </header>

                <div className="dashboard-content">
                    {loading ? (
                        <p>Loading internships...</p>
                    ) : internships.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <Search size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Openings</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Check back later for new opportunities!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {internships.map((intern: any, index: number) => (
                                <motion.div 
                                    key={intern.id}
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleApplyClick(intern)}
                                    style={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.25rem',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                    }}
                                    whileHover={{ y: -4, borderColor: 'var(--color-primary)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                                >
                                    <div style={{ 
                                        height: '140px', 
                                        margin: '-1.5rem -1.5rem 0 -1.5rem',
                                        background: 'var(--color-surface)',
                                        position: 'relative'
                                    }}>
                                        <button 
                                            onClick={(e) => handleSave(e, intern.id)}
                                            style={{ 
                                                position: 'absolute', top: '10px', left: '10px', 
                                                background: 'rgba(255,255,255,0.9)', border: 'none', 
                                                padding: '0.5rem', borderRadius: '50%', 
                                                cursor: 'pointer', zIndex: 10,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                            title="Save for later"
                                        >
                                            <Bookmark size={18} color="var(--color-primary)" />
                                        </button>
                                        <img 
                                            src={intern.cover_image ? `http://localhost:5005${intern.cover_image}` : (intern.employers?.cover_image ? `http://localhost:5005${intern.employers.cover_image}` : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')} 
                                            alt={`${intern.title} cover`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.25rem', lineHeight: 1.3, marginBottom: '0.25rem' }}>{intern.title}</h3>
                                        <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: '600', fontSize: '1rem' }}>{intern.employers?.company_name}</p>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {intern.location || intern.employers?.location || 'Remote'}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {intern.duration_weeks} weeks</span>
                                        {intern.stipend ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><DollarSign size={14} /> {intern.currency} {intern.stipend}</span> : <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Unpaid</span>}
                                    </div>
                                    
                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Skills</div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {intern.internship_skills?.slice(0, 4).map((s: any) => (
                                                <span key={s.skill_id} style={{
                                                    background: 'rgba(59, 130, 246, 0.08)',
                                                    color: 'var(--color-primary)',
                                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                                    padding: '0.25rem 0.6rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500
                                                }}>
                                                    {s.skills?.name}
                                                </span>
                                            ))}
                                            {intern.internship_skills?.length > 4 && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0.25rem 0' }}>+{intern.internship_skills.length - 4} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ 
                                        marginTop: '1.5rem', 
                                        display: 'flex', 
                                        gap: '1rem', 
                                        paddingTop: '1rem', 
                                        borderTop: '1px solid var(--color-border)' 
                                    }}>
                                        <button 
                                            onClick={(e) => handleSave(e, intern.id)}
                                            style={{ 
                                                flex: 1, 
                                                padding: '0.6rem', 
                                                borderRadius: '8px', 
                                                background: 'rgba(59, 130, 246, 0.05)', 
                                                color: 'var(--color-primary)', 
                                                border: '1px solid rgba(59, 130, 246, 0.2)', 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '0.5rem', 
                                                fontSize: '0.9rem', 
                                                fontWeight: 500 
                                            }}
                                        >
                                            <Bookmark size={16} /> Save
                                        </button>
                                        <button 
                                            className="btn-primary"
                                            style={{ flex: 1.5, padding: '0.6rem' }}
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <ApplyModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        internship={selectedInternship} 
                    />
                </div>
            </main>
        </div>
    );
};

export default AllInternships;
