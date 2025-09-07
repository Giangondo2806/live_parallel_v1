export enum UserRole {
  ADMIN = 'admin',
  RA_ALL = 'ra_all',
  RA_DEPARTMENT = 'ra_department',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

export enum ResourceStatus {
  IDLE = 'idle',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  UNAVAILABLE = 'unavailable',
}

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  UPLOAD_CV = 'upload_cv',
  DELETE_CV = 'delete_cv',
  IMPORT_DATA = 'import_data',
  EXPORT_DATA = 'export_data',
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: number;
  departmentName?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
