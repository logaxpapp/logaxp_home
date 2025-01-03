// src/components/Card/CommentSection.tsx

import React, { useState } from 'react';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useCreateReplyMutation,
  useToggleLikeCommentMutation,
  useFetchCommentsQuery,
} from '../../api/tasksApi';
import { useToast } from '../../features/Toast/ToastContext';
import { IComment } from '../../types/task';
import { FiTrash2, FiEdit, FiMessageSquare } from 'react-icons/fi';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

interface CommentSectionProps {
  cardId: string;
  currentUserId: string; // To identify if the current user has liked a comment
}

const CommentSection: React.FC<CommentSectionProps> = ({ cardId, currentUserId }) => {
  const [content, setContent] = useState('');
  const { showToast } = useToast();

  const [createComment, { isLoading: creating }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [editComment, { isLoading: isEditing }] = useEditCommentMutation();
  const [createReply, { isLoading: isCreatingReply }] = useCreateReplyMutation();
  const [toggleLikeComment, { isLoading: isLiking }] = useToggleLikeCommentMutation();

  // Use RTK Query to fetch comments
  const { data: comments, error, isLoading: isFetchingComments, refetch } = useFetchCommentsQuery(cardId);

  // State for Editing and Replying
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  const handleAddComment = async () => {
    if (!content.trim()) {
      showToast('Comment cannot be empty.', 'error');
      return;
    }

    try {
      await createComment({ cardId, content }).unwrap();
      setContent('');
      showToast('Comment added!', 'success');
      refetch(); // Re-fetch comments after adding
    } catch (err: any) {
      console.error('Failed to add comment:', err);
      showToast(err?.data?.message || 'Error adding comment.', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId).unwrap();
      showToast('Comment deleted!', 'success');
      refetch(); // Re-fetch comments after deletion
    } catch (err: any) {
      console.error('Failed to delete comment:', err);
      showToast(err?.data?.message || 'Error deleting comment.', 'error');
    }
  };

  const handleEditComment = async () => {
    if (!editedContent.trim()) {
      showToast('Comment cannot be empty.', 'error');
      return;
    }

    try {
      await editComment({ commentId: editingCommentId!, content: editedContent }).unwrap();
      showToast('Comment edited successfully!', 'success');
      setEditingCommentId(null);
      setEditedContent('');
      refetch();
    } catch (err: any) {
      console.error('Failed to edit comment:', err);
      showToast(err?.data?.message || 'Error editing comment.', 'error');
    }
  };

  const handleAddReply = async () => {
    if (!replyContent.trim()) {
      showToast('Reply cannot be empty.', 'error');
      return;
    }

    try {
      await createReply({ cardId, parentCommentId: replyingCommentId!, content: replyContent }).unwrap();
      showToast('Reply added!', 'success');
      setReplyingCommentId(null);
      setReplyContent('');
      refetch();
    } catch (err: any) {
      console.error('Failed to add reply:', err);
      showToast(err?.data?.message || 'Error adding reply.', 'error');
    }
  };

  const handleToggleLike = async (commentId: string) => {
    try {
      await toggleLikeComment(commentId).unwrap();
      showToast('Like updated!', 'success');
      refetch();
    } catch (err: any) {
      console.error('Failed to toggle like:', err);
      showToast(err?.data?.message || 'Error toggling like.', 'error');
    }
  };

  if (isFetchingComments) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>Error loading comments.</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {/* Add new comment */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddComment}
          disabled={creating}
          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center ${
            creating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {creating ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* List existing comments */}
      <ul className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((com) => (
            <li key={com._id} className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold">Author: {com.author.name}</p>
                  {editingCommentId === com._id ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-2 mt-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="mt-2">{com.content}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleLike(com._id)}
                    disabled={isLiking}
                    className="flex items-center text-red-500 hover:text-red-600"
                    aria-label={com.likes.includes(currentUserId) ? 'Unlike comment' : 'Like comment'}
                  >
                    {com.likes.includes(currentUserId) ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
                    <span className="ml-1">{com.likes.length}</span>
                  </button>
                  {editingCommentId === com._id ? (
                    <>
                      <button
                        onClick={handleEditComment}
                        disabled={isEditing}
                        className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center ${
                          isEditing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isEditing ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingCommentId(com._id);
                          setEditedContent(com.content);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                        aria-label={`Edit comment by ${com.author.name}`}
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setReplyingCommentId(com._id);
                          setReplyContent('');
                        }}
                        className="text-green-500 hover:text-green-600"
                        aria-label={`Reply to comment by ${com.author.name}`}
                      >
                        <FiMessageSquare size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(com._id)}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1"
                        aria-label={`Delete comment by ${com.author.name}`}
                      >
                        <FiTrash2 size={18} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Render Replies */}
              {com.parentCommentId === undefined && com.replies && com.replies.length > 0 && (
                <ul className="mt-4 space-y-2 pl-6">
                  {com.replies.map((reply) => (
                    <li key={reply._id} className="p-3 bg-gray-50 rounded shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold">Author: {reply.author.name}</p>
                          <p className="mt-1">{reply.content}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleLike(reply._id)}
                            disabled={isLiking}
                            className="flex items-center text-red-500 hover:text-red-600"
                            aria-label={reply.likes.includes(currentUserId) ? 'Unlike reply' : 'Like reply'}
                          >
                            {reply.likes.includes(currentUserId) ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
                            <span className="ml-1 text-sm">{reply.likes.length}</span>
                          </button>
                          {editingCommentId === reply._id ? (
                            <>
                              <button
                                onClick={handleEditComment}
                                disabled={isEditing}
                                className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center ${
                                  isEditing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                {isEditing ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCommentId(reply._id);
                                  setEditedContent(reply.content);
                                }}
                                className="text-blue-500 hover:text-blue-600"
                                aria-label={`Edit reply by ${reply.author.name}`}
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(reply._id)}
                                className="text-red-500 hover:text-red-600 flex items-center gap-1"
                                aria-label={`Delete reply by ${reply.author.name}`}
                              >
                                <FiTrash2 size={16} />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Reply Input */}
              {replyingCommentId === com._id && (
                <div className="mt-4 flex gap-2 pl-6">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleAddReply}
                    disabled={isCreatingReply}
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center ${
                      isCreatingReply ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isCreatingReply ? 'Replying...' : 'Reply'}
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No comments yet. Be the first to comment!</li>
        )}
      </ul>
    </div>
  );
};

export default CommentSection;
