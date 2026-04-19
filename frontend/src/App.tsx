import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import RegisterStudent from './pages/RegisterStudent';
import RegisterEmployer from './pages/RegisterEmployer';
import RegisterAdmin from './pages/RegisterAdmin';
import InternDashboard from './pages/dashboards/InternDashboard';
import AllInternships from './pages/dashboards/AllInternships';
import SkillProfile from './pages/dashboards/SkillProfile';
import StudentProfile from './pages/dashboards/StudentProfile';
import EmployerDashboard from './pages/dashboards/EmployerDashboard';
import CreatePosting from './pages/dashboards/CreatePosting';
import EmployerProfile from './pages/dashboards/EmployerProfile';
import Supervisors from './pages/dashboards/Supervisors';
import SupervisorDashboard from './pages/dashboards/SupervisorDashboard';
import MyApplications from './pages/dashboards/MyApplications';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdminAnalytics from './pages/dashboards/AdminAnalytics';
import UserManagement from './pages/dashboards/UserManagement';
import EmployerApplications from './pages/dashboards/EmployerApplications';
import SupervisorApplications from './pages/dashboards/SupervisorApplications';
import SavedInternships from './pages/dashboards/SavedInternships';
import Companies from './pages/dashboards/Companies';
import AllCompaniesPublic from './pages/public/AllCompaniesPublic';
import CompanyPublicProfile from './pages/public/CompanyPublicProfile';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<RegisterStudent />} />
          <Route path="/employer-register" element={<RegisterEmployer />} />
          <Route path="/admin-setup-portal" element={<RegisterAdmin />} />
          <Route path="/companies" element={<AllCompaniesPublic />} />
          <Route path="/companies/:id" element={<CompanyPublicProfile />} />

          {/* Protected Dashboards */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <InternDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/all-internships"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AllInternships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/skills"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SkillProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/saved"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SavedInternships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/companies"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applications"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-internship"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <CreatePosting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/edit-internship/:id"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <CreatePosting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/supervisors"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <Supervisors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor/applications"
            element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
