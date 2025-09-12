'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Typography,
  TableSortLabel
} from '@mui/material';
import {
  Edit,
  Delete,
  Download,
  Warning,
  Person,
  MoreVert,
  Visibility,
  FilePresent
} from '@mui/icons-material';
import { ResourceStatus } from '@/lib/types';

interface IdleResource {
  id: number;
  employeeCode: string;
  fullName: string;
  department: {
    id: number;
    name: string;
    code: string;
  };
  position: string;
  email?: string;
  skillSet?: string;
  idleFrom: string;
  idleTo?: string;
  status: ResourceStatus;
  rate?: number;
  processNote?: string;
  isUrgent: boolean;
  cvFilesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ResourceDataGridProps {
  data: IdleResource[];
  loading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  onRowSelectionChange: (selectedIds: number[]) => void;
  onRowEdit: (id: number) => void;
  onRowDelete: (id: number) => void;
  onRowView: (id: number) => void;
  onCVDownload: (id: number) => void;
  selectedRows: number[];
  visibleColumns: string[];
}

export function ResourceDataGrid({
  data,
  loading,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onRowSelectionChange,
  onRowEdit,
  onRowDelete,
  onRowView,
  onCVDownload,
  selectedRows,
  visibleColumns
}: ResourceDataGridProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<string>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleMenuAction = (action: string) => {
    if (!selectedRowId) return;
    
    switch (action) {
      case 'view':
        // TODO: Navigate to resource detail view
        onRowView(selectedRowId);
        break;
      case 'edit':
        // TODO: Open edit dialog or navigate to edit page
        onRowEdit(selectedRowId);
        break;
      case 'delete':
        // TODO: Show delete confirmation dialog
        onRowDelete(selectedRowId);
        break;
      case 'download':
        // TODO: Download CV files for resource
        onCVDownload(selectedRowId);
        break;
    }
    handleMenuClose();
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // TODO: Select all visible rows
      const allIds = data.map(row => row.id);
      onRowSelectionChange(allIds);
    } else {
      onRowSelectionChange([]);
    }
  };

  const handleSelectRow = (id: number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    onRowSelectionChange(newSelected);
  };

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSortChange(field, newDirection);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getIdleDuration = (idleFromString: string) => {
    const idleFrom = new Date(idleFromString);
    const now = new Date();
    const diffInMonths = Math.floor((now.getTime() - idleFrom.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
  };

  const isSelected = (id: number) => selectedRows.indexOf(id) !== -1;
  const numSelected = selectedRows.length;
  const rowCount = data.length;

  const renderSkillChips = (skillSet?: string) => {
    if (!skillSet) return '-';
    const skills = skillSet.split(',').slice(0, 3);
    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill.trim()}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
        ))}
        {skillSet.split(',').length > 3 && (
          <Chip
            label={`+${skillSet.split(',').length - 3}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: '20px' }}
          />
        )}
      </Stack>
    );
  };

  const renderStatusChip = (status: ResourceStatus) => {
    const statusColors = {
      [ResourceStatus.IDLE]: 'warning',
      [ResourceStatus.ASSIGNED]: 'success',
      [ResourceStatus.PROCESSING]: 'info',
      [ResourceStatus.UNAVAILABLE]: 'error',
    } as const;

    return (
      <Chip
        label={status.toUpperCase()}
        color={statusColors[status] || 'default'}
        size="small"
      />
    );
  };

  return (
    <Paper elevation={1} className="w-full">
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={handleSelectAll}
                />
              </TableCell>
              
              {visibleColumns.includes('employeeCode') && (
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'employeeCode'}
                    direction={sortField === 'employeeCode' ? sortDirection : 'asc'}
                    onClick={() => handleSort('employeeCode')}
                  >
                    Employee Code
                  </TableSortLabel>
                </TableCell>
              )}
              
              {visibleColumns.includes('fullName') && (
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'fullName'}
                    direction={sortField === 'fullName' ? sortDirection : 'asc'}
                    onClick={() => handleSort('fullName')}
                  >
                    Full Name
                  </TableSortLabel>
                </TableCell>
              )}
              
              {visibleColumns.includes('department') && (
                <TableCell>Department</TableCell>
              )}
              
              {visibleColumns.includes('position') && (
                <TableCell>Position</TableCell>
              )}
              
              {visibleColumns.includes('skillSet') && (
                <TableCell>Skills</TableCell>
              )}
              
              {visibleColumns.includes('idleFrom') && (
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'idleFrom'}
                    direction={sortField === 'idleFrom' ? sortDirection : 'asc'}
                    onClick={() => handleSort('idleFrom')}
                  >
                    Idle From
                  </TableSortLabel>
                </TableCell>
              )}
              
              {visibleColumns.includes('status') && (
                <TableCell>Status</TableCell>
              )}
              
              {visibleColumns.includes('rate') && (
                <TableCell>Rate ($/h)</TableCell>
              )}
              
              {visibleColumns.includes('cvFilesCount') && (
                <TableCell>CV</TableCell>
              )}
              
              {visibleColumns.includes('isUrgent') && (
                <TableCell>Urgent</TableCell>
              )}
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {data.map((row) => {
              const isItemSelected = isSelected(row.id);
              
              return (
                <TableRow
                  key={row.id}
                  hover
                  selected={isItemSelected}
                  className={row.isUrgent ? 'bg-orange-50 border-l-4 border-orange-400' : ''}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                  
                  {visibleColumns.includes('employeeCode') && (
                    <TableCell>{row.employeeCode}</TableCell>
                  )}
                  
                  {visibleColumns.includes('fullName') && (
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Person fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {row.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('department') && (
                    <TableCell>
                      <Chip
                        label={row.department?.code}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('position') && (
                    <TableCell>{row.position}</TableCell>
                  )}
                  
                  {visibleColumns.includes('skillSet') && (
                    <TableCell>{renderSkillChips(row.skillSet)}</TableCell>
                  )}
                  
                  {visibleColumns.includes('idleFrom') && (
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatDate(row.idleFrom)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({getIdleDuration(row.idleFrom)})
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('status') && (
                    <TableCell>{renderStatusChip(row.status)}</TableCell>
                  )}
                  
                  {visibleColumns.includes('rate') && (
                    <TableCell>{row.rate ? `$${row.rate}` : '-'}</TableCell>
                  )}
                  
                  {visibleColumns.includes('cvFilesCount') && (
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {row.cvFilesCount > 0 ? (
                          <Tooltip title={`${row.cvFilesCount} CV file${row.cvFilesCount > 1 ? 's' : ''}`}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCVDownload(row.id);
                              }}
                            >
                              <FilePresent fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No CV
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  )}
                  
                  {visibleColumns.includes('isUrgent') && (
                    <TableCell>
                      {row.isUrgent && (
                        <Tooltip title="Idle for 2+ months">
                          <Warning color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                  
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => onRowView(row.id)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onRowEdit(row.id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuClick(e, row.id)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Resource</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('download')}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download CV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Resource</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
