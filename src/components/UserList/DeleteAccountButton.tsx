import React, { useState } from 'react';
import { useRequestAccountDeletionMutation } from '../../api/usersApi';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import Button from '../../components/common/Button/Button';

const DeleteAccountRequest: React.FC = () => {
  const [reason, setReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [requestAccountDeletion, { isLoading }] = useRequestAccountDeletionMutation();

  const handleReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
    setErrorMessage(''); // Clear error message on input change
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(event.target.checked);
    setErrorMessage(''); // Clear error message on input change
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleModalOpen = () => {
    if (!isConfirmed) {
      setErrorMessage('Please confirm that you understand this action is irreversible.');
      return;
    }
    if (reason.trim() === '') {
      setErrorMessage('Please provide a reason for your account deletion request.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleDeleteRequest = async () => {
    try {
      const response = await requestAccountDeletion({ reason }).unwrap();
      alert(response.message);
    } catch (error) {
      alert('Failed to request account deletion.');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-xl mx-auto mt-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 font-primary border-b pb-2 mb-4 dark:text-lemonGreen-light">
          Request Account Deletion
        </h2>
        <p className="text-gray-600 mt-2 dark:text-gray-50">
          We're sorry to see you go. Please let us know your reason for leaving.
        </p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 shadow-sm">
        <textarea
          value={reason}
          onChange={handleReasonChange}
          placeholder="Enter your reason for leaving..."
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}

      <div className="flex items-start mb-6">
        <input
          type="checkbox"
          id="confirmation"
          checked={isConfirmed}
          onChange={handleCheckboxChange}
          className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
        />
        <label htmlFor="confirmation" className="ml-3 text-gray-700 dark:text-gray-50">
          I understand that this action is irreversible and all my data will be permanently deleted.
        </label>
      </div>

      <Button
        variant="danger"
        size="large"
        onClick={handleModalOpen}
        isLoading={isLoading}
        className="w-full"
      >
        Submit Deletion Request
      </Button>

      <div className="mt-6 text-center text-gray-500 dark:text-gray-50">
        <p>
          If you have any issues, feel free to{' '}
          <a href="/support" className="text-blue-600">
            contact support
          </a>
          .
        </p>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteRequest}
        title="Confirm Account Deletion"
        message="Are you sure you want to request account deletion? This action is irreversible, and all your data will be permanently deleted."
      />
    </div>
  );
};

export default DeleteAccountRequest;
