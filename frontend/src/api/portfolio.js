import api from './axios';

export const portfolioApi = {
  // Public
  getPublic: async (slug) => {
    const response = await api.get(`/public/portfolio/${slug}`);
    return response.data;
  },

  sendContact: async (slug, data) => {
    const response = await api.post(`/public/portfolio/${slug}/contact`, data);
    return response.data;
  },

  // Private
  get: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },

  /** Télécharge le CV (blob) pour l'ouvrir avec le token d'auth */
  getCvBlob: async () => {
    const response = await api.get('/portfolio/cv', {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf, */*',
      },
    });
    return response.data;
  },

  update: async (data) => {
    const response = await api.put('/portfolio', data);
    return response.data;
  },

  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/portfolio/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadCv: async (file) => {
    const formData = new FormData();
    formData.append('cv', file);
    const response = await api.post('/portfolio/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateTheme: async (data) => {
    const response = await api.put('/portfolio/theme', data);
    return response.data;
  },

  publish: async () => {
    const response = await api.put('/portfolio/publish');
    return response.data;
  },
};
