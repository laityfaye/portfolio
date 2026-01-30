import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    // Check for admin token first (for admin routes)
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('auth_token');

    // Use admin token for admin routes, user token otherwise
    if (config.url?.includes('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = error.config?.url?.includes('/admin');

      if (isAdminRoute) {
        localStorage.removeItem('admin_token');
        window.location.href = '/p/admin/login';
      } else {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/p/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
