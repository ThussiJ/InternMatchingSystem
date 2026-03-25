import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, FileText, LogOut, Search, Calendar, Plus, Building2 } from 'lucide-react';
import '../../styles/dashboard.css';
import { applicationService, employerService, internshipService } from '../../services/api';

const EmployerApplications: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();
    
    const [applications, setApplications] = useState<any[]>([]);
    const [supervisors, setSupervisors] = useState<any[]>([]);
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [internshipFilter, setInternshipFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [aData, sData, pData] = await Promise.all([
                applicationService.getEmployerApplications(),
                employerService.getSupervisors(),
                internshipService.getMyInternships()
            ]);
            setApplications(aData);
            setSupervisors(sData);
            setInternships(pData);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (appId: string, supId: string) => {
        try {
            await applicationService.assignSupervisor(appId, supId);
            fetchData();
        } catch (error) {
            console.error('Failed to assign supervisor:', error);
            alert('Error assigning supervisor');
        }
    };

    const filteredApplications = applications.filter(app => {
        const profile = app.students?.user_profiles;
        const fullName = profile ? `${profile.first_name} ${profile.last_name}` : '';
        const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesInternship = internshipFilter === 'all' || app.internship_id === internshipFilter;
        return matchesSearch && matchesStatus && matchesInternship;
    });

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
                    <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <h2>Manage Applications 📂</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Review applicants and delegate to supervisors</p>
                    <p style={{ fontSize: '0.8rem', color: 'orange' }}>Debug: {applications.length} apps fetched, filtered: {filteredApplications.length}</p>
                </header>

                <div className="dashboard-content">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={18} />
                            <input 
                                type="text" 
                                placeholder="Search candidates..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                            />
                        </div>
                        <select 
                            value={internshipFilter} 
                            onChange={(e) => setInternshipFilter(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', minWidth: '200px' }}
                        >
                            <option value="all">All Internships</option>
                            {internships.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                        </select>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="placed">Placed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading applications...</p>
                    ) : filteredApplications.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <FileText size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3>No Applications Found</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredApplications.map((app) => (
                                <motion.div 
                                    key={app.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1.5rem', alignItems: 'center' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-border)' }}>
                                            <img 
                                                src={app.students?.profile_picture ? `http://localhost:5005${app.students.profile_picture}` : 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + app.id} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{app.students?.user_profiles?.first_name} {app.students?.user_profiles?.last_name}</h4>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Internship</div>
                                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{app.internships?.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                            <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 
                                            Applied {new Date(app.applied_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Assigned Supervisor</label>
                                        <select 
                                            value={app.supervisor_id || ''} 
                                            onChange={(e) => handleAssign(app.id, e.target.value)}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)', fontSize: '0.875rem' }}
                                        >
                                            <option value="">Unassigned</option>
                                            {supervisors.map(s => (
                                                <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <span style={{ 
                                            padding: '0.4rem 1rem', 
                                            borderRadius: '999px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 'bold', 
                                            textTransform: 'uppercase',
                                            background: app.status === 'placed' ? 'rgba(34, 197, 94, 0.2)' : app.status === 'accepted' ? 'rgba(59, 130, 246, 0.1)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                            color: app.status === 'placed' ? '#16a34a' : app.status === 'accepted' ? '#3b82f6' : app.status === 'rejected' ? '#ef4444' : '#eab308'
                                        }}>
                                            {app.status === 'placed' ? 'Placed ✅' : app.status}
                                        </span>
                                        <a 
                                            href={app.students?.cv_path ? `http://localhost:5005${app.students.cv_path}` : '#'} 
                                            target="_blank"
                                            style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <FileText size={14} /> View CV
                                        </a>
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

export default EmployerApplications;
