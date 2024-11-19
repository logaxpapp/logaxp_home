import React, { useState } from 'react';
import {  useSendResourceToUsersMutation } from '../../api/resourceApiSlice';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';

interface SendResourceProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
}

const SendResource: React.FC<SendResourceProps> = ({ isOpen, onClose, resourceId }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: users, isLoading, error } = useFetchAllUsersQuery({ page, limit });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sendResource] = useSendResourceToUsersMutation();

  const handleSend = async () => {
    try {
      await sendResource({ resourceId, userIds: selectedUsers }).unwrap();
      alert('Resource sent successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to send resource:', err);
      alert('Failed to send resource.');
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Resource">
      <div className="space-y-4">
        <h2>Select Users to Send the Resource</h2>
        <div className="flex flex-col space-y-2">
        {users?.users.map((user) => (
            <label key={user._id} className="flex items-center">
                <input
                type="checkbox"
                value={user._id}
                onChange={(e) =>
                    setSelectedUsers((prev) =>
                    e.target.checked
                        ? [...prev, e.target.value]
                        : prev.filter((id) => id !== e.target.value)
                    )
                }
                />
                <span className="ml-2">{user.name}</span>
            </label>
            ))}

        </div>
        <div className="flex justify-end">
          <Button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SendResource;
