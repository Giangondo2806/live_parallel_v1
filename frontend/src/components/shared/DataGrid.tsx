'use client';

import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Card,
  Checkbox,
  Toolbar,
  Tooltip,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  GetApp,
} from '@mui/icons-material';

export interface DataGridColumn<T = any> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'status' | 'actions';
}

export interface DataGridProps<T = any> {
  columns: DataGridColumn<T>[];
  rows: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    rowsPerPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
  };
  sorting?: {
    field: keyof T;
    direction: 'asc' | 'desc';
    onSort: (field: keyof T) => void;
  };
  selection?: {
    selected: string[];
    onSelectionChange: (selected: string[]) => void;
    getRowId: (row: T) => string;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  actions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    custom?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: (row: T) => void;
      color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    }>;
  };
  title?: string;
  subtitle?: string;
  toolbar?: React.ReactNode;
}

export function DataGrid<T = any>({
  columns,
  rows,
  loading = false,
  pagination,
  sorting,
  selection,
  search,
  actions,
  title,
  subtitle,
  toolbar,
}: DataGridProps<T>) {
  const [menuAnchor, setMenuAnchor] = React.useState<{
    el: HTMLElement;
    row: T;
  } | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: T) => {
    setMenuAnchor({ el: event.currentTarget, row });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selection) return;
    
    if (event.target.checked) {
      const allIds = rows.map(row => selection.getRowId(row));
      selection.onSelectionChange(allIds);
    } else {
      selection.onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string) => {
    if (!selection) return;
    
    const selectedIndex = selection.selected.indexOf(rowId);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selection.selected, rowId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selection.selected.slice(1));
    } else if (selectedIndex === selection.selected.length - 1) {
      newSelected = newSelected.concat(selection.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selection.selected.slice(0, selectedIndex),
        selection.selected.slice(selectedIndex + 1),
      );
    }

    selection.onSelectionChange(newSelected);
  };

  const renderCellContent = (column: DataGridColumn<T>, value: any, row: T) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'status':
        return (
          <Chip
            label={value}
            size="small"
            color={value === 'active' ? 'success' : 'default'}
            className="capitalize"
          />
        );
      case 'boolean':
        return value ? 'Có' : 'Không';
      case 'date':
        return value ? new Date(value).toLocaleDateString('vi-VN') : '';
      case 'actions':
        return (
          <Box className="flex space-x-1">
            {actions?.onView && (
              <Tooltip title="Xem chi tiết">
                <IconButton
                  size="small"
                  onClick={() => actions.onView!(row)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {actions?.onEdit && (
              <Tooltip title="Chỉnh sửa">
                <IconButton
                  size="small"
                  onClick={() => actions.onEdit!(row)}
                  className="text-green-600 hover:bg-green-50"
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {actions?.onDelete && (
              <Tooltip title="Xóa">
                <IconButton
                  size="small"
                  onClick={() => actions.onDelete!(row)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {(actions?.custom?.length || 0) > 0 && (
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, row)}
                className="text-gray-600 hover:bg-gray-50"
              >
                <MoreVert fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      default:
        return value || '';
    }
  };

  const isSelected = (rowId: string) => 
    selection?.selected.indexOf(rowId) !== -1;

  return (
    <Card className="argon-card">
      {/* Header */}
      {(title || search || toolbar) && (
        <Box className="p-6 border-b border-gray-200">
          <Box className="flex justify-between items-center mb-4">
            <Box>
              {title && (
                <Typography variant="h6" className="text-gray-800 font-semibold">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" className="text-gray-600">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {toolbar}
          </Box>

          {search && (
            <TextField
              fullWidth
              placeholder={search.placeholder || 'Tìm kiếm...'}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              InputProps={{
                startAdornment: <Search className="text-gray-400 mr-2" />,
              }}
              className="max-w-md"
            />
          )}
        </Box>
      )}

      {/* Selection Toolbar */}
      {selection && selection.selected.length > 0 && (
        <Toolbar className="bg-blue-50 border-b border-blue-200">
          <Typography variant="subtitle1" className="flex-1 text-blue-800">
            {selection.selected.length} mục đã chọn
          </Typography>
          <Button
            startIcon={<Delete />}
            className="text-red-600"
          >
            Xóa đã chọn
          </Button>
        </Toolbar>
      )}

      {/* Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selection.selected.length > 0 && 
                      selection.selected.length < rows.length
                    }
                    checked={
                      rows.length > 0 && 
                      selection.selected.length === rows.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className="bg-gray-50 font-semibold text-gray-700"
                >
                  {column.sortable && sorting ? (
                    <TableSortLabel
                      active={sorting.field === column.id}
                      direction={sorting.field === column.id ? sorting.direction : 'asc'}
                      onClick={() => sorting.onSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selection ? 1 : 0)} 
                  className="text-center py-8"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selection ? 1 : 0)} 
                  className="text-center py-8 text-gray-500"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                const rowId = selection ? selection.getRowId(row) : index.toString();
                const selected = isSelected(rowId);
                
                return (
                  <TableRow
                    hover
                    key={rowId}
                    selected={selected}
                    className="hover:bg-gray-50"
                  >
                    {selection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected}
                          onChange={() => handleSelectRow(rowId)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.id as string}
                        align={column.align}
                      >
                        {renderCellContent(column, (row as any)[column.id], row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={(_, page) => pagination.onPageChange(page)}
          onRowsPerPageChange={(e) => 
            pagination.onRowsPerPageChange(parseInt(e.target.value, 10))
          }
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor?.el}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {actions?.custom?.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick(menuAnchor!.row);
              handleMenuClose();
            }}
          >
            {action.icon && <Box className="mr-2">{action.icon}</Box>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
}
