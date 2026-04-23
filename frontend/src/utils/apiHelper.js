const BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || '';

/**
 * Build full URL for API endpoints
 */
const buildUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return BASE_URL ? `${BASE_URL}${normalizedPath}` : normalizedPath;
};

/**
 * Get authorization header with JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Generic fetch wrapper
 */
const fetchJson = async (path, options = {}) => {
  try {
    const response = await fetch(buildUrl(path), {
      headers: getAuthHeaders(),
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================================================
// HEALTH & STATUS
// ============================================================================

export const getHealth = async () => {
  return fetchJson('/health');
};

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const auth = {
  login: (email, password) =>
    fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
};

// ============================================================================
// TAX CALCULATION
// ============================================================================

export const tax = {
  calculate: (payload) =>
    fetchJson('/api/tax/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getHistory: () =>
    fetchJson('/api/tax/history', { method: 'GET' }),

  getCalculation: (id) =>
    fetchJson(`/api/tax/${id}`, { method: 'GET' }),

  deleteCalculation: (id) =>
    fetchJson(`/api/tax/${id}`, { method: 'DELETE' }),

  generateReport: (calculationId) =>
    fetchJson(`/api/tax/${calculationId}/report`, { method: 'POST' }),
};

// ============================================================================
// CLIENT MANAGEMENT
// ============================================================================

export const clients = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/clients${queryString ? `?${queryString}` : ''}`;
    return fetchJson(url, { method: 'GET' });
  },

  create: (clientData) =>
    fetchJson('/api/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    }),

  get: (id) =>
    fetchJson(`/api/clients/${id}`, { method: 'GET' }),

  update: (id, clientData) =>
    fetchJson(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    }),

  delete: (id) =>
    fetchJson(`/api/clients/${id}`, { method: 'DELETE' }),

  addCalculation: (id, calculationId) =>
    fetchJson(`/api/clients/${id}/calculations`, {
      method: 'POST',
      body: JSON.stringify({ calculationId }),
    }),
};

// ============================================================================
// PROFILE
// ============================================================================

export const profile = {
  get: () =>
    fetchJson('/api/profile', { method: 'GET' }),

  update: (userData) =>
    fetchJson('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return fetch(buildUrl('/api/profile/photo'), {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${auth.getToken()}` },
      body: formData,
    }).then(res => res.json());
  },
};

// ============================================================================
// CHAT
// ============================================================================

export const chat = {
  sendMessage: (message, clientId = null) =>
    fetchJson('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ message, clientId }),
    }),

  getHistory: (clientId = null) => {
    const url = clientId
      ? `/api/chat/history?clientId=${clientId}`
      : '/api/chat/history';
    return fetchJson(url, { method: 'GET' });
  },

  clearHistory: () =>
    fetchJson('/api/chat/history', { method: 'DELETE' }),
};

// ============================================================================
// REPORTS
// ============================================================================

export const reports = {
  generatePDF: (calculationId, caName = '', caLogo = '') =>
    fetchJson(`/api/reports/pdf`, {
      method: 'POST',
      body: JSON.stringify({ calculationId, caName, caLogo }),
    }),

  downloadPDF: (reportId) =>
    fetch(buildUrl(`/api/reports/${reportId}/download`), {
      headers: { 'Authorization': `Bearer ${auth.getToken()}` },
    }).then(res => res.blob()),

  sendViaEmail: (reportId, recipientEmail) =>
    fetchJson(`/api/reports/${reportId}/email`, {
      method: 'POST',
      body: JSON.stringify({ recipientEmail }),
    }),

  shareViaWhatsApp: (reportId) =>
    fetchJson(`/api/reports/${reportId}/whatsapp`, {
      method: 'POST',
    }),
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const apiHelper = {
  getHealth,
  auth,
  tax,
  clients,
  profile,
  chat,
  reports,
};

export default apiHelper;
