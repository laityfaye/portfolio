import api from './axios';

export const paymentsApi = {
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  uploadProof: async (file) => {
    const formData = new FormData();
    formData.append('proof', file);
    const response = await api.post('/payments/proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
