'use client';

import React, { useState, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import { ResourceFilters } from './ResourceFilters';
import { ResourceActions } from './ResourceActions';
import { ResourceDataGrid } from './ResourceDataGrid';
import { ResourceStatus } from '@/lib/types';

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
  // Mock data for UI display
  const mockResources = [
    {
      id: 1,
      employeeCode: 'EMP001',
      fullName: 'Nguyen Van A',
      department: { id: 1, name: 'Information Technology', code: 'IT' },
      position: 'Senior Developer',
      email: 'nguyen.van.a@company.com',
      skillSet: 'Java, Spring Boot, React, MySQL',
      idleFrom: '2024-01-15',
      idleTo: undefined,
      status: ResourceStatus.IDLE,
      rate: 50,
      processNote: 'Available for new projects',
      isUrgent: true,
      cvFilesCount: 2,
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
    },
    {
      id: 2,
      employeeCode: 'EMP002',
      fullName: 'Tran Thi B',
      department: { id: 2, name: 'Human Resources', code: 'HR' },
      position: 'Business Analyst',
      email: 'tran.thi.b@company.com',
      skillSet: 'Business Analysis, Requirement Gathering, Jira',
      idleFrom: '2024-02-20',
      idleTo: undefined,
      status: ResourceStatus.IDLE,
      rate: 40,
      processNote: undefined,
      isUrgent: false,
      cvFilesCount: 1,
      createdAt: '2024-02-20T09:15:00Z',
      updatedAt: '2024-02-25T14:45:00Z',
    },
    {
      id: 3,
      employeeCode: 'EMP003',
      fullName: 'Le Van C',
      department: { id: 1, name: 'Information Technology', code: 'IT' },
      position: 'QA Engineer',
      email: 'le.van.c@company.com',
      skillSet: 'Manual Testing, Automation Testing, Selenium',
      idleFrom: '2024-03-10',
      idleTo: undefined,
      status: ResourceStatus.PROCESSING,
      rate: 35,
      processNote: 'Interview scheduled',
      isUrgent: false,
      cvFilesCount: 1,
      createdAt: '2024-03-10T11:20:00Z',
      updatedAt: '2024-03-15T16:10:00Z',
    },
    {
      id: 4,
      employeeCode: 'EMP004',
      fullName: 'Pham Thi D',
      department: { id: 3, name: 'Marketing', code: 'MKT' },
      position: 'UI/UX Designer',
      email: 'pham.thi.d@company.com',
      skillSet: 'Figma, Adobe XD, Photoshop, User Research',
      idleFrom: '2023-11-05',
      idleTo: undefined,
      status: ResourceStatus.IDLE,
      rate: 45,
      processNote: 'Long-term idle',
      isUrgent: true,
      cvFilesCount: 3,
      createdAt: '2023-11-05T13:30:00Z',
      updatedAt: '2024-01-10T09:25:00Z',
    },
    {
      id: 5,
      employeeCode: 'EMP005',
      fullName: 'Hoang Van E',
      department: { id: 1, name: 'Information Technology', code: 'IT' },
      position: 'Project Manager',
      email: 'hoang.van.e@company.com',
      skillSet: 'Agile, Scrum, Project Management, Leadership',
      idleFrom: '2024-01-25',
      idleTo: undefined,
      status: ResourceStatus.ASSIGNED,
      rate: 60,
      processNote: 'Assigned to Project Alpha',
      isUrgent: false,
      cvFilesCount: 0,
      createdAt: '2024-01-25T07:45:00Z',
      updatedAt: '2024-02-01T12:15:00Z',
    }
  ];

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

  // Event Handlers with TODO comments for business logic implementation
  const handleFiltersChange = useCallback((newFilters: any) => {
    // TODO: Apply filters to API query
    // TODO: Reset pagination to first page
    // TODO: Update URL query parameters
    // TODO: Call backend API with filter parameters
    console.log('Applying filters:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters, page: 0 }));
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleClearFilters = useCallback(() => {
    // TODO: Reset all filters to default values
    // TODO: Clear URL query parameters
    // TODO: Reload data with default parameters
    console.log('Clearing all filters');
    setFilters({
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
  }, []);

  const handleRefresh = useCallback(() => {
    // TODO: Reload data from API
    // TODO: Maintain current filters and pagination
    // TODO: Show refresh loading state
    console.log('Refreshing data');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

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
    // TODO: Update pagination state
    // TODO: Call API with new page parameters
    // TODO: Maintain current filters and sorting
    console.log('Page changed to:', newPage);
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Update page size state
    // TODO: Reset to first page
    // TODO: Call API with new page size
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log('Rows per page changed to:', newRowsPerPage);
    setFilters(prev => ({ ...prev, rowsPerPage: newRowsPerPage, page: 0 }));
  }, []);

  const handleSortChange = useCallback((field: string, direction: 'asc' | 'desc') => {
    // TODO: Update sort state
    // TODO: Call API with new sort parameters
    // TODO: Maintain current filters and pagination
    console.log('Sort changed:', field, direction);
    setFilters(prev => ({ ...prev, sortField: field, sortDirection: direction }));
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

  // Apply filters to mock data for UI demonstration
  const filteredData = React.useMemo(() => {
    let filtered = [...mockResources];
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.fullName.toLowerCase().includes(searchLower) ||
        resource.employeeCode.toLowerCase().includes(searchLower) ||
        resource.skillSet?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.departmentId) {
      filtered = filtered.filter(resource => 
        resource.department.id.toString() === filters.departmentId
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(resource => resource.status === filters.status);
    }
    
    if (filters.urgentOnly) {
      filtered = filtered.filter(resource => resource.isUrgent);
    }
    
    return filtered;
  }, [filters]);

  const totalCount = filteredData.length;
  const paginatedData = filteredData.slice(
    filters.page * filters.rowsPerPage,
    (filters.page + 1) * filters.rowsPerPage
  );

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

      {/* Data Grid Section */}
      <Card>
        <CardContent className="p-0">
          {/* Header */}
          <Box className="p-4 border-b border-gray-200">
            <Typography variant="h6" className="text-gray-700 font-semibold">
              Idle Resources ({totalCount} total)
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {selectedRows.length > 0 && `${selectedRows.length} selected • `}
              Showing {paginatedData.length} of {totalCount} resources
            </Typography>
          </Box>

          {/* Alert for urgent resources */}
          {filteredData.some(r => r.isUrgent) && (
            <Alert severity="warning" className="m-4">
              {filteredData.filter(r => r.isUrgent).length} resource(s) have been idle for 2+ months and require attention.
            </Alert>
          )}

          {/* Data Grid */}
          <ResourceDataGrid
            data={paginatedData}
            loading={loading}
            totalCount={totalCount}
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
        </CardContent>
      </Card>
    </Box>
  );
}
