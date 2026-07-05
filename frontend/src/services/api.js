import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject auth tokens automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const researchAPI = {
  list: async (filters = {}) => {
    const response = await api.get('/research', { params: filters });
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await api.get(`/research/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/research', data);
    return response.data;
  },
  update: async (slug, data) => {
    const response = await api.put(`/research/${slug}`, data);
    return response.data;
  },
  delete: async (slug) => {
    const response = await api.delete(`/research/${slug}`);
    return response.data;
  },
};

export const timelineAPI = {
  getEvents: async () => {
    const response = await api.get('/timeline');
    return response.data;
  },
};

export const quizAPI = {
  list: async () => {
    const response = await api.get('/quiz');
    return response.data;
  },
  submitScore: async (quizId, scoreData) => {
    const response = await api.post(`/quiz/${quizId}/submit`, scoreData);
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await api.get('/quiz/leaderboard');
    return response.data;
  },
};

export const communityAPI = {
  getPosts: async () => {
    const response = await api.get('/community');
    return response.data;
  },
  createPost: async (postData) => {
    const response = await api.post('/community', postData);
    return response.data;
  },
  submitDiscovery: async (discoveryData) => {
    const response = await api.post('/community/discoveries', discoveryData);
    return response.data;
  },
  getPendingDiscoveries: async () => {
    const response = await api.get('/community/discoveries/pending');
    return response.data;
  },
  approveDiscovery: async (id) => {
    const response = await api.post(`/community/discoveries/${id}/approve`);
    return response.data;
  },
};

export const contactAPI = {
  submit: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },
};

export default api;
