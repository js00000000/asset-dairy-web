import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast(message, { 
      icon: '⚠️',
      style: {
        background: '#FCD34D',
        color: 'black',
      }
    }),
    info: (message: string) => toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: 'white',
      }
    }),
  };
};
