// src/components/Card/CardActions.tsx

import React from 'react';
import { useLikeCardMutation, useUnlikeCardMutation, useAddWatcherToCardMutation, useRemoveWatcherFromCardMutation } from '../../../api/cardApi';
import { useToast } from '../../../features/Toast/ToastContext';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../../../store/slices/authSlice';

interface CardActionsProps {
  cardId: string;
  isLiked: boolean;
  likesCount: number;
  isWatching: boolean;
  watchersCount: number;
}

const CardActions: React.FC<CardActionsProps> = ({ cardId, isLiked, likesCount, isWatching, watchersCount }) => {
  const { showToast } = useToast();
  const user = useAppSelector(selectCurrentUser);
  const currentUserId = user?._id;

  const [likeCard] = useLikeCardMutation();
  const [unlikeCard] = useUnlikeCardMutation();
  const [addWatcherToCard] = useAddWatcherToCardMutation();
  const [removeWatcherFromCard] = useRemoveWatcherFromCardMutation();

  const handleLike = async () => {
    if (!currentUserId) {
      showToast('You must be logged in to like a card.', 'error');
      return;
    }

    try {
      if (isLiked) {
        await unlikeCard({ cardId }).unwrap();
        showToast('You unliked the card.', 'info');
      } else {
        await likeCard({ cardId }).unwrap();
        showToast('You liked the card!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Error updating like status.', 'error');
    }
  };

  const handleWatcher = async () => {
    if (!currentUserId) {
      showToast('You must be logged in to watch a card.', 'error');
      return;
    }

    try {
      if (isWatching) {
        await removeWatcherFromCard({ cardId, userId: currentUserId }).unwrap();
        showToast('You stopped watching the card.', 'info');
      } else {
        await addWatcherToCard({ cardId, userId: currentUserId }).unwrap();
        showToast('You are now watching the card!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Error updating watcher status.', 'error');
    }
  };

  return (
    <div className="flex items-center space-x-4 mt-2">
      {/* Like Button */}
      <button onClick={handleLike} className="flex items-center space-x-1">
        {isLiked ? '❤️' : '🤍'}
        <span>{likesCount}</span>
      </button>
      
      {/* Watcher Button */}
      <button onClick={handleWatcher} className="flex items-center space-x-1">
        {isWatching ? '👁️‍🗨️ Unwatch' : '👁️ Watch'}
        <span>{watchersCount}</span>
      </button>
    </div>
  );
};

export default CardActions;
