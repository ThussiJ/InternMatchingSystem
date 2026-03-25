import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    LogOut,
    Users,
    Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
    ];

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <h3>Admin Console</h3>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path}
                        to={item.path} 
                        className={location.pathname === item.path ? 'active' : ''}
                    >
                        <item.icon size={18} /> {item.label}
                    </Link>
                ))}
                
                <div style={{ margin: '1rem 0', borderTop: '1px solid var(--color-border)', opacity: 0.5 }}></div>
                
                <Link to="/" className="sidebar-link">
                    <LayoutDashboard size={18} /> View Landing Page
                </Link>
                
                <button disabled className="nav-item-disabled">
                    <Settings size={18} /> System Settings
                </button>
            </nav>
            <div className="sidebar-footer">
                <button onClick={logout} className="btn-logout">
                    <LogOut size={18} /> Sign Out
                </button>
            </div>

            <style>{`
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.8rem 1rem;
                    border-radius: var(--radius-md);
                    color: var(--color-text-muted);
                    font-weight: 500;
                    text-decoration: none;
                    transition: all var(--transition-fast);
                }
                
                .sidebar-link:hover {
                    background: rgba(var(--color-primary-rgb), 0.1);
                    color: var(--color-primary);
                }
            `}</style>
        </aside>
    );
};

export default AdminSidebar;
