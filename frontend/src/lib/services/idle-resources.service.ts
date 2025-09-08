import { api } from '../api';

export interface IdleResourceData {
  id: number;
  employeeCode: string;
  fullName: string;
  departmentId: number;
  department: {
    id: number;
    name: string;
    code: string;
  };
  position: string;
  email?: string;
  skillSet?: string;
  idleFrom: string;
  idleTo?: string;
  status: string;
  processNote?: string;
  rate?: number;
  isUrgent: boolean;
  cvFilesCount: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  // Enhanced search fields for T-S03-002
  searchRelevance?: number;
  searchHighlight?: {
    fullName?: string;
    employeeCode?: string;
    skillSet?: string;
    position?: string;
    department?: string;
  };
}

export interface PaginatedIdleResourceResponse {
  data: IdleResourceData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ResourceSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  departmentId?: number;
  status?: string;
  idleFromStart?: string;
  idleFromEnd?: string;
  urgent?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const idleResourcesService = {
  // Get paginated list of idle resources
  async getIdleResources(params: ResourceSearchParams = {}): Promise<PaginatedIdleResourceResponse> {
    const response = await api.get('/idle-resources', { params });
    return response.data;
  },

  // Search idle resources (same as getIdleResources for now)
  async searchIdleResources(params: ResourceSearchParams = {}): Promise<PaginatedIdleResourceResponse> {
    const response = await api.get('/idle-resources/search', { params });
    return response.data;
  },

  // Get single idle resource
  async getIdleResource(id: number): Promise<IdleResourceData> {
    const response = await api.get(`/idle-resources/${id}`);
    return response.data;
  },

  // Create new idle resource
  async createIdleResource(data: Partial<IdleResourceData>): Promise<IdleResourceData> {
    const response = await api.post('/idle-resources', data);
    return response.data;
  },

  // Update idle resource
  async updateIdleResource(id: number, data: Partial<IdleResourceData>): Promise<IdleResourceData> {
    const response = await api.put(`/idle-resources/${id}`, data);
    return response.data;
  },

  // Delete idle resource
  async deleteIdleResource(id: number): Promise<void> {
    await api.delete(`/idle-resources/${id}`);
  },

  // Bulk delete idle resources
  async bulkDeleteIdleResources(ids: number[]): Promise<{ deletedCount: number; errors: string[] }> {
    const response = await api.post('/idle-resources/bulk-delete', { ids });
    return response.data;
  },

  // Export idle resources to Excel
  async exportIdleResources(params: ResourceSearchParams = {}): Promise<Blob> {
    const response = await api.get('/idle-resources/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  // Import idle resources from Excel
  async importIdleResources(file: File): Promise<any> {
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
