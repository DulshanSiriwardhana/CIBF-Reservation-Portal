import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiXCircle className="w-5 h-5" />,
    warning: <FiAlertCircle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
  };

  const iconBgColors = {
    success: 'bg-[#dcfce7] text-[#16a34a]',
    error: 'bg-[#fee2e2] text-[#dc2626]',
    warning: 'bg-[#fef3c7] text-[#d97706]',
    info: 'bg-[#dbeafe] text-[#2563eb]',
  };

  const borderColors = {
    success: 'border-[#86efac]',
    error: 'border-[#fca5a5]',
    warning: 'border-[#fde047]',
    info: 'border-[#93c5fd]',
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border ${borderColors[type]} bg-white shadow-[0_20px_70px_rgba(15,23,42,0.12)] max-w-md animate-slide-in-right`}
    >
      <div className={`flex-shrink-0 ${iconBgColors[type]} rounded-lg p-2.5`}>
        {icons[type]}
      </div>
      <p className="font-medium flex-1 text-sm text-[#0f172a] leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-all duration-200"
        aria-label="Close notification"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
