import api from './axios';

// Admin Authentication
export const adminAuthApi = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  me: () => api.get('/admin/me'),
};

// Admin Dashboard
export const adminDashboardApi = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getPendingPayments: () => api.get('/admin/dashboard/pending-payments'),
  getRecentUsers: () => api.get('/admin/dashboard/recent-users'),
};

// Admin Users Management
export const adminUsersApi = {
  getAll: (params = {}) => api.get('/admin/users', { params }),
  getStats: () => api.get('/admin/users/stats'),
  getOne: (id) => api.get(`/admin/users/${id}`),
  activate: (id) => api.post(`/admin/users/${id}/activate`),
  suspend: (id) => api.post(`/admin/users/${id}/suspend`),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

// Admin Payments Management
export const adminPaymentsApi = {
  getAll: (params = {}) => api.get('/admin/payments', { params }),
  getStats: () => api.get('/admin/payments/stats'),
  getOne: (id) => api.get(`/admin/payments/${id}`),
  approve: (id, data = {}) => api.post(`/admin/payments/${id}/approve`, data),
  reject: (id, data) => api.post(`/admin/payments/${id}/reject`, data),
};

// Admin Portfolios Management
export const adminPortfoliosApi = {
  getAll: (params = {}) => api.get('/admin/portfolios', { params }),
  getStats: () => api.get('/admin/portfolios/stats'),
  getOne: (id) => api.get(`/admin/portfolios/${id}`),
  update: (id, data) => api.put(`/admin/portfolios/${id}`, data),
  publish: (id) => api.post(`/admin/portfolios/${id}/publish`),
  unpublish: (id) => api.post(`/admin/portfolios/${id}/unpublish`),
  delete: (id) => api.delete(`/admin/portfolios/${id}`),
};

// Admin Tarification (modèles de prix)
export const adminPricingApi = {
  getAll: () => api.get('/admin/pricing-models'),
  update: (id, data) => api.put(`/admin/pricing-models/${id}`, data),
};
