import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaClipboardList, FaCommentDots, FaTimes, FaPaperclip } from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import {
  useFetchTicketByIdQuery,
  useAddCommentToTicketMutation,
  useDeleteTicketMutation,
  useAssignTicketMutation,
   // Import upload attachment mutation
} from '../../api/ticketsApi';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/UI/Card';
import CommentsList from './CommentsList';
import AddCommentForm from './AddCommentForm';
import ActivityLog from './ActivityLog';
import AttachmentsList from './AttachmentsList';
import { useToast } from '../../features/Toast/ToastContext';
import SingleSelect from '../../components/common/Input/SelectDropdown/SingleSelect';
import Modal from '../../components/common/Feedback/Modal';
import ConfirmModal from '../../components/common/Feedback/ConfirmModal';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { IUser } from '../../types/user';

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useAppSelector(selectCurrentUser);

  // Fetch ticket details
  const { data: ticket, isLoading, isError, error, refetch } = useFetchTicketByIdQuery(id!, { skip: !id });
  const [addCommentToTicket, { isLoading: isAddingComment }] = useAddCommentToTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  // const [uploadAttachment, { isLoading: isUploading }] = useUploadAttachmentMutation(); // Attachment upload mutation

  // Assignment state and mutation
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { data: usersData, isLoading: isUsersLoading } = useFetchAllUsersQuery({ page: 1, limit: 10 });
  const [assignTicketMutation, { isLoading: isAssigning }] = useAssignTicketMutation();

  // Local state for handling file uploads
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Comment Handling
  const handleAddComment = async (content: string) => {
    if (!ticket || !user) return;
    try {
      await addCommentToTicket({ ticketId: ticket._id, content }).unwrap();
      showToast('Comment added successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast('Failed to add comment. Please try again later.', 'error');
    }
  };

  // Confirm Deletion Modal
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
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

  // Assign ticket to user
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

  // Handle file selection for attachments
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  // Handle file upload
  // const handleUploadAttachment = async () => {
  //   if (!selectedFiles || !ticket) return;
  //   try {
  //     const formData = new FormData();
  //     Array.from(selectedFiles).forEach((file) => formData.append('attachments', file));
  //     await uploadAttachment({ ticketId: ticket._id, attachments: formData }).unwrap();
  //     showToast('Attachment uploaded successfully!', 'success');
  //     refetch(); // Refresh ticket data to show new attachment
  //     setSelectedFiles(null); // Clear selected files after upload
  //   } catch (err: any) {
  //     showToast('Failed to upload attachment. Please try again later.', 'error');
  //   }
  // };

  // Open/Close assignment modal
  const openAssignModal = () => setIsAssignModalOpen(true);
  const closeAssignModal = () => setIsAssignModalOpen(false);

  if (isLoading) {
    return <div className="text-center mt-10">Loading ticket details...</div>;
  }

  if (isError) {
    return <div className="text-center mt-10 text-red-500">Failed to load ticket: {error.toString()}</div>;
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Ticket Not Found</h1>
        <Button variant="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FaUser className="text-yellow-500 text-lg" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{ticket.title}</h1>
            <p className="text-sm text-gray-500">{ticket.status}</p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-red-500 text-lg">
          <FaTimes />
        </button>
      </div>

      <Card className="p-4 mb-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <MdDescription className="text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-700">Description</h2>
        </div>
        <p className="text-gray-700 mb-4">{ticket.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {ticket.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="primary" onClick={openAssignModal}>Assign Staff</Button>
          <Button variant="danger" onClick={() => setIsConfirmDeleteOpen(true)}>Delete Ticket</Button>
        </div>
      </Card>

      {/* Attachments Section */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-2">
          <FaPaperclip className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Attachments</h2>
        </div>
        <AttachmentsList attachments={ticket.attachments} />

        <div className="mt-4 flex items-center">
          <input type="file" multiple onChange={handleFileChange} />
          {/* <Button variant="primary" onClick={handleUploadAttachment} disabled={isUploading || !selectedFiles}>
            {isUploading ? 'Uploading...' : 'Upload Attachment'}
          </Button> */}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-2">
          <FaCommentDots className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Comments</h2>
        </div>
        <CommentsList comments={ticket.comments} />
        <AddCommentForm onAddComment={handleAddComment} isLoading={isAddingComment} />
      </div>

      {/* Activity Log Section */}
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-2">
          <FaClipboardList className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Activity Log</h2>
        </div>
        <ActivityLog activities={ticket.activityLog} />
      </div>

      {/* Assign Ticket Modal */}
      {isAssignModalOpen && (
        <Modal isOpen={isAssignModalOpen} onClose={closeAssignModal} title="Assign Ticket">
          <div className="space-y-4">
            <SingleSelect
              options={usersData?.users.map((user: IUser) => ({
                value: user._id,
                label: user.name,
              })) || []}
              value={selectedUser ? selectedUser._id : null}
              onChange={(userId) => {
                const selected = usersData?.users.find((user: IUser) => user._id === userId) || null;
                setSelectedUser(selected);
              }}
              placeholder="Find Staff"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="secondary" onClick={closeAssignModal}>Cancel</Button>
            <Button variant="primary" onClick={handleAssignTicket} disabled={!selectedUser || isAssigning}>
              {isAssigning ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
      />
    </div>
  );
};

export default TicketDetails;
