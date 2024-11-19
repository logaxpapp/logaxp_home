// src/components/Tickets/CommentsList.tsx

import React from 'react';
import { IComment } from '../../types/ticket';
import { IUser } from '../../types/user';

interface CommentsListProps {
  comments: IComment[];
  usersData?: IUser[];
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, usersData }) => {
  if (!comments || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  const usersMap = new Map<string, IUser>();
  usersData?.forEach((user) => {
    usersMap.set(user._id, user);
  });

  const getAuthorName = (author: string | IUser): string => {
    if (typeof author === 'string') {
      return usersMap.get(author)?.name || author;
    } else if (author && author.name) {
      return author.name;
    } else {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="border p-4 rounded">
          <p className="text-sm text-gray-600">
            <strong>{getAuthorName(comment.author.name)}</strong> commented on{' '}
            {new Date(comment.date).toLocaleString()}
          </p>
          <p className="mt-2 text-gray-800">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
