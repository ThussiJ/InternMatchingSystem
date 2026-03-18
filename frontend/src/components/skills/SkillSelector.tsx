import React, { useState, useEffect } from 'react';
import { internshipService } from '../../services/api';
import { Plus, X, Star } from 'lucide-react';

interface Skill {
    id: string;
    name: string;
    category: string;
}

interface SelectedSkill {
    skill_id: string;
    name: string;
    required_level: number;
    mandatory: boolean;
}

interface SkillSelectorProps {
    onSkillsChange: (skills: SelectedSkill[]) => void;
}

const SkillSelector: React.FC<SkillSelectorProps> = ({ onSkillsChange }) => {
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const skills = await internshipService.getAllSkills();
            setAllSkills(skills);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    useEffect(() => {
        onSkillsChange(selectedSkills);
    }, [selectedSkills, onSkillsChange]);

    const addSkill = (skill: Skill) => {
        if (!selectedSkills.find(s => s.skill_id === skill.id)) {
            setSelectedSkills([...selectedSkills, {
                skill_id: skill.id,
                name: skill.name,
                required_level: 3,
                mandatory: true
            }]);
        }
        setSearchTerm('');
        setShowDropdown(false);
    };

    const handleAddNewSkill = async () => {
        if (!searchTerm.trim()) return;
        setIsAdding(true);
        try {
            const newSkill = await internshipService.addSkill(searchTerm.trim());
            setAllSkills([...allSkills, newSkill]);
            addSkill(newSkill);
        } catch (error: any) {
            alert(error.message || 'Failed to add new skill');
        } finally {
            setIsAdding(false);
        }
    };

    const removeSkill = (skillId: string) => {
        setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skillId));
    };

    const updateSkill = (skillId: string, updates: Partial<SelectedSkill>) => {
        setSelectedSkills(selectedSkills.map(s => 
            s.skill_id === skillId ? { ...s, ...updates } : s
        ));
    };

    const filteredSkills = allSkills.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSkills.find(ss => ss.skill_id === s.id)
    );

    return (
        <div className="skill-selector">
            <div className="selected-skills-labels">
                {selectedSkills.map(skill => (
                    <div key={skill.skill_id} className="skill-pill">
                        <span className="skill-pill-name">{skill.name}</span>
                        <div className="skill-pill-stars">
                            {[1, 2, 3, 4, 5].map(level => (
                                <Star 
                                    key={level} 
                                    size={10} 
                                    fill={level <= skill.required_level ? "currentColor" : "none"}
                                    onClick={() => updateSkill(skill.skill_id, { required_level: level })}
                                    className="pill-star"
                                />
                            ))}
                        </div>
                        <button 
                            type="button" 
                            onClick={() => removeSkill(skill.skill_id)}
                            className="skill-pill-remove"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                {selectedSkills.length === 0 && <span className="no-skills-text">No skills selected yet.</span>}
            </div>

            <div className="skill-search-container">
                <div className="search-input-wrapper">
                    <input 
                        type="text" 
                        placeholder="Search or type to add new skill..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="skill-search-input"
                    />
                </div>
                
                {showDropdown && (searchTerm || filteredSkills.length > 0) && (
                    <div className="skills-dropdown">
                        <div className="dropdown-section-title">Available Skills</div>
                        {filteredSkills.map(skill => (
                            <div 
                                key={skill.id} 
                                className="dropdown-item"
                                onClick={() => addSkill(skill)}
                            >
                                <span>{skill.name}</span>
                                <Plus size={14} />
                            </div>
                        ))}
                        
                        {searchTerm && !allSkills.find(s => s.name.toLowerCase() === searchTerm.toLowerCase()) && (
                            <div 
                                className="dropdown-item add-new-skill-option"
                                onClick={handleAddNewSkill}
                            >
                                <div className="add-new-content">
                                    <Plus size={16} className="add-icon" />
                                    <span>Create "<strong>{searchTerm}</strong>"</span>
                                </div>
                                {isAdding && <div className="spinner-small" />}
                            </div>
                        )}
                        
                        {filteredSkills.length === 0 && !searchTerm && (
                            <div className="dropdown-empty">Type to search...</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillSelector;
