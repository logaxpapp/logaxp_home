// src/pages/Whiteboard/WhiteboardManager.tsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IUser } from '../../types/user';
import {
  useFetchMyWhiteboardsQuery,
  useCreateWhiteboardMutation,
  useGetWhiteboardQuery,
  useUpdateWhiteboardMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
  useRevertToSnapshotMutation,
  useDeleteWhiteboardMutation,
  IWhiteboard,
  IStroke,
} from '../../api/whiteboardApi';
import { FaTrash } from 'react-icons/fa';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import SingleSelect from '../../components/common/Input/SelectDropdown/SingleSelect';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';

// Canvas and Toolbar
import CanvasWhiteboard from './CanvasWhiteboard';
import WhiteboardToolbar from './WhiteboardToolbar';

const WhiteboardManager: React.FC = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?._id;

  // Which board is selected
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  // Modal for creating new board
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  // Strokes + Undo/Redo
  const [localStrokes, setLocalStrokes] = useState<IStroke[]>([]);
  const [undoStack, setUndoStack] = useState<IStroke[][]>([]);
  const [redoStack, setRedoStack] = useState<IStroke[][]>([]);

  // Snapshots
  const [snapshotMode, setSnapshotMode] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

  // Tools
  const [currentTool, setCurrentTool] =
    useState<'pen' | 'rectangle' | 'eraser' | 'text'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);

  // Fetch boards
  const {
    data: myBoards,
    isLoading: loadingBoards,
    isError: errorBoards,
    refetch: refetchBoards,
  } = useFetchMyWhiteboardsQuery();

  const [createWhiteboard] = useCreateWhiteboardMutation();

  // Fetch active board
  const {
    data: activeBoard,
    isLoading: loadingBoard,
    isError: errorActiveBoard,
    refetch: refetchActiveBoard,
  } = useGetWhiteboardQuery(selectedBoardId!, {
    skip: !selectedBoardId,
  });

  const [updateWhiteboard] = useUpdateWhiteboardMutation();
  const [addParticipant] = useAddParticipantMutation();
  const [removeParticipant] = useRemoveParticipantMutation();
  const [revertSnapshot] = useRevertToSnapshotMutation();
  const [deleteWhiteboard] = useDeleteWhiteboardMutation();

  // (Optional) fetch users for participant adding
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const { data: allUsers } = useFetchAllUsersQuery({ page, limit });

  // Whenever the activeBoard changes, set localStrokes & reset undo/redo
  useEffect(() => {
    if (activeBoard?.strokes) {
      setLocalStrokes(activeBoard.strokes);
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [activeBoard]);

  // Create a new board
  const handleCreateBoard = async () => {
    if (!currentUserId) {
      alert('Please log in');
      return;
    }
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
    } catch (err) {
      console.error('Failed to create whiteboard:', err);
    }
  };

  // Select a board
  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setSnapshotMode(false);
    setSelectedSnapshot(null);
  };

  // Save strokes
  const handleSave = async () => {
    if (!selectedBoardId) return;
    try {
      await updateWhiteboard({
        id: selectedBoardId,
        data: {
          strokes: localStrokes,
          createSnapshot: snapshotMode,
        },
      }).unwrap();
      alert('Whiteboard saved!');
      setSnapshotMode(false);
      setSelectedSnapshot(null);
      refetchActiveBoard();
    } catch (error) {
      console.error('Failed to update whiteboard:', error);
    }
  };

  // Add participant
  const handleAddParticipant = async (userId: string) => {
    if (!selectedBoardId) return;
    try {
      await addParticipant({ id: selectedBoardId, userId }).unwrap();
      refetchActiveBoard();
    } catch (error) {
      console.error('Failed to add participant:', error);
    }
  };

  // Remove participant
  const handleRemoveParticipant = async (userId: string) => {
    if (!selectedBoardId) return;
    try {
      await removeParticipant({ id: selectedBoardId, userId }).unwrap();
      refetchActiveBoard();
    } catch (error) {
      console.error('Failed to remove participant:', error);
    }
  };

  // Revert to snapshot
  const handleRevertSnapshot = async () => {
    if (!selectedBoardId || !selectedSnapshot) return;
    try {
      await revertSnapshot({ id: selectedBoardId, snapshotId: selectedSnapshot }).unwrap();
      setSelectedSnapshot(null);
      refetchActiveBoard();
    } catch (error) {
      console.error('Failed to revert snapshot:', error);
    }
  };

  // Delete a board
  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await deleteWhiteboard(boardId).unwrap();
      refetchBoards();
      if (boardId === selectedBoardId) {
        setSelectedBoardId(null);
        setLocalStrokes([]);
        setUndoStack([]);
        setRedoStack([]);
      }
    } catch (error) {
      console.error('Failed to delete whiteboard:', error);
    }
  };

  // Delete a snapshot
  const handleDeleteSnapshot = async (snapshotId: string) => {
    if (!selectedBoardId) return;
    if (!window.confirm('Are you sure you want to delete this snapshot?')) return;
    try {
      const response = await fetch(
        `/api/whiteboards/${selectedBoardId}/snapshots/${snapshotId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete snapshot');
      }
      refetchActiveBoard();
    } catch (err) {
      console.error(err);
    }
  };

  // Undo/Redo/Clear logic
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const handleBeginStroke = () => {
    setUndoStack((prev) => [...prev, structuredClone(localStrokes)]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (!canUndo) return;
    const prevState = undoStack[undoStack.length - 1];
    setUndoStack((us) => us.slice(0, us.length - 1));
    setRedoStack((rs) => [...rs, structuredClone(localStrokes)]);
    setLocalStrokes(prevState);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((rs) => rs.slice(0, rs.length - 1));
    setUndoStack((us) => [...us, structuredClone(localStrokes)]);
    setLocalStrokes(nextState);
  };

  const handleClear = () => {
    setUndoStack((prev) => [...prev, structuredClone(localStrokes)]);
    setLocalStrokes([]);
    setRedoStack([]);
  };

  // If not logged in, show a message
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">Please log in to manage your whiteboards.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Sticky header with the vital message */}
      <header className="sticky top-0 bg-gray-800 text-white p-2 z-50 text-center">
        <p className="text-sm sm:text-base">
          I want the vital message at all time
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-grow px-4 py-6 space-y-8">
        {/* ----- Modal for Creating Whiteboard ----- */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Modal Overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsCreateModalOpen(false)}
            />
            {/* Modal Content */}
            <div className="bg-white p-6 rounded shadow relative z-10 w-[400px]">
              <h2 className="text-xl font-bold mb-4">Create New Whiteboard</h2>
              <label className="block mb-2">
                Title
                <input
                  type="text"
                  placeholder="Title"
                  className="border p-2 w-full mb-2"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                />
              </label>
              <label className="block mb-4">
                Description
                <textarea
                  placeholder="Description"
                  className="border p-2 w-full"
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                />
              </label>

              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleCreateBoard}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----- Section: Board Selection & Creation ----- */}
        <section className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-xl font-semibold">Manage Whiteboards</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:bg-blue-600 transition duration-200 transform hover:scale-105"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New
            </button>

            {/* SingleSelect for existing boards */}
            {myBoards && myBoards.length > 0 && (
              <SingleSelect
                label="Select a Board"
                options={myBoards.map((board) => ({
                  value: board._id,
                  label: board.title,
                }))}
                value={selectedBoardId}
                onChange={(val) => {
                  if (!val) {
                    setSelectedBoardId(null);
                    setLocalStrokes([]);
                    setUndoStack([]);
                    setRedoStack([]);
                  } else {
                    handleSelectBoard(val);
                  }
                }}
                placeholder="Choose a Whiteboard..."
                isLoading={loadingBoards}
              />
            )}

            {/* Button to delete selected board */}
            {selectedBoardId && (
              <button
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                onClick={() => handleDeleteBoard(selectedBoardId)}
              >
                Delete
              </button>
            )}
          </div>

          {loadingBoards && <p>Loading boards...</p>}
          {errorBoards && <p>Error loading boards.</p>}
          {myBoards && myBoards.length === 0 && (
            <p>No boards found. Create one above!</p>
          )}
        </section>

        {/* ----- Section: Current Selected Board ----- */}
        {selectedBoardId && activeBoard && (
          <section className="bg-white p-6 rounded-lg shadow space-y-6">
            {/* Board Header */}
            <div>
              <h2 className="text-lg font-bold mb-2">
                {activeBoard.title}{' '}
                <span className="text-gray-600 ml-2">
                  (Version {activeBoard.version})
                </span>
              </h2>
              <p className="text-gray-600">
                Owner:{' '}
                {typeof activeBoard.owner === 'object'
                  ? (activeBoard.owner as any).name
                  : 'N/A'}
              </p>
            </div>

            {/* Toolbar */}
            <WhiteboardToolbar
              snapshotMode={snapshotMode}
              setSnapshotMode={setSnapshotMode}
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              lineWidth={lineWidth}
              setLineWidth={setLineWidth}
              canUndo={canUndo}
              canRedo={canRedo}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              handleClear={handleClear}
            />

            {/* Canvas Editor */}
            <CanvasWhiteboard
              localStrokes={localStrokes}
              setLocalStrokes={setLocalStrokes}
              serverVersion={activeBoard.version}
              whiteboardId={activeBoard._id}
              currentTool={currentTool}
              currentColor={currentColor}
              lineWidth={lineWidth}
              onBeginStroke={handleBeginStroke}
            />

            {/* Save button */}
            <div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>

            {/* Participants */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold">Participants</h3>
              <ul className="list-disc ml-6">
                {activeBoard.participants &&
                  (activeBoard.participants as any[]).map((p: any) => (
                    <li key={p._id} className="flex items-center gap-2">
                      <span>{p.name || p.email || p._id}</span>
                      <button
                        onClick={() => handleRemoveParticipant(p._id)}
                        className="text-red-500 underline hover:text-red-700 hover:bg-red-100 transition-colors rounded px-1"
                      >
                        <FaTrash className="inline w-4 h-4" />
                      </button>
                    </li>
                  ))}
              </ul>
              {/* Add participant from user list */}
              {allUsers?.users && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <p className="text-sm text-gray-600">Add participant:</p>
                  {allUsers.users.map((u: IUser) => (
                    <button
                      key={u._id}
                      className="bg-blue-100 px-2 py-1 rounded text-sm hover:bg-blue-200 transition"
                      onClick={() => handleAddParticipant(u._id)}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Snapshots */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Snapshots</h3>
              <div className="space-y-3">
                {activeBoard.snapshots?.map((snap) => (
                  <div
                    key={snap._id as string}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">Version: {snap.version}</p>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(snap.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSnapshot(snap._id as string)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(snap._id as string)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {selectedSnapshot && (
                <div className="mt-4">
                  <button
                    onClick={handleRevertSnapshot}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Revert to Selected Snapshot
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer (optional) */}
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} - Whiteboard Manager
      </footer>
    </motion.div>
  );
};

export default WhiteboardManager;
