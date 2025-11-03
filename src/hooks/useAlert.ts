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

export interface AlertQueueItem extends AlertState {
  id: string;
}

export interface UseAlertQueueReturn {
  alerts: AlertQueueItem[];
  addSuccess: (message: string, title?: string, autoClose?: number) => string;
  addError: (message: string, title?: string, autoClose?: number) => string;
  addWarning: (message: string, title?: string, autoClose?: number) => string;
  addInfo: (message: string, title?: string, autoClose?: number) => string;
  addAlert: (state: Omit<AlertState, 'open'>) => string;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

/**
 * A hook for managing an alert queue (multiple notifications)
 *
 * @param maxAlerts - Maximum number of alerts shown simultaneously
 * @returns Object with methods and state for managing the alert queue
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { alerts, addSuccess, addError, removeAlert } = useAlertQueue(3);
 *
 *   const handleMultipleActions = async () => {
 *     addInfo('Processing started...', undefined, 2000);
 *
 *     try {
 *       await action1();
 *       addSuccess('Action 1 completed', undefined, 3000);
 *
 *       await action2();
 *       addSuccess('Action 2 completed', undefined, 3000);
 *     } catch (error) {
 *       addError(error.message, 'Error');
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleMultipleActions}>Execute</button>
 *       <div className="fixed top-4 right-4 space-y-2">
 *         {alerts.map(alert => (
 *           <Alert
 *             key={alert.id}
 *             {...alert}
 *             onClose={() => removeAlert(alert.id)}
 *           />
 *         ))}
 *       </div>
 *     </>
 *   );
 * }
 * ```
 */
export function useAlertQueue(maxAlerts: number = 5): UseAlertQueueReturn {
  const [alerts, setAlerts] = useState<AlertQueueItem[]>([]);

  const addAlert = useCallback(
    (state: Omit<AlertState, 'open'>): string => {
      const id = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newAlert: AlertQueueItem = {
        ...state,
        id,
        open: true,
      };

      setAlerts(prev => {
        const updated = [...prev, newAlert];
        return updated.slice(-maxAlerts);
      });

      return id;
    },
    [maxAlerts]
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const addSuccess = useCallback(
    (message: string, title?: string, autoClose: number = 5000): string => {
      return addAlert({
        message,
        title,
        variant: 'success',
        autoClose,
      });
    },
    [addAlert]
  );

  const addError = useCallback(
    (message: string, title?: string, autoClose?: number): string => {
      return addAlert({
        message,
        title,
        variant: 'error',
        autoClose,
      });
    },
    [addAlert]
  );

  const addWarning = useCallback(
    (message: string, title?: string, autoClose?: number): string => {
      return addAlert({
        message,
        title,
        variant: 'warning',
        autoClose,
      });
    },
    [addAlert]
  );

  const addInfo = useCallback(
    (message: string, title?: string, autoClose: number = 5000): string => {
      return addAlert({
        message,
        title,
        variant: 'info',
        autoClose,
      });
    },
    [addAlert]
  );

  return {
    alerts,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    addAlert,
    removeAlert,
    clearAlerts,
  };
}
