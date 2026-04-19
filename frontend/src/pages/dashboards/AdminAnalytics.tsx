import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { 
    Users, 
    Briefcase, 
    FileText, 
    TrendingUp, 
    UserCheck, 
    Building2,
    Clock,
    CheckCircle2,
    XCircle,
    Star,
    Loader2,
    AlertCircle
} from 'lucide-react';
import '../../styles/dashboard.css';

const AdminAnalytics: React.FC = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.getAnalytics();
            setAnalytics(data);
        } catch (err: any) {
            console.error('Analytics Fetch Error:', err);
            setError(err.message || 'Failed to fetch analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <AdminSidebar />
                <main className="dashboard-main">
                    <div className="flex flex-col items-center justify-center h-full gap-4" style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                        <p className="text-gray-500 font-medium">Preparing your insights...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-layout">
                <AdminSidebar />
                <main className="dashboard-main">
                    <div className="flex flex-col items-center justify-center h-full text-red-500 gap-4" style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AlertCircle size={48} />
                        <h3 className="text-xl font-bold">Something went wrong</h3>
                        <p>{error}</p>
                        <button onClick={fetchAnalytics} className="btn btn-outline" style={{ marginTop: '1rem' }}>Try Again</button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <AdminSidebar />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Platform Analytics</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Real-time overview of InternTalentConnect ecosystem</p>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* User Statistics */}
                    <section style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', padding: '0.5rem', borderRadius: '8px' }}>
                                <Users size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>User Insights</h3>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                            <StatCard 
                                title="Total Users" 
                                value={analytics.users.total} 
                                icon={<TrendingUp size={24} />} 
                                color="#4f46e5"
                            />
                            <StatCard 
                                title="Students" 
                                value={analytics.users.students} 
                                icon={<UserCheck size={24} />} 
                                color="#10b981"
                            />
                            <StatCard 
                                title="Employers" 
                                value={analytics.users.employers} 
                                icon={<Building2 size={24} />} 
                                color="#f59e0b"
                            />
                            <StatCard 
                                title="Supervisors" 
                                value={analytics.users.supervisors} 
                                icon={<Users size={24} />} 
                                color="#ec4899"
                            />
                        </div>
                    </section>

                    {/* Internship & Application Statistics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        {/* Internships Column */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem', borderRadius: '8px' }}>
                                    <Briefcase size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Internships</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <StatRow label="Total Postings" value={analytics.internships.total} icon={<FileText size={18} />} />
                                <StatRow label="Open Internships" value={analytics.internships.open} icon={<TrendingUp size={18} />} color="#10b981" />
                                <StatRow label="Featured Listings" value={analytics.internships.featured} icon={<Star size={18} />} color="#f59e0b" />
                            </div>
                        </section>

                        {/* Applications Column */}
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '0.5rem', borderRadius: '8px' }}>
                                    <FileText size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Applications</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <StatRow label="Total Submissions" value={analytics.applications.total} icon={<TrendingUp size={18} />} />
                                <StatRow label="Pending Review" value={analytics.applications.pending} icon={<Clock size={18} />} color="#6366f1" />
                                <StatRow label="Accepted" value={analytics.applications.accepted} icon={<CheckCircle2 size={18} />} color="#10b981" />
                                <StatRow label="Selected Applicants" value={analytics.applications.selected} icon={<Star size={18} />} color="#f59e0b" />
                                <StatRow label="Rejected" value={analytics.applications.rejected} icon={<XCircle size={18} />} color="#ef4444" />
                            </div>
                        </section>
                    </div>

                    {/* Progress Visualizer (Simple CSS based) */}
                    <section style={{ marginTop: '3rem' }}>
                        <div className="section-card">
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Application Status Distribution</h3>
                            <div style={{ display: 'flex', height: '32px', borderRadius: '16px', overflow: 'hidden', width: '100%', background: '#f3f4f6' }}>
                                <ProgressBarPiece 
                                    value={analytics.applications.accepted} 
                                    total={analytics.applications.total} 
                                    color="#10b981" 
                                    label="Accepted"
                                />
                                <ProgressBarPiece 
                                    value={analytics.applications.selected} 
                                    total={analytics.applications.total} 
                                    color="#f59e0b" 
                                    label="Selected"
                                />
                                <ProgressBarPiece 
                                    value={analytics.applications.pending} 
                                    total={analytics.applications.total} 
                                    color="#6366f1" 
                                    label="Pending"
                                />
                                <ProgressBarPiece 
                                    value={analytics.applications.rejected} 
                                    total={analytics.applications.total} 
                                    color="#ef4444" 
                                    label="Rejected"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                <LegendItem label="Accepted" color="#10b981" count={analytics.applications.accepted} />
                                <LegendItem label="Selected" color="#f59e0b" count={analytics.applications.selected} />
                                <LegendItem label="Pending" color="#6366f1" count={analytics.applications.pending} />
                                <LegendItem label="Rejected" color="#ef4444" count={analytics.applications.rejected} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${color}` }}>
        <div>
            <h4 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{title}</h4>
            <div className="stat-value" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{value}</div>
        </div>
        <div style={{ color: color, opacity: 0.8 }}>
            {icon}
        </div>
    </div>
);

const StatRow: React.FC<{ label: string; value: number; icon: React.ReactNode; color?: string }> = ({ label, value, icon, color }) => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 1.25rem', 
        background: 'var(--color-surface)', 
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: color || 'var(--color-text-muted)' }}>{icon}</div>
            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{label}</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: color || 'var(--color-text-main)' }}>{value}</span>
    </div>
);

const ProgressBarPiece: React.FC<{ value: number; total: number; color: string; label: string }> = ({ value, total, color, label }) => {
    if (total === 0 || value === 0) return null;
    const percentage = (value / total) * 100;
    return (
        <div 
            style={{ 
                width: `${percentage}%`, 
                background: color, 
                height: '100%', 
                transition: 'width 0.5s ease-out' 
            }} 
            title={`${label}: ${value} (${percentage.toFixed(1)}%)`}
        />
    );
};

const LegendItem: React.FC<{ label: string; color: string; count: number }> = ({ label, color, count }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: color }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{label}: </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{count}</span>
    </div>
);

export default AdminAnalytics;
