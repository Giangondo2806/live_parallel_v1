'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Delete,
  Download,
  Upload,
  MoreVert,
  Settings,
  Refresh,
  FileDownload,
  FileUpload
} from '@mui/icons-material';

interface ResourceActionsProps {
  selectedIds: number[];
  onRefresh: () => void;
  onAddNew: () => void;
  onBulkDelete: (ids: number[]) => void;
  onExport: (format: 'excel' | 'csv') => void;
  onImport: (file: File) => void;
  onColumnSettings: () => void;
  isLoading?: boolean;
}

export function ResourceActions({
  selectedIds,
  onRefresh,
  onAddNew,
  onBulkDelete,
  onExport,
  onImport,
  onColumnSettings,
  isLoading = false
}: ResourceActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExportAnchorEl(null);
  };

  const handleBulkDelete = () => {
    // TODO: Implement bulk delete confirmation
    // TODO: Show confirmation dialog with resource details
    // TODO: Handle deletion errors gracefully
    // TODO: Update UI after successful deletion
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Call API for bulk delete
    // TODO: Show loading state
    // TODO: Handle errors and show toast notifications
    onBulkDelete(selectedIds);
    setDeleteDialogOpen(false);
  };

  const handleExport = (format: 'excel' | 'csv') => {
    // TODO: Apply current filters to export
    // TODO: Show progress indicator for large exports
    // TODO: Download file automatically
    // TODO: Handle export errors
    onExport(format);
    handleClose();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Validate file format and size
      // TODO: Show import progress
      // TODO: Handle import errors and validation messages
      // TODO: Refresh grid after successful import
      onImport(file);
      setImportDialogOpen(false);
    }
  };

  const handleRefresh = () => {
    // TODO: Clear cache and reload data
    // TODO: Maintain current filters and pagination
    // TODO: Show refresh loading state
    onRefresh();
  };

  return (
    <Box className="mb-4">
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        {/* Primary Actions */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddNew}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add New Resource
          </Button>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>

          {selectedIds.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </Stack>

        {/* Secondary Actions */}
        <Stack direction="row" spacing={1}>
          <Tooltip title="Export Data">
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportClick}
            >
              Export
            </Button>
          </Tooltip>

          <Tooltip title="Import Data">
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => setImportDialogOpen(true)}
            >
              Import
            </Button>
          </Tooltip>

          <Tooltip title="Column Settings">
            <IconButton onClick={onColumnSettings}>
              <Settings />
            </IconButton>
          </Tooltip>

          <Tooltip title="More Actions">
            <IconButton onClick={handleMoreClick}>
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Loading Progress */}
      {isLoading && (
        <Box className="mt-2">
          <LinearProgress />
        </Box>
      )}

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleExport('excel')}>
          <ListItemIcon>
            <FileDownload />
          </ListItemIcon>
          <ListItemText>Export to Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <FileDownload />
          </ListItemIcon>
          <ListItemText>Export to CSV</ListItemText>
        </MenuItem>
      </Menu>

      {/* More Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={onColumnSettings}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText>Column Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setImportDialogOpen(true)}>
          <ListItemIcon>
            <FileUpload />
          </ListItemIcon>
          <ListItemText>Import from Excel</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedIds.length} selected resource{selectedIds.length > 1 ? 's' : ''}?
          </Typography>
          <Typography variant="body2" className="text-gray-600 mt-2">
            This action cannot be undone. All associated CV files and history will be archived.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
        <DialogTitle>Import Resources from Excel</DialogTitle>
        <DialogContent>
          <Typography className="mb-4">
            Upload an Excel file (.xlsx, .xls) to import multiple resources at once.
          </Typography>
          <Box>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFile}
              style={{ display: 'none' }}
              id="import-file-input"
            />
            <label htmlFor="import-file-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<FileUpload />}
                fullWidth
              >
                Select Excel File
              </Button>
            </label>
          </Box>
          <Typography variant="body2" className="text-gray-600 mt-2">
            Make sure your Excel file follows the template format with columns:
            Employee Code, Full Name, Department, Position, Skills, Idle From, etc.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
