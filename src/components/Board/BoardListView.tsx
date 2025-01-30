// src/components/BoardListView.tsx

import React, { useState } from 'react';
import { IBoard, ICardWithListName } from '../../types/task';
import AddList from './AddList'; // Use AddList component
import CardDetailsModal from './Card/CardDetailsModal';
import EditCardModal from './Card/EditCardModal'; // Use EditCardModal component
import { useDeleteCardMutation } from '../../api/cardApi';
import { useToast } from '../../features/Toast/ToastContext';
import TruncatedTitle from '../../utils/TruncatedTitle';
import BoardListDetail from './BoardListDetail';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardListViewProps {
  board: IBoard | undefined;
}

const BoardListView: React.FC<BoardListViewProps> = ({ board }) => {
  // For opening the card details modal
  const [selectedCard, setSelectedCard] = useState<ICardWithListName | null>(null);
  // For editing the card 
  const [editingCard, setEditingCard] = useState<ICardWithListName | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // for viewing the card
  const [viewSelectedCard, setViewSelectedCard] = useState<ICardWithListName | null>(null);

  const [deleteCard] = useDeleteCardMutation();
  const { showToast } = useToast();

  if (!board) return <div>No board data available</div>;

  // Flatten all cards from all lists for easy table rendering
  const allCards: ICardWithListName[] = board.lists.flatMap((list) =>
    list.cards.map((card) => ({ ...card, listName: list.header })) // Use list.header instead of list.name
  );

  const handleViewCard = (card: ICardWithListName) => {
    setViewSelectedCard(card); // Set the selected card
    setIsDetailOpen(true); // Open the modal
  };

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

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">List View for {board.name}</h2>
      <p className="text-gray-700 mb-6">{board.description}</p>

      {/* Add List Component */}
      <div className="mb-6">
        <AddList />
      </div>

      <div className="overflow-x-auto text-gray-900">
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
                Due Date
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
            <AnimatePresence>
              {allCards.length === 0 ? (
                <motion.tr
                  key="no-cards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    No cards available.
                  </td>
                </motion.tr>
              ) : (
                allCards.map((card) => (
                  <motion.tr
                    key={card._id}
                    className="hover:bg-gray-100 cursor-pointer"
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <td className="py-4 px-6 border-b border-gray-200">
                      <TruncatedTitle text={card.title} wordLimit={5} />
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <TruncatedTitle text={card.description || '-'} wordLimit={5} />
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {card.dueDate ? new Date(card.dueDate).toLocaleDateString() : '-'}
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
                      {/* Buttons: View, Edit, Delete */}
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCard(card);
                        }}
                        className="text-green-500 hover:text-green-700 mr-2"
                        aria-label={`View ${card.title}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        👁️
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCard(card);
                        }}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        aria-label={`Edit ${card.title}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        ✎
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card._id);
                        }}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Delete ${card.title}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        🗑️
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Card Details Modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailsModal
            isOpen={!!selectedCard}
            onRequestClose={() => setSelectedCard(null)}
            card={selectedCard}
            boardId={board._id}
          />
        )}
      </AnimatePresence>

      {/* Edit Card Modal */}
      <AnimatePresence>
        {editingCard && (
          <EditCardModal
            isOpen={!!editingCard}
            onRequestClose={() => setEditingCard(null)}
            card={editingCard}
            boardId={board._id}
          />
        )}
      </AnimatePresence>

      {/* BoardListDetail Modal */}
      <AnimatePresence>
        {isDetailOpen && viewSelectedCard && (
          <BoardListDetail
            card={viewSelectedCard}
            onClose={() => {
              setIsDetailOpen(false);
              setViewSelectedCard(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoardListView;
