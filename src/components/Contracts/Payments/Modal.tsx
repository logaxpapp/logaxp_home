// src/components/common/Modal.tsx

import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen = true, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 float-right"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')! // Ensure you have a div with id 'modal-root' in your HTML
  );
};

export default Modal;
