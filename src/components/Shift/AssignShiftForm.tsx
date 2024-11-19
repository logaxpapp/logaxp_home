import React, { useState } from 'react';
import Button from '../common/Button/Button';
import SingleSelect from '../common/Input/SelectDropdown/SingleSelect';
import { IShift } from '../../types/shift';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { IUser } from '../../types/user';

interface AssignShiftFormProps {
  shift: IShift;
  onSubmit: (shiftId: string, userId: string) => void;
  onCancel: () => void;
}

const AssignShiftForm: React.FC<AssignShiftFormProps> = ({ shift, onSubmit, onCancel }) => {
  const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

  const { data: usersData, isLoading: isUsersLoading, error: usersError } = useFetchAllUsersQuery({page, limit});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await onSubmit(shift._id, selectedUser);
    } catch (error) {
      console.error('Failed to assign shift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map users to options
  const userOptions = usersData?.users.map((user: IUser) => ({
    value: user._id,
    label: `${user.name} (${user.email})`,
  })) || [];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Assign Shift</h2>
      {usersError && (
        <p className="text-red-500 mb-4">Failed to load users. Please try again later.</p>
      )}
      
      <form onSubmit={handleSubmit}>
        <SingleSelect
          label="Assign To"
          options={userOptions}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder={isUsersLoading ? "Loading users..." : "Select Employee"}
          isDisabled={isUsersLoading || isSubmitting}
          required
        />

        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || isUsersLoading || !selectedUser}>
            {isSubmitting ? "Assigning..." : "Assign Shift"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssignShiftForm;
