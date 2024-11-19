// src/components/common/Feedback/Modal/Modal.tsx

import React, { useEffect, useRef } from 'react';
import { ModalProps } from './Modal.types';
import { FaTimes } from 'react-icons/fa';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && modalRef.current === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:text-gray-50"
      onClick={handleOverlayClick}
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
        style={{ maxHeight: '80vh', overflowY: 'auto' }} // Ensure content is scrollable if too large
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b bg-lemonGreen-light dark:border-gray-700">
          {title && (
            <h3
              className="text-lg leading-6 font-medium text-gray-900 dark:text-white font-primary"
              id="modal-title"
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close modal"
          >
            <FaTimes className='text-white'/>
          </button>
        </div>
        {/* Body */}
        <div className="px-4 py-5 dark:text-gray-50"> 
          {children}
          
        </div>
        {/* Footer */}
        {footer && <div className="px-4 py-3 border-t dark:border-gray-700">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
