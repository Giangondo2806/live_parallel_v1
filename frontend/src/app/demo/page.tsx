'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { 
  Button, 
  Card, 
  Input, 
  DataGrid, 
  ConfirmDialog, 
  FileUpload,
  type DataGridColumn,
} from '../../components';
import { useConfirmDialog } from '../../hooks';
import { Box, Typography, Alert, Divider } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

// Sample data for DataGrid
const sampleData = [
  { id: '1', name: 'Nguyễn Văn A', role: 'admin', status: 'active', email: 'nva@example.com' },
  { id: '2', name: 'Trần Thị B', role: 'manager', status: 'active', email: 'ttb@example.com' },
  { id: '3', name: 'Lê Văn C', role: 'viewer', status: 'inactive', email: 'lvc@example.com' },
];

const columns: DataGridColumn[] = [
  { id: 'name', label: 'Họ tên', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'role', label: 'Vai trò', sortable: true },
  { id: 'status', label: 'Trạng thái', type: 'status' },
  { id: 'actions', label: 'Hành động', type: 'actions', align: 'center' },
];

export default function ComponentsDemoPage() {
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  
  const confirmDialog = useConfirmDialog((data) => {
    console.log('Confirmed action with data:', data);
  });

  const handleFileUpload = async (files: File[]) => {
    setUploadLoading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploadLoading(false);
    console.log('Files uploaded:', files);
  };

  return (
    <DashboardLayout>
      <Box className="space-y-8">
        <Box>
          <Typography variant="h4" className="text-gray-800 font-bold mb-2">
            Components Demo
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Trang demo các shared components đã được tạo
          </Typography>
        </Box>

        {/* Buttons Demo */}
        <Card>
          <Typography variant="h6" className="mb-4">Buttons</Typography>
          <Box className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="primary" loading>Loading Button</Button>
            <Button variant="primary" icon={<Add />}>With Icon</Button>
            <Button variant="outline" icon={<Edit />} iconPosition="end">Icon End</Button>
          </Box>
        </Card>

        {/* Input Demo */}
        <Card>
          <Typography variant="h6" className="mb-4">Input Components</Typography>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Text Input" placeholder="Nhập văn bản..." />
            <Input label="Email Input" type="email" placeholder="email@example.com" />
            <Input label="Password Input" type="password" placeholder="Mật khẩu" />
            <Input 
              label="Multiline Input" 
              multiline 
              rows={3} 
              placeholder="Nhập nhiều dòng..."
            />
          </Box>
        </Card>

        {/* Cards Demo */}
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default">
            <Typography variant="h6" className="mb-2">Default Card</Typography>
            <Typography variant="body2" className="text-gray-600">
              Card mặc định với style argon
            </Typography>
          </Card>
          
          <Card variant="outlined">
            <Typography variant="h6" className="mb-2">Outlined Card</Typography>
            <Typography variant="body2" className="text-gray-600">
              Card với viền outline
            </Typography>
          </Card>
          
          <Card variant="elevated">
            <Typography variant="h6" className="mb-2">Elevated Card</Typography>
            <Typography variant="body2" className="text-gray-600">
              Card với shadow nâng cao
            </Typography>
          </Card>
        </Box>

        {/* DataGrid Demo */}
        <Card padding="none">
          <DataGrid
            title="DataGrid Demo"
            subtitle="Hiển thị dữ liệu dạng bảng với các tính năng"
            columns={columns}
            rows={sampleData}
            search={{
              value: searchValue,
              onChange: setSearchValue,
              placeholder: 'Tìm kiếm người dùng...'
            }}
            actions={{
              onView: (row) => console.log('View:', row),
              onEdit: (row) => console.log('Edit:', row),
              onDelete: (row) => confirmDialog.openDialog({ action: 'delete', row }),
            }}
            pagination={{
              page: 0,
              rowsPerPage: 10,
              total: sampleData.length,
              onPageChange: (page) => console.log('Page:', page),
              onRowsPerPageChange: (rows) => console.log('Rows per page:', rows),
            }}
            selection={{
              selected: [],
              onSelectionChange: (selected) => console.log('Selected:', selected),
              getRowId: (row) => row.id,
            }}
            toolbar={
              <Button variant="primary" icon={<Add />}>
                Thêm mới
              </Button>
            }
          />
        </Card>

        {/* File Upload Demo */}
        <Card>
          <Typography variant="h6" className="mb-4">File Upload Component</Typography>
          <FileUpload
            title="Tải lên CV"
            description="Chọn file PDF hoặc Word để tải lên"
            accept=".pdf,.doc,.docx"
            maxSize={5}
            onFilesSelected={setSelectedFiles}
            onUpload={handleFileUpload}
            uploading={uploadLoading}
            uploadProgress={uploadLoading ? 75 : 0}
          />
        </Card>

        {/* Confirm Dialog Demo */}
        <Card>
          <Typography variant="h6" className="mb-4">Confirm Dialog</Typography>
          <Box className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => confirmDialog.openDialog({ type: 'info' })}
            >
              Info Dialog
            </Button>
            <Button 
              variant="outline" 
              onClick={() => confirmDialog.openDialog({ type: 'warning' })}
            >
              Warning Dialog
            </Button>
            <Button 
              variant="danger" 
              onClick={() => confirmDialog.openDialog({ type: 'danger' })}
            >
              Danger Dialog
            </Button>
          </Box>
          
          <ConfirmDialog
            open={confirmDialog.isOpen}
            title="Xác nhận hành động"
            message="Bạn có chắc chắn muốn thực hiện hành động này không?"
            variant={confirmDialog.data?.type || 'warning'}
            onConfirm={confirmDialog.confirmAction}
            onCancel={confirmDialog.closeDialog}
          />
        </Card>

        {/* Alert Demo */}
        <Box className="space-y-4">
          <Alert severity="success">Thông báo thành công!</Alert>
          <Alert severity="warning">Cảnh báo quan trọng!</Alert>
          <Alert severity="error">Đã xảy ra lỗi!</Alert>
          <Alert severity="info">Thông tin hữu ích.</Alert>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
