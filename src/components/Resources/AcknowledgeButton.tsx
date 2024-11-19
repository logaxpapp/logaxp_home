// src/components/Resources/AcknowledgeButton.tsx

import React from 'react';
import { useAcknowledgeResourceMutation } from '../../api/resourceApiSlice';

interface AcknowledgeButtonProps {
  resourceId: string;
}

const AcknowledgeButton: React.FC<AcknowledgeButtonProps> = ({ resourceId }) => {
  const [acknowledgeResource, { isLoading }] = useAcknowledgeResourceMutation();

  const handleAcknowledge = async () => {
    try {
      await acknowledgeResource({ resourceId }).unwrap();
      alert('Acknowledgment recorded!');
    } catch (err) {
      console.error('Failed to acknowledge resource:', err);
      alert('Failed to record acknowledgment.');
    }
  };

  return (
    <button
      onClick={handleAcknowledge}
      disabled={isLoading}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
    >
      {isLoading ? 'Acknowledging...' : 'Acknowledge'}
    </button>
  );
};

export default AcknowledgeButton;
