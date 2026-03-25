import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { 
    Star, 
    Search, 
    Filter, 
    Loader2, 
    AlertCircle 
} from 'lucide-react';
import '../../styles/dashboard.css';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'employers' | 'internships'>('employers');
    const [employers, setEmployers] = useState<any[]>([]);
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'employers') {
                const data = await adminService.getAllEmployers();
                setEmployers(data);
            } else {
                const data = await adminService.getAllInternships();
                setInternships(data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEmployerFeatured = async (id: string, currentStatus: boolean) => {
        try {
            await adminService.toggleEmployerFeatured(id, !currentStatus);
            setEmployers(prev => prev.map(emp => emp.id === id ? { ...emp, is_featured: !currentStatus } : emp));
        } catch (err: any) {
            alert(err.message || 'Error toggling featured status');
        }
    };

    const handleToggleInternshipFeatured = async (id: string, currentStatus: boolean) => {
        try {
            await adminService.toggleInternshipFeatured(id, !currentStatus);
            setInternships(prev => prev.map(int => int.id === id ? { ...int, is_featured: !currentStatus } : int));
        } catch (err: any) {
            alert(err.message || 'Error toggling featured status');
        }
    };

    const filteredEmployers = employers.filter(emp => 
        emp.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.industry && emp.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredInternships = internships.filter(int => 
        int.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        int.employers?.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-layout">
            <AdminSidebar />

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Landing Page Featured Items</h2>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button 
                                    onClick={() => setActiveTab('employers')}
                                    className={`btn btn-sm ${activeTab === 'employers' ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    Employers
                                </button>
                                <button 
                                    onClick={() => setActiveTab('internships')}
                                    className={`btn btn-sm ${activeTab === 'internships' ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    Internships
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4" style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="relative w-full md:w-96" style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input 
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
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
                            <div className="flex items-center gap-2 text-sm text-gray-500" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                <Filter size={16} />
                                <span>Showing {activeTab === 'employers' ? filteredEmployers.length : filteredInternships.length} items</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4" style={{ padding: '5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                                    <p className="text-gray-500 font-medium">Loading {activeTab}...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2" style={{ padding: '5rem 0', color: '#ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={40} />
                                    <p className="font-semibold">{error}</p>
                                    <button onClick={fetchData} className="btn btn-outline btn-sm">Try Again</button>
                                </div>
                            ) : (
                                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ background: 'rgba(var(--color-primary-rgb), 0.03)', color: 'var(--color-text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <tr>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Name/Title</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Status/Industry</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Created At</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 700, textAlign: 'center' }}>Featured</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100" style={{ fontSize: '0.95rem' }}>
                                        {activeTab === 'employers' ? (
                                            filteredEmployers.map((emp) => (
                                                <tr key={emp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td style={{ padding: '1rem 1.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <div style={{ 
                                                                width: '40px', 
                                                                height: '40px', 
                                                                background: 'rgba(59, 130, 246, 0.1)', 
                                                                color: 'var(--color-primary)', 
                                                                borderRadius: '8px', 
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                justifyContent: 'center', 
                                                                fontWeight: 'bold',
                                                                flexShrink: 0
                                                            }}>
                                                                {emp.company_name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{emp.company_name}</div>
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{emp.website || 'No website'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{emp.industry || 'General'}</td>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                        {new Date(emp.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <button 
                                                                onClick={() => handleToggleEmployerFeatured(emp.id, !!emp.is_featured)}
                                                                style={{ 
                                                                    padding: '0.5rem', 
                                                                    borderRadius: '8px', 
                                                                    transition: 'all 0.2s',
                                                                    border: '1px solid transparent',
                                                                    background: emp.is_featured ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                                                    color: emp.is_featured ? '#fbbf24' : 'var(--color-text-muted)',
                                                                    cursor: 'pointer'
                                                                }}
                                                                title={emp.is_featured ? "Remove from Featured" : "Mark as Featured"}
                                                            >
                                                                <Star fill={emp.is_featured ? 'currentColor' : 'none'} size={20} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            filteredInternships.map((int) => (
                                                <tr key={int.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                    <td style={{ padding: '1rem 1.5rem' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{int.title}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 500 }}>{int.employers?.company_name}</div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem' }}>
                                                        <span style={{ 
                                                            padding: '0.25rem 0.75rem', 
                                                            borderRadius: '20px', 
                                                            fontSize: '0.75rem', 
                                                            fontWeight: 700, 
                                                            textTransform: 'uppercase',
                                                            background: int.status === 'open' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                                            color: int.status === 'open' ? '#22c55e' : '#6b7280'
                                                        }}>
                                                            {int.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                        {new Date(int.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '1rem 1.5rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <button 
                                                                onClick={() => handleToggleInternshipFeatured(int.id, !!int.is_featured)}
                                                                style={{ 
                                                                    padding: '0.5rem', 
                                                                    borderRadius: '8px', 
                                                                    transition: 'all 0.2s',
                                                                    border: '1px solid transparent',
                                                                    background: int.is_featured ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                                                    color: int.is_featured ? '#fbbf24' : 'var(--color-text-muted)',
                                                                    cursor: 'pointer'
                                                                }}
                                                                title={int.is_featured ? "Remove from Featured" : "Mark as Featured"}
                                                            >
                                                                <Star fill={int.is_featured ? 'currentColor' : 'none'} size={20} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}

                                        {((activeTab === 'employers' && filteredEmployers.length === 0) || 
                                          (activeTab === 'internships' && filteredInternships.length === 0)) && !loading && (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                    No results found for "{searchTerm}"
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
            `}</style>
        </div>
    );
};

export default AdminDashboard;
