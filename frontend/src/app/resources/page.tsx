'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
import { ImportDialog } from '../../components/resources/ImportDialog';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { 
  idleResourcesService, 
  IdleResourceData, 
  PaginatedIdleResourceResponse,
  ResourceSearchParams
} from '../../lib/services/idle-resources.service';

interface MockDepartment {
  id: number;
  name: string;
  code: string;
}

interface StatusOption {
  value: string;
  label: string;
}

// Mock data for departments (will be loaded from API later)
const MOCK_DEPARTMENTS: MockDepartment[] = [
  { id: 1, name: 'IT Department', code: 'IT' },
  { id: 2, name: 'QA Department', code: 'QA' },
  { id: 3, name: 'Design', code: 'DES' },
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
  const [resources, setResources] = useState<IdleResourceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  // Search filters
  const [searchFilters, setSearchFilters] = useState<ResourceSearchParams>({
    search: '',
    departmentId: undefined,
    status: undefined,
    urgent: false,
    page: 1,
    pageSize: 20,
    sortBy: 'updatedAt',
    sortOrder: 'DESC'
  });

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState<boolean>(false);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);

  // Data Grid columns definition
  const columns: DataGridColumn<IdleResourceData>[] = [
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
      render: (value: string, row: IdleResourceData) => (
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
      render: (value: IdleResourceData['department']) => value?.name || '-'
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

  // Load resources from API
  const loadResourceList = useCallback(async (searchParams: ResourceSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...searchFilters,
        ...searchParams,
        page,
        pageSize
      };

      const response = await idleResourcesService.getIdleResources(params);
      
      setResources(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
      setPageSize(response.pageSize);
      
    } catch (err) {
      console.error('Failed to load resources:', err);
      setError('Failed to load idle resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchFilters, page, pageSize]);

  // Initial data load
  useEffect(() => {
    loadResourceList();
  }, [loadResourceList]);

  // Event handlers
  const handleSearch = useCallback(() => {
    setPage(1);
    loadResourceList();
  }, [loadResourceList]);

  const handleReset = useCallback(() => {
    setSearchFilters({
      search: '',
      departmentId: undefined,
      status: undefined,
      urgent: false,
      page: 1,
      pageSize: 20,
      sortBy: 'updatedAt',
      sortOrder: 'DESC'
    });
    setPage(1);
    loadResourceList();
  }, [loadResourceList]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    loadResourceList();
  }, [loadResourceList]);

  const handleSort = useCallback((column: string, direction: 'ASC' | 'DESC') => {
    setSearchFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: direction
    }));
    loadResourceList();
  }, [loadResourceList]);

  const handleRefresh = useCallback(() => {
    loadResourceList();
  }, [loadResourceList]);

  const handleAddNew = useCallback(() => {
    // TODO: Navigate to add new resource form
    console.log('Navigate to add new resource');
  }, []);

  const handleDelete = useCallback(() => {
    // TODO: Implement delete confirmation and API call
    setDeleteDialogOpen(true);
  }, []);

  const handleBulkDelete = useCallback(() => {
    // TODO: Implement bulk delete confirmation and API call
    setBulkDeleteDialogOpen(true);
  }, []);

  const handleExport = useCallback(async () => {
    console.log('Export button clicked');
    try {
      setLoading(true);
      setError(null);

      // Use current search filters for export
      const exportParams = {
        ...searchFilters,
        page: undefined, // Export all pages
        pageSize: undefined
      };

      console.log('Export params:', exportParams);

      const blob = await idleResourcesService.exportIdleResources(exportParams);
      console.log('Export blob received:', blob);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `idle-resources-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Export completed successfully');
      
    } catch (error) {
      console.error('Export failed:', error);
      setError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [searchFilters]);

  const handleImport = useCallback(() => {
    console.log('Opening import dialog...');
    setImportDialogOpen(true);
  }, []);

  const handleImportComplete = useCallback(async (result: any) => {
    console.log('Import completed with result:', result);
    
    // Show success message with details
    if (result.successCount > 0) {
      setError(null);
      // Refresh the resource list to show imported data
      await loadResourceList();
      
      // Show success message (you can add a success state if needed)
      console.log(`Successfully imported ${result.successCount} resources`);
    }
    
    if (result.errorCount > 0) {
      const errorMessage = `Import completed with ${result.errorCount} errors. Check console for details.`;
      setError(errorMessage);
      console.error('Import errors:', result.errors);
    }
  }, [loadResourceList]);

  const handleImportDialogClose = useCallback(() => {
    console.log('Closing import dialog...');
    setImportDialogOpen(false);
  }, []);

  const validateExcelFile = useCallback((file: File): boolean => {
    // Check file extension
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      setError('Invalid file format. Please select an Excel file (.xlsx or .xls)');
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit');
      return false;
    }

    return true;
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateExcelFile(file)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await idleResourcesService.importIdleResources(file);
      
      // Handle import results
      console.log('Import result:', result);
      
      // Refresh resource list after successful import
      if (result.successCount > 0) {
        await loadResourceList();
      }
      
    } catch (error) {
      console.error('Import failed:', error);
      setError(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  }, [validateExcelFile, loadResourceList]);

  const handleRowSelect = useCallback((rowId: number) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === resources.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(resources.map(r => r.id));
    }
  }, [selectedRows.length, resources]);

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Card>
          <CardHeader
            title="Idle Resource Management"
            action={
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<ImportIcon />}
                  onClick={handleImport}
                  size="small"
                  disabled={loading}
                >
                  Import
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  onClick={handleExport}
                  size="small"
                  disabled={loading}
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNew}
                  size="small"
                  disabled={loading}
                >
                  Add New
                </Button>
              </Stack>
            }
          />
          
          <CardContent>
            {/* Search and Filter Section */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Search..."
                  placeholder="Search by name, employee code, or skills"
                  value={searchFilters.search || ''}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, search: e.target.value }))}
                  sx={{ minWidth: 300 }}
                  size="small"
                />
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={searchFilters.departmentId || 'all'}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      departmentId: e.target.value === 'all' ? undefined : Number(e.target.value)
                    }))}
                    label="Department"
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    {MOCK_DEPARTMENTS.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={searchFilters.status || 'all'}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      status: e.target.value === 'all' ? undefined : e.target.value 
                    }))}
                    label="Status"
                  >
                    {STATUS_OPTIONS.map((option) => (
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
                
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Stack>
            </Stack>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Action Buttons */}
            {selectedRows.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  Delete Selected ({selectedRows.length})
                </Button>
              </Stack>
            )}

            {/* Data Grid */}
            <Box sx={{ position: 'relative', minHeight: loading ? 200 : 'auto' }}>
              {loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              
              <DataGrid
                columns={columns}
                rows={resources}
                loading={loading}
                selection={{
                  selected: selectedRows.map(String),
                  onSelectionChange: (selected: string[]) => setSelectedRows(selected.map(Number)),
                  getRowId: (row: IdleResourceData) => String(row.id)
                }}
                sorting={{
                  field: searchFilters.sortBy as keyof IdleResourceData,
                  direction: searchFilters.sortOrder === 'ASC' ? 'asc' : 'desc',
                  onSort: (field: keyof IdleResourceData) => {
                    const direction = searchFilters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
                    handleSort(String(field), direction);
                  }
                }}
                pagination={{
                  page: page - 1, // DataGrid expects 0-based page
                  rowsPerPage: pageSize,
                  total,
                  onPageChange: (newPage: number) => handlePageChange(newPage + 1), // Convert back to 1-based
                  onRowsPerPageChange: (newPageSize: number) => {
                    setPageSize(newPageSize);
                    setPage(1);
                    loadResourceList();
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Confirmation Dialogs */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Resource"
          message="Are you sure you want to delete this resource? This action cannot be undone."
          onConfirm={() => {
            // TODO: Implement delete API call
            setDeleteDialogOpen(false);
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />

        <ConfirmDialog
          open={bulkDeleteDialogOpen}
          title="Delete Multiple Resources"
          message={`Are you sure you want to delete ${selectedRows.length} selected resources? This action cannot be undone.`}
          onConfirm={() => {
            // TODO: Implement bulk delete API call
            setBulkDeleteDialogOpen(false);
            setSelectedRows([]);
          }}
          onCancel={() => setBulkDeleteDialogOpen(false)}
        />

        {/* Import Dialog */}
        <ImportDialog
          open={importDialogOpen}
          onClose={handleImportDialogClose}
          onImportComplete={handleImportComplete}
        />
      </Box>
    </DashboardLayout>
  );
}
