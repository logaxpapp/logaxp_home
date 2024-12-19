import React, { useState } from 'react';
import {
  useCreateNewsletterMutation,
  useGetAllNewslettersQuery,
  useUpdateNewsletterMutation,
  useDeleteNewsletterMutation,
  useSendNewsletterMutation, // Ensuring this is included
} from '../../api/newsletterApi';
import { useToast } from '../../features/Toast/ToastContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ClipLoader } from 'react-spinners'; 
import { uploadImage } from '../../services/cloudinaryService';

const AdminSendNewsletter: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(null);
  const { data: newsletters, refetch } = useGetAllNewslettersQuery();
  const [createNewsletter, { isLoading: isCreating }] = useCreateNewsletterMutation();
  const [updateNewsletter, { isLoading: isUpdating }] = useUpdateNewsletterMutation();
  const [deleteNewsletter] = useDeleteNewsletterMutation();
  const [sendNewsletter, { isLoading: isSending }] = useSendNewsletterMutation(); // Added

  const { showToast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      showToast('Subject and content are required.');
      return;
    }

    try {
      if (selectedNewsletterId) {
        await updateNewsletter({ id: selectedNewsletterId, updates: { subject, content } }).unwrap();
        showToast('Newsletter updated successfully!');
      } else {
        await createNewsletter({ subject, content }).unwrap();
        showToast('Newsletter created successfully!');
      }
      setSubject('');
      setContent('');
      setSelectedNewsletterId(null);
      refetch();
    } catch (err: any) {
      showToast(err.data?.message || 'Failed to save newsletter.');
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      showToast('Subject and content are required.');
      return;
    }

    try {
      await sendNewsletter({ subject, content }).unwrap();
      showToast('Newsletter sent to all confirmed subscribers successfully!');
    } catch (err: any) {
      showToast(err.data?.message || 'Failed to send newsletter.');
    }
  };

  const handleEdit = (id: string, subject: string, content: string) => {
    setSelectedNewsletterId(id);
    setSubject(subject);
    setContent(content);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNewsletter(id).unwrap();
      showToast('Newsletter deleted successfully!');
      refetch();
    } catch (err: any) {
      showToast(err.data?.message || 'Failed to delete newsletter.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8  font-secondary ">
      <h2 className="text-2xl font-semibold mb-6">
        {selectedNewsletterId ? 'Edit Newsletter' : 'Send Newsletter'}
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter newsletter subject"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="min-h-[400px]"
            placeholder="Compose your newsletter content here..."
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center ${
              isCreating || isUpdating ? 'cursor-not-allowed' : ''
            }`}
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <ClipLoader size={20} color="#ffffff" />
            ) : selectedNewsletterId ? (
              'Update Newsletter'
            ) : (
              'Save Newsletter'
            )}
          </button>
          <button
            type="button"
            className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none flex items-center ${
              isSending ? 'cursor-not-allowed' : ''
            }`}
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? <ClipLoader size={20} color="#ffffff" /> : 'Send to All Subscribers'}
          </button>
          <button
            type="reset"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
            onClick={() => {
              setSubject('');
              setContent('');
              setSelectedNewsletterId(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Sent Newsletters</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Subject
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Sent At
                </th>
                <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {newsletters?.map((newsletter) => (
                <tr key={newsletter._id} className="border-b">
                  <td className="py-4 px-6 text-sm text-gray-900">{newsletter.subject}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{new Date(newsletter.sentAt).toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-center">
                    <button
                      onClick={() => handleEdit(newsletter._id, newsletter.subject, newsletter.content)}
                      className="text-blue-600 hover:text-blue-900 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(newsletter._id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!newsletters?.length && (
                <tr>
                  <td colSpan={3} className="py-4 px-6 text-sm text-center text-gray-500">
                    No newsletters available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSendNewsletter;
