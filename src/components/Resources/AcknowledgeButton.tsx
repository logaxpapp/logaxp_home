import React, { useState } from 'react';
import { useAcknowledgeResourceMutation } from '../../api/resourceApiSlice';
import SignaturePicker from './SignaturePicker'; // Assuming you have this component

interface AcknowledgeButtonProps {
  resourceId: string;
}

const AcknowledgeButton: React.FC<AcknowledgeButtonProps> = ({ resourceId }) => {
  const [acknowledgeResource, { isLoading }] = useAcknowledgeResourceMutation();
  const [signature, setSignature] = useState<{ text: string; font: string }>({ text: '', font: '' });

  const handleAcknowledge = async () => {
    if (!signature.text.trim() || !signature.font) {
      alert('Please provide and select your signature to acknowledge the resource.');
      return;
    }

    try {
      await acknowledgeResource({ resourceId, signature }).unwrap();
      alert('Acknowledgment and signature recorded successfully!');
    } catch (err) {
      console.error('Failed to acknowledge resource:', err);
      alert('Failed to record acknowledgment.');
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <h2 className="text-lg font-medium mb-4">Sign to Acknowledge</h2>
      {/* SignaturePicker Component */}
      <SignaturePicker
        onSignatureSelect={(selectedSignature) => setSignature(selectedSignature)}
      />
      <button
        onClick={handleAcknowledge}
        disabled={isLoading || !signature.text.trim() || !signature.font}
        className={`mt-4 px-4 py-2 rounded-md text-white ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {isLoading ? 'Acknowledging...' : 'Acknowledge and Sign'}
      </button>
    </div>
  );
};

export default AcknowledgeButton;
