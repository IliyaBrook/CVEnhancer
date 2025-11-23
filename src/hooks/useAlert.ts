import { useState, useCallback } from 'react';
import type { AlertVariant } from '@/components/Alert';

export interface AlertState {
  open: boolean;
  title?: string;
  message: string;
  variant?: AlertVariant | string;
  autoClose?: number;
}

export interface UseAlertReturn {
  alertState: AlertState;
  showSuccess: (message: string, title?: string, autoClose?: number) => void;
  showError: (message: string, title?: string, autoClose?: number) => void;
  showWarning: (message: string, title?: string, autoClose?: number) => void;
  showInfo: (message: string, title?: string, autoClose?: number) => void;
  showAlert: (state: Omit<AlertState, 'open'>) => void;
  hideAlert: () => void;
  isOpen: boolean;
}

export function useAlert(initialState?: Partial<AlertState>): UseAlertReturn {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    variant: 'info',
    ...initialState,
  });

  const showAlert = useCallback((state: Omit<AlertState, 'open'>) => {
    setAlertState({
      ...state,
      open: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (message: string, title?: string, autoClose?: number) => {
      showAlert({
        message,
        title,
        variant: 'success',
        autoClose,
      });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string, title?: string, autoClose?: number) => {
      showAlert({
        message,
        title,
        variant: 'error',
        autoClose,
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string, title?: string, autoClose?: number) => {
      showAlert({
        message,
        title,
        variant: 'warning',
        autoClose,
      });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string, title?: string, autoClose?: number) => {
      showAlert({
        message,
        title,
        variant: 'info',
        autoClose,
      });
    },
    [showAlert]
  );

  return {
    alertState,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAlert,
    hideAlert,
    isOpen: alertState.open,
  };
}
