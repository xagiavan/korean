import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Badge } from '../types';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'celebration';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  // For celebration type
  celebrationType?: 'goal' | 'badge';
  badgeIcon?: React.FC<any>;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
  showBadgeCelebration: (badges: Badge[]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    setToasts(prevToasts => [...prevToasts, { ...toast, id: toastId++ }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const showBadgeCelebration = useCallback((badges: Badge[]) => {
    // de-duplicate just in case
    const uniqueBadges = [...new Map(badges.map(b => [b.id, b])).values()];
    
    if (uniqueBadges.length === 0 && toasts.every(t => t.celebrationType !== 'goal')) {
        // This is likely a goal completion call without badges
        addToast({
            type: 'celebration',
            celebrationType: 'goal',
            title: 'Hoàn thành Mục tiêu!',
            message: 'Bạn đã hoàn thành tất cả các bước trong lộ trình học hôm nay. Làm tốt lắm!',
        });
        return;
    }

    uniqueBadges.forEach(badge => {
        addToast({
            type: 'celebration',
            celebrationType: 'badge',
            title: 'Huy hiệu Mới!',
            message: `Bạn đã mở khóa: ${badge.name}!`,
            badgeIcon: badge.icon,
        });
    });
  }, [addToast, toasts]);

  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast, showBadgeCelebration }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): Pick<ToastContextType, 'addToast' | 'showBadgeCelebration'> => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return { addToast: context.addToast, showBadgeCelebration: context.showBadgeCelebration };
};

export const useToastState = (): Pick<ToastContextType, 'toasts' | 'removeToast'> => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToastState must be used within a ToastProvider');
    }
    return { toasts: context.toasts, removeToast: context.removeToast };
}
