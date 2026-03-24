import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, CheckCircle, XCircle, LogOut, ExternalLink, Award, User, Star, Clock } from 'lucide-react';
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
            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                style={{
                    background: 'var(--color-background)',
                    width: '100%', maxWidth: '600px', borderRadius: '20px',
                    padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    border: '1px solid var(--color-border)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1.5rem', border: '4px solid var(--color-primary)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=` + application.id} style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.75rem' }}>{application.students?.user_profiles?.first_name} {application.students?.user_profiles?.last_name}</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Applying for <strong>{application.internships?.title}</strong></p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--color-surface)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            <Award size={16} /> Skill Match
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{matchScore !== null ? `${matchScore}%` : '...'}</div>
                    </div>
                    <div style={{ background: 'var(--color-surface)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            <FileText size={16} /> Application
                        </div>
                        <a 
                            href={application.students?.cv_path ? `http://localhost:5005${application.students.cv_path}` : '#'} 
                            target="_blank" 
                            style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            Review CV <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            onClick={() => onStatusUpdate(application.id, 'rejected')}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <XCircle size={18} /> Reject
                        </button>
                        <button 
                            onClick={() => onStatusUpdate(application.id, 'accepted')}
                            style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <CheckCircle size={18} /> Accept
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => onStatusUpdate(application.id, 'placed')}
                        style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)' }}
                    >
                        <Star size={20} /> Confirm Placement & Hire
                    </button>
                </div>
                
                <button onClick={onClose} style={{ width: '100%', marginTop: '1.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>Cancel Review</button>
            </motion.div>
        </div>
    );
};

const SupervisorApplications: React.FC = () => {
    const { logout } = useAuth();
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
                    <h2>Review Candidates 🎯</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Assess assigned applicants and confirm their placement.</p>
                </header>

                <div className="dashboard-content">
                    {loading ? (
                        <p>Loading assigned applications...</p>
                    ) : applications.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <User size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3>No Candidates Assigned</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>You will see applications here once life cycles are delegated to you.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {applications.map((app: any) => (
                                <motion.div 
                                    key={app.id} 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                    whileHover={{ borderColor: 'var(--color-primary)', transform: 'translateY(-4px)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--color-border)', overflow: 'hidden' }}>
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=` + app.id} style={{ width: '100%' }} />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{app.students?.user_profiles?.first_name} {app.students?.user_profiles?.last_name}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{app.internships?.title}</p>
                                            </div>
                                        </div>
                                        <span style={{ 
                                            padding: '0.3rem 0.75rem', 
                                            borderRadius: '999px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 'bold', 
                                            textTransform: 'uppercase',
                                            background: app.status === 'placed' ? 'rgba(34, 197, 94, 0.2)' : app.status === 'accepted' ? 'rgba(59, 130, 246, 0.1)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                            color: app.status === 'placed' ? '#16a34a' : app.status === 'accepted' ? '#3b82f6' : app.status === 'rejected' ? '#ef4444' : '#eab308'
                                        }}>
                                            {app.status}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                                        <div style={{ background: 'var(--color-background)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Star size={14} color="#eab308" /> GPA: {app.students?.gpa || 'N/A'}
                                        </div>
                                        <div style={{ background: 'var(--color-background)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} /> Applied {new Date(app.applied_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => openReview(app)}
                                        style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.5rem' }}
                                    >
                                        Review & Decide
                                    </button>
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

export default SupervisorApplications;
