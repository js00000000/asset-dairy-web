import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const toastStyles: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: { 
    bg: 'bg-green-500', 
    icon: <Check className="w-6 h-6" /> 
  },
  error: { 
    bg: 'bg-red-500', 
    icon: <X className="w-6 h-6" /> 
  },
  warning: { 
    bg: 'bg-yellow-500', 
    icon: <AlertTriangle className="w-6 h-6" /> 
  },
  info: { 
    bg: 'bg-blue-500', 
    icon: <Info className="w-6 h-6" /> 
  }
};

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const { bg, icon } = toastStyles[type];

  return (
    <div 
      className={`fixed bottom-6 right-6 ${bg} text-white px-6 py-3 rounded-xl 
        shadow-2xl flex items-center space-x-3 
        animate-in slide-in-from-bottom-10 fade-in-10 
        z-50`}
    >
      {icon}
      <span className="font-semibold">{message}</span>
    </div>
  );
};

// Utility function for showing toasts globally
export const useToast = () => {
  const [toastConfig, setToastConfig] = useState<ToastProps | null>(null);

  const showToast = (config: ToastProps) => {
    setToastConfig(config);
  };

  const ToastContainer = toastConfig ? <Toast {...toastConfig} /> : null;

  return { showToast, ToastContainer };
};

export default Toast;
