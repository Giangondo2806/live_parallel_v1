'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Search, FilterList, Refresh } from '@mui/icons-material';
import { ResourceStatus } from '@/lib/types';

interface ResourceFiltersProps {
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  currentFilters: any;
}

export function ResourceFilters({ onFiltersChange, onClearFilters, currentFilters }: ResourceFiltersProps) {
  // Mock departments data for UI display
  const mockDepartments = [
    { id: 1, name: 'Information Technology', code: 'IT' },
    { id: 2, name: 'Human Resources', code: 'HR' },
    { id: 3, name: 'Marketing', code: 'MKT' },
    { id: 4, name: 'Finance', code: 'FIN' },
    { id: 5, name: 'Operations', code: 'OPS' },
  ];

  const mockPositions = [
    'Senior Developer',
    'Junior Developer',
    'Business Analyst',
    'QA Engineer',
    'Project Manager',
    'Designer',
    'Data Analyst'
  ];

  const statusOptions = Object.values(ResourceStatus);

  const [localFilters, setLocalFilters] = useState({
    searchTerm: '',
    departmentId: '',
    status: '',
    position: '',
    urgentOnly: false,
    idleFromStart: '',
    idleFromEnd: '',
    ...currentFilters
  });

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    
    // TODO: Implement actual filter logic
    // TODO: Apply debounce for search term
    // TODO: Validate date ranges
    // TODO: Call API with new filters
    console.log('Filter changed:', field, value);
  };

  const handleApplyFilters = () => {
    // TODO: Apply filters to data grid
    // TODO: Update URL query parameters
    // TODO: Call API with current filter state
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      departmentId: '',
      status: '',
      position: '',
      urgentOnly: false,
      idleFromStart: '',
      idleFromEnd: '',
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== '' && value !== false && value !== null && value !== undefined
    ).length;
  };

  return (
    <Card className="mb-4">
      <CardContent>
        <Box className="space-y-4">
          {/* Search and Primary Filters Row */}
          <Box className="flex flex-wrap gap-4">
            {/* Search Term */}
            <Box className="flex-1 min-w-[300px]">
              <TextField
                fullWidth
                label="Search"
                placeholder="Search by name, employee code, or skills..."
                value={localFilters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                InputProps={{
                  startAdornment: <Search className="text-gray-400 mr-2" />
                }}
              />
            </Box>

            {/* Department Filter */}
            <Box className="min-w-[150px]">
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={localFilters.departmentId}
                  label="Department"
                  onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {mockDepartments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Status Filter */}
            <Box className="min-w-[120px]">
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={localFilters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Position Filter */}
            <Box className="min-w-[150px]">
              <FormControl fullWidth>
                <InputLabel>Position</InputLabel>
                <Select
                  value={localFilters.position}
                  label="Position"
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                >
                  <MenuItem value="">All Positions</MenuItem>
                  {mockPositions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Secondary Filters Row */}
          <Box className="flex flex-wrap gap-4 items-center">
            {/* Urgent Only Checkbox */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localFilters.urgentOnly}
                    onChange={(e) => handleFilterChange('urgentOnly', e.target.checked)}
                    color="warning"
                  />
                }
                label="Urgent Only (≥2 months)"
                className="text-sm"
              />
            </Box>

            {/* Date Range Filters */}
            <Box className="min-w-[160px]">
              <TextField
                fullWidth
                type="date"
                label="Idle From (Start)"
                value={localFilters.idleFromStart}
                onChange={(e) => handleFilterChange('idleFromStart', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box className="min-w-[160px]">
              <TextField
                fullWidth
                type="date"
                label="Idle From (End)"
                value={localFilters.idleFromEnd}
                onChange={(e) => handleFilterChange('idleFromEnd', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Action Buttons */}
            <Box className="flex-1 min-w-[300px]">
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleApplyFilters}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                  {getActiveFiltersCount() > 0 && (
                    <Chip 
                      label={getActiveFiltersCount()} 
                      size="small" 
                      className="ml-2 bg-white text-blue-600"
                    />
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleClearFilters}
                  disabled={getActiveFiltersCount() === 0}
                >
                  Clear Filters
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
