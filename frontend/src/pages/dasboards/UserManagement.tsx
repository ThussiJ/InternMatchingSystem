import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { 
    Search, 
    Filter, 
    Loader2, 
    AlertCircle,
    UserCheck, // Restored/Kept as per instruction
    UserX,    // Restored/Kept as per instruction
    Trash2,
    Mail
} from 'lucide-react';
import '../../styles/dashboard.css';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
        
        try {
            await adminService.updateUserStatus(id, !currentStatus);
            setUsers(prev => prev.map(user => user.id === id ? { ...user, is_active: !currentStatus } : user));
        } catch (err: any) {
            alert(err.message || 'Error updating user status');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        
        try {
            await adminService.deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err: any) {
            alert(err.message || 'Error deleting user');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            (user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.role?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'admin': return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
            case 'employer': return { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
            case 'student': return { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
            case 'supervisor': return { background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' };
            default: return { background: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' };
        }
    };

    return (
        <div className="dashboard-layout">
            <AdminSidebar />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>User Management</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Manage system users, roles, and account status
                    </p>
                </header>

                <div className="dashboard-content">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div className="relative w-full md:w-80" style={{ position: 'relative' }}>
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input 
                                        type="text"
                                        placeholder="Search by name or role..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        style={{ 
                                            width: '100%', 
                                            padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
                                            borderRadius: '10px', 
                                            border: '1px solid var(--color-border)',
                                            background: 'var(--color-background)',
                                            color: 'var(--color-text-main)'
                                        }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    style={{ 
                                        padding: '0.75rem 1rem', 
                                        borderRadius: '10px', 
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-background)',
                                        color: 'var(--color-text-main)',
                                        minWidth: '150px'
                                    }}
                                >
                                    <option value="all">All Roles</option>
                                    <option value="student">Students</option>
                                    <option value="employer">Employers</option>
                                    <option value="supervisor">Supervisors</option>
                                    <option value="admin">Admins</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                <Filter size={16} />
                                <span>Showing {filteredUsers.length} users</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4" style={{ padding: '5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                                    <p className="text-gray-500 font-medium">Loading users...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2" style={{ padding: '5rem 0', color: '#ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={40} />
                                    <p className="font-semibold">{error}</p>
                                    <button onClick={fetchUsers} className="btn btn-outline btn-sm">Try Again</button>
                                </div>
                            ) : (
                                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'rgba(var(--color-primary-rgb), 0.03)', color: 'var(--color-text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <tr>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>User</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Role</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Status</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Joined</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100" style={{ fontSize: '0.95rem' }}>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ 
                                                            width: '40px', 
                                                            height: '40px', 
                                                            background: user.avatar_url ? `url(${user.avatar_url})` : 'rgba(var(--color-primary-rgb), 0.1)', 
                                                            backgroundSize: 'cover',
                                                            color: 'var(--color-primary)', 
                                                            borderRadius: '50%', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center', 
                                                            fontWeight: 'bold',
                                                            flexShrink: 0
                                                        }}>
                                                            {!user.avatar_url && user.first_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <Mail size={12} /> {user.id.substring(0, 8)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <span style={{ 
                                                        padding: '0.25rem 0.75rem', 
                                                        borderRadius: '20px', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: 700, 
                                                        textTransform: 'uppercase',
                                                        ...getRoleBadgeStyle(user.role)
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ 
                                                            width: '8px', 
                                                            height: '8px', 
                                                            borderRadius: '50%', 
                                                            background: user.is_active ? '#22c55e' : '#ef4444' 
                                                        }}></div>
                                                        <span style={{ color: user.is_active ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                                                            {user.is_active ? 'Active' : 'Deactivated'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                        <button 
                                                            onClick={() => handleToggleStatus(user.id, !!user.is_active)}
                                                            style={{ 
                                                                padding: '0.5rem', 
                                                                borderRadius: '8px', 
                                                                transition: 'all 0.2s',
                                                                color: user.is_active ? '#ef4444' : '#22c55e',
                                                                background: 'transparent',
                                                                border: '1px solid currentColor',
                                                                cursor: 'pointer'
                                                            }}
                                                            title={user.is_active ? "Deactivate User" : "Activate User"}
                                                        >
                                                            {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            style={{ 
                                                                padding: '0.5rem', 
                                                                borderRadius: '8px', 
                                                                transition: 'all 0.2s',
                                                                color: '#6b7280',
                                                                background: 'transparent',
                                                                border: '1px solid #d1d5db',
                                                                cursor: 'pointer'
                                                            }}
                                                            className="hover-danger"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredUsers.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={5} style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                    No users found matching your filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .hover-danger:hover {
                    color: #ef4444 !important;
                    border-color: #ef4444 !important;
                    background: rgba(239, 68, 68, 0.05) !important;
                }
            `}</style>
        </div>
    );
};

export default UserManagement;
