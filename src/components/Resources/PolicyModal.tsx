// src/components/Resources/PolicyModal.tsx

import React from 'react';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';
import { IResource } from '../../types/resourceTypes';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: IResource;
  onAcknowledge: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policy, onAcknowledge }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={policy.title}>
      <div className="space-y-6">
        <div
          className="prose dark:prose-dark max-h-80 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        ></div>
        {policy.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {policy.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Policy Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-md shadow-sm"
              />
            ))}
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </Button>
          <Button
            onClick={onAcknowledge}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            I Have Read and Understand
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PolicyModal;
