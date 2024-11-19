// src/components/Tickets/AddCommentForm.tsx

import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';

interface AddCommentFormProps {
  onAddComment: (content: string) => void;
  isLoading: boolean;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ onAddComment, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === '') return;
    onAddComment(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Add a comment..."
        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        required
      ></textarea>
      <div className="mt-2 flex justify-end">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Comment'}
        </Button>
      </div>
    </form>
  );
};

export default AddCommentForm;
