import { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthApi } from '../api/admin';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const response = await adminAuthApi.me();
        setAdmin(response.data.admin);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('admin_token');
        setAdmin(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await adminAuthApi.login({ email, password });
    const { admin: adminData, token } = response.data;

    localStorage.setItem('admin_token', token);
    setAdmin(adminData);
    setIsAuthenticated(true);

    return response.data;
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminContext.Provider value={{
      admin,
      loading,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
