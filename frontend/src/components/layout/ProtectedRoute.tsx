import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('student' | 'employer' | 'admin' | 'supervisor')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Show nothing or a global loading spinner while AuthContext resolves local storage
    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading session...</p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        // If authenticated but wrong role, throw them back to their appropriate dashboard
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
