import { UserRole } from '../../common/types';

export const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$1234567890123456789012345678901234567890123456', // 'admin123' hashed
    email: 'admin@company.com',
    fullName: 'System Administrator',
    role: UserRole.ADMIN,
    departmentId: 1,
    isActive: true,
  },
  {
    id: 2,
    username: 'ra_all',
    password: '$2b$10$1234567890123456789012345678901234567890123456', // 'ra123' hashed
    email: 'ra.all@company.com',
    fullName: 'Resource Admin (All)',
    role: UserRole.RA_ALL,
    departmentId: 1,
    isActive: true,
  },
  {
    id: 3,
    username: 'ra_dev',
    password: '$2b$10$1234567890123456789012345678901234567890123456', // 'ra123' hashed
    email: 'ra.dev@company.com',
    fullName: 'Resource Admin (Dev)',
    role: UserRole.RA_DEPARTMENT,
    departmentId: 1,
    isActive: true,
  },
  {
    id: 4,
    username: 'manager_it',
    password: '$2b$10$1234567890123456789012345678901234567890123456', // 'manager123' hashed
    email: 'manager.it@company.com',
    fullName: 'IT Manager',
    role: UserRole.MANAGER,
    departmentId: 1,
    isActive: true,
  },
  {
    id: 5,
    username: 'manager_qa',
    password: '$2b$10$1234567890123456789012345678901234567890123456', // 'manager123' hashed
    email: 'manager.qa@company.com',
    fullName: 'QA Manager',
    role: UserRole.MANAGER,
    departmentId: 3,
    isActive: true,
  },
  {
    id: 6,
    username: 'viewer1',
    password: '$2b$10$1234567890123456789012345678901234567890123456', // 'viewer123' hashed
    email: 'viewer1@company.com',
    fullName: 'General Viewer',
    role: UserRole.VIEWER,
    departmentId: undefined,
    isActive: true,
  },
  {
    id: 7,
    username: 'viewer2',
    password: '$2b$10$1234567890123456789012345678901234567890123456', // 'viewer123' hashed
    email: 'viewer2@company.com',
    fullName: 'Business Viewer',
    role: UserRole.VIEWER,
    departmentId: 4,
    isActive: true,
  },
];
