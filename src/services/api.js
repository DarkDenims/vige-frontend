import axios from 'axios';

// Base API URL - change this when backend is deployed
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor (for adding auth tokens later)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for handling errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const logAPI = {
  // Upload log file
  uploadLog: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post('/logs/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Get all logs
  getLogs: (params = {}) => {
    return apiClient.get('/logs/', { params });
  },

  // Get single log by ID
  getLog: (id) => {
    return apiClient.get(`/logs/${id}/`);
  },

  // Delete log
  deleteLog: (id) => {
    return apiClient.delete(`/logs/${id}/`);
  },

  // Get log parsing status
  getParsingStatus: (id) => {
    return apiClient.get(`/logs/${id}/status/`);
  },
};

export const alertAPI = {
  // Get all alerts
  getAlerts: (params = {}) => {
    return apiClient.get('/alerts/', { params });
  },

  // Get single alert
  getAlert: (id) => {
    return apiClient.get(`/alerts/${id}/`);
  },

  // Mark alert as resolved
  resolveAlert: (id) => {
    return apiClient.patch(`/alerts/${id}/`, { status: 'resolved' });
  },

  // Get alert statistics
  getAlertStats: () => {
    return apiClient.get('/alerts/stats/');
  },
};

export const exportAPI = {
  // Export logs/alerts as JSON
  exportJSON: (type, params = {}) => {
    return apiClient.get(`/export/${type}/json/`, { params });
  },

  // Export logs/alerts as CSV
  exportCSV: (type, params = {}) => {
    return apiClient.get(`/export/${type}/csv/`, { 
      params,
      responseType: 'blob',
    });
  },
};

export default apiClient;