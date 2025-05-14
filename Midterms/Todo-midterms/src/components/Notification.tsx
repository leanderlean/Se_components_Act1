// src/components/Notification.tsx
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

interface NotificationProps {
  message: string;
  type?: 'error' | 'warning' | 'success';
}

export const Notification: React.FC<NotificationProps> = ({ message, type = 'warning' }) => {
  useEffect(() => {
    const toastMethod = {
      error: toast.error,
      warning: toast, // Use default toast for warnings
      success: toast.success,
    }[type];

    const toastId = toastMethod(message, {
      duration: 4000,
      position: 'top-right',
    });

    return () => {
      toast.dismiss(toastId);
    };
  }, [message, type]);

  return null;
};