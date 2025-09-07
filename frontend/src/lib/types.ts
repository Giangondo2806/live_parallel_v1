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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IdleResource {
  id: number;
  employeeCode: string;
  fullName: string;
  departmentId: number;
  department?: Department;
  position: string;
  email?: string;
  skillSet?: string;
  idleFrom: Date;
  idleTo?: Date;
  status: ResourceStatus;
  processNote?: string;
  rate?: number;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  isUrgent?: boolean;
}

export interface CVFile {
  id: number;
  resourceId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  originalName?: string;
  uploadedBy: number;
  uploadedAt: Date;
  isActive: boolean;
}

export interface HistoryLog {
  id: number;
  resourceId?: number;
  actionType: ActionType;
  oldValues?: string;
  newValues?: string;
  description?: string;
  changedBy: number;
  changedAt: Date;
  entityType?: string;
  entityId?: number;
}

export interface DashboardData {
  totalIdle: number;
  urgentCount: number;
  departmentStats: Array<{
    departmentName: string;
    count: number;
  }>;
  recentUpdates: IdleResource[];
}

// Idle Resource API Types
export interface CreateIdleResourceRequest {
  employeeCode: string;
  fullName: string;
  departmentId: number;
  position: string;
  email?: string;
  skillSet?: string;
  idleFrom: string;
  idleTo?: string;
  status: ResourceStatus;
  processNote?: string;
  rate?: number;
}

export interface UpdateIdleResourceRequest extends Partial<CreateIdleResourceRequest> {
  updatedBy?: number;
}

export interface SearchCriteriaRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  departmentId?: number;
  status?: ResourceStatus;
  idleFromStart?: string;
  idleFromEnd?: string;
  urgent?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IdleResourceResponse {
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
  idleFrom: Date;
  idleTo?: Date;
  status: ResourceStatus;
  processNote?: string;
  rate?: number;
  isUrgent: boolean;
  cvFilesCount: number;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedIdleResourceResponse {
  data: IdleResourceResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BulkDeleteRequest {
  ids: number[];
}

export interface ImportResult {
  successCount: number;
  errorCount: number;
  errors: string[];
  totalProcessed: number;
}

export interface ExportFilter {
  departmentIds?: number[];
  status?: string;
  urgentOnly?: boolean;
}

// Search filters for UI
export interface ResourceSearchFilters {
  search: string;
  departmentId: string;
  status: string;
  urgentOnly: boolean;
}
