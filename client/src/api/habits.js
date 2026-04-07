import api from './client';

export const habitsApi = {
  getAll: async (filter = 'all') => {
    // Changed: fetch ALL habits by default so we can filter on frontend
    const params = { archived: filter };
    const response = await api.get('/habits', { params });
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/habits/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/habits', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/habits/${id}`, data);
    return response.data;
  },

  archive: async (id) => {
    const response = await api.patch(`/habits/${id}/archive`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },

  reorder: async (habits) => {
    const response = await api.patch('/habits/reorder', { habits });
    return response.data;
  }
};