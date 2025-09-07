'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  Description as FileIcon
} from '@mui/icons-material';
import { DataGrid, DataGridColumn } from '../../components/shared/DataGrid';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { IdleResourceResponse, ResourceSearchFilters, ResourceStatus } from '../../lib/types';

// Interface for mock data (matching IdleResourceResponse but with string dates for simplicity)
interface MockIdleResource {
  id: number;
  employeeCode: string;
  fullName: string;
  department: {
    id: number;
    name: string;
    code: string;
  };
  position: string;
  email: string;
  skillSet: string;
  idleFrom: string;
  idleTo: string | null;
  status: string;
  rate: number;
  isUrgent: boolean;
  cvFilesCount: number;
  updatedAt: string;
}

interface MockDepartment {
  id: number;
  name: string;
  code: string;
}

interface StatusOption {
  value: string;
  label: string;
}

// Mock data for UI display
const MOCK_IDLE_RESOURCES: MockIdleResource[] = [
  {
    id: 1,
    employeeCode: 'EMP001',
    fullName: 'Nguyen Van A',
    department: { id: 1, name: 'IT Department', code: 'IT' },
    position: 'Java Developer',
    email: 'nguyenvana@company.com',
    skillSet: 'Java, Spring Boot, MySQL',
    idleFrom: '2024-01-15',
    idleTo: null,
    status: 'idle',
    rate: 5000,
    isUrgent: true,
    cvFilesCount: 1,
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    employeeCode: 'EMP002',
    fullName: 'Tran Thi B',
    department: { id: 2, name: 'QA Department', code: 'QA' },
    position: 'Test Engineer',
    email: 'tranthib@company.com',
    skillSet: 'Manual Testing, Automation',
    idleFrom: '2024-02-20',
    idleTo: null,
    status: 'idle',
    rate: 4000,
    isUrgent: false,
    cvFilesCount: 1,
    updatedAt: '2024-02-20T14:20:00Z'
  },
  {
    id: 3,
    employeeCode: 'EMP003',
    fullName: 'Le Van C',
    department: { id: 1, name: 'IT Department', code: 'IT' },
    position: 'Frontend Developer',
    email: 'levanc@company.com',
    skillSet: 'React, TypeScript, Material-UI',
    idleFrom: '2024-03-10',
    idleTo: null,
    status: 'idle',
    rate: 4500,
    isUrgent: false,
    cvFilesCount: 0,
    updatedAt: '2024-03-10T09:15:00Z'
  },
  {
    id: 4,
    employeeCode: 'EMP004',
    fullName: 'Pham Thi D',
    department: { id: 3, name: 'Marketing', code: 'MKT' },
    position: 'Digital Marketing',
    email: 'phamthid@company.com',
    skillSet: 'SEO, Google Ads, Social Media',
    idleFrom: '2023-11-05',
    idleTo: null,
    status: 'idle',
    rate: 3500,
    isUrgent: true,
    cvFilesCount: 1,
    updatedAt: '2023-11-05T16:45:00Z'
  },
  {
    id: 5,
    employeeCode: 'EMP005',
    fullName: 'Hoang Van E',
    department: { id: 1, name: 'IT Department', code: 'IT' },
    position: 'Business Analyst',
    email: 'hoangvane@company.com',
    skillSet: 'Requirements Analysis, Documentation',
    idleFrom: '2024-01-25',
    idleTo: null,
    status: 'processing',
    rate: 4200,
    isUrgent: false,
    cvFilesCount: 1,
    updatedAt: '2024-01-25T11:30:00Z'
  }
];

const MOCK_DEPARTMENTS: MockDepartment[] = [
  { id: 1, name: 'IT Department', code: 'IT' },
  { id: 2, name: 'QA Department', code: 'QA' },
  { id: 3, name: 'Marketing', code: 'MKT' },
  { id: 4, name: 'HR Department', code: 'HR' },
  { id: 5, name: 'Finance', code: 'FIN' }
];

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'idle', label: 'Idle' },
  { value: 'processing', label: 'Processing' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'unavailable', label: 'Unavailable' }
];

export default function IdleResourceListPage() {
  // State management
  const [resources, setResources] = useState<MockIdleResource[]>(MOCK_IDLE_RESOURCES);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchFilters, setSearchFilters] = useState<ResourceSearchFilters>({
    search: '',
    departmentId: 'all',
    status: 'all',
    urgentOnly: false
  });

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState<boolean>(false);

  // Data Grid columns definition
  const columns: DataGridColumn<MockIdleResource>[] = [
    {
      id: 'employeeCode',
      label: 'Employee Code',
      minWidth: 120,
      sortable: true
    },
    {
      id: 'fullName',
      label: 'Full Name',
      minWidth: 180,
      sortable: true,
      render: (value: string, row: MockIdleResource) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.isUrgent && (
            <Tooltip title="Idle for more than 2 months">
              <WarningIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
          <Typography variant="body2">{value}</Typography>
        </Box>
      )
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 130,
      sortable: true,
      render: (value: MockIdleResource['department']) => value?.name || '-'
    },
    {
      id: 'position',
      label: 'Position',
      minWidth: 150,
      sortable: true
    },
    {
      id: 'skillSet',
      label: 'Skills',
      minWidth: 200,
      sortable: false,
      render: (value: string) => (
        <Tooltip title={value || 'No skills listed'}>
          <Typography variant="body2" noWrap>
            {value || '-'}
          </Typography>
        </Tooltip>
      )
    },
    {
      id: 'idleFrom',
      label: 'Idle From',
      minWidth: 120,
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 110,
      sortable: true,
      render: (value: string) => (
        <Chip
          label={value}
          size="small"
          color={
            value === 'idle' ? 'default' :
            value === 'processing' ? 'warning' :
            value === 'assigned' ? 'success' : 'error'
          }
        />
      )
    },
    {
      id: 'rate',
      label: 'Rate (JPY/h)',
      minWidth: 120,
      sortable: true,
      render: (value: number) => value ? `¥${value.toLocaleString()}` : '-'
    },
    {
      id: 'cvFilesCount',
      label: 'CV',
      minWidth: 80,
      sortable: false,
      render: (value: number) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {value > 0 ? (
            <Tooltip title={`${value} CV file(s)`}>
              <FileIcon color="primary" fontSize="small" />
            </Tooltip>
          ) : (
            <Tooltip title="No CV file">
              <FileIcon color="disabled" fontSize="small" />
            </Tooltip>
          )}
        </Box>
      )
    }
  ];

  // Event handlers - All with TODO comments for business logic implementation
  const handleSearch = useCallback(() => {
    // TODO: Implement API call to search resources with current filters
    // TODO: Add debouncing for search input
    // TODO: Handle search errors and show user feedback
    // TODO: Update URL parameters for shareable search results
    console.log('Search filters:', searchFilters);
  }, [searchFilters]);

  const handleReset = useCallback(() => {
    // TODO: Reset all filters and reload original data
    // TODO: Clear URL parameters
    setSearchFilters({
      search: '',
      departmentId: 'all',
      status: 'all',
      urgentOnly: false
    });
  }, []);

  const handleAddNew = useCallback(() => {
    // TODO: Navigate to resource detail page in create mode
    // TODO: Check user permissions for creating resources
    console.log('Navigate to create new resource');
  }, []);

  const handleEdit = useCallback((id: number) => {
    // TODO: Navigate to resource detail page in edit mode
    // TODO: Check user permissions for editing this resource
    console.log('Edit resource:', id);
  }, []);

  const handleDelete = useCallback((id: number) => {
    // TODO: Check user permissions for deleting this resource
    // TODO: Check for dependencies (CV files, history)
    setDeleteDialogOpen(true);
    console.log('Delete resource:', id);
  }, []);

  const handleBulkDelete = useCallback(() => {
    // TODO: Check user permissions for each selected resource
    // TODO: Validate bulk deletion constraints
    if (selectedRows.length === 0) return;
    setBulkDeleteDialogOpen(true);
  }, [selectedRows]);

  const handleImport = useCallback(() => {
    // TODO: Open file picker for Excel import
    // TODO: Validate file format and size
    // TODO: Show import progress dialog
    // TODO: Handle import results and errors
    console.log('Import Excel file');
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Apply current filters to export
    // TODO: Generate Excel file with filtered data
    // TODO: Download file with proper filename
    // TODO: Show export progress for large datasets
    console.log('Export to Excel with filters:', searchFilters);
  }, [searchFilters]);

  const handleColumnSettings = useCallback(() => {
    // TODO: Open column visibility/ordering dialog
    // TODO: Save user preferences for column layout
    console.log('Open column settings');
  }, []);

  const confirmDelete = useCallback(() => {
    // TODO: Implement actual delete API call
    // TODO: Show success/error message
    // TODO: Refresh data grid
    setDeleteDialogOpen(false);
    console.log('Confirmed delete');
  }, []);

  const confirmBulkDelete = useCallback(() => {
    // TODO: Implement bulk delete API call
    // TODO: Handle partial failures
    // TODO: Show detailed results
    // TODO: Refresh data grid
    setBulkDeleteDialogOpen(false);
    setSelectedRows([]);
    console.log('Confirmed bulk delete:', selectedRows);
  }, [selectedRows]);

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Page Header */}
        <Typography variant="h4" gutterBottom>
          Idle Resource Management
        </Typography>

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Search & Filters" />
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              label="Search"
              placeholder="Search by name, code, or skills..."
              value={searchFilters.search}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, search: e.target.value }))}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={searchFilters.departmentId}
                label="Department"
                onChange={(e) => setSearchFilters(prev => ({ ...prev, departmentId: e.target.value }))}
              >
                <MenuItem value="all">All Departments</MenuItem>
                {MOCK_DEPARTMENTS.map(dept => (
                  <MenuItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={searchFilters.status}
                label="Status"
                onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              color="primary"
            >
              Add New Resource
            </Button>

            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              disabled={selectedRows.length === 0}
              color="error"
            >
              Delete Selected ({selectedRows.length})
            </Button>

            <Button
              variant="outlined"
              startIcon={<ImportIcon />}
              onClick={handleImport}
            >
              Import Excel
            </Button>

            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExport}
            >
              Export Data
            </Button>

            <IconButton onClick={handleColumnSettings} title="Column Settings">
              <SettingsIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid<MockIdleResource>
              columns={columns}
              rows={resources}
              loading={loading}
              title="Idle Resources"
              subtitle={`${resources.length} resources found`}
              selection={{
                selected: selectedRows.map(String),
                onSelectionChange: (selected: string[]) => setSelectedRows(selected.map(Number)),
                getRowId: (row: MockIdleResource) => String(row.id)
              }}
              actions={{
                onEdit: (row: MockIdleResource) => handleEdit(row.id),
                onDelete: (row: MockIdleResource) => handleDelete(row.id),
                onView: (row: MockIdleResource) => handleEdit(row.id)
              }}
              pagination={{
                page: 1,
                rowsPerPage: 20,
                total: resources.length,
                onPageChange: (page: number) => {
                  // TODO: Implement pagination API call
                  console.log('Page changed to:', page);
                },
                onRowsPerPageChange: (rowsPerPage: number) => {
                  // TODO: Implement page size change API call
                  console.log('Page size changed to:', rowsPerPage);
                }
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Urgent Resources Alert */}
      {resources.some(r => r.isUrgent) && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {resources.filter(r => r.isUrgent).length} resource(s) have been idle for more than 2 months and require attention.
          </Typography>
        </Alert>
      )}

      {/* Delete Confirmation Dialogs */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmDialog
        open={bulkDeleteDialogOpen}
        title="Bulk Delete Resources"
        message={`Are you sure you want to delete ${selectedRows.length} selected resource(s)? This action cannot be undone.`}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteDialogOpen(false)}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </Box>
    </DashboardLayout>
  );
}
