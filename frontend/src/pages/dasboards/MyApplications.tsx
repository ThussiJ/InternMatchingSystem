import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Star, LogOut, Code, Search, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import '../../styles/dashboard.css';
import { applicationService } from '../../services/api';

const MyApplications: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await applicationService.getMyApplications();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'accepted': return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', icon: <CheckCircle size={16} /> };
            case 'rejected': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <XCircle size={16} /> };
            default: return { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308', icon: <Clock size={16} /> };
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
                    <h2>My Applications 📄</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Track the status of your internship applications</p>
                </header>

                <div className="dashboard-content">
                    {loading ? (
                        <p>Loading your applications...</p>
                    ) : applications.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <FileText size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Applications Yet</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>You haven't applied for any internships yet.</p>
                            <Link to="/student/all-internships" className="btn-primary" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none' }}>
                                Browse Internships
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {applications.map((app: any, index: number) => {
                                const style = getStatusStyle(app.status);
                                return (
                                    <motion.div 
                                        key={app.id}
                                        initial={{ opacity: 0, x: -20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            background: 'var(--color-surface)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '12px',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{app.internships?.title}</h3>
                                            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{app.internships?.employers?.company_name}</p>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                                                Applied on {new Date(app.applied_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <div style={{
                                            background: style.bg,
                                            color: style.color,
                                            padding: '0.5rem 1rem',
                                            borderRadius: '999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}>
                                            {style.icon}
                                            {app.status}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyApplications;
