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
  getDashboardData: async (filters?: {
    departmentId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/dashboard/data?${params.toString()}`);
    return response.data;
  },

  getStatistics: async (filters?: {
    departmentId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await api.get(`/dashboard/statistics?${params.toString()}`);
    return response.data;
  },

  getRecentActivities: async (filters?: {
    departmentId?: string;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/dashboard/recent-activities?${params.toString()}`);
    return response.data;
  },

  getDepartmentStats: async (filters?: {
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await api.get(`/dashboard/department-stats?${params.toString()}`);
    return response.data;
  },
};

// Idle Resources API
export const idleResourcesApi = {
  getAllWithPagination: async (filters?: {
    searchTerm?: string;
    departmentId?: number;
    status?: string;
    position?: string;
    idleFromStart?: string;
    idleFromEnd?: string;
    urgentOnly?: boolean;
    skills?: string[];
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) => {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.position) params.append('position', filters.position);
    if (filters?.idleFromStart) params.append('idleFromStart', filters.idleFromStart);
    if (filters?.idleFromEnd) params.append('idleFromEnd', filters.idleFromEnd);
    if (filters?.urgentOnly) params.append('urgentOnly', filters.urgentOnly.toString());
    if (filters?.skills && filters.skills.length > 0) {
      filters.skills.forEach(skill => params.append('skills[]', skill));
    }
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const response = await api.get(`/idle-resources?${params.toString()}`);
    return response.data;
  },

  search: async (filters: {
    searchTerm?: string;
    departmentId?: number;
    status?: string;
    position?: string;
    idleFromStart?: string;
    idleFromEnd?: string;
    urgentOnly?: boolean;
    skills?: string[];
  }) => {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.position) params.append('position', filters.position);
    if (filters.idleFromStart) params.append('idleFromStart', filters.idleFromStart);
    if (filters.idleFromEnd) params.append('idleFromEnd', filters.idleFromEnd);
    if (filters.urgentOnly) params.append('urgentOnly', filters.urgentOnly.toString());
    if (filters.skills && filters.skills.length > 0) {
      filters.skills.forEach(skill => params.append('skills[]', skill));
    }
    
    const response = await api.get(`/idle-resources/search?${params.toString()}`);
    return response.data;
  },

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

  batchDelete: async (ids: number[]) => {
    const response = await api.delete('/idle-resources/batch', { data: { ids } });
    return response.data;
  },

  exportData: async (filters?: any, format: 'excel' | 'csv' = 'excel') => {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.urgentOnly) params.append('urgentOnly', filters.urgentOnly.toString());
    params.append('format', format);
    
    const response = await api.get(`/idle-resources/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  importData: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/idle-resources/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
