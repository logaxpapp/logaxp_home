// src/components/AdminSendNewsletter.tsx

import React, { useState } from 'react';
import { useSendNewsletterMutation } from '../../api/newsletterApi';
import { useToast } from '../../features/Toast/ToastContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ClipLoader } from 'react-spinners';

const AdminSendNewsletter: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sendNewsletter, { isLoading }] = useSendNewsletterMutation();

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      showToast('Subject and content are required.');
      return;
    }
    try {
      await sendNewsletter({ subject, content }).unwrap();
      showToast('Newsletter sent successfully!');
      setSubject('');
      setContent('');
    } catch (err: any) {
      showToast(err.data?.message || 'Failed to send newsletter.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Send Newsletter</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="min-h-[400px]" // Adjusted to roughly 10 rows
            placeholder="Compose your newsletter content here..."
            style={{ height: '200px' }} // Ensuring 10 rows of content height
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center ${
              isLoading ? 'cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Send Newsletter'}
          </button>
          <button
            type="reset"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
            onClick={() => {
              setSubject('');
              setContent('');
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSendNewsletter;
