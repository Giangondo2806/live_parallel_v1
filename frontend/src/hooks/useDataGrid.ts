import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  rowsPerPage: number;
  total: number;
}

export interface SortingState<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

export interface UseDataGridReturn<T> {
  // Pagination
  pagination: PaginationState;
  handlePageChange: (page: number) => void;
  handleRowsPerPageChange: (rowsPerPage: number) => void;
  
  // Sorting
  sorting: SortingState<T>;
  handleSort: (field: keyof T) => void;
  
  // Selection
  selected: string[];
  handleSelectAll: (items: T[], getRowId: (item: T) => string) => void;
  handleSelectOne: (id: string) => void;
  clearSelection: () => void;
  
  // Search
  searchValue: string;
  handleSearch: (value: string) => void;
  
  // Reset
  reset: () => void;
}

export function useDataGrid<T = any>(
  initialField?: keyof T,
  initialDirection: 'asc' | 'desc' = 'asc'
): UseDataGridReturn<T> {
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    rowsPerPage: 10,
    total: 0,
  });

  // Sorting state
  const [sorting, setSorting] = useState<SortingState<T>>({
    field: initialField || ('' as keyof T),
    direction: initialDirection,
  });

  // Selection state
  const [selected, setSelected] = useState<string[]>([]);

  // Search state
  const [searchValue, setSearchValue] = useState('');

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleRowsPerPageChange = useCallback((rowsPerPage: number) => {
    setPagination(prev => ({ ...prev, rowsPerPage, page: 0 }));
  }, []);

  // Sorting handler
  const handleSort = useCallback((field: keyof T) => {
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Selection handlers
  const handleSelectAll = useCallback((items: T[], getRowId: (item: T) => string) => {
    if (selected.length === items.length) {
      setSelected([]);
    } else {
      setSelected(items.map(getRowId));
    }
  }, [selected.length]);

  const handleSelectOne = useCallback((id: string) => {
    setSelected(prev => {
      const selectedIndex = prev.indexOf(id);
      if (selectedIndex === -1) {
        return [...prev, id];
      } else {
        return prev.filter(selectedId => selectedId !== id);
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  // Search handler
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
  }, []);

  // Reset all states
  const reset = useCallback(() => {
    setPagination({ page: 0, rowsPerPage: 10, total: 0 });
    setSorting({ field: initialField || ('' as keyof T), direction: initialDirection });
    setSelected([]);
    setSearchValue('');
  }, [initialField, initialDirection]);

  return {
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
    sorting,
    handleSort,
    selected,
    handleSelectAll,
    handleSelectOne,
    clearSelection,
    searchValue,
    handleSearch,
    reset,
  };
}
