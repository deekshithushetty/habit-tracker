import api from './client';

export const completionsApi = {
  getByDate: async (date) => {
    const response = await api.get('/completions', { params: { date } });
    return response.data;
  },

  getRange: async (from, to) => {
    const response = await api.get('/completions/range', { params: { from, to } });
    return response.data;
  },

  getHabitHistory: async (habitId, from, to) => {
    const response = await api.get(`/completions/history/${habitId}`, {
      params: { from, to }
    });
    return response.data;
  },

  toggle: async (habitId, date) => {
    const response = await api.post('/completions/toggle', { habitId, date });
    return response.data;
  }
};