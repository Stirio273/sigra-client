// router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import RoleGuard from '../components/guards/RoleGuard';
import GuestRoute from '../components/guards/GuestRoute';

// Pages
import Dashboard     from '../pages/Dashboard';
import AdminPanel    from '../pages/AdminPanel';
import Unauthorized  from '../pages/Unauthorized';
import Forbidden     from '../pages/Forbidden';
import Home          from '../pages/Home';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Protected Routes (authenticated users only) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Role-Based Routes */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={['Admin', 'SuperAdmin']}>
              <AdminPanel />
            </RoleGuard>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
