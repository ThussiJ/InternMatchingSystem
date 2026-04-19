import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, FileText, LogOut, Plus, MapPin, Clock, DollarSign, Building2, User, ChevronRight, CheckCircle, XCircle, Edit3, Trash2 } from 'lucide-react';
import '../../styles/dashboard.css';
import { internshipService, applicationService, employerService } from '../../services/api';
import DashboardHeader from '../../components/layout/DashboardHeader';

const ApplicantsModal: React.FC<{ isOpen: boolean; onClose: () => void; applications: any[]; supervisors: any[]; onAssign: (appId: string, supId: string) => void }> = ({ isOpen, onClose, applications, supervisors, onAssign }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                style={{
                    background: 'var(--color-background)',
                    width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '16px',
                    overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    display: 'flex', flexDirection: 'column'
                }}
            >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Applicants</h2>
                    <button onClick={onClose} className="btn-logout" style={{ padding: '0.5rem' }}>Close</button>
                </div>
                <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                    {applications.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No applicants yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {applications.map((app: any) => (
                                <div key={app.id} style={{ 
                                    background: 'var(--color-surface)', border: '1px solid var(--color-border)', 
                                    padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-border)' }}>
                                            <img 
                                                src={app.students?.profile_picture ? `http://localhost:5005${app.students.profile_picture}` : 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + app.id} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{app.students?.user_profiles?.first_name} {app.students?.user_profiles?.last_name}</h4>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                                <span style={{ fontSize: '0.7rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>GPA: {app.students?.gpa || 'N/A'}</span>
                                                <span style={{ fontSize: '0.7rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{app.students?.university_id || 'Student'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Assign Supervisor</label>
                                            <select 
                                                value={app.supervisor_id || ''} 
                                                onChange={(e) => onAssign(app.id, e.target.value)}
                                                style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: '0.8rem' }}
                                            >
                                                <option value="">Unassigned</option>
                                                {supervisors.map(s => (
                                                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', background: app.status === 'accepted' ? 'rgba(34, 197, 94, 0.1)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)', color: app.status === 'accepted' ? '#22c55e' : app.status === 'rejected' ? '#ef4444' : '#eab308' }}>
                                            {app.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const EmployerDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [postings, setPostings] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [supervisors, setSupervisors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [selectedPostApps, setSelectedPostApps] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pData, aData, sData] = await Promise.all([
                internshipService.getMyInternships(),
                applicationService.getEmployerApplications(),
                employerService.getSupervisors()
            ]);
            setPostings(pData);
            setApplications(aData);
            setSupervisors(sData);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (appId: string, supId: string) => {
        try {
            await applicationService.assignSupervisor(appId, supId);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to assign supervisor:', error);
            alert('Error assigning supervisor');
        }
    };

    const handleDeleteInternship = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete the internship "${title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await internshipService.deleteInternship(id);
            alert('Internship deleted successfully');
            fetchData(); // Refresh list
        } catch (error: any) {
            console.error('Failed to delete internship:', error);
            alert('Failed to delete internship: ' + error.message);
        }
    };

    const openApplicantsList = (postId: string) => {
        const postApps = applications.filter(app => app.internship_id === postId);
        setSelectedPostApps(postApps);
        setIsAppModalOpen(true);
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
                    <Link to="/employer/post-internship"><Plus size={18} /> Post Internship</Link>
                    <Link to="/employer/supervisors"><Users size={18} /> Manage Supervisors</Link>
                    <Link to="/employer/profile"><Building2 size={18} /> Company Profile</Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem' }}>
                <DashboardHeader 
                    title={`Welcome back, ${user?.firstName || 'Employer'}! 👋`} 
                    subtitle="Manage your internship postings and applicants" 
                />

                <div className="dashboard-content">
                    {loading ? (
                        <p>Loading your active postings...</p>
                    ) : postings.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <Briefcase size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Active Postings</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>You haven't published any internships yet.</p>
                            <button 
                                onClick={() => navigate('/employer/post-internship')}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Create First Posting
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {postings.map((post: any, index: number) => {
                                const postAppCount = applications.filter(a => a.internship_id === post.id).length;
                                return (
                                    <motion.div 
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        transition={{ delay: index * 0.1 }}
                                        style={{
                                            background: 'var(--color-surface)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div style={{ 
                                            height: '140px', 
                                            margin: '-1.5rem -1.5rem 0 -1.5rem',
                                            background: 'var(--color-surface)'
                                        }}>
                                            <img 
                                                src={post.cover_image ? `http://localhost:5005${post.cover_image}` : (post.employers?.cover_image ? `http://localhost:5005${post.employers.cover_image}` : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')} 
                                                alt={`${post.title} cover`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80';
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.25rem' }}>{post.title}</h3>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    onClick={() => navigate(`/employer/edit-internship/${post.id}`)}
                                                    style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}
                                                    title="Edit"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteInternship(post.id, post.title)}
                                                    style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <span style={{ 
                                                    background: post.status === 'open' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)', 
                                                    color: post.status === 'open' ? '#22c55e' : '#6b7280', 
                                                    padding: '0.25rem 0.75rem', 
                                                    borderRadius: '999px', 
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {post.status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {post.location || 'Remote'}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {post.duration_weeks} weeks</span>
                                        </div>
                                        
                                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                                <Users size={16} />
                                                <span>{postAppCount} Applicants</span>
                                            </div>
                                            <button 
                                                onClick={() => openApplicantsList(post.id)}
                                                style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: '0.5rem 1rem', borderRadius: '6px', color: 'var(--color-text-main)', cursor: 'pointer', fontSize: '0.875rem' }}
                                            >
                                                View Applicants
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <ApplicantsModal 
                isOpen={isAppModalOpen} 
                onClose={() => setIsAppModalOpen(false)} 
                applications={selectedPostApps}
                supervisors={supervisors}
                onAssign={handleAssign}
            />
        </div>
    );
};

export default EmployerDashboard;
