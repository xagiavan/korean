import React from 'react';
import { useToastState } from '../contexts/ToastContext';
import Toast from './Toast';
import CelebrationAnimation from './CelebrationAnimation';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastState();

  const celebrationToast = toasts.find(t => t.type === 'celebration');

  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map(toast => (
            toast.type !== 'celebration' && <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </div>
      </div>
      {celebrationToast && (
        <CelebrationAnimation
            type={celebrationToast.celebrationType!}
            title={celebrationToast.title}
            description={celebrationToast.message}
            badgeIcon={celebrationToast.badgeIcon}
            onClose={() => removeToast(celebrationToast.id)}
        />
      )}
    </>
  );
};

export default ToastContainer;
