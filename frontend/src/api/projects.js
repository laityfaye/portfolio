import api from './axios';

export const projectsApi = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  get: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  uploadImage: async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/projects/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  reorder: async (projects) => {
    const response = await api.put('/projects/reorder', { projects });
    return response.data;
  },
};
