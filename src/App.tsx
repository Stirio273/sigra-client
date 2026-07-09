import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import ForbiddenPage from './components/auth/ForbiddenPage';

// Pages
import Dashboard from "@/pages/dashboard/Dashboard";


export function App() {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* Protected Routes (authentication required) */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* </Route> */}

          {/* Role-based Protected Routes */}
          {/* <Route element={<ProtectedRoute requiredRoles={['Admin']} />}> */}
            {/* <Route path="/admin" element={<AdminPage />} /> */}
          {/* </Route> */}

        </Routes>
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
}

export default App
