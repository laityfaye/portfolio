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

  /**
   * Initier un paiement PayTech - Retourne l'URL de redirection vers PayTech
   * Documentation: https://doc.intech.sn/doc_paytech.php
   */
  requestPayTech: async (targetPayment = 'Orange Money, Wave, Free Money') => {
    const response = await api.post('/payments/paytech/request', {
      target_payment: targetPayment,
    });
    return response.data;
  },
};
