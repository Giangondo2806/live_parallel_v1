import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  ApiResponse,
  CreateIdleResourceRequest,
  UpdateIdleResourceRequest,
  SearchCriteriaRequest,
  PaginatedIdleResourceResponse,
  IdleResourceResponse,
  BulkDeleteRequest,
  ImportResult,
  ExportFilter
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
export const api = axios.create({
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
  // Get paginated list with search and filters
  getAll: async (criteria?: SearchCriteriaRequest): Promise<PaginatedIdleResourceResponse> => {
    // TODO: Implement proper query parameter handling
    // TODO: Add request validation and error handling
    // TODO: Add retry logic for failed requests
    const params = new URLSearchParams();
    if (criteria) {
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/idle-resources?${params.toString()}`);
    return response.data;
  },

  // Advanced search
  search: async (criteria: SearchCriteriaRequest): Promise<PaginatedIdleResourceResponse> => {
    // TODO: Implement full-text search with highlighting
    // TODO: Add search result caching
    // TODO: Track search analytics
    const response = await api.get('/idle-resources/search', { params: criteria });
    return response.data;
  },

  // Get single resource by ID
  getById: async (id: number): Promise<IdleResourceResponse> => {
    // TODO: Add caching for frequently accessed resources
    // TODO: Handle not found errors gracefully
    const response = await api.get(`/idle-resources/${id}`);
    return response.data;
  },

  // Create new resource
  create: async (data: CreateIdleResourceRequest): Promise<IdleResourceResponse> => {
    // TODO: Add client-side validation before API call
    // TODO: Handle validation errors from server
    // TODO: Show success notification
    const response = await api.post('/idle-resources', data);
    return response.data;
  },

  // Update existing resource
  update: async (id: number, data: UpdateIdleResourceRequest): Promise<IdleResourceResponse> => {
    // TODO: Implement optimistic updates
    // TODO: Handle concurrent update conflicts
    // TODO: Track change history
    const response = await api.put(`/idle-resources/${id}`, data);
    return response.data;
  },

  // Delete single resource
  delete: async (id: number): Promise<void> => {
    // TODO: Add confirmation dialog
    // TODO: Handle dependency conflicts
    // TODO: Show deletion feedback
    const response = await api.delete(`/idle-resources/${id}`);
    return response.data;
  },

  // Bulk delete resources
  bulkDelete: async (data: BulkDeleteRequest): Promise<{ deletedCount: number; errors: string[] }> => {
    // TODO: Add bulk operation progress tracking
    // TODO: Handle partial failures gracefully
    // TODO: Show detailed results to user
    const response = await api.delete('/idle-resources/batch', { data });
    return response.data;
  },

  // Import from Excel file
  importFromExcel: async (file: File): Promise<ImportResult> => {
    // TODO: Add file validation (size, format)
    // TODO: Show upload progress
    // TODO: Handle large file uploads
    // TODO: Provide import preview before processing
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/idle-resources/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Export to Excel
  exportToExcel: async (filter?: ExportFilter): Promise<Blob> => {
    // TODO: Add export progress for large datasets
    // TODO: Allow custom column selection
    // TODO: Include export metadata
    const response = await api.get('/idle-resources/export', {
      params: filter,
      responseType: 'blob',
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
