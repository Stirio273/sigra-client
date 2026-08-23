import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import ForbiddenPage from './components/auth/ForbiddenPage';

// Pages
import Dashboard from "@/pages/dashboard/Dashboard";
import FicheTicket from "@/pages/itsm/FicheTicket";
import Modules from "@/pages/itsm/Modules";
import Outils from "@/pages/itsm/Outils";
import Reports from "@/pages/itsm/Reports";
import Team from "@/pages/itsm/Team";


export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          {/* Protected Routes (authentication required) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/outils" element={<Outils />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/team" element={<Team />} />
            <Route path="/tickets/:id" element={<FicheTicket />} />
          </Route>

          {/* Role-based Protected Routes */}
          {/* <Route element={<ProtectedRoute requiredRoles={['Admin']} />}> */}
            {/* <Route path="/admin" element={<AdminPage />} /> */}
          {/* </Route> */}

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
