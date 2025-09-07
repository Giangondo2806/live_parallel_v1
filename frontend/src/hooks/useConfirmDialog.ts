import { useState } from 'react';

export interface UseConfirmDialogReturn {
  isOpen: boolean;
  data: any;
  openDialog: (data?: any) => void;
  closeDialog: () => void;
  confirmAction: () => void;
}

export function useConfirmDialog(onConfirm?: (data?: any) => void): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const openDialog = (dialogData?: any) => {
    setData(dialogData);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setData(null);
  };

  const confirmAction = () => {
    if (onConfirm) {
      onConfirm(data);
    }
    closeDialog();
  };

  return {
    isOpen,
    data,
    openDialog,
    closeDialog,
    confirmAction,
  };
}
