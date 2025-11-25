import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

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
    success: <FiCheckCircle className="w-4 h-4" />,
    error: <FiXCircle className="w-4 h-4" />,
    warning: <FiAlertCircle className="w-4 h-4" />,
    info: <FiInfo className="w-4 h-4" />,
  };

  const colors = {
    success: 'bg-[#0b1320] border border-[#10492d] text-[#22c55e]',
    error: 'bg-[#1f0f19] border border-[#b91c1c]/40 text-[#f87171]',
    warning: 'bg-[#1f1a0b] border border-[#facc15]/40 text-[#facc15]',
    info: 'bg-[#0b1426] border border-[#1d4ed8]/40 text-[#60a5fa]',
  };

  return (
    <div
      className={`fixed top-16 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-[0_15px_60px_rgba(0,0,0,0.6)] ${colors[type]} max-w-md backdrop-blur`}
    >
      <div className="flex-shrink-0 bg-black/20 rounded-lg p-2">{icons[type]}</div>
      <p className="font-medium flex-1 text-sm text-white">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded text-white/70 hover:text-white"
      >
        <FiXCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
