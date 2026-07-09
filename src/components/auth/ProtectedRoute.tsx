import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    requiredRoles?: string[]; // Optional role-based protection
    redirectTo?: string;
}

const ProtectedRoute = ({
    requiredRoles = [],
    redirectTo = '/unauthorized',
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="loading-container">
                <span>Verifying authentication...</span>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check role-based access if roles are required
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) =>
            user?.roles.includes(role)
        );

        if (!hasRequiredRole) {
            return <Navigate to="/forbidden" replace />;
        }
    }

    // Render child routes
    return <Outlet />;
};

export default ProtectedRoute;
