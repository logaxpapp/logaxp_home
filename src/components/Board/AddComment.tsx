// src/components/AddComment.tsx

import React, { useState } from 'react';
import { useCreateCommentMutation } from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';

interface AddCommentProps {
  cardId: string;
}

const AddComment: React.FC<AddCommentProps> = ({ cardId }) => {
  const [commentContent, setCommentContent] = useState('');
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const { showToast } = useToast();

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      showToast('Comment cannot be empty.', 'error');
      return;
    }

    try {
      await createComment({
        cardId,      // Correct property name
        content: commentContent,
      }).unwrap();
      setCommentContent('');
      showToast('Comment added successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to add comment:', err);
      showToast(err?.data?.message || 'Error adding comment.', 'error');
    }
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleAddComment}>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default AddComment;
