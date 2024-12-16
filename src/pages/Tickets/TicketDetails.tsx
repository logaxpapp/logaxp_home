// src/pages/Tickets/TicketDetails.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaClipboardList, FaCommentDots, FaTimes, FaPaperclip, FaUserPlus, FaUserMinus, FaPlus } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import {
  useFetchTicketByIdQuery,
  useAddCommentToTicketMutation,
  useDeleteTicketMutation,
  useAssignTicketMutation,
  useAddWatcherToTicketMutation,
  useRemoveWatcherFromTicketMutation,
  useUpdateTicketCustomFieldsMutation,
} from '../../api/ticketsApi';
import { IUser } from '../../types/user';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/UI/Card';
import CommentsList from './CommentsList';
import AddCommentForm from './AddCommentForm';
import ActivityLog from './ActivityLog';
import AttachmentsList from './AttachmentsList';
import { useToast } from '../../features/Toast/ToastContext';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import MultiSelect from '../../components/common/Input/SelectDropdown/MultiSelect';
import SingleSelect from '../../components/common/Input/SelectDropdown/SingleSelect';

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentUser = useAppSelector(selectCurrentUser);

  const { data: ticket, isLoading, isError, error, refetch } = useFetchTicketByIdQuery(id!, { skip: !id });
  const [addCommentToTicket, { isLoading: isAddingComment }] = useAddCommentToTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const [assignTicketMutation, { isLoading: isAssigning }] = useAssignTicketMutation();
  const [addWatcherToTicket, { isLoading: isAddingWatcher }] = useAddWatcherToTicketMutation();
  const [removeWatcherFromTicket, { isLoading: isRemovingWatcher }] = useRemoveWatcherFromTicketMutation();
  const [updateCustomFields, { isLoading: isUpdatingFields }] = useUpdateTicketCustomFieldsMutation();

  const { data: usersData, isLoading: isUsersLoading } = useFetchAllUsersQuery({ page: 1, limit: 50 });

  // State for confirming deletion
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Assign Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // Watchers State
  const [selectedWatchersToAdd, setSelectedWatchersToAdd] = useState<string[]>([]);

  // Custom Fields Modal State
  const [isCustomFieldsModalOpen, setIsCustomFieldsModalOpen] = useState(false);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  // Functions
  const openAssignModal = () => setIsAssignModalOpen(true);
  const closeAssignModal = () => setIsAssignModalOpen(false);

  const handleAddComment = async (content: string) => {
    if (!ticket || !currentUser) return;
    try {
      await addCommentToTicket({ ticketId: ticket._id, content }).unwrap();
      showToast('Comment added successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast('Failed to add comment. Please try again later.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!ticket) return;
    try {
      await deleteTicket(ticket._id).unwrap();
      showToast('Ticket deleted successfully!', 'success');
      navigate(-1);
    } catch (err: any) {
      showToast('Failed to delete ticket. Please try again later.', 'error');
    } finally {
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleAssignTicket = async () => {
    if (!ticket || !selectedUser) {
      showToast('Please select a user to assign.', 'error');
      return;
    }
    try {
      await assignTicketMutation({ ticketId: ticket._id, assigneeId: selectedUser._id }).unwrap();
      showToast('Ticket assigned successfully!', 'success');
      refetch();
      closeAssignModal();
    } catch (err: any) {
      showToast('Failed to assign ticket. Please try again later.', 'error');
    }
  };

  const handleAddWatchers = async () => {
    if (!ticket || selectedWatchersToAdd.length === 0) return;
    try {
      for (const watcherId of selectedWatchersToAdd) {
        await addWatcherToTicket({ ticketId: ticket._id, userId: watcherId }).unwrap();
      }
      showToast('Watcher(s) added successfully!', 'success');
      refetch();
      setSelectedWatchersToAdd([]);
    } catch (err: any) {
      showToast('Failed to add watchers. Please try again later.', 'error');
    }
  };

  const handleRemoveWatcher = async (userId: string) => {
    if (!ticket) return;
    try {
      await removeWatcherFromTicket({ ticketId: ticket._id, userId }).unwrap();
      showToast('Watcher removed successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast('Failed to remove watcher. Please try again later.', 'error');
    }
  };

  const handleUpdateCustomFields = async () => {
    if (!ticket) return;
    if (!newFieldKey.trim()) {
      showToast('Field key cannot be empty', 'error');
      return;
    }
    try {
      await updateCustomFields({
        ticketId: ticket._id,
        fields: { [newFieldKey]: newFieldValue },
      }).unwrap();
      showToast('Custom field updated successfully!', 'success');
      refetch();
      setNewFieldKey('');
      setNewFieldValue('');
      setIsCustomFieldsModalOpen(false);
    } catch (err: any) {
      showToast('Failed to update custom fields. Please try again later.', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading ticket details...</div>;
  }

  if (isError || !ticket) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Ticket Not Found</h1>
        <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // Prepare watchers data
  const watchersList = ticket.watchers || [];
  const availableUsers = usersData?.users || [];
  const watcherOptions = availableUsers
    .filter((u) => !watchersList.some((w) => w._id === u._id))
    .map((user) => ({ value: user._id, label: user.name }));

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaUser className="text-yellow-500 text-lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            <p className="text-sm text-gray-500 capitalize">{ticket.status}</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-red-500 text-lg" title="Go Back">
          <FaTimes />
        </button>
      </div>

      {/* Description and Actions */}
      <Card className="p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <MdDescription className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Description</h2>
        </div>
        <p className="text-gray-700 mb-4">{ticket.description}</p>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ticket.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex space-x-4">
          <Button variant="primary" onClick={() => setIsCustomFieldsModalOpen(true)}>
            Manage Custom Fields
          </Button>
          <Button variant="danger" onClick={() => setIsConfirmDeleteOpen(true)} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Ticket'}
          </Button>
          <Button variant="primary" onClick={openAssignModal}>Assign Staff</Button>
        </div>
      </Card>

      {/* Watchers Section */}
      <Card className="p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <FaUserPlus className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Watchers</h2>
        </div>
        {watchersList.length === 0 ? (
          <p className="text-gray-600 mb-4">No watchers yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {watchersList.map((w) => (
              <div key={w._id} className="flex items-center bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1">
                {w.name}
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveWatcher(w._id)}
                  disabled={isRemovingWatcher}
                  title="Remove Watcher"
                >
                  <FaUserMinus />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <MultiSelect
              label="Add Watchers"
              options={watcherOptions}
              value={selectedWatchersToAdd}
              onChange={(vals) => setSelectedWatchersToAdd(vals as string[])}
              placeholder="Select users to watch..."
              isDisabled={isUsersLoading || isAddingWatcher}
            />
          </div>
          <Button
            variant="primary"
            onClick={handleAddWatchers}
            disabled={isAddingWatcher || selectedWatchersToAdd.length === 0}
          >
            {isAddingWatcher ? 'Adding...' : 'Add Watchers'}
          </Button>
        </div>
      </Card>

      {/* Custom Fields Section */}
      <Card className="p-4 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <FaClipboardList className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Custom Fields</h2>
        </div>
        {Object.keys(ticket.customFields).length === 0 && (
          <p className="text-gray-600 mb-4">No custom fields defined.</p>
        )}
        {Object.entries(ticket.customFields).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
            <span className="text-gray-700 text-sm font-medium">{key}: {String(value)}</span>
          </div>
        ))}
        <Button variant="primary" onClick={() => setIsCustomFieldsModalOpen(true)} className="mt-2">
          <FaPlus className="mr-1"/> Add/Update Custom Field
        </Button>
      </Card>

      {/* Attachments Section */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <FaPaperclip className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Attachments</h2>
        </div>
        <AttachmentsList attachments={ticket.attachments} />
      </div>

      {/* Comments Section */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <FaCommentDots className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Comments</h2>
        </div>
        <CommentsList comments={ticket.comments} />
        <AddCommentForm onAddComment={handleAddComment} isLoading={isAddingComment} />
      </div>

      {/* Activity Log Section */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <FaClipboardList className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Activity Log</h2>
        </div>
        <ActivityLog activities={ticket.activityLog} />
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
      />

      {/* Custom Fields Modal */}
      <Modal
        isOpen={isCustomFieldsModalOpen}
        onClose={() => setIsCustomFieldsModalOpen(false)}
        title="Update Custom Fields"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Field Key</label>
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 'Location' or 'Department Code'"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Field Value</label>
            <input
              type="text"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 'NY-123' or 'Sales Floor'"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-4">
          <Button variant="secondary" onClick={() => setIsCustomFieldsModalOpen(false)} disabled={isUpdatingFields}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCustomFields} disabled={isUpdatingFields}>
            {isUpdatingFields ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </Modal>

      {/* Assign Staff Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={closeAssignModal}
        title="Assign Staff"
      >
        <p className="text-sm text-gray-600 mb-4">Select a user to assign to this ticket:</p>
        {isUsersLoading ? (
          <div>Loading users...</div>
        ) : (
          <SingleSelect
            options={availableUsers.map((user) => ({ value: user._id, label: user.name }))}
            value={selectedUser ? selectedUser._id : null}
            onChange={(userId) => {
              const foundUser = availableUsers.find((u) => u._id === userId) || null;
              setSelectedUser(foundUser);
            }}
            placeholder="Select a user..."
          />
        )}
        <div className="flex justify-end mt-4 space-x-4">
          <Button variant="secondary" onClick={closeAssignModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignTicket} disabled={!selectedUser || isAssigning}>
            {isAssigning ? 'Assigning...' : 'Assign'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TicketDetails;
