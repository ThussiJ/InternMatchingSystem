import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building2, LogOut, Plus, Users, UserPlus, FileText } from 'lucide-react';
import '../../styles/dashboard.css';
import { employerService } from '../../services/api';

const Supervisors: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const [supervisors, setSupervisors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [adding, setAdding] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        designation: ''
    });

    useEffect(() => {
        fetchSupervisors();
    }, []);

    const fetchSupervisors = async () => {
        try {
            const data = await employerService.getSupervisors();
            setSupervisors(data);
        } catch (error) {
            console.error('Failed to fetch supervisors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSupervisor = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            await employerService.createSupervisor(formData);
            alert('Supervisor created successfully!');
            setFormData({ first_name: '', last_name: '', email: '', password: '', designation: '' });
            setShowAddForm(false);
            fetchSupervisors();
        } catch (error: any) {
            console.error('Failed to create supervisor', error);
            alert('Failed to create supervisor: ' + error.message);
        } finally {
            setAdding(false);
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
                <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2>Manage Supervisors</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>Create and manage supervisor accounts linked to your company</p>
                    </div>
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: showAddForm ? 'var(--color-surface)' : 'var(--color-primary)', color: showAddForm ? 'var(--color-text-main)' : 'white', border: showAddForm ? '1px solid var(--color-border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                    >
                        {showAddForm ? 'Cancel' : <><UserPlus size={18} /> Add Supervisor</>}
                    </button>
                </header>

                <div className="dashboard-content">
                    {showAddForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '2rem' }}>
                            <form onSubmit={handleAddSupervisor} style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h3 style={{ margin: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>Create New Supervisor Account</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}/>
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Job Designation / Title</label>
                                        <input type="text" name="designation" placeholder="e.g. Senior Software Engineer" value={formData.designation} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}/>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="submit" disabled={adding} className="btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 'bold', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer' }}>
                                        {adding ? 'Creating...' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {loading ? (
                        <p>Loading supervisors...</p>
                    ) : supervisors.length === 0 ? (
                        <div style={{ background: 'var(--color-surface)', padding: '3rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                            <Users size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Supervisors Added</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>You haven't provisioned any supervisor accounts yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {supervisors.map((sup: any) => (
                                <div key={sup.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                            {sup.first_name ? sup.first_name[0] : 'S'}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{sup.first_name} {sup.last_name}</h3>
                                            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{sup.designation}</p>
                                        </div>
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                        Added: {new Date(sup.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Supervisors;
