import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Briefcase, FileText, Star, LogOut } from 'lucide-react';
import '../../styles/dashboard.css';

const InternDashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>Intern Portal</h3>
                </div>
                <nav className="sidebar-nav">
                    <a href="#" className="active"><Briefcase size={18} /> Recommendations</a>
                    <a href="#"><FileText size={18} /> My Applications</a>
                    <a href="#"><Star size={18} /> Saved Internships</a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>Welcome back, {user?.firstName}! 👋</h2>
                </header>

                <div className="dashboard-content">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-grid">
                        <div className="stat-card">
                            <h4>Active Applications</h4>
                            <div className="stat-value">3</div>
                        </div>
                        <div className="stat-card">
                            <h4>Profile Strength</h4>
                            <div className="stat-value text-gradient">85%</div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default InternDashboard;
