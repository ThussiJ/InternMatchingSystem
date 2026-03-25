export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

export const authService = {
    async login(credentials: any) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    async register(data: any) {
        console.log('Registering at:', `${API_URL}/auth/register`);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    }
};

export const internshipService = {
    async getAllSkills() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/internships/skills`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch skills');
        return response.json();
    },

    async createInternship(data: any | FormData) {
        const token = localStorage.getItem('token');
        
        const isFormData = data instanceof FormData;
        const headers: any = {
            'Authorization': `Bearer ${token}`
        };
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${API_URL}/internships`, {
            method: 'POST',
            headers,
            body: isFormData ? data : JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create internship');
        }
        return response.json();
    },

    async getMyInternships() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/internships/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch internships');
        return response.json();
    },

    async getOpenInternships() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/internships`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch open internships');
        return response.json();
    },

    async getFeaturedInternships() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/internships/featured`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch featured internships');
        return response.json();
    },

    async addSkill(name: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/internships/skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, category: 'General' })
        });
        if (!response.ok) {
            let errorMessage = 'Failed to add skill';
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } else {
                console.error('Non-JSON error response:', await response.text());
                errorMessage = `Server error (${response.status})`;
            }
            throw new Error(errorMessage);
        }
        return response.json();
    }
};

export const studentService = {
    async getSkills() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/students/skills`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch student skills');
        return response.json();
    },

    async addSkill(skill_id: string, proficiency_level: number, years_of_experience: number = 0) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/students/skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skill_id, proficiency_level, years_of_experience })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add skill');
        }
        return response.json();
    },

    async removeSkill(skillId: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/students/skills/${skillId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to remove skill');
        return response.json();
    },

    async getProfile() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/students/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    async updateProfile(formData: FormData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/students/profile`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }
        return response.json();
    }
};

export const employerService = {
    async getProfile() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/employers/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    async getFeaturedEmployers() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/employers/featured`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch featured employers');
        return response.json();
    },

    async updateProfile(formData: FormData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/employers/profile`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }
        return response.json();
    },

    async getSupervisors() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/employers/supervisors`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch supervisors');
        return response.json();
    },

    async createSupervisor(data: any) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/employers/supervisors`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create supervisor');
        }
        return response.json();
    }
};

export const applicationService = {
    async apply(formData: FormData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit application');
        }
        return response.json();
    },

    async getMyApplications() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch applications');
        return response.json();
    },

    async getEmployerApplications() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications/employer`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch employer applications');
        return response.json();
    },

    async getSupervisorApplications() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications/supervisor`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch supervisor applications');
        return response.json();
    },

    async assignSupervisor(applicationId: string, supervisorId: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications/${applicationId}/assign`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ supervisorId })
        });
        if (!response.ok) throw new Error('Failed to assign supervisor');
        return response.json();
    },

    async updateStatus(applicationId: string, status: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/applications/${applicationId}/status`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    }
};

export const savedInternshipService = {
    async getSavedInternships() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/saved-internships`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch saved internships');
        return response.json();
    },

    async saveInternship(internshipId: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/saved-internships`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ internshipId })
        });
        if (!response.ok) throw new Error('Failed to save internship');
        return response.json();
    },

    async unsaveInternship(internshipId: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/saved-internships/${internshipId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to unsave internship');
        return response.json();
    }
};

export const adminService = {
    async getAllEmployers() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/employers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch employers');
        return response.json();
    },

    async toggleEmployerFeatured(id: string, is_featured: boolean) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/employers/${id}/feature`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ is_featured })
        });
        if (!response.ok) throw new Error('Failed to toggle featured status');
        return response.json();
    },

    async getAllInternships() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/internships`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch internships');
        return response.json();
    },

    async toggleInternshipFeatured(id: string, is_featured: boolean) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/internships/${id}/feature`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_featured })
        });
        if (!response.ok) throw new Error('Failed to toggle internship featured status');
        return response.json();
    },

    async getAllUsers() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    async updateUserStatus(id: string, is_active: boolean) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active })
        });
        if (!response.ok) throw new Error('Failed to update user status');
        return response.json();
    },

    async deleteUser(id: string) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return response.json();
    }
};
