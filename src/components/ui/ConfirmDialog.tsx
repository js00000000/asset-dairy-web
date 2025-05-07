import React from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Account",
  description = "Are you sure you want to delete your account? This action is permanent and cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        aria-labelledby="delete-dialog-title"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 
            id="delete-dialog-title" 
            className="text-xl font-bold text-red-600 flex items-center gap-2"
          >
            <Trash2 className="w-6 h-6" />
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 text-gray-700">
          <p className="mb-6">{description}</p>
          
          <div className="flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
