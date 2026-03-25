import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, LogOut, CheckCircle, Clock, Users, FileText, XCircle, ExternalLink, Award } from 'lucide-react';
import '../../styles/dashboard.css';
import { applicationService, studentService } from '../../services/api';

const ReviewModal: React.FC<{ isOpen: boolean; onClose: () => void; application: any; onStatusUpdate: (appId: string, status: string) => void }> = ({ isOpen, onClose, application, onStatusUpdate }) => {
    const [matchScore, setMatchScore] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && application) {
            calculateMatch();
        }
    }, [isOpen, application]);

    const calculateMatch = async () => {
        try {
            const studentSkills = await studentService.getSkills();
            const internSkills = application.internships?.internship_skills || [];
            
            if (internSkills.length === 0) {
                setMatchScore(100);
                return;
            }

            const studentSkillIds = new Set(studentSkills.map((s: any) => s.skill_id));
            let matchCount = 0;
            internSkills.forEach((req: any) => {
                if (studentSkillIds.has(req.skill_id)) matchCount++;
            });

            setMatchScore(Math.round((matchCount / internSkills.length) * 100));
        } catch (e) {
            console.error('Match calculation error', e);
        }
    };

    if (!isOpen || !application) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{
                    background: 'var(--color-background)',
                    width: '100%', maxWidth: '600px', borderRadius: '16px',
                    padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '4px solid var(--color-primary)' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=` + application.id} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h2 style={{ margin: 0 }}>{application.user_profiles?.first_name} {application.user_profiles?.last_name}</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Applying for {application.internships?.title}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                            <Award size={14} /> Skill Match
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{matchScore !== null ? `${matchScore}%` : 'Calculating...'}</div>
                    </div>
                    <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                            <FileText size={14} /> Resume
                        </div>
                        <a 
                            href={application.students?.cv_path ? `http://localhost:5005${application.students.cv_path}` : '#'} 
                            target="_blank" 
                            style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            View CV <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => onStatusUpdate(application.id, 'rejected')}
                        style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <XCircle size={18} /> Reject
                    </button>
                    <button 
                        onClick={() => onStatusUpdate(application.id, 'accepted')}
                        style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <CheckCircle size={18} /> Accept Intern
                    </button>
                </div>
                <button onClick={onClose} style={{ width: '100%', marginTop: '1rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>Close Review</button>
            </motion.div>
        </div>
    );
};

const SupervisorDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await applicationService.getSupervisorApplications();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appId: string, status: string) => {
        try {
            await applicationService.updateStatus(appId, status);
            setIsReviewOpen(false);
            fetchApplications();
        } catch (error) {
            console.error('Status update failed:', error);
            alert('Failed to update status');
        }
    };

    const openReview = (app: any) => {
        setSelectedApp(app);
        setIsReviewOpen(true);
    };

    const counts = {
        active: applications.filter(a => a.status === 'accepted').length,
        pending: applications.filter(a => a.status === 'pending').length
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>Supervisor Portal</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/supervisor/dashboard" className={location.pathname === '/supervisor/dashboard' ? 'active' : ''}><Briefcase size={18} /> Overview</Link>
                    <Link to="/supervisor/applications" className={location.pathname === '/supervisor/applications' ? 'active' : ''}><FileText size={18} /> Manage Interns</Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h2>Welcome back, {user?.firstName || 'Supervisor'}! 👋</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Review and manage applications assigned to you.</p>
                </header>

                <div className="dashboard-content">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', padding: '1rem', borderRadius: '50%' }}>
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{counts.active}</h3>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Active Interns</p>
                            </div>
                        </div>
                        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '1rem', borderRadius: '50%' }}>
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{counts.pending}</h3>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Pending Reviews</p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading assigned applications...</p>
                    ) : applications.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <Users size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Interns Assigned</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>You have no applications to review at this time.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {applications.map((app: any) => (
                                <motion.div 
                                    key={app.id} 
                                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                    whileHover={{ borderColor: 'var(--color-primary)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-border)', overflow: 'hidden' }}>
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=` + app.id} style={{ width: '100%' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{app.user_profiles?.first_name} {app.user_profiles?.last_name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-primary)' }}>{app.internships?.title}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-background)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                                            GPA: {app.students?.gpa || 'N/A'}
                                        </span>
                                        <button 
                                            onClick={() => openReview(app)}
                                            style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
                                        >
                                            Review Candidate
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <ReviewModal 
                isOpen={isReviewOpen} 
                onClose={() => setIsReviewOpen(false)} 
                application={selectedApp}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
};

export default SupervisorDashboard;
