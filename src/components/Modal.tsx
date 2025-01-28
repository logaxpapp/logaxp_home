// src/components/Modal.tsx

import React, { ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  isOpen: boolean; 
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on `Esc` key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); };
  }, [onClose]);

  // Focus trap can be implemented here or using a library

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal when clicking outside
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
          aria-label="Close Modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;
