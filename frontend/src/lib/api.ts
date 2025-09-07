import axios, { AxiosResponse } from 'axios';
import { AuthResponse, LoginRequest, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  validateSession: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getDashboardData: async () => {
    const response = await api.get('/dashboard/data');
    return response.data;
  },
};

// Idle Resources API
export const idleResourcesApi = {
  getAll: async () => {
    const response = await api.get('/idle-resources');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/idle-resources/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/idle-resources', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/idle-resources/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/idle-resources/${id}`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

// CV Files API
export const cvFilesApi = {
  getByResourceId: async (resourceId: number) => {
    const response = await api.get(`/cv-files/resource/${resourceId}`);
    return response.data;
  },

  upload: async (resourceId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resourceId', resourceId.toString());

    const response = await api.post('/cv-files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  download: async (id: number) => {
    const response = await api.get(`/cv-files/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// History Logs API
export const historyLogsApi = {
  getAll: async () => {
    const response = await api.get('/history-logs');
    return response.data;
  },
};

// Departments API
export const departmentsApi = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data;
  },
};

export default api;
