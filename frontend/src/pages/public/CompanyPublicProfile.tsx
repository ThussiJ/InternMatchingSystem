import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Globe, Users, ArrowLeft, Mail, Briefcase, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { employerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const CompanyPublicProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isContacted, setIsContacted] = useState(false);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                if (id) {
                    const data = await employerService.getPublicEmployerById(id);
                    setCompany(data);
                    
                    // If user is student, check contact status
                    if (user?.role === 'student') {
                        const allEmployers = await employerService.getAllEmployersWithStatus();
                        const current = allEmployers.find((e: any) => e.id === id);
                        if (current) setIsContacted(current.isContacted);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch company:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id, user]);

    const handleBeInTouch = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/companies/${id}` } });
            return;
        }

        if (user.role !== 'student') {
            alert('Only students can use this feature.');
            return;
        }

        try {
            const response = await employerService.toggleBeInTouch(id!);
            setIsContacted(response.isContacted);
        } catch (error) {
            console.error('Failed to toggle contact:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="error-screen">
                <h2>Company not found</h2>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="public-profile-page">
            <Navbar />
            
            <main className="profile-container">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="profile-header-card"
                >
                    <div className="profile-cover">
                        {company.cover_image ? (
                            <img src={`http://localhost:5005${company.cover_image}`} alt={company.company_name} className="cover-img" />
                        ) : (
                            <div className="cover-placeholder"></div>
                        )}
                        <Link to="/" className="back-btn"><ArrowLeft size={18} /> Back</Link>
                    </div>

                    <div className="profile-info-section">
                        <div className="logo-container">
                            <div className="company-logo-large">
                                <Building2 size={40} color="var(--color-primary)" />
                            </div>
                        </div>

                        <div className="info-content">
                            <div className="header-meta">
                                <h1 className="company-name">{company.company_name}</h1>
                                <div className="verification-badge">
                                    <ShieldCheck size={16} /> Verified Partner
                                </div>
                            </div>
                            
                            <p className="industry-text">{company.industry || 'Technology & Innovation'}</p>
                            
                            <div className="meta-grid">
                                <div className="meta-item"><MapPin size={16} /> {company.location || 'Distributed'}</div>
                                <div className="meta-item"><Users size={16} /> {company.company_size || '1-50'} Employees</div>
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="meta-item link">
                                        <Globe size={16} /> {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                <div className="meta-item"><Calendar size={16} /> Joined Feb 2024</div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button 
                                onClick={handleBeInTouch}
                                className={`btn-be-in-touch ${isContacted ? 'active' : ''}`}
                            >
                                {isContacted ? 'In Touch ✅' : 'Be in Touch'}
                            </button>
                            <button className="btn-secondary-outline">
                                <Mail size={18} /> Message
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="profile-grid">
                    <div className="profile-main">
                        <section className="profile-section">
                            <h2 className="section-title">About the Company</h2>
                            <div className="about-text">
                                <p>
                                    {company.description || `${company.company_name} is a leading player in the ${company.industry || 'industry'}, dedicated to fostering innovation and providing exceptional opportunities for student talent.`}
                                </p>
                                <p>
                                    As a partner of InternTalentConnect, we are committed to mentoring the next generation of professionals. Our culture is built on collaboration, continuous learning, and pushing boundaries.
                                </p>
                            </div>
                        </section>

                        <section className="profile-section">
                            <h2 className="section-title">Why Join Us?</h2>
                            <div className="perks-grid">
                                <div className="perk-card">
                                    <div className="perk-icon"><Briefcase size={20} /></div>
                                    <h3>Real Impact</h3>
                                    <p>Work on projects that matter and see your contributions in production.</p>
                                </div>
                                <div className="perk-card">
                                    <div className="perk-icon"><Users size={20} /></div>
                                    <h3>Mentorship</h3>
                                    <p>Learn from industry veterans who are invested in your career growth.</p>
                                </div>
                                <div className="perk-card">
                                    <div className="perk-icon"><ShieldCheck size={20} /></div>
                                    <h3>Growth</h3>
                                    <p>Many of our interns transition into full-time roles upon graduation.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="profile-sidebar">
                        <div className="card-sidebar">
                            <h3 className="card-title">Quick Links</h3>
                            <div className="sidebar-links">
                                <a href="#" className="sidebar-link">Open Positions <ExternalLink size={14} /></a>
                                <a href="#" className="sidebar-link">Company Culture <ExternalLink size={14} /></a>
                                <a href="#" className="sidebar-link">Intern Stories <ExternalLink size={14} /></a>
                            </div>
                        </div>

                        <div className="card-sidebar highlight">
                            <h3 className="card-title">Ready for an Internship?</h3>
                            <p>Apply to our latest postings or get in touch to be the first to know about new opportunities.</p>
                            <button className="btn btn-light w-full">View All Postings</button>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />

            <style>{`
                .public-profile-page {
                    background-color: var(--color-background);
                    min-height: 100vh;
                }

                .profile-container {
                    max-width: 1200px;
                    margin: 2rem auto 5rem;
                    padding: 0 1.5rem;
                }

                .profile-header-card {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    margin-bottom: 2rem;
                }

                .profile-cover {
                    height: 240px;
                    background: linear-gradient(135deg, var(--color-primary-light, #e0e7ff), var(--color-primary));
                    position: relative;
                }

                .cover-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .cover-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
                    opacity: 0.1;
                }

                .back-btn {
                    position: absolute;
                    top: 1.5rem;
                    left: 1.5rem;
                    background: rgba(255,255,255,0.9);
                    backdrop-filter: blur(10px);
                    padding: 0.6rem 1.2rem;
                    border-radius: 50px;
                    color: var(--color-text-main);
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                    z-index: 10;
                }

                .back-btn:hover {
                    transform: translateX(-4px);
                    background: white;
                }

                .profile-info-section {
                    padding: 0 3rem 3rem;
                    display: flex;
                    align-items: flex-end;
                    gap: 2rem;
                    margin-top: -3.5rem;
                    position: relative;
                }

                .logo-container {
                    flex-shrink: 0;
                }

                .company-logo-large {
                    width: 120px;
                    height: 120px;
                    background: white;
                    border: 6px solid var(--color-surface);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
                }

                .info-content {
                    flex: 1;
                    padding-bottom: 0.5rem;
                }

                .header-meta {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.25rem;
                    flex-wrap: wrap;
                }

                .company-name {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: var(--color-text-main);
                    margin: 0;
                }

                .verification-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: rgba(var(--color-primary-rgb), 0.1);
                    color: var(--color-primary);
                    padding: 0.4rem 0.8rem;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 700;
                }

                .industry-text {
                    font-size: 1.1rem;
                    color: var(--color-primary);
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .meta-grid {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .meta-item.link {
                    color: var(--color-primary);
                    text-decoration: none;
                }

                .meta-item.link:hover {
                    text-decoration: underline;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                }

                .btn-be-in-touch {
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    padding: 0.9rem 2.5rem;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(var(--color-primary-rgb), 0.3);
                }

                .btn-be-in-touch:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.4);
                }

                .btn-be-in-touch.active {
                    background: transparent;
                    border: 2px solid var(--color-primary);
                    color: var(--color-primary);
                    box-shadow: none;
                }

                .btn-secondary-outline {
                    background: transparent;
                    border: 1px solid var(--color-border);
                    color: var(--color-text-main);
                    padding: 0.9rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    transition: all 0.2s;
                }

                .btn-secondary-outline:hover {
                    background: var(--color-surface-alt);
                    border-color: var(--color-text-muted);
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 2rem;
                }

                .profile-section {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                }

                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-text-main);
                }

                .about-text p {
                    color: var(--color-text-muted);
                    line-height: 1.8;
                    margin-bottom: 1.5rem;
                    font-size: 1.05rem;
                }

                .perks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .perk-card {
                    padding: 1.5rem;
                    border-radius: 16px;
                    border: 1px solid var(--color-border);
                    transition: all 0.3s;
                }

                .perk-card:hover {
                    border-color: var(--color-primary);
                    background: rgba(var(--color-primary-rgb), 0.02);
                }

                .perk-icon {
                    width: 44px;
                    height: 44px;
                    background: rgba(var(--color-primary-rgb), 0.1);
                    color: var(--color-primary);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                }

                .perk-card h3 {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }

                .perk-card p {
                    font-size: 0.9rem;
                    color: var(--color-text-muted);
                    line-height: 1.5;
                }

                .card-sidebar {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    padding: 1.75rem;
                    margin-bottom: 1.5rem;
                }

                .card-sidebar.highlight {
                    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                    color: white;
                    border: none;
                }

                .card-sidebar.highlight .card-title {
                    color: white;
                }

                .card-sidebar.highlight p {
                    opacity: 0.9;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                }

                .card-title {
                    font-size: 1.2rem;
                    margin-bottom: 1.25rem;
                }

                .sidebar-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.75rem 1rem;
                    background: var(--color-background);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    text-decoration: none;
                    color: var(--color-text-main);
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .sidebar-link:hover {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                    transform: translateX(4px);
                }

                .btn-light {
                    background: white;
                    color: var(--color-primary);
                    border: none;
                    padding: 0.9rem;
                    border-radius: 10px;
                    font-weight: 700;
                    width: 100%;
                }

                @media (max-width: 992px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }

                    .profile-info-section {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        padding-top: 1rem;
                    }

                    .info-content {
                        margin-bottom: 1.5rem;
                    }

                    .header-meta {
                        justify-content: center;
                    }

                    .meta-grid {
                        justify-content: center;
                    }
                }

                @media (max-width: 600px) {
                    .company-name {
                        font-size: 1.75rem;
                    }
                    .action-buttons {
                        flex-direction: column;
                        width: 100%;
                    }
                    .btn-be-in-touch, .btn-secondary-outline {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default CompanyPublicProfile;
