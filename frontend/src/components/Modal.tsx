import React from 'react';
import type { ReactNode } from 'react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;