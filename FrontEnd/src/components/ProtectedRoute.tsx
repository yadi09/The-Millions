import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { hasToken, isTokenExpired, clearAuth } from '../utils/authUtils';
import { logout } from '../features/auth/authSlice';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * Gates the admin shell. Redirects to /admin/login if:
 *  - No token in localStorage
 *  - Token exists but its `exp` claim is in the past
 *  - Redux's isAuthenticated flag is false (e.g. after logout)
 *
 * When the redirect is caused by an expired token, we proactively clear
 * local auth so stale state doesn't linger across navigations.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const location = useLocation();

    const tokenPresent = hasToken();
    const expired = tokenPresent && isTokenExpired();

    // Clean up local state synchronously when the gate fails for an expired
    // token. The dispatch needs to run in an effect, but the Navigate below
    // takes effect on the same render — so by the time we land on /login,
    // auth state has been wiped.
    useEffect(() => {
        if (expired) {
            clearAuth();
            dispatch(logout());
        }
    }, [expired, dispatch]);

    if (!tokenPresent || expired || !isAuthenticated) {
        // `state.from` lets login send the user back to where they were heading.
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
