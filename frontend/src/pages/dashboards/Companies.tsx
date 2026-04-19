import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Star, LogOut, Code, Search, User, Building2, Globe, MapPin, Users } from 'lucide-react';
import '../../styles/dashboard.css';
import { employerService } from '../../services/api';
import DashboardHeader from '../../components/layout/DashboardHeader';

const Companies: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();
    
    const [employers, setEmployers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployers();
    }, []);

    const fetchEmployers = async () => {
        try {
            const data = await employerService.getAllEmployersWithStatus();
            setEmployers(data);
        } catch (error) {
            console.error('Failed to fetch employers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBeInTouch = async (employerId: string) => {
        try {
            const response = await employerService.toggleBeInTouch(employerId);
            setEmployers(prev => prev.map(emp => 
                emp.id === employerId ? { ...emp, isContacted: response.isContacted } : emp
            ));
        } catch (error) {
            console.error('Failed to toggle contact:', error);
            alert('Failed to update contact status');
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

            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem' }}>
                <DashboardHeader 
                    title="Partner Companies 🏢" 
                    subtitle="Connect with employers to get notified of new opportunities" 
                />

                <div className="dashboard-content">
                    {loading ? (
                        <p>Loading companies...</p>
                    ) : employers.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <Building2 size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Companies Found</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Check back later as more employers join the platform.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {employers.map((emp: any, index: number) => (
                                <motion.div 
                                    key={emp.id}
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative'
                                    }}
                                    whileHover={{ y: -8, borderColor: 'var(--color-primary)', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                                >
                                    <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--color-primary-light, #e0e7ff), var(--color-primary))', position: 'relative' }}>
                                        {emp.cover_image ? (
                                            <img src={`http://localhost:5005${emp.cover_image}`} alt={emp.company_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                                                <Building2 size={48} color="white" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginTop: '-3rem', marginBottom: '1rem', position: 'relative' }}>
                                            <div style={{ 
                                                width: '64px', 
                                                height: '64px', 
                                                borderRadius: '12px', 
                                                background: 'white', 
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid white'
                                            }}>
                                                <Building2 size={32} color="var(--color-primary)" />
                                            </div>
                                        </div>

                                        <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)', fontSize: '1.25rem' }}>{emp.company_name}</h3>
                                        <p style={{ margin: '0 0 1rem 0', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>{emp.industry || 'Tech & Software'}</p>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                                <MapPin size={14} /> {emp.location || 'Distributed'}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                                <Users size={14} /> {emp.company_size || '1-50'} employees
                                            </div>
                                            {emp.website && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                                                    <Globe size={14} /> <a href={emp.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Visit Website</a>
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            onClick={() => handleToggleBeInTouch(emp.id)}
                                            style={{
                                                marginTop: 'auto',
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: emp.isContacted ? '2px solid var(--color-primary)' : 'none',
                                                background: emp.isContacted ? 'transparent' : 'var(--color-primary)',
                                                color: emp.isContacted ? 'var(--color-primary)' : 'white',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {emp.isContacted ? 'In Touch ✅' : 'Be in Touch'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Companies;
