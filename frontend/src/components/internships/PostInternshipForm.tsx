import React, { useState } from 'react';
import { internshipService } from '../../services/api';
import SkillSelector from '../skills/SkillSelector';
import { Send, AlertCircle } from 'lucide-react';

interface PostInternshipFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const PostInternshipForm: React.FC<PostInternshipFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        duration_weeks: 12,
        stipend: 0,
        currency: 'LKR',
        location: '',
        mode: 'onsite',
        minimum_gpa: 3.0,
        application_deadline: '',
        start_date: '',
        end_date: ''
    });

    const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await internshipService.createInternship({
                ...formData,
                skills: selectedSkills
            });
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'duration_weeks' || name === 'stipend' || name === 'minimum_gpa' 
                ? parseFloat(value) 
                : value 
        }));
    };

    return (
        <div className="post-internship-container">
            <header className="form-header">
                <h3>Post New Internship</h3>
                <p>Fill in the details to attract the best talent.</p>
            </header>

            {error && (
                <div className="form-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="internship-form">
                <div className="form-section">
                    <h4>Basic Information</h4>
                    <div className="form-group">
                        <label>Internship Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            placeholder="e.g. Software Engineering Intern"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <input 
                                type="text" 
                                name="department" 
                                placeholder="e.g. Engineering"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mode</label>
                            <select name="mode" value={formData.mode} onChange={handleChange}>
                                <option value="onsite">On-site</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            name="description" 
                            required 
                            rows={4}
                            placeholder="Describe the role, responsibilities, and what the intern will learn..."
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h4>Requirements & Compensation</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Minimum GPA</label>
                            <input 
                                type="number" 
                                name="minimum_gpa" 
                                step="0.1" 
                                min="0" 
                                max="4"
                                value={formData.minimum_gpa}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Duration (Weeks)</label>
                            <input 
                                type="number" 
                                name="duration_weeks" 
                                value={formData.duration_weeks}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Stipend</label>
                            <input 
                                type="number" 
                                name="stipend" 
                                value={formData.stipend}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                placeholder="e.g. Colombo, Sri Lanka"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label>Technical Skills</label>
                        <SkillSelector onSkillsChange={setSelectedSkills} />
                    </div>
                </div>

                <div className="form-section">
                    <h4>Timeline</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Application Deadline</label>
                            <input 
                                type="date" 
                                name="application_deadline" 
                                required
                                value={formData.application_deadline}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input 
                                type="date" 
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input 
                                type="date" 
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn btn-outline" disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Publishing...' : <><Send size={18} /> Publish Internship</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostInternshipForm;
