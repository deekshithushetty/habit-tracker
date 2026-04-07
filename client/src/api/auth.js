import api, { setAccessToken, clearAccessToken } from './client';

export const authApi = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
    }
  },

  refresh: async () => {
    const response = await api.post('/auth/refresh');
    setAccessToken(response.data.accessToken);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};