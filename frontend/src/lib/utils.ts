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
    currency: 'USD',
  }).format(amount);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

export const getStatusColor = (status: string): string => {
  const colors = {
    idle: '#FFC107',
    assigned: '#28A745',
    processing: '#17A2B8',
    unavailable: '#DC3545',
  };
  return colors[status as keyof typeof colors] || '#6C757D';
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
