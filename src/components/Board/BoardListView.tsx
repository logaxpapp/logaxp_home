// src/components/BoardListView.tsx

import React, { useState } from 'react';
import { IBoard, ICardWithListName } from '../../types/task';
import AddList from './AddList'; // Use AddList component
import CardDetailsModal from './Card/CardDetailsModal';
import EditCardModal from './Card/EditCardModal'; // Use EditCardModal component
import { useDeleteCardMutation } from '../../api/cardApi';
import { useToast } from '../../features/Toast/ToastContext';

interface BoardListViewProps {
  board: IBoard | undefined;
}

const BoardListView: React.FC<BoardListViewProps> = ({ board }) => {
  // For opening the card details modal
  const [selectedCard, setSelectedCard] = useState<ICardWithListName | null>(null);
  const [editingCard, setEditingCard] = useState<ICardWithListName | null>(null);

  const [deleteCard] = useDeleteCardMutation();
  const { showToast } = useToast();

  if (!board) return <div>No board data available</div>;

  // Flatten all cards from all lists for easy table rendering
  const allCards: ICardWithListName[] = board.lists.flatMap((list) =>
    list.cards.map((card) => ({ ...card, listName: list.name }))
  );

  const handleEditCard = (card: ICardWithListName) => {
    setEditingCard(card);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteCard({ cardId }).unwrap(); // Pass an object with cardId
        showToast('Card deleted successfully!', 'success');
      } catch (err: any) {
        console.error('Failed to delete card:', err);
        showToast(err?.data?.message || 'Error deleting card.', 'error');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">List View for {board.name}</h2>
      <p className="text-gray-700 mb-6">{board.description}</p>

      {/* Add List Component */}
      <div className="mb-6">
        <AddList />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md shadow-sm">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                Title
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                List
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                Status
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                Priority
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Assignees
              </th>
              <th className="py-3 px-6 bg-gray-200 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allCards.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No cards available.
                </td>
              </tr>
            ) : (
              allCards.map((card) => (
                <tr
                  key={card._id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedCard(card)}
                >
                  <td className="py-4 px-6 border-b border-gray-200">
                    {card.title}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {card.description || '-'}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {card.listName}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {card.status}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {card.priority}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                  {card.assignees.length > 0
                    ? card.assignees
                        .map((assignee) =>
                          typeof assignee === 'string' ? 'Unknown Assignee' : assignee.name
                        )
                        .join(', ')
                    : '-'}
                </td>
                  <td className="py-4 px-6 border-b border-gray-200 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the row click
                        handleEditCard(card);
                      }}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      aria-label={`Edit ${card.title}`}
                    >
                      ✎
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the row click
                        handleDeleteCard(card._id);
                      }}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete ${card.title}`}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card Details Modal */}
      {selectedCard && (
        <CardDetailsModal
          isOpen={!!selectedCard}
          onRequestClose={() => setSelectedCard(null)}
          card={selectedCard}
        />
      )}

      {/* Edit Card Modal */}
      {editingCard && (
        <EditCardModal
          isOpen={!!editingCard}
          onRequestClose={() => setEditingCard(null)}
          card={editingCard}
        />
      )}
    </div>
  );
};

export default BoardListView;
