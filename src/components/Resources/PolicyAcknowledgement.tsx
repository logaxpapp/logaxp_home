import React, { useState } from 'react';
import { useFetchResourcesQuery } from '../../api/resourceApiSlice';
import { IResource, ResourceType } from '../../types/resourceTypes';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useAcknowledgePolicyMutation } from '../../api/usersApi';
import Button from '../common/Button/Button';
import PolicyModal from './PolicyModal';
import { useToast } from '../../features/Toast/ToastContext';

const PolicyAcknowledgement: React.FC = () => {
  const { data, isLoading, error } = useFetchResourcesQuery({
    page: 1,
    limit: 100,
    type: ResourceType.Policy,
  });
  const [acknowledgePolicy] = useAcknowledgePolicyMutation();
  const [selectedPolicy, setSelectedPolicy] = useState<IResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const currentUser = useAppSelector(selectCurrentUser);
  const toast = useToast();

  const handleOpenPolicy = (policy: IResource) => {
    setSelectedPolicy(policy);
    setIsModalOpen(true);
  };

  const handleAcknowledge = async () => {
    if (!selectedPolicy) return;
    try {
      await acknowledgePolicy({ resourceId: selectedPolicy._id }).unwrap();
      setIsModalOpen(false);
      toast.showToast('Policy acknowledged successfully!', 'success');
    } catch (err) {
      console.error('Failed to acknowledge policy:', err);
      toast.showToast('Failed to acknowledge policy. Please try again.', 'error');
    }
  };

  if (isLoading) return <p className="text-center">Loading policies...</p>;
  if (error) return <p className="text-center text-red-500">Error loading policies.</p>;

  const resources: IResource[] = data?.resources || [];

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="relative  rounded-lg shadow-lg p-2 text-gray-500">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold mb-2 font-primary text-blue-500">Policy Acknowledgement</h1>
            <p className="text-sm">
              Review and acknowledge your company's policies. Click on a policy to view and acknowledge it.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
           
            <h2 className="text-xl font-bold">{currentUser?.name || 'User'}</h2>
            {currentUser?.department && <p className="text-sm italic">{currentUser.department}</p>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 font-primary">Company Policies</h2>
        {resources.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">No policies available at the moment.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {resources.map((policy) => (
              <li key={policy._id} className="py-4 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{policy.title}</span>
                {!currentUser?.acknowledgedPolicies?.includes(policy._id) && (
                  <Button
                    onClick={() => handleOpenPolicy(policy)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    View & Acknowledge
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Policy Modal */}
      {selectedPolicy && (
        <PolicyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          policy={selectedPolicy}
          onAcknowledge={handleAcknowledge}
        />
      )}
    </div>
  );
};

export default PolicyAcknowledgement;
