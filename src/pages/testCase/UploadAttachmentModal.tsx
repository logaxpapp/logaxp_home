// "I want the vital message at all time."
// src/features/testManager/modals/UploadAttachmentModal.tsx

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUploadTestCaseAttachmentMutation } from '../../api/testCaseApi';
import { useToast } from '../../features/Toast/ToastContext';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

interface UploadAttachmentModalProps {
  testCaseId: string;
  onClose: () => void;
}

const UploadAttachmentModal: React.FC<UploadAttachmentModalProps> = ({
  testCaseId,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { showToast } = useToast();

  // RTK Query mutation hook
  const [uploadAttachment, { isLoading }] = useUploadTestCaseAttachmentMutation();

  // Handle file selection via "Browse" button
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Drag-and-drop events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Initiate upload
  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Please select a file to upload.');
      return;
    }

    try {
      await uploadAttachment({
        id: testCaseId,
        file: selectedFile,
      }).unwrap();

      showToast('Attachment uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Upload error', error);
      showToast('Failed to upload attachment.');
    }
  };

  // Remove the selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
          aria-hidden="true" // Marks overlay as decorative so screen readers ignore it
        />

        {/* Modal Card */}
        <motion.div
          className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-[500px] p-6"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          exit={{ y: 50 }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close upload attachment modal"
          >
            <FaTimes size={20} />
          </button>

          <h2
            id="upload-modal-title"
            className="text-xl font-semibold mb-4 text-gray-800"
          >
            Upload Attachment
          </h2>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0} // Make it focusable for keyboard users
            aria-label="Drag and drop a file here or browse to upload"
          >
            <FaCloudUploadAlt className="mx-auto text-gray-400 mb-3" size={40} />
            <p className="text-gray-600">
              Drag &amp; drop a file here or{' '}
              <label className="cursor-pointer text-blue-600 hover:underline">
                <span className="focus:outline-none">browse</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Select a file to upload"
                />
              </label>
            </p>

            {/* File Preview */}
            {selectedFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  Selected file: <strong>{selectedFile.name}</strong>
                </p>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700 text-sm mt-2"
                  aria-label="Remove selected file"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              disabled={isLoading || !selectedFile}
              aria-disabled={isLoading || !selectedFile}
            >
              {isLoading ? (
                <>
                  Uploading...
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadAttachmentModal;
