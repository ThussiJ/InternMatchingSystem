import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col footer-brand">
                        <h3 className="logo" style={{ color: 'var(--color-primary)' }}>InternTalent</h3>
                        <p>
                            The intelligent internship matching system connecting ambitious students with top-tier companies.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s' }} aria-label="Instagram"><Instagram size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/internships">Browse Internships</Link></li>
                            <li><Link to="/companies">Top Companies</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>For Users</h4>
                        <ul className="footer-links">
                            <li><Link to="/register">Student Registration</Link></li>
                            <li><Link to="/employer-register">Employer Portal</Link></li>
                            <li><Link to="/login">Sign In</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/support">Support Center</Link></li>
                            <li style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <Link to="/admin-setup-portal" style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>Admin Portal</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul className="footer-links">
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Mail size={16} color="var(--color-primary)" />
                                <span>support@interntalent.com</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Phone size={16} color="var(--color-primary)" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <MapPin size={16} color="var(--color-primary)" style={{ marginTop: '0.25rem' }} />
                                <span>123 Innovation Drive,<br />Tech District, CA 94103</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} InternTalent Connect. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
