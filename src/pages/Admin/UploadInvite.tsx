import React, { useState } from 'react';
import { useBulkUploadUsersMutation, useCreateUserAndSendInviteMutation } from '../../api/usersApi';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Feedback/Modal';
import { useToast } from '../../features/Toast/ToastContext';

const UploadInvite: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkUploadUsers] = useBulkUploadUsersMutation();
  const [createUserAndSendInvite] = useCreateUserAndSendInviteMutation();
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a CSV file to upload.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await bulkUploadUsers(formData).unwrap();
      showToast('Users uploaded successfully!', 'success');
      setFile(null);
    } catch (error) {
      showToast('Failed to upload users. Please try again.', 'error');
    }
  };

  const handleCreateInvite = async (name: string, email: string, role: string) => {
    try {
      const defaultPassword = 'Password@123';
      await createUserAndSendInvite({
        name,
        email,
        role,
        password: defaultPassword,
      }).unwrap();
      showToast('User created and invitation sent successfully!', 'success');
      setIsModalOpen(false);
    } catch (error) {
      showToast('Failed to send invitation. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-blue-50 p-4 min-h-screen">
      <div className="justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <header className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-3xl font-bold text-blue-700">User Creation</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Invite User
        </Button>
      </header>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 font-primary">Bulk Upload Users</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 focus:outline-none"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
          <div className="mt-4">
            <Button variant="primary" onClick={handleUpload} disabled={!file}>
              Upload
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-white to-blue-50 p-6 shadow-lg rounded-lg flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 font-primary">
            How to Use Bulk Upload
          </h2>
          <p className="text-gray-600 mb-4">
            Upload a CSV file containing user details such as <strong>name</strong>,{' '}
            <strong>email</strong>, and <strong>role</strong>. Ensure the file follows the
            provided template.
          </p>
          <a
            href="/path/to/template.csv"
            download
            className="inline-block text-blue-600 font-medium hover:underline"
          >
            Download Template
          </a>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite User">
        <InviteUserForm onSubmit={handleCreateInvite} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

interface InviteUserFormProps {
  onSubmit: (name: string, email: string, role: string) => void;
  onClose: () => void;
}

const InviteUserForm: React.FC<InviteUserFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, role);
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="support">Support</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Send Invite
        </Button>
      </div>
    </form>
  );
};

export default UploadInvite;
