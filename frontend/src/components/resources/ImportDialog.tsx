'use client';

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Link
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { idleResourcesService } from '../../lib/services/idle-resources.service';

interface ImportResult {
  successCount: number;
  errorCount: number;
  errors: string[];
  totalProcessed: number;
}

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImportComplete?: (result: ImportResult) => void;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onClose,
  onImportComplete
}) => {
  console.log('ImportDialog render:', { open });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return 'Invalid file format. Please select an Excel file (.xlsx or .xls)';
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'File size exceeds 10MB limit';
    }

    return null;
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select triggered');
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.size);

    const validationError = validateFile(file);
    if (validationError) {
      console.error('File validation error:', validationError);
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setImportResult(null);
  }, [validateFile]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      console.log('No file selected for upload');
      return;
    }

    console.log('Starting upload:', selectedFile.name);
    setUploading(true);
    setError(null);

    try {
      const result = await idleResourcesService.importIdleResources(selectedFile);
      console.log('Import result:', result);
      setImportResult(result);
      onImportComplete?.(result);

    } catch (error) {
      console.error('Import error:', error);
      setError(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setUploading(false);
    }
  }, [selectedFile, onImportComplete]);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      const blob = await idleResourcesService.downloadImportTemplate();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resource-import-template.xlsx';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Template download error:', error);
      setError('Failed to download template');
    }
  }, []);

  const handleClose = useCallback(() => {
    if (uploading) return;
    
    setSelectedFile(null);
    setImportResult(null);
    setError(null);
    onClose();
  }, [uploading, onClose]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      disableEscapeKeyDown={uploading}
    >
      <DialogTitle>
        Import Resources from Excel
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* Instructions */}
          <Alert severity="info">
            <Typography variant="body2">
              Upload an Excel file (.xlsx or .xls) containing resource data. 
              Make sure your file includes the required columns: Employee Code, Full Name, Department, Position, etc.
            </Typography>
          </Alert>

          {/* Template Download */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Download Template
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
            >
              Download Excel Template
            </Button>
          </Box>

          <Divider />

          {/* File Selection */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Select File
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<UploadIcon />}
              disabled={uploading}
              sx={{ mb: 2 }}
            >
              Choose Excel File
              <VisuallyHiddenInput
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
            </Button>

            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected file:
                </Typography>
                <Chip
                  label={`${selectedFile.name} (${formatFileSize(selectedFile.size)})`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>

          {/* Upload Progress */}
          {uploading && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Uploading and processing file...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          {/* Error Display */}
          {error && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {error}
            </Alert>
          )}

          {/* Import Results */}
          {importResult && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Import Results
              </Typography>
              
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Chip
                    icon={<SuccessIcon />}
                    label={`${importResult.successCount} Successful`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    icon={<ErrorIcon />}
                    label={`${importResult.errorCount} Failed`}
                    color="error"
                    size="small"
                  />
                  <Chip
                    label={`${importResult.totalProcessed} Total Processed`}
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                {importResult.errors.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="error" gutterBottom>
                      Import Errors:
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {importResult.errors.map((error, index) => (
                        <Typography key={index} variant="body2" color="error" sx={{ fontSize: '0.8rem' }}>
                          • {error}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={uploading}
        >
          {importResult ? 'Close' : 'Cancel'}
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
        >
          {uploading ? 'Uploading...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
