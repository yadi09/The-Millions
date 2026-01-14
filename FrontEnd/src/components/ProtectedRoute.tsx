import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { hasToken } from '../utils/authUtils';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Checks both Redux state and localStorage token
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const tokenExists = hasToken();

    // If no token exists or user is not authenticated, redirect to login
    if (!tokenExists || !isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // User is authenticated, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute;
