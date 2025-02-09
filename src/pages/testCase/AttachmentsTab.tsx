import React, { useCallback, useState } from 'react';
import {
  ITestCase,
  ITestCaseAttachment
} from '../../types/testCase';
import UploadAttachmentModal from './UploadAttachmentModal';
import {
  useDeleteTestCaseAttachmentMutation,
  // You need something like this for uploads:
  useUploadTestCaseAttachmentMutation
} from '../../api/testCaseApi';
import {
  FaPaperclip,
  FaUpload,
  FaTrash,
  FaCopy,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import Loader from '../../components/Loader';
import Toast from '../../components/common/Feedback/Toast';

interface AttachmentsTabProps {
  testCase: ITestCase;
  isLoading?: boolean;
}

const PAGE_SIZE = 5; // Number of attachments per page

const AttachmentsTab: React.FC<AttachmentsTabProps> = ({ testCase, isLoading }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Local toasts
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: 'success' | 'error' }[]
  >([]);

  // Mutations
  const [deleteTestCaseAttachment, { isLoading: isDeleting }] =
    useDeleteTestCaseAttachmentMutation();

  // IMPORTANT: We'll assume you have a RTK Query mutation for uploading.
  // If your "UploadAttachmentModal" uses some other approach, adapt accordingly.
  const [uploadTestCaseAttachment, { isLoading: isUploading }] =
    useUploadTestCaseAttachmentMutation();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  const attachments = testCase.attachments ?? [];
  const totalPages = Math.ceil(attachments.length / PAGE_SIZE);

  // Slice attachments for the current page
  const paginatedAttachments = attachments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ---- Toast Helpers ----
  const addToast = (message: string, type: 'success' | 'error') => {
    setToasts((prev) => [
      ...prev,
      { id: String(Date.now()), message, type }
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ---- Handlers ----

  // 1) Copy Link Handler
  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      addToast('Attachment link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Failed to copy attachment link:', error);
      addToast('Error copying attachment link.', 'error');
    }
  };

  // 2) Delete Attachment Handler
  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return;
    try {
      await deleteTestCaseAttachment({
        testCaseId: testCase._id,
        attachmentId
      }).unwrap();

      addToast('Attachment deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete attachment:', err);
      addToast('Error deleting attachment.', 'error');
    }
  };

  // 3) Universal File Upload (paste or drop)
  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        // Just pass the raw 'file' here:
        await uploadTestCaseAttachment({
          id: testCase._id,
          file,         // Passing the File object
        }).unwrap();
  
        addToast(`Uploaded: ${file.name}`, 'success');
      } catch (err) {
        console.error('File upload failed:', err);
        addToast('Error uploading file.', 'error');
      }
    },
    [testCase._id, uploadTestCaseAttachment]
  );
  
  // 4) Paste Handler
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // If you only want images, you can filter by file.type, etc.
    const pastedFiles = Array.from(e.clipboardData.files);

    if (pastedFiles.length > 0) {
      e.preventDefault(); // Prevent default so browser doesn’t do anything else
      pastedFiles.forEach((file) => {
        // For demonstration, handle only images or any file you want:
        handleFileUpload(file);
      });
    }
  };

  // 5) Drag/Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach((file) => handleFileUpload(file));
  };

  // 6) Pagination
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  // ---- Render ----
  return (
    <div
      className="space-y-6 p-4 bg-white rounded-lg shadow-sm"
      // Attach Paste/Drag events to a container. 
      // If you'd rather confine the area, wrap just a "dropzone" portion.
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ minHeight: '250px' }} // for visual space
    >
      <h4 className="font-medium text-xl flex items-center space-x-2">
        <FaPaperclip className="text-gray-600" />
        <span>Attachments</span>
      </h4>

      {/* Optional instructions for user */}
      <div className="text-sm text-gray-500 mb-2">
        <p>
          <strong>Tip:</strong> Paste an image or file here, drag-and-drop it, or click{' '}
          <em>Upload</em> to select files from your system.
        </p>
      </div>

      {/* If any of the upload or delete calls are in progress, 
          you could display a small indicator, or you can rely on the "isUploading"/"isDeleting" states. */}
      {(isUploading || isDeleting) && (
        <div className="text-blue-500 text-sm">Processing...</div>
      )}

      {/* Display attachments or loading */}
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader />
        </div>
      ) : attachments.length === 0 ? (
        <p className="text-sm text-gray-500">No attachments yet.</p>
      ) : (
        <>
          {/* Attachment List */}
          <ul className="space-y-3">
            {paginatedAttachments.map((att: ITestCaseAttachment) => (
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
                <div className="flex items-center space-x-3">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyLink(att.url)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaCopy />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteAttachment(att._id)}
                    className={`text-red-500 hover:text-red-700 ${
                      isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isDeleting}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center space-x-2 mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 ${
                  currentPage === 1 && 'opacity-50 cursor-not-allowed'
                }`}
              >
                <FaArrowLeft />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 ${
                  currentPage === totalPages && 'opacity-50 cursor-not-allowed'
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* Button to open your "Upload from System" modal. */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
      >
        <FaUpload />
        <span>Upload</span>
      </button>

      {/* OPTIONAL: If you prefer or need your existing UploadAttachmentModal */}
      {showUploadModal && (
        <UploadAttachmentModal
          testCaseId={testCase._id}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default AttachmentsTab;
