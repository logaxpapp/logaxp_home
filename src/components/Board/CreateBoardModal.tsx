// src/components/CreateBoardModal.tsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CreateBoard from './CreateBoard';
import CustomOverlay from './CustomOverlay';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto text-gray-800">
      <div className="flex items-center justify-center min-h-screen">
        <CustomOverlay />
        <div className="bg-white rounded max-w-md mx-auto p-6 z-20 relative shadow-lg">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          {/* Modal Title */}
          <Dialog.Title className="text-lg font-medium mb-4">Create New Board</Dialog.Title>
          
          {/* CreateBoard Form */}
          <CreateBoard onClose={onClose} />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateBoardModal;
