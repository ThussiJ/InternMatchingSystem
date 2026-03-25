import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { studentService, applicationService } from '../../services/api';

interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    internship: any;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, internship }) => {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [updateCv, setUpdateCv] = useState(false);
    const [newCv, setNewCv] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchStudentProfile();
        }
    }, [isOpen]);

    const fetchStudentProfile = async () => {
        try {
            const data = await studentService.getProfile();
            setStudent(data);
        } catch (err) {
            console.error('Failed to fetch student profile:', err);
            setError('Failed to load profile details.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewCv(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('internshipId', internship.id);
            if (updateCv && newCv) {
                formData.append('cv', newCv);
            }

            await applicationService.apply(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit application.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 1000, padding: '1rem'
            }}>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                        background: 'var(--color-background)',
                        width: '100%', maxWidth: '500px', borderRadius: '16px',
                        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        position: 'relative'
                    }}
                >
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)'
                    }}><X size={24} /></button>

                    <div style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Apply for Internship</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                            Apply for <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{internship.title}</span> at {internship.employers?.company_name}
                        </p>

                        {loading ? (
                            <p>Loading your details...</p>
                        ) : success ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <CheckCircle size={64} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
                                <h3>Application Submitted!</h3>
                                <p style={{ color: 'var(--color-text-muted)' }}>Redirecting you back...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div style={{
                                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                        padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'
                                    }}>
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Name</label>
                                            <span style={{ fontWeight: 500 }}>{student?.first_name} {student?.last_name}</span>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>GPA</label>
                                            <span style={{ fontWeight: 500 }}>{student?.gpa || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>University</label>
                                        <span style={{ fontWeight: 500 }}>{student?.university_id || 'N/A'}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
                                        <input type="checkbox" checked={updateCv} onChange={(e) => setUpdateCv(e.target.checked)} />
                                        <span style={{ fontSize: '0.875rem' }}>Update CV for this application</span>
                                    </label>

                                    {updateCv ? (
                                        <div style={{
                                            border: '2px dashed var(--color-border)', borderRadius: '12px',
                                            padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                                            transition: 'all 0.2s', position: 'relative'
                                        }}>
                                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{
                                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
                                            }} />
                                            <Upload size={24} style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }} />
                                            <p style={{ margin: 0, fontSize: '0.875rem' }}>
                                                {newCv ? newCv.name : 'Click to upload or drag and drop'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.875rem' }}>
                                            <FileText size={18} /> 
                                            <span>Using current CV: {student?.cv_path?.split('/').pop() || 'No CV on file'}</span>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={submitting || (updateCv && !newCv)}
                                    className="btn-primary" 
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: 600 }}
                                >
                                    {submitting ? 'Submitting...' : 'Confirm and Apply'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ApplyModal;
