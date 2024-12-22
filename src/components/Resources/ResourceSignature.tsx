import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchResourceByIdQuery, useAcknowledgeResourceMutation } from '../../api/resourceApiSlice';
import SignaturePicker from './SignaturePicker'; // Import the SignaturePicker component

const ResourceSignature: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { data: resource, isLoading, error } = useFetchResourceByIdQuery(resourceId || '');
  const [acknowledgeResource] = useAcknowledgeResourceMutation();
  const [signature, setSignature] = useState<{ text: string; font: string }>({ text: '', font: '' });
  const navigate = useNavigate();

  if (isLoading) return <p>Loading document...</p>;
  if (error || !resource) return <p>Error loading document.</p>;

  const handleAcknowledge = async () => {
    try {
      await acknowledgeResource({ resourceId: resourceId!, signature });
      alert('Document acknowledged and signed successfully!');
      navigate('/dashboard'); // Redirect to dashboard or desired location
    } catch (err) {
      console.error('Error acknowledging resource:', err);
      alert('Failed to acknowledge document.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{resource.title}</h1>
      <p className="mb-8">{resource.content}</p>
      <SignaturePicker onSignatureSelect={setSignature} />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
        onClick={handleAcknowledge}
        disabled={!signature.text.trim() || !signature.font}
      >
        Acknowledge and Sign
      </button>
    </div>
  );
};

export default ResourceSignature;
