import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { employerService } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const AllCompaniesPublic: React.FC = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await employerService.getAllPublicEmployers();
                setCompanies(data);
            } catch (error) {
                console.error('Failed to fetch companies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company => 
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="companies-public-page">
            <Navbar />
            
            <header className="page-header">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="header-content"
                    >
                        <h1>Explore Our <span className="text-gradient">Partner Companies</span></h1>
                        <p>Connect with industry leaders and discover the perfect place to start your career.</p>
                        
                        <div className="search-bar-wrapper">
                            <div className="search-bar-container">
                                <Search className="search-icon" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or industry..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="search-btn">Search</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="container py-12">
                {loading ? (
                    <div className="loading-state">
                        <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                        <p>Loading companies...</p>
                    </div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="empty-state">
                        <Building2 size={64} opacity={0.2} />
                        <h3>No companies found</h3>
                        <p>Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="companies-grid">
                        {filteredCompanies.map((company, index) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="company-card-public"
                            >
                                <div className="card-top">
                                    <div className="company-logo-med">
                                        <Building2 size={24} color="var(--color-primary)" />
                                    </div>
                                    <span className="industry-tag">{company.industry || 'Tech'}</span>
                                </div>
                                
                                <h3 className="company-name-card">{company.company_name}</h3>
                                
                                <div className="company-meta-item">
                                    <MapPin size={14} />
                                    <span>{company.location || 'Colombo, Sri Lanka'}</span>
                                </div>

                                <Link to={`/companies/${company.id}`} className="view-profile-link">
                                    View Profile <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            <style>{`
                .companies-public-page {
                    background-color: var(--color-background);
                    min-height: 100vh;
                }

                .page-header {
                    background: var(--color-surface);
                    padding: 6rem 0 4rem;
                    border-bottom: 1px solid var(--color-border);
                    text-align: center;
                }

                .header-content h1 {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                }

                .header-content p {
                    font-size: 1.25rem;
                    color: var(--color-text-muted);
                    max-width: 600px;
                    margin: 0 auto 2.5rem;
                }

                .text-gradient {
                    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .search-bar-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                    background: var(--color-background);
                    padding: 4px;
                    border-radius: 50px;
                    border: 1px solid var(--color-border);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .search-bar-container {
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .search-icon {
                    position: absolute;
                    left: 1.25rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--color-text-muted);
                }

                .search-bar-container input {
                    flex: 1;
                    padding: 0.8rem 1rem 0.8rem 3.5rem;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    outline: none;
                }

                .search-btn {
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.75rem;
                    border-radius: 50px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .search-btn:hover {
                    background: var(--color-secondary);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
                }

                .companies-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                    padding: 2rem 0;
                }

                .company-card-public {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    padding: 2rem;
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                }

                .company-card-public:hover {
                    transform: translateY(-8px);
                    border-color: var(--color-primary);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.08);
                }

                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .company-logo-med {
                    width: 48px;
                    height: 48px;
                    background: rgba(var(--color-primary-rgb), 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .industry-tag {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    background: var(--color-background);
                    padding: 0.3rem 0.8rem;
                    border-radius: 50px;
                    color: var(--color-text-muted);
                    border: 1px solid var(--color-border);
                }

                .company-name-card {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: var(--color-text-main);
                }

                .company-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-text-muted);
                    font-size: 0.85rem;
                    margin-bottom: 1.5rem;
                }

                .view-profile-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--color-primary);
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.95rem;
                    transition: gap 0.2s;
                }

                .view-profile-link:hover {
                    gap: 0.8rem;
                }

                .loading-state, .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 6rem 0;
                    text-align: center;
                }

                .loading-state p {
                    margin-top: 1rem;
                    color: var(--color-text-muted);
                }

                .empty-state h3 {
                    margin-top: 1.5rem;
                    font-size: 1.5rem;
                }

                .empty-state p {
                    color: var(--color-text-muted);
                }

                @media (max-width: 600px) {
                    .page-header h1 { font-size: 2.25rem; }
                    .page-header p { font-size: 1.1rem; }
                    .companies-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default AllCompaniesPublic;
