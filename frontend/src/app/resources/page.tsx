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

  // Data Grid columns definition with search highlighting for T-S03-002
  const columns: DataGridColumn<IdleResourceData>[] = [
    {
      id: 'employeeCode',
      label: 'Employee Code',
      minWidth: 120,
      sortable: true,
      render: (value: string, row: IdleResourceData) => (
        <Typography 
          variant="body2" 
          dangerouslySetInnerHTML={{
            __html: row.searchHighlight?.employeeCode || value
          }}
        />
      )
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
          <Typography 
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: row.searchHighlight?.fullName || value
            }}
          />
          {row.searchRelevance && row.searchRelevance > 80 && (
            <Chip 
              label={`${row.searchRelevance}%`}
              size="small"
              color="primary"
              sx={{ fontSize: '0.7rem', height: '16px' }}
            />
          )}
        </Box>
      )
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 130,
      sortable: true,
      render: (value: IdleResourceData['department'], row: IdleResourceData) => (
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: row.searchHighlight?.department || value?.name || '-'
          }}
        />
      )
    },
    {
      id: 'position',
      label: 'Position',
      minWidth: 150,
      sortable: true,
      render: (value: string, row: IdleResourceData) => (
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: row.searchHighlight?.position || value
          }}
        />
      )
    },
    {
      id: 'skillSet',
      label: 'Skills',
      minWidth: 200,
      sortable: false,
      render: (value: string, row: IdleResourceData) => (
        <Tooltip title={value || 'No skills listed'}>
          <Typography 
            variant="body2" 
            noWrap
            dangerouslySetInnerHTML={{
              __html: row.searchHighlight?.skillSet || value || '-'
            }}
          />
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

  // Enhanced loadResourceList to support both search and regular loading
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

      // Use search endpoint if there's search text, otherwise use regular endpoint
      const response = params.search && params.search.trim()
        ? await idleResourcesService.searchIdleResources(params)
        : await idleResourcesService.getIdleResources(params);
      
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

  // Enhanced search functionality for T-S03-002
  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPage(1); // Reset to first page for new search

      const searchParams = {
        ...searchFilters,
        page: 1,
        pageSize
      };

      // Use search endpoint for advanced search with highlighting
      const response = searchFilters.search && searchFilters.search.trim()
        ? await idleResourcesService.searchIdleResources(searchParams)
        : await idleResourcesService.getIdleResources(searchParams);
      
      setResources(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
      setPageSize(response.pageSize);
      
    } catch (err) {
      console.error('Failed to search resources:', err);
      setError('Failed to search idle resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchFilters, pageSize]);

  const handleReset = useCallback(async () => {
    // Clear all search filters and reload data
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
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await idleResourcesService.getIdleResources({
        page: 1,
        pageSize: 20,
        sortBy: 'updatedAt',
        sortOrder: 'DESC'
      });
      
      setResources(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
      setPageSize(response.pageSize);
      
    } catch (err) {
      console.error('Failed to reset and load resources:', err);
      setError('Failed to load idle resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSort = useCallback(async (column: string, direction: 'ASC' | 'DESC') => {
    const newFilters = {
      ...searchFilters,
      sortBy: column,
      sortOrder: direction,
      page: 1 // Reset to first page when sorting
    };
    
    setSearchFilters(newFilters);
    setPage(1);
    
    try {
      setLoading(true);
      setError(null);
      
      // Use search endpoint if there's a search term, otherwise use regular endpoint
      const response = newFilters.search && newFilters.search.trim()
        ? await idleResourcesService.searchIdleResources(newFilters)
        : await idleResourcesService.getIdleResources(newFilters);
      
      setResources(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
      
    } catch (err) {
      console.error('Failed to sort resources:', err);
      setError('Failed to sort idle resources. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchFilters]);

  // Enhanced page change handler for T-S03-002
  const handlePageChange = useCallback(async (newPage: number) => {
    setPage(newPage);
    
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...searchFilters,
        page: newPage,
        pageSize
      };

      // Use search endpoint if there's search text, otherwise use regular endpoint
      const response = params.search && params.search.trim()
        ? await idleResourcesService.searchIdleResources(params)
        : await idleResourcesService.getIdleResources(params);
      
      setResources(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
      
    } catch (err) {
      console.error('Failed to change page:', err);
      setError('Failed to load page. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchFilters, pageSize]);

  // Initial data load
  useEffect(() => {
    loadResourceList();
  }, [loadResourceList]);

  // Debounced search effect for T-S03-002
  useEffect(() => {
    const searchTerm = searchFilters.search;
    if (!searchTerm || searchTerm.trim() === '') {
      return; // Don't auto-search for empty terms
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [searchFilters.search]); // Only trigger on search text change

  // Auto-refresh effect for filters (department, status, urgent)
  useEffect(() => {
    if (searchFilters.departmentId !== undefined || 
        searchFilters.status !== undefined || 
        searchFilters.urgent !== false) {
      handleSearch();
    }
  }, [searchFilters.departmentId, searchFilters.status, searchFilters.urgent]);

  // Event handlers for various actions
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

  const handleExport = useCallback(() => {
    // TODO: Implement Excel export functionality
    console.log('Export resources to Excel');
  }, []);

  const handleImport = useCallback(() => {
    // TODO: Implement Excel import functionality
    console.log('Import resources from Excel');
  }, []);

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
                >
                  Import
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  onClick={handleExport}
                  size="small"
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNew}
                  size="small"
                >
                  Add New
                </Button>
              </Stack>
            }
          />
          
          <CardContent>
            {/* Enhanced Search and Filter Section - T-S03-002 */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <TextField
                  label="Search..."
                  placeholder="Search by name, employee code, skills, position, or department"
                  value={searchFilters.search || ''}
                  onChange={(e) => {
                    setSearchFilters(prev => ({ ...prev, search: e.target.value }));
                    // Auto-search with debouncing will be handled by useEffect
                  }}
                  sx={{ minWidth: 350 }}
                  size="small"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
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

                {/* Advanced Search Actions */}
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  size="small"
                  disabled={loading}
                >
                  Search
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                  size="small"
                  disabled={loading}
                >
                  Reset
                </Button>
              </Stack>

              {/* Additional Filters Row */}
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Button
                  variant={searchFilters.urgent ? "contained" : "outlined"}
                  onClick={() => setSearchFilters(prev => ({ ...prev, urgent: !prev.urgent }))}
                  size="small"
                  startIcon={<WarningIcon />}
                  color={searchFilters.urgent ? "warning" : "primary"}
                >
                  Urgent Only
                </Button>

                {/* Search Results Summary */}
                {total > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {searchFilters.search && searchFilters.search.trim() 
                      ? `Found ${total} results for "${searchFilters.search.trim()}"` 
                      : `Showing ${total} resources`}
                  </Typography>
                )}
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
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                pagination={{
                  page: page - 1, // Convert to 0-based for Material-UI
                  rowsPerPage: pageSize,
                  total: total,
                  onPageChange: (newPage: number) => handlePageChange(newPage + 1), // Convert back to 1-based
                  onRowsPerPageChange: (newPageSize: number) => {
                    setPageSize(newPageSize);
                    setPage(1);
                    loadResourceList({ pageSize: newPageSize, page: 1 });
                  }
                }}
                selection={{
                  selected: selectedRows.map(id => id.toString()),
                  onSelectionChange: (selected: string[]) => {
                    setSelectedRows(selected.map(id => parseInt(id)));
                  },
                  getRowId: (row: IdleResourceData) => row.id.toString()
                }}
                sorting={{
                  field: searchFilters.sortBy as keyof IdleResourceData || 'updatedAt',
                  direction: (searchFilters.sortOrder?.toLowerCase() as 'asc' | 'desc') || 'desc',
                  onSort: (field: keyof IdleResourceData) => {
                    const currentDirection = searchFilters.sortOrder || 'DESC';
                    const newDirection = currentDirection === 'DESC' ? 'ASC' : 'DESC';
                    handleSort(field as string, newDirection);
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Resource"
          message="Are you sure you want to delete this resource? This action cannot be undone."
          onConfirm={() => {
            // TODO: Implement actual delete logic
            setDeleteDialogOpen(false);
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />

        {/* Bulk Delete Confirmation Dialog */}
        <ConfirmDialog
          open={bulkDeleteDialogOpen}
          title="Delete Multiple Resources"
          message={`Are you sure you want to delete ${selectedRows.length} selected resources? This action cannot be undone.`}
          onConfirm={() => {
            // TODO: Implement actual bulk delete logic
            setBulkDeleteDialogOpen(false);
          }}
          onCancel={() => setBulkDeleteDialogOpen(false)}
        />
      </Box>
    </DashboardLayout>
  );
}
