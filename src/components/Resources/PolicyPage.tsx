import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IResource } from '../../types/resourceTypes';
import { useAcknowledgePolicyMutation } from '../../api/usersApi';
import SignaturePicker from './SignaturePicker';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Button from '../common/Button/Button';
import { useToast } from '../../features/Toast/ToastContext';

const PolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const currentUser = useAppSelector(selectCurrentUser);

  const [acknowledgePolicy] = useAcknowledgePolicyMutation();

  // Extract policy from location.state
  const policy = location.state?.policy as IResource;

  // State for the selected signature
  const [selectedSignature, setSelectedSignature] = React.useState<{
    text: string;
    font: string;
    size: string;
    color: string;
  } | null>(null);

  // Handle acknowledgment action
  const handleAcknowledge = async () => {
    if (!selectedSignature) {
      alert('Please complete your signature before acknowledging the policy.');
      return;
    }
    try {
      await acknowledgePolicy({
        resourceId: policy._id,
        signature: selectedSignature,
      }).unwrap();
      toast.showToast('Policy acknowledged successfully!', 'success');
      navigate(-1); // Go back to the policy list
    } catch (err) {
      console.error('Failed to acknowledge policy:', err);
      toast.showToast('Failed to acknowledge policy. Please try again.', 'error');
    }
  };

  // If no policy exists, show an error
  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Policy not found. Please navigate back.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900 mt-4 text-white p-2 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">LogaXP</h1>
            <p className="text-sm">1108 Berry Street, Old Hickory, Nashville TN 37138, USA</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm">
              <strong>Secretary:</strong> John Grecham
            </p>
            <p className="text-sm">
              <strong>Contact:</strong> +1 (615) 554-3592
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline mb-4"
        >
          ← Back to Policies
        </button>
        <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold mb-4">{policy.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
            {currentUser?.name || 'User'}
        </p>
        </div>
        <div
          className="prose dark:prose-dark max-h-96 overflow-y-auto mb-6"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        ></div>
        {policy.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
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
        <SignaturePicker onSignatureSelect={setSelectedSignature} />
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleAcknowledge}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            I Have Read and Understand
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-sm py-4 mt-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} LogaXP. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PolicyPage;
