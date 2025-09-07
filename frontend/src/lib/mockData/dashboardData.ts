// Mock data for Dashboard UI components
export interface MockDashboardData {
  statistics: {
    totalIdleResources: number;
    urgentResources: number;
    availableResources: number;
    totalResources: number;
    idlePercentage: number;
    departmentsWithIdle: number;
  };
  departmentStats: Array<{
    departmentId: number;
    departmentName: string;
    idleCount: number;
    totalCount: number;
    idlePercentage: number;
    urgentCount: number;
  }>;
  recentActivities: Array<{
    id: number;
    resourceName: string;
    resourceId: number;
    action: string;
    performedBy: string;
    department: string;
    timestamp: Date;
    description?: string;
  }>;
  lastUpdated: Date;
}

export const MOCK_DASHBOARD_DATA: MockDashboardData = {
  statistics: {
    totalIdleResources: 47,
    urgentResources: 12, // >= 2 months idle
    availableResources: 103,
    totalResources: 150,
    idlePercentage: 31.3,
    departmentsWithIdle: 5,
  },
  departmentStats: [
    {
      departmentId: 1,
      departmentName: 'IT Development',
      idleCount: 18,
      totalCount: 45,
      idlePercentage: 40.0,
      urgentCount: 5,
    },
    {
      departmentId: 2,
      departmentName: 'Quality Assurance',
      idleCount: 12,
      totalCount: 30,
      idlePercentage: 40.0,
      urgentCount: 3,
    },
    {
      departmentId: 3,
      departmentName: 'Business Analysis',
      idleCount: 8,
      totalCount: 25,
      idlePercentage: 32.0,
      urgentCount: 2,
    },
    {
      departmentId: 4,
      departmentName: 'UI/UX Design',
      idleCount: 6,
      totalCount: 20,
      idlePercentage: 30.0,
      urgentCount: 1,
    },
    {
      departmentId: 5,
      departmentName: 'DevOps',
      idleCount: 3,
      totalCount: 15,
      idlePercentage: 20.0,
      urgentCount: 1,
    },
    {
      departmentId: 6,
      departmentName: 'Marketing',
      idleCount: 0,
      totalCount: 15,
      idlePercentage: 0,
      urgentCount: 0,
    },
  ],
  recentActivities: [
    {
      id: 1,
      resourceName: 'Nguyen Van A',
      resourceId: 101,
      action: 'Status Updated',
      performedBy: 'ra_user',
      department: 'IT Development',
      timestamp: new Date('2025-01-08T14:30:00'),
      description: 'Status changed from Available to Idle',
    },
    {
      id: 2,
      resourceName: 'Tran Thi B',
      resourceId: 102,
      action: 'CV Uploaded',
      performedBy: 'ra_user',
      department: 'Quality Assurance',
      timestamp: new Date('2025-01-08T11:15:00'),
      description: 'New CV file uploaded: tran_thi_b_cv_2025.pdf',
    },
    {
      id: 3,
      resourceName: 'Le Van C',
      resourceId: 103,
      action: 'Resource Created',
      performedBy: 'manager1',
      department: 'Business Analysis',
      timestamp: new Date('2025-01-08T09:45:00'),
      description: 'New resource added to idle pool',
    },
    {
      id: 4,
      resourceName: 'Pham Thi D',
      resourceId: 104,
      action: 'Skills Updated',
      performedBy: 'ra_user',
      department: 'UI/UX Design',
      timestamp: new Date('2025-01-07T16:20:00'),
      description: 'Skill set updated: Added React Native, Figma Advanced',
    },
    {
      id: 5,
      resourceName: 'Hoang Van E',
      resourceId: 105,
      action: 'Department Changed',
      performedBy: 'admin',
      department: 'DevOps',
      timestamp: new Date('2025-01-07T14:10:00'),
      description: 'Transferred from IT Development to DevOps',
    },
    {
      id: 6,
      resourceName: 'Vu Thi F',
      resourceId: 106,
      action: 'Status Updated',
      performedBy: 'manager2',
      department: 'Quality Assurance',
      timestamp: new Date('2025-01-07T10:30:00'),
      description: 'Status changed from Idle to Available - Assigned to new project',
    },
    {
      id: 7,
      resourceName: 'Do Van G',
      resourceId: 107,
      action: 'Rate Updated',
      performedBy: 'ra_user',
      department: 'IT Development',
      timestamp: new Date('2025-01-06T15:45:00'),
      description: 'Hourly rate updated from ¥4,500 to ¥5,000',
    },
    {
      id: 8,
      resourceName: 'Bui Thi H',
      resourceId: 108,
      action: 'Resource Deleted',
      performedBy: 'admin',
      department: 'Marketing',
      timestamp: new Date('2025-01-06T13:20:00'),
      description: 'Resource removed from system - Left company',
    },
  ],
  lastUpdated: new Date('2025-01-08T15:00:00'),
};

// Chart data for department statistics visualization
export const MOCK_DEPARTMENT_CHART_DATA = {
  labels: MOCK_DASHBOARD_DATA.departmentStats.map(dept => dept.departmentName),
  datasets: [
    {
      label: 'Idle Resources',
      data: MOCK_DASHBOARD_DATA.departmentStats.map(dept => dept.idleCount),
      backgroundColor: [
        '#FF6384',
        '#36A2EB', 
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
      ],
      borderWidth: 2,
    },
    {
      label: 'Total Resources',
      data: MOCK_DASHBOARD_DATA.departmentStats.map(dept => dept.totalCount),
      backgroundColor: '#E5E7EB',
      borderWidth: 1,
    },
  ],
};

// Mock data for different time periods
export const MOCK_PERIOD_DATA = {
  last_7_days: {
    newIdleResources: 5,
    resolvedIdleResources: 3,
    averageIdleDuration: 45, // days
  },
  last_30_days: {
    newIdleResources: 18,
    resolvedIdleResources: 12,
    averageIdleDuration: 52, // days
  },
  last_3_months: {
    newIdleResources: 47,
    resolvedIdleResources: 35,
    averageIdleDuration: 38, // days
  },
};

// Mock urgent resources with details
export const MOCK_URGENT_RESOURCES = [
  {
    id: 201,
    name: 'Senior Developer A',
    department: 'IT Development',
    idleFrom: '2023-10-15',
    idleDays: 87,
    reason: 'Project completion - awaiting new assignment',
  },
  {
    id: 202,
    name: 'QA Lead B',
    department: 'Quality Assurance',
    idleFrom: '2023-11-01',
    idleDays: 70,
    reason: 'Team restructuring',
  },
  {
    id: 203,
    name: 'Business Analyst C',
    department: 'Business Analysis',
    idleFrom: '2023-11-20',
    idleDays: 51,
    reason: 'Client project delay',
  },
];
