import React, { useState } from 'react';
import { ITestCase, ITestCaseAttachment } from '../../types/testCase';
import UploadAttachmentModal from './UploadAttachmentModal';  // The modal for uploading
import { useDeleteTestCaseAttachmentMutation } from '../../api/testCaseApi';
import { FaPaperclip, FaUpload, FaTrash } from 'react-icons/fa';
import Loader from '../../components/Loader';

interface AttachmentsTabProps {
  testCase: ITestCase;
  isLoading?: boolean;
}

const AttachmentsTab: React.FC<AttachmentsTabProps> = ({ testCase, isLoading }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // RTK mutation for deleting an attachment
  const [deleteTestCaseAttachment, { isLoading: isDeleting }] =
    useDeleteTestCaseAttachmentMutation();

  // Use empty array if attachments is undefined
  const attachments = testCase.attachments ?? [];

  // Delete handler
  const handleDeleteAttachment = async (attachmentId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this attachment?');
    if (!confirm) return;

    try {
      await deleteTestCaseAttachment({
        testCaseId: testCase._id,
        attachmentId,
      }).unwrap();

      alert('Attachment deleted successfully!');
      // RTK Query invalidates the cache for this testCase, so `fetchTestCaseById` 
      // or `fetchAllTestCases` is re-fetched automatically if you have them in use, 
      // causing the UI to update.
    } catch (err) {
      console.error('Failed to delete attachment:', err);
      alert('Error deleting attachment. Check console for details.');
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <h4 className="font-medium text-xl flex items-center space-x-2">
        <FaPaperclip className="text-gray-600" />
        <span>Attachments</span>
      </h4>

      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader />
        </div>
      ) : attachments.length === 0 ? (
        <p className="text-sm text-gray-500">No attachments yet.</p>
      ) : (
        <ul className="space-y-3">
          {attachments.map((att: ITestCaseAttachment) => (
            <li
              key={att._id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline flex items-center space-x-2"
                >
                  <FaPaperclip className="text-gray-500" />
                  <span>{att.filename}</span>
                </a>
                <span className="ml-7 text-xs text-gray-500">
                  Uploaded: {new Date(att.uploadedAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => handleDeleteAttachment(att._id)}
                className="text-red-500 hover:text-red-700"
                disabled={isDeleting}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Upload Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
      >
        <FaUpload />
        <span>Upload New Attachment</span>
      </button>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadAttachmentModal
          testCaseId={testCase._id}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};

export default AttachmentsTab;
