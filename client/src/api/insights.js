import api from './client';

export const insightsApi = {
  getOverview: async (period = 'month') => {
    const response = await api.get('/insights/overview', { params: { period } });
    return response.data;
  },

  getStreaks: async () => {
    const response = await api.get('/insights/streaks');
    return response.data;
  },

  getDailyTrend: async (period = 'week') => {
    const response = await api.get('/insights/daily-trend', { params: { period } });
    return response.data;
  },

  getBestWorstDays: async (period = 'month') => {
    const response = await api.get('/insights/best-worst-days', { params: { period } });
    return response.data;
  },

  getHabitInsight: async (habitId, period = 'month') => {
    const response = await api.get(`/insights/habit/${habitId}`, { params: { period } });
    return response.data;
  },

  getComparison: async (current = 'week', previous = 'week') => {
    const response = await api.get('/insights/comparison', {
      params: { current, previous }
    });
    return response.data;
  }
};