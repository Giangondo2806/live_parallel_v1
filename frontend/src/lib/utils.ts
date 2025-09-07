export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
};

export const formatDateTime = (date: Date | string): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('vi-VN');
};

export const formatCurrency = (amount: number): string => {
  if (!amount) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format file size from bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get role display name in Vietnamese
 */
export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    admin: 'Quản trị viên',
    ra_all: 'RA Toàn bộ',
    ra_department: 'RA Phòng ban', 
    manager: 'Quản lý',
    viewer: 'Người xem',
  };
  
  return roleNames[role] || role;
};

/**
 * Get status color for Material-UI components
 */
export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'approved':
      return 'success';
    case 'pending':
    case 'waiting':
      return 'warning';
    case 'inactive':
    case 'rejected':
    case 'error':
      return 'error';
    case 'processing':
    case 'in_progress':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const isUrgentResource = (idleFrom: Date | string): boolean => {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  return new Date(idleFrom) <= twoMonthsAgo;
};

export const getIdleDuration = (idleFrom: Date | string): string => {
  const now = new Date();
  const idle = new Date(idleFrom);
  const diffTime = Math.abs(now.getTime() - idle.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} ngày`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} tháng`;
  } else {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} năm ${months} tháng`;
  }
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateEmployeeCode = (code: string): boolean => {
  const codeRegex = /^[A-Z]{2,4}\d{3,6}$/;
  return codeRegex.test(code);
};

export const getStatusText = (status: string): string => {
  const texts = {
    idle: 'Nhàn rỗi',
    assigned: 'Đã phân công',
    processing: 'Đang xử lý',
    unavailable: 'Không khả dụng',
  };
  return texts[status as keyof typeof texts] || status;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
