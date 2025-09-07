'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  CheckCircle,
  Error,
  Close,
} from '@mui/icons-material';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  uploading?: boolean;
  uploadProgress?: number;
  error?: string;
  title?: string;
  description?: string;
}

export function FileUpload({
  accept = '*/*',
  multiple = false,
  maxSize = 10, // 10MB default
  maxFiles = 5,
  onFilesSelected,
  onUpload,
  uploading = false,
  uploadProgress = 0,
  error,
  title = 'Tải file lên',
  description = 'Kéo thả file vào đây hoặc click để chọn file',
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): File[] => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let errorMsg = '';

    // Check number of files
    if (!multiple && fileArray.length > 1) {
      errorMsg = 'Chỉ được chọn 1 file';
    } else if (fileArray.length > maxFiles) {
      errorMsg = `Chỉ được chọn tối đa ${maxFiles} file`;
    } else {
      // Check file size
      for (const file of fileArray) {
        if (file.size > maxSize * 1024 * 1024) {
          errorMsg = `File "${file.name}" vượt quá kích thước tối đa ${maxSize}MB`;
          break;
        }
        validFiles.push(file);
      }
    }

    setValidationError(errorMsg);
    return errorMsg ? [] : validFiles;
  };

  const handleFileSelect = (files: FileList) => {
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (onUpload && selectedFiles.length > 0) {
      await onUpload(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="argon-card">
      <CardContent className="p-6">
        <Typography variant="h6" className="mb-4 text-gray-800">
          {title}
        </Typography>

        {/* Upload Area */}
        <Box
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUpload className="text-6xl text-gray-400 mb-4" />
          <Typography variant="h6" className="mb-2 text-gray-700">
            {dragActive ? 'Thả file vào đây' : description}
          </Typography>
          <Typography variant="body2" className="text-gray-500 mb-4">
            Kích thước tối đa: {maxSize}MB • Số file tối đa: {maxFiles}
          </Typography>
          <Button
            variant="outlined"
            className="border-gray-300 text-gray-600"
            disabled={uploading}
          >
            Chọn file
          </Button>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={uploading}
        />

        {/* Validation Error */}
        {validationError && (
          <Alert severity="error" className="mt-4">
            {validationError}
          </Alert>
        )}

        {/* API Error */}
        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}

        {/* Upload Progress */}
        {uploading && (
          <Box className="mt-4">
            <Typography variant="body2" className="mb-2 text-gray-600">
              Đang tải lên... {uploadProgress}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              className="rounded"
            />
          </Box>
        )}

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <Box className="mt-4">
            <Typography variant="subtitle2" className="mb-2 text-gray-700">
              File đã chọn:
            </Typography>
            <List className="bg-gray-50 rounded-lg">
              {selectedFiles.map((file, index) => (
                <ListItem key={index} className="border-b border-gray-200 last:border-b-0">
                  <ListItemIcon>
                    <InsertDriveFile className="text-blue-500" />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                  />
                  <Button
                    size="small"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Close />
                  </Button>
                </ListItem>
              ))}
            </List>

            {/* Upload Button */}
            {onUpload && (
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="argon-button-gradient mt-4"
                fullWidth
              >
                {uploading ? 'Đang tải lên...' : 'Tải lên'}
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
