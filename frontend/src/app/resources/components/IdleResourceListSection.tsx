'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Alert, CircularProgress } from '@mui/material';
import { ResourceFilters } from './ResourceFilters';
import { ResourceActions } from './ResourceActions';
import { ResourceDataGrid } from './ResourceDataGrid';
import { ResourceStatus, IdleResourceResponse, PaginatedResponse, SearchCriteria } from '@/lib/types';
import { idleResourcesApi } from '@/lib/api';

interface FilterState {
  searchTerm: string;
  departmentId: string;
  status: string;
  position: string;
  urgentOnly: boolean;
  idleFromStart: string;
  idleFromEnd: string;
  page: number;
  rowsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export function IdleResourceListSection() {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    departmentId: '',
    status: '',
    position: '',
    urgentOnly: false,
    idleFromStart: '',
    idleFromEnd: '',
    page: 0,
    rowsPerPage: 10,
    sortField: 'updatedAt',
    sortDirection: 'desc'
  });

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<PaginatedResponse<IdleResourceResponse> | null>(null);
  const [visibleColumns] = useState([
    'employeeCode',
    'fullName', 
    'department',
    'position',
    'skillSet',
    'idleFrom',
    'status',
    'rate',
    'cvFilesCount',
    'isUrgent'
  ]);

  // Load data from API
  const loadData = useCallback(async (searchCriteria?: SearchCriteria) => {
    setLoading(true);
    setError(null);
    
    try {
      const criteria: SearchCriteria = {
        searchTerm: filters.searchTerm || undefined,
        departmentId: filters.departmentId ? parseInt(filters.departmentId) : undefined,
        status: filters.status || undefined,
        position: filters.position || undefined,
        idleFromStart: filters.idleFromStart || undefined,
        idleFromEnd: filters.idleFromEnd || undefined,
        urgentOnly: filters.urgentOnly || undefined,
        page: (filters.page + 1), // Convert from 0-based to 1-based
        limit: filters.rowsPerPage,
        sortBy: filters.sortField,
        sortOrder: filters.sortDirection === 'asc' ? 'ASC' : 'DESC',
        ...searchCriteria
      };

      const response = await idleResourcesApi.getAllWithPagination(criteria);
      setResourceData(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resources');
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Event Handlers with real API integration
  const handleFiltersChange = useCallback((newFilters: any) => {
    console.log('Applying filters:', newFilters);
    setFilters(prev => ({ 
      ...prev, 
      ...newFilters, 
      page: 0 // Reset to first page when filters change
    }));
    setSelectedRows([]); // Clear selections when filters change
  }, []);

  const handleClearFilters = useCallback(() => {
    console.log('Clearing all filters');
    const defaultFilters = {
      searchTerm: '',
      departmentId: '',
      status: '',
      position: '',
      urgentOnly: false,
      idleFromStart: '',
      idleFromEnd: '',
      page: 0,
      rowsPerPage: 10,
      sortField: 'updatedAt',
      sortDirection: 'desc' as const
    };
    setFilters(defaultFilters);
    setSelectedRows([]);
  }, []);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing data');
    loadData();
  }, [loadData]);

  const handleAddNew = useCallback(() => {
    // TODO: Navigate to create new resource page
    // TODO: Open create resource dialog
    // TODO: Clear any existing form data
    console.log('Add new resource');
  }, []);

  const handleBulkDelete = useCallback((ids: number[]) => {
    // TODO: Show confirmation dialog with resource details
    // TODO: Call bulk delete API endpoint
    // TODO: Handle deletion errors gracefully
    // TODO: Refresh grid after successful deletion
    // TODO: Show success/error toast notifications
    console.log('Bulk delete resources:', ids);
  }, []);

  const handleExport = useCallback((format: 'excel' | 'csv') => {
    // TODO: Apply current filters to export
    // TODO: Call export API endpoint
    // TODO: Show export progress indicator
    // TODO: Download generated file
    // TODO: Handle export errors
    console.log('Export data as:', format);
  }, []);

  const handleImport = useCallback((file: File) => {
    // TODO: Validate file format and size
    // TODO: Upload file to import API endpoint
    // TODO: Show import progress indicator
    // TODO: Display import results (success count, errors)
    // TODO: Refresh grid after successful import
    console.log('Import file:', file.name);
  }, []);

  const handleColumnSettings = useCallback(() => {
    // TODO: Open column visibility settings dialog
    // TODO: Allow users to show/hide columns
    // TODO: Save column preferences to user settings
    // TODO: Apply column changes to grid
    console.log('Open column settings');
  }, []);

  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    console.log('Page changed to:', newPage);
    setFilters(prev => ({ ...prev, page: newPage }));
    setSelectedRows([]); // Clear selections when page changes
  }, []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log('Rows per page changed to:', newRowsPerPage);
    setFilters(prev => ({ 
      ...prev, 
      rowsPerPage: newRowsPerPage, 
      page: 0 // Reset to first page when page size changes
    }));
    setSelectedRows([]);
  }, []);

  const handleSortChange = useCallback((field: string, direction: 'asc' | 'desc') => {
    console.log('Sort changed:', field, direction);
    setFilters(prev => ({ 
      ...prev, 
      sortField: field, 
      sortDirection: direction 
    }));
    setSelectedRows([]);
  }, []);

  const handleRowSelectionChange = useCallback((selectedIds: number[]) => {
    // TODO: Update selected rows state
    // TODO: Enable/disable bulk action buttons
    // TODO: Update UI to show selection count
    console.log('Selected rows changed:', selectedIds);
    setSelectedRows(selectedIds);
  }, []);

  const handleRowEdit = useCallback((id: number) => {
    // TODO: Navigate to edit resource page
    // TODO: Open edit resource dialog
    // TODO: Load resource data for editing
    console.log('Edit resource:', id);
  }, []);

  const handleRowDelete = useCallback((id: number) => {
    // TODO: Show delete confirmation dialog
    // TODO: Call delete API endpoint
    // TODO: Handle deletion errors
    // TODO: Refresh grid after successful deletion
    console.log('Delete resource:', id);
  }, []);

  const handleRowView = useCallback((id: number) => {
    // TODO: Navigate to resource detail page
    // TODO: Open resource detail dialog
    // TODO: Load full resource information
    console.log('View resource:', id);
  }, []);

  const handleCVDownload = useCallback((id: number) => {
    // TODO: Call CV download API endpoint
    // TODO: Handle multiple CV files (show selection dialog)
    // TODO: Download files automatically
    // TODO: Handle download errors
    console.log('Download CV for resource:', id);
  }, []);

  return (
    <Box className="space-y-4">
      {/* Filters Section */}
      <ResourceFilters
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        currentFilters={filters}
      />

      {/* Actions Section */}
      <ResourceActions
        selectedIds={selectedRows}
        onRefresh={handleRefresh}
        onAddNew={handleAddNew}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        onImport={handleImport}
        onColumnSettings={handleColumnSettings}
        isLoading={loading}
      />

      {/* Error Display */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Data Grid Section */}
      <Card>
        <CardContent className="p-0">
          {/* Header */}
          <Box className="p-4 border-b border-gray-200">
            <Typography variant="h6" className="text-gray-700 font-semibold">
              Idle Resources ({resourceData?.total || 0} total)
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {selectedRows.length > 0 && `${selectedRows.length} selected • `}
              Showing {resourceData?.data?.length || 0} of {resourceData?.total || 0} resources
            </Typography>
          </Box>

          {/* Alert for urgent resources */}
          {resourceData?.data && resourceData.data.some(r => r.isUrgent) && (
            <Alert severity="warning" className="m-4">
              {resourceData.data.filter(r => r.isUrgent).length} resource(s) have been idle for 2+ months and require attention.
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Box className="flex justify-center items-center p-8">
              <CircularProgress />
            </Box>
          )}

          {/* Data Grid */}
          {!loading && resourceData && resourceData.data.length > 0 && (
            <ResourceDataGrid
              data={resourceData.data}
              loading={loading}
              totalCount={resourceData.total}
              page={filters.page}
              rowsPerPage={filters.rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSortChange={handleSortChange}
              onRowSelectionChange={handleRowSelectionChange}
              onRowEdit={handleRowEdit}
              onRowDelete={handleRowDelete}
              onRowView={handleRowView}
              onCVDownload={handleCVDownload}
              selectedRows={selectedRows}
              visibleColumns={visibleColumns}
            />
          )}

          {/* Empty State */}
          {!loading && resourceData && resourceData.data.length === 0 && (
            <Box className="flex flex-col items-center justify-center p-8 text-gray-500">
              <Typography variant="h6" className="mb-2">
                No resources found
              </Typography>
              <Typography variant="body2">
                Try adjusting your filters or search criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
