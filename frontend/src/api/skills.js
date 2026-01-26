import api from './axios';

export const skillsApi = {
  getAll: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/skills', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },

  reorder: async (skills) => {
    const response = await api.put('/skills/reorder', { skills });
    return response.data;
  },
};
