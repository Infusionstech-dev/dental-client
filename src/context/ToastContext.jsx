import { createContext, useCallback, useContext, useState } from 'react';
import ToastNotification from '../components/common/ToastNotification';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message, type = 'success') => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), 3800);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastNotification toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
