// src/components/common/Feedback/Toast/Toast.tsx

import React, { useEffect } from 'react';
import { ToastProps as ToastComponentProps } from './Toast.types';

const Toast: React.FC<ToastComponentProps> = ({ id, message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg ${
        type === 'success'
          ? 'bg-green-100 text-green-700'
          : type === 'error'
          ? 'bg-red-100 text-red-700'
          : 'bg-blue-100 text-blue-700'
      }`}
      role="alert"
      aria-live="assertive"
    >
      {/* Customize the toast content as needed */}
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-lg font-semibold focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
