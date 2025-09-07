import { UserRole } from './types';

export const APP_CONFIG = {
  name: 'IRMS',
  fullName: 'Idle Resource Management System',
  version: '1.0.0',
  description: 'System for managing idle resources and workforce allocation',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  DASHBOARD: {
    DATA: '/dashboard/data',
  },
  IDLE_RESOURCES: {
    BASE: '/idle-resources',
    BY_ID: (id: number) => `/idle-resources/${id}`,
    SEARCH: '/idle-resources/search',
    IMPORT: '/idle-resources/import',
    EXPORT: '/idle-resources/export',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  CV_FILES: {
    BASE: '/cv-files',
    BY_RESOURCE: (resourceId: number) => `/cv-files/resource/${resourceId}`,
    DOWNLOAD: (id: number) => `/cv-files/${id}/download`,
    UPLOAD: '/cv-files/upload',
  },
  HISTORY_LOGS: {
    BASE: '/history-logs',
  },
  DEPARTMENTS: {
    BASE: '/departments',
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  IDLE_RESOURCES: '/resources',
  RESOURCE_DETAIL: (id: number) => `/resources/${id}`,
  USERS: '/users',
  HISTORY: '/history',
};

export const STATUS_COLORS = {
  idle: '#FFC107',
  assigned: '#28A745',
  processing: '#17A2B8',
  unavailable: '#DC3545',
};

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: ['read', 'write', 'delete', 'manage_users'],
  [UserRole.RA_ALL]: ['read', 'write', 'delete', 'import', 'export'],
  [UserRole.RA_DEPARTMENT]: ['read', 'write', 'export'],
  [UserRole.MANAGER]: ['read', 'write', 'export'],
  [UserRole.VIEWER]: ['read'],
};

export const URGENT_THRESHOLD_MONTHS = 2;

export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};
