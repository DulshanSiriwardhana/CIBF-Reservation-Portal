import React, { useEffect } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      iconBg: 'bg-[#fee2e2] text-[#dc2626]',
      border: 'border-[#fca5a5]',
      confirmButton: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white',
    },
    warning: {
      iconBg: 'bg-[#fef3c7] text-[#d97706]',
      border: 'border-[#fde047]',
      confirmButton: 'bg-[#d97706] hover:bg-[#b45309] text-white',
    },
    info: {
      iconBg: 'bg-[#dbeafe] text-[#2563eb]',
      border: 'border-[#93c5fd]',
      confirmButton: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white',
    },
  };

  const styles = typeStyles[type];

  // Disable body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Disable scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      if (isOpen) {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-xl border ${styles.border} shadow-[0_20px_70px_rgba(15,23,42,0.15)] max-w-md w-full animate-scale-in`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={`flex-shrink-0 ${styles.iconBg} rounded-lg p-3`}>
                <FiAlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#0f172a] mb-2">{title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-[#e1e7ef] text-sm font-semibold text-[#0f172a] hover:bg-[#f1f5f9] transition-all duration-200"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${styles.confirmButton}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;

