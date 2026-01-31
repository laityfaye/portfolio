import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AdminProvider } from '../context/AdminContext';
import { ThemeProvider } from '../context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Portfolio from '../pages/Portfolio';
import PortfolioPreview from '../pages/PortfolioPreview';
import NotFound from '../pages/NotFound';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminLayout from '../pages/admin/AdminLayout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppRoutes = () => {
  return (
    <BrowserRouter basename="/p">
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/preview" element={<PortfolioPreview />} />
              <Route path="/:slug" element={<Portfolio />} />

              {/* Protected Routes (User) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard/*" element={<Dashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/*" element={<AdminLayout />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
