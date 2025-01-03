// src/components/Document/ProtectedDocumentManager.tsx
import React, { useState, useEffect } from 'react';
import {
  useCreateProtectedDocumentMutation,
  useDownloadProtectedDocumentMutation,
} from '../../api/documentApi';
import { useFetchAllUsersQuery,  } from '../../api/usersApi';
import { IUser } from '../../types/user';
import Button from '../common/Button/Button';
import { useToast } from '../../features/Toast/ToastContext';

const ProtectedDocumentManager: React.FC = () => {
  const { showToast } = useToast();

  // 1. Create protected doc
  const [createDoc, { isLoading: creating }] = useCreateProtectedDocumentMutation();
  // 2. Download protected doc
  const [downloadDoc, { isLoading: downloading }] = useDownloadProtectedDocumentMutation();

  // Fetch users for the user dropdown
  const { data: usersData } = useFetchAllUsersQuery({ page: 1, limit: 50 });
  const allUsers: IUser[] = usersData?.users || [];

  // Form states for creating
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientUserId, setRecipientUserId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  // States for download
  const [downloadDocId, setDownloadDocId] = useState('');
  const [downloadPassword, setDownloadPassword] = useState('');

  // Helper to reset the form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setRecipientEmail('');
    setRecipientUserId('');
    setIsPasswordProtected(false);
    setSelectedFile(null);
  };

  // Handle create
  const handleCreate = async () => {
    if (!title.trim() || !selectedFile) {
      showToast('Title and file are required', 'error');
      return;
    }
    // Warn if both userId and email are set
    if (recipientEmail && recipientUserId) {
      showToast('Please choose either a user OR an external email, not both.', 'error');
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('passwordProtected', String(isPasswordProtected));
    formData.append('attachment', selectedFile);

    if (recipientEmail.trim()) {
      formData.append('recipientEmail', recipientEmail);
    }
    if (recipientUserId.trim()) {
      formData.append('recipientUserId', recipientUserId);
    }

    try {
      await createDoc(formData).unwrap();
      showToast('Document created. If password-protected, check your email.', 'success');
      resetForm();
    } catch (error: any) {
      console.error(error);
      showToast(`Failed: ${error.data?.message || 'Unknown error'}`, 'error');
    }
  };

  // Handle download (verifying password)
  const handleDownload = async () => {
    if (!downloadDocId.trim() || !downloadPassword.trim()) {
      showToast('Document ID and password are required.', 'error');
      return;
    }

    try {
      const result = await downloadDoc({ docId: downloadDocId, password: downloadPassword }).unwrap();
      showToast('Password correct. Generating presigned URL...', 'success');

      // Actually open the presigned URL in a new tab
      window.open(result.presignedUrl, '_blank');
    } catch (error: any) {
      console.error(error);
      showToast(`Failed to download: ${error.data?.message || 'Invalid password'}`, 'error');
    }
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-md rounded-md space-y-6 min-h-screen sidebar">
      <h1 className="text-3xl font-bold mb-4">Protected Document Manager</h1>

      {/* CREATE SECTION */}
      <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4">
        <h2 className="text-lg font-semibold">Create & Send a Protected Document</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Password Protected Checkbox */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPasswordProtected}
              onChange={(e) => setIsPasswordProtected(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Password-Protect This Document</span>
          </label>
        </div>

        {/* User or Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dropdown for internal user */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Send to a User (Internal)</label>
            <select
              className="border rounded p-2 w-full"
              value={recipientUserId}
              onChange={(e) => {
                setRecipientUserId(e.target.value);
                if (e.target.value) {
                  setRecipientEmail(''); // clear external email if user is chosen
                }
              }}
            >
              <option value="">-- Not Selected --</option>
              {allUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          {/* External email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Or Send to External Email</label>
            <input
              className="w-full border rounded p-2"
              value={recipientEmail}
              onChange={(e) => {
                setRecipientEmail(e.target.value);
                if (e.target.value) {
                  setRecipientUserId('');
                }
              }}
              placeholder="someone@example.com"
            />
          </div>
        </div>

        {/* File */}
        <div>
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
        </div>

        <Button variant="primary" onClick={handleCreate} isLoading={creating}>
          Create & Send
        </Button>
      </div>

      {/* DOWNLOAD SECTION */}
      <div className="border p-4 rounded shadow-sm bg-gray-50 space-y-4">
        <h2 className="text-lg font-semibold">Download a Password-Protected Doc</h2>
        <p className="text-sm text-gray-700">
          Enter the Document ID and the Password you received by email to generate a presigned URL.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Document ID</label>
            <input
              className="w-full border rounded p-2"
              value={downloadDocId}
              onChange={(e) => setDownloadDocId(e.target.value)}
              placeholder="e.g. 64f9b771..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={downloadPassword}
              onChange={(e) => setDownloadPassword(e.target.value)}
              placeholder="e.g. abc123..."
            />
          </div>
        </div>

        <Button variant="secondary" onClick={handleDownload} isLoading={downloading}>
          Download
        </Button>
      </div>
    </div>
  );
};

export default ProtectedDocumentManager;
