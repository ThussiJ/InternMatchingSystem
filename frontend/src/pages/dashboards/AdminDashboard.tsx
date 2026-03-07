import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Settings, Activity } from 'lucide-react';
import '../../styles/dashboard.css';

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>Admin Matrix</h3>
                </div>
                <nav className="sidebar-nav">
                    <a href="#" className="active"><LayoutDashboard size={18} /> Overview</a>
                    <a href="#"><Activity size={18} /> System Logs</a>
                    <a href="#"><Settings size={18} /> Config</a>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={logout} className="btn-logout"><LogOut size={18} /> Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>System Control, {user?.firstName}</h2>
                </header>

                <div className="dashboard-content">
                    <div className="stat-grid">
                        <div className="stat-card">
                            <h4>Total Users</h4>
                            <div className="stat-value text-gradient">1,402</div>
                        </div>
                        <div className="stat-card">
                            <h4>Matches Made</h4>
                            <div className="stat-value text-gradient">841</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
