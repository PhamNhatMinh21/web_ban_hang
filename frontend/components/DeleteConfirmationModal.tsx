import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-[var(--admin-bg-card)] rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Xác nhận xóa</h2>
        <p className="text-[var(--admin-text-secondary)] mb-8">
          Bạn có chắc chắn muốn xóa sản phẩm <strong className="text-[var(--admin-text-main)]">{productName}</strong>? Hành động này không thể hoàn tác.
        </p>
        
        <div className="flex justify-center items-center space-x-4">
          <button 
              type="button" 
              onClick={onClose}
              className="py-2.5 px-6 text-sm font-bold bg-[var(--admin-bg-hover)] text-[var(--admin-text-main)] rounded-lg hover:opacity-90 transition-opacity"
          >
            Hủy
          </button>
          <button 
              type="button"
              onClick={onConfirm}
              className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;