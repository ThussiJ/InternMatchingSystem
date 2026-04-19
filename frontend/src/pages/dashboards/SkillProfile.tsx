import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Star, LogOut, Code, Plus, Trash2, Search, User, Building2 } from 'lucide-react';
import '../../styles/dashboard.css';
import { internshipService, studentService } from '../../services/api';
import DashboardHeader from '../../components/layout/DashboardHeader';

const SkillProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [mySkills, setMySkills] = useState<any[]>([]);
    const [allSkills, setAllSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [proficiency, setProficiency] = useState(3);
    const [experience, setExperience] = useState(0);

    const [isAddingNewSkill, setIsAddingNewSkill] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mySkillsData, allSkillsData] = await Promise.all([
                studentService.getSkills(),
                internshipService.getAllSkills()
            ]);
            setMySkills(mySkillsData);
            setAllSkills(allSkillsData);
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSkillId) return;
        try {
            await studentService.addSkill(selectedSkillId, proficiency, experience);
            await fetchData();
            setSelectedSkillId('');
            setProficiency(3);
            setExperience(0);
        } catch (error) {
            console.error('Error adding skill:', error);
            alert('Failed to add skill. Maybe it already exists?');
        }
    };

    const handleCreateNewSkill = async () => {
        if (!newSkillName.trim()) return;
        try {
            const newSkill = await internshipService.addSkill(newSkillName.trim());
            setAllSkills(prev => [...prev, newSkill]);
            setSelectedSkillId(newSkill.id);
            setNewSkillName('');
            setIsAddingNewSkill(false);
        } catch (error: any) {
            console.error('Failed to add new skill:', error);
            alert('Failed to add new skill: ' + error.message);
        }
    };

    const handleRemoveSkill = async (skillId: string) => {
        try {
            await studentService.removeSkill(skillId);
            setMySkills(mySkills.filter(s => s.skill_id !== skillId));
        } catch (error) {
            console.error('Error removing skill:', error);
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
                    title="Skill Profile 🛠️" 
                    subtitle="Showcase your expertise and technical background" 
                />

                <div className="dashboard-content">
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        {/* Add Skill Form */}
                        <div style={{ flex: '1', minWidth: '300px', background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ marginTop: 0 }}>Add New Skill</h3>
                            <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Skill</label>
                                    {isAddingNewSkill ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="New skill name..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }} />
                                            <button type="button" onClick={handleCreateNewSkill} style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                                            <button type="button" onClick={() => setIsAddingNewSkill(false)} style={{ padding: '0.75rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <select 
                                                value={selectedSkillId} 
                                                onChange={(e) => setSelectedSkillId(e.target.value)}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}
                                                required={!isAddingNewSkill}
                                            >
                                                <option value="">-- Choose a skill --</option>
                                                {allSkills.map(skill => (
                                                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                                                ))}
                                            </select>
                                            <button type="button" onClick={() => setIsAddingNewSkill(true)} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}>+ Add missing skill...</button>
                                        </>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Proficiency (1-5)</label>
                                        <input 
                                            type="number" min="1" max="5" 
                                            value={proficiency} 
                                            onChange={(e) => setProficiency(Number(e.target.value))}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}
                                            required
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Experience (Years)</label>
                                        <input 
                                            type="number" min="0" step="0.5" 
                                            value={experience} 
                                            onChange={(e) => setExperience(Number(e.target.value))}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text-main)' }}
                                        />
                                    </div>
                                </div>
                                <button type="submit" style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                                    <Plus size={18} /> Add Skill
                                </button>
                            </form>
                        </div>

                        {/* My Skills List */}
                        <div style={{ flex: '2', minWidth: '300px' }}>
                            {loading ? (
                                <p>Loading your skills...</p>
                            ) : mySkills.length === 0 ? (
                                <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
                                    <Code size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
                                    <p style={{ color: 'var(--color-text-muted)' }}>You haven't added any skills yet. Add your first skill to improve your matches!</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {mySkills.map((skill, i) => (
                                        <motion.div 
                                            key={skill.skill_id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}
                                        >
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{skill.skills?.name}</h4>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                                    {skill.skills?.category} • Level {skill.proficiency_level} • {skill.years_of_experience} yrs
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveSkill(skill.skill_id)}
                                                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                title="Remove skill"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SkillProfile;
