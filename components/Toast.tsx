import React, { useEffect } from 'react';
import { ToastMessage } from '../contexts/ToastContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, CloseIcon, TrophyIcon } from './icons/Icons';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const ICONS: Record<ToastMessage['type'], React.FC<any>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: InformationCircleIcon,
  celebration: TrophyIcon,
};

const COLORS: Record<ToastMessage['type'], { bg: string, text: string, icon: string }> = {
  success: { bg: 'bg-green-50 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', icon: 'text-green-500' },
  error: { bg: 'bg-red-50 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', icon: 'text-red-500' },
  info: { bg: 'bg-blue-50 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', icon: 'text-blue-500' },
  warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', icon: 'text-yellow-500' },
  celebration: { bg: 'bg-yellow-50 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', icon: 'text-yellow-500' },
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, type, title, message } = toast;
  const Icon = ICONS[type];
  const color = COLORS[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 4000); // Auto-dismiss after 4 seconds

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className={`w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 ${color.bg} animate-fade-in-up`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color.icon}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-bold ${color.text}`}>{title}</p>
            <p className={`mt-1 text-sm ${color.text}`}>{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className={`inline-flex rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${color.bg} ${color.text}`}
              onClick={() => onDismiss(id)}
            >
              <span className="sr-only">Close</span>
              <CloseIcon small aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;