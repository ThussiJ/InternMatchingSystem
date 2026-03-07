import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Users, PlusCircle, CheckSquare } from 'lucide-react';
import '../../styles/dashboard.css';

const EmployerDashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>Employer Portal</h3>
                </div>
                <nav className="sidebar-nav">
                    <a href="#" className="active"><Users size={18} /> Candidates</a>
                    <a href="#"><PlusCircle size={18} /> Post Internship</a>
                    <a href="#"><CheckSquare size={18} /> Active Postings</a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>Hello, {user?.firstName} from {user?.lastName} HQ 👋</h2>
                </header>

                <div className="dashboard-content">
                    <div className="stat-grid">
                        <div className="stat-card">
                            <h4>Total Applicants</h4>
                            <div className="stat-value">24</div>
                        </div>
                        <div className="stat-card">
                            <h4>Open Internships</h4>
                            <div className="stat-value">2</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmployerDashboard;
