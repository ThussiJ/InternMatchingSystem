import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Building2, Plus, ArrowLeft, Trash2, Users, FileText } from 'lucide-react';
import '../../styles/dashboard.css';
import { internshipService } from '../../services/api';

const CreatePosting: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [allSkills, setAllSkills] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        duration_weeks: 12,
        stipend: '',
        currency: 'LKR',
        location: '',
        mode: 'onsite',
        minimum_gpa: '',
        application_deadline: '',
        start_date: '',
        end_date: ''
    });

    const [selectedSkills, setSelectedSkills] = useState<{ skill_id: string; required_level: number; mandatory: boolean; name?: string }[]>([]);
    const [currentSkillId, setCurrentSkillId] = useState('');
    const [currentLevel, setCurrentLevel] = useState(3);
    const [currentMandatory, setCurrentMandatory] = useState(true);

    const [isAddingNewSkill, setIsAddingNewSkill] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const data = await internshipService.getAllSkills();
                setAllSkills(data);
            } catch (error) {
                console.error('Failed to fetch skills:', error);
            }
        };
        fetchSkills();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentSkillId) return;
        if (selectedSkills.find(s => s.skill_id === currentSkillId)) return;

        const skillName = allSkills.find(s => s.id === currentSkillId)?.name;
        setSelectedSkills(prev => [...prev, { skill_id: currentSkillId, required_level: currentLevel, mandatory: currentMandatory, name: skillName }]);
        setCurrentSkillId('');
    };

    const handleCreateNewSkill = async () => {
        if (!newSkillName.trim()) return;
        try {
            const newSkill = await internshipService.addSkill(newSkillName.trim());
            setAllSkills(prev => [...prev, newSkill]);
            setCurrentSkillId(newSkill.id);
            setNewSkillName('');
            setIsAddingNewSkill(false);
        } catch (error: any) {
            console.error('Failed to add new skill:', error);
            alert('Failed to add new skill: ' + error.message);
        }
    };

    const handleRemoveSkill = (id: string) => {
        setSelectedSkills(prev => prev.filter(s => s.skill_id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                duration_weeks: Number(formData.duration_weeks),
                stipend: formData.stipend ? Number(formData.stipend) : null,
                minimum_gpa: formData.minimum_gpa ? Number(formData.minimum_gpa) : null,
                application_deadline: formData.application_deadline || null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                skills: selectedSkills.map(s => ({ skill_id: s.skill_id, required_level: s.required_level, mandatory: s.mandatory }))
            };

            await internshipService.createInternship(submitData);
            alert('Internship posted successfully!');
            navigate('/employer/dashboard');
        } catch (error: any) {
            console.error('Failed to post internship:', error);
            alert('Failed to post internship: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>Employer Portal</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/employer/dashboard"><Briefcase size={18} /> Manage Postings</Link>
                    <Link to="/employer/applications"><FileText size={18} /> Manage Applications</Link>
                    <Link to="/employer/post-internship" className="active"><Plus size={18} /> Post Internship</Link>
                    <Link to="/employer/supervisors"><Users size={18} /> Manage Supervisors</Link>
                    <Link to="/employer/profile"><Building2 size={18} /> Company Profile</Link>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout">Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main" style={{ overflowY: 'auto', padding: '2rem' }}>
                <header className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button type="button" onClick={() => navigate('/employer/dashboard')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={24} color="var(--color-text-main)" />
                    </button>
                    <div>
                        <h2>Create New Posting 📝</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>Publish an opportunity for top university talents.</p>
                    </div>
                </header>

                <div className="dashboard-content" style={{ maxWidth: '800px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Job Details Section */}
                        <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Job Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Job Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Department</label>
                                    <input type="text" name="department" value={formData.department} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Work Mode</label>
                                    <select name="mode" value={formData.mode} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}>
                                        <option value="remote">Remote</option>
                                        <option value="onsite">On-site</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Duration (Weeks)</label>
                                    <input type="number" name="duration_weeks" value={formData.duration_weeks} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Stipend</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select name="currency" value={formData.currency} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}>
                                            <option value="LKR">LKR</option>
                                            <option value="USD">USD</option>
                                        </select>
                                        <input type="number" name="stipend" value={formData.stipend} onChange={handleChange} placeholder="Amount" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Minimum GPA</label>
                                    <input type="number" name="minimum_gpa" step="0.01" value={formData.minimum_gpa} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Application Deadline</label>
                                        <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Start Date (Optional)</label>
                                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>End Date (Optional)</label>
                                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Requirement Section */}
                        <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Required Skills</h3>
                            
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 2, minWidth: '200px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Skill</label>
                                    {isAddingNewSkill ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="New skill name..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                            <button type="button" onClick={handleCreateNewSkill} style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                                            <button type="button" onClick={() => setIsAddingNewSkill(false)} style={{ padding: '0.75rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <select 
                                                value={currentSkillId} 
                                                onChange={(e) => setCurrentSkillId(e.target.value)}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}
                                            >
                                                <option value="">-- Choose a skill --</option>
                                                {allSkills.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <button type="button" onClick={() => setIsAddingNewSkill(true)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}>+ Add missing skill...</button>
                                        </>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: '100px' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Level (1-5)</label>
                                    <input type="number" min="1" max="5" value={currentLevel} onChange={(e) => setCurrentLevel(Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
                                    <input type="checkbox" checked={currentMandatory} onChange={(e) => setCurrentMandatory(e.target.checked)} id="mandatoryCheck" />
                                    <label htmlFor="mandatoryCheck" style={{ fontSize: '0.875rem' }}>Mandatory</label>
                                </div>
                                <button type="button" onClick={handleAddSkill} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
                            </div>

                            {selectedSkills.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {selectedSkills.map((s) => (
                                        <li key={s.skill_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-background)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                            <span>
                                                <strong>{s.name}</strong> • Level {s.required_level} {s.mandatory ? <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Required)</span> : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Optional)</span>}
                                            </span>
                                            <button type="button" onClick={() => handleRemoveSkill(s.skill_id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button type="submit" disabled={loading} style={{ padding: '1rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {loading ? 'Publishing...' : 'Publish Internship'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreatePosting;
