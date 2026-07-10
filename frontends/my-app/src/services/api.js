const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`/api${url}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return { data: await response.json() };
};

export const authAPI = {
  login: async (credentials) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  },
  register: async (userData) => {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },
  getMe: async () => {
    const response = await apiFetch('/auth/me');
    return response.data;
  },
};

export const researchAPI = {
  list: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await apiFetch(`/research${query ? `?${query}` : ''}`);
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await apiFetch(`/timeline/${slug}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiFetch('/research', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },
  update: async (slug, data) => {
    const response = await apiFetch(`/research/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },
  delete: async (slug) => {
    const response = await apiFetch(`/research/${slug}`, {
      method: 'DELETE',
    });
    return response.data;
  },
};

export const timelineAPI = {
  getEvents: async () => {
    const response = await apiFetch('/timeline');
    return response.data;
  },
};

export const quizAPI = {
  list: async () => {
    const response = await apiFetch('/quiz');
    return response.data;
  },
  submitScore: async (quizId, scoreData) => {
    const response = await apiFetch(`/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await apiFetch('/quiz/leaderboard');
    return response.data;
  },
};

export const communityAPI = {
  getPosts: async () => {
    const response = await apiFetch('/community');
    return response.data;
  },
  createPost: async (postData) => {
    const response = await apiFetch('/community', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    return response.data;
  },
  submitDiscovery: async (discoveryData) => {
    const response = await apiFetch('/community/discoveries', {
      method: 'POST',
      body: JSON.stringify(discoveryData),
    });
    return response.data;
  },
  getPendingDiscoveries: async () => {
    const response = await apiFetch('/community/discoveries/pending');
    return response.data;
  },
  approveDiscovery: async (id) => {
    const response = await apiFetch(`/community/discoveries/${id}/approve`, {
      method: 'POST',
    });
    return response.data;
  },
};

export const contactAPI = {
  submit: async (messageData) => {
    const response = await apiFetch('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    return response.data;
  },
};
