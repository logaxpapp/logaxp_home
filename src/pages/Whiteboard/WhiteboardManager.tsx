import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  useFetchMyWhiteboardsQuery,
  useCreateWhiteboardMutation,
  useDeleteWhiteboardMutation,
  useEditWhiteboardMutation
} from '../../api/whiteboardApi';
import { IWhiteboard } from '../../api/whiteboardApi';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { FaPlus, FaTrash, FaEdit, FaList, FaThLarge } from 'react-icons/fa';

const WhiteboardManager: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?._id;

  // State for creating a new board
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  // State for editing a board
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<IWhiteboard | null>(null);
  const [editBoardTitle, setEditBoardTitle] = useState('');
  const [editBoardDesc, setEditBoardDesc] = useState('');

  // Optional toggles for Card/List
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // RTK Query hooks for boards
  const {
    data: myBoards,
    isLoading: loadingBoards,
    isError: errorBoards,
    refetch: refetchBoards,
  } = useFetchMyWhiteboardsQuery();

  const [createWhiteboard] = useCreateWhiteboardMutation();
  const [deleteWhiteboard] = useDeleteWhiteboardMutation();
  const [editWhiteboard, { isLoading }] = useEditWhiteboardMutation();

  // If user is not logged in
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">Please log in to view your whiteboards.</p>
      </div>
    );
  }

  // Create Board
  const handleCreateBoard = async () => {
    if (!newBoardTitle) return;

    try {
      await createWhiteboard({
        ownerId: currentUserId,
        title: newBoardTitle,
        description: newBoardDesc,
      }).unwrap();
      setNewBoardTitle('');
      setNewBoardDesc('');
      setIsCreateModalOpen(false);
      refetchBoards();
    } catch (error) {
      console.error('Failed to create whiteboard:', error);
    }
  };

  // Delete Board
  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await deleteWhiteboard(boardId).unwrap();
      refetchBoards();
    } catch (error) {
      console.error('Failed to delete whiteboard:', error);
    }
  };

  // Navigate to Board
  const handleGoToBoard = (boardId: string) => {
    navigate(`/dashboard/whiteboard/${boardId}`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (board: IWhiteboard) => {
    setEditingBoard(board);
    setEditBoardTitle(board.title);
    setEditBoardDesc(board.description || '');
    setIsEditModalOpen(true);
  };

  // Update Board
  const handleUpdateBoard = async () => {
    if (!editingBoard) return;

    try {
      await editWhiteboard({
        id: editingBoard._id,
        data: {
          title: editBoardTitle,
          description: editBoardDesc,
        },
      }).unwrap();
      setIsEditModalOpen(false);
      refetchBoards();
    } catch (error) {
      console.error('Failed to update whiteboard:', error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Whiteboards</h1>

        {/* Create New Board Button and View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <FaPlus className="w-5 h-5" />
            <span></span>
          </button>

          {/* Toggle Card/List View */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaThLarge className="w-5 h-5" />
              <span></span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg flex items-center  ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FaList className="w-5 h-5" />
              <span></span>
            </button>
          </div>
        </div>

        {/* List of Boards */}
        {loadingBoards && <p className="text-center">Loading your boards...</p>}
        {errorBoards && <p className="text-center text-red-500">Error loading boards.</p>}
        {myBoards && myBoards.length === 0 && (
          <p className="text-center text-gray-600">No boards found. Create one above!</p>
        )}

        {/* Rendering Boards in Card or List mode */}
        <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {myBoards?.map((board: IWhiteboard) => (
            <motion.div
              key={board._id}
              className={`bg-white rounded-lg shadow hover:shadow-lg transition ${
                viewMode === 'card' ? 'p-6 flex flex-col cursor-pointer' : 'p-4 flex items-center justify-between'
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleGoToBoard(board._id)}
            >
              <div className={viewMode === 'card' ? 'flex-grow' : ''}>
                <h3 className="text-lg font-semibold mb-2">{board.title}</h3>
                <p className="text-sm text-gray-600">{board.description}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(board);
                  }}
                  className="px-3 py-1 text-blue-500 bg-yellow-50 rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <FaEdit className="w-4 h-4" />
                  <span></span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board._id);
                  }}
                  className="px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 flex items-center"
                >
                  <FaTrash className="w-4 h-4" />
                 
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Board Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsCreateModalOpen(false)}
            />
            {/* Modal Content */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg relative z-10 w-[400px]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-4">Create New Whiteboard</h2>
              <label className="block mb-2">
                Title
                <input
                  type="text"
                  placeholder="Title"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                />
              </label>
              <label className="block mb-4">
                Description
                <textarea
                  placeholder="Description"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={handleCreateBoard}
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Board Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingBoard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsEditModalOpen(false)}
            />
            {/* Modal Content */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg relative z-10 w-[400px]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-4">Edit Whiteboard</h2>
              <label className="block mb-2">
                Title
                <input
                  type="text"
                  placeholder="Title"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editBoardTitle}
                  onChange={(e) => setEditBoardTitle(e.target.value)}
                />
              </label>
              <label className="block mb-4">
                Description
                <textarea
                  placeholder="Description"
                  className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editBoardDesc}
                  onChange={(e) => setEditBoardDesc(e.target.value)}
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={handleUpdateBoard}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WhiteboardManager;