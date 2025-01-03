import React, { useState } from 'react';
import {
  useUploadSingleAttachmentMutation,
  useUploadMultipleAttachmentsMutation,
  useDeleteAttachmentMutation,
  useFetchAttachmentsByCardQuery,
} from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';
import { IAttachment } from '../../types/task';
import { FiTrash2 } from 'react-icons/fi';
import { AiOutlineCloudUpload } from 'react-icons/ai';

interface AttachmentSectionProps {
  cardId: string;
}

const AttachmentSection: React.FC<AttachmentSectionProps> = ({ cardId }) => {
  const { data: attachments = [], isLoading, isError, refetch } = useFetchAttachmentsByCardQuery(cardId);
  const [files, setFiles] = useState<File[]>([]);
  const { showToast } = useToast();

  const [uploadSingleAttachment, { isLoading: singleUploading }] =
    useUploadSingleAttachmentMutation();
  const [uploadMultipleAttachments, { isLoading: multipleUploading }] =
    useUploadMultipleAttachmentsMutation();
  const [deleteAttachment, { isLoading: deleting }] =
    useDeleteAttachmentMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      showToast('Please select files for upload.', 'error');
      return;
    }

    try {
      if (files.length === 1) {
        await uploadSingleAttachment({ cardId, file: files[0] }).unwrap();
        showToast('Single attachment uploaded successfully!', 'success');
      } else {
        await uploadMultipleAttachments({ cardId, files }).unwrap();
        showToast('Multiple attachments uploaded successfully!', 'success');
      }
      setFiles([]);
      refetch();
    } catch (err) {
      console.error('Failed to upload attachments:', err);
      showToast('Error uploading attachments.', 'error');
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return;
    try {
      await deleteAttachment(attachmentId).unwrap();
      showToast('Attachment deleted successfully!', 'success');
      refetch();
    } catch (err) {
      console.error('Failed to delete attachment:', err);
      showToast('Error deleting attachment.', 'error');
    }
  };

  if (isLoading) return <p>Loading attachments...</p>;

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Attachments</h3>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="mb-6 flex flex-col gap-4">
        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={files.length === 0 || singleUploading || multipleUploading}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white ${
            singleUploading || multipleUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <AiOutlineCloudUpload size={18} />
          {singleUploading || multipleUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Attachments List */}
      {isError ? (
        <p className="text-red-500">Error loading attachments. Please try again later.</p>
      ) : attachments.length > 0 ? (
        <ul className="space-y-4">
          {attachments.map((att) => (
            <li
              key={att._id}
              className="flex justify-between items-center p-4 bg-white rounded shadow"
            >
              <div>
                <p className="text-sm font-semibold">{att.filename}</p>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View
                </a>
              </div>
              <button
                onClick={() => handleDelete(att._id)}
                disabled={deleting}
                className={`text-red-500 hover:text-red-700 flex items-center gap-1 ${
                  deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiTrash2 size={18} />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No attachments yet. Add some files!</p>
      )}
    </div>
  );
};

export default AttachmentSection;
