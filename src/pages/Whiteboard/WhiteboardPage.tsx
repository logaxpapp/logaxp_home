// src/features/whiteboard/WhiteboardPage.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetWhiteboardQuery,
  useUpdateWhiteboardMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
  useDeleteWhiteboardMutation,
  useRevertToSnapshotMutation,
  useDeleteSnapshotMutation,
  useGetBoardSnapshotsQuery,
  useGetBoardParticipantsQuery,
  IStroke,
} from '../../api/whiteboardApi';

import { IUser } from '../../types/user';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';

import CanvasWhiteboard from './CanvasWhiteboard';
import WhiteboardToolbar from './WhiteboardToolbar';
import ShapesSidebar from './ShapesSidebar'; // the new shapes panel

import { motion } from 'framer-motion';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

const WhiteboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = currentUser?._id;

  // Local strokes & tool states
  const [localStrokes, setLocalStrokes] = useState<IStroke[]>([]);
  const [undoStack, setUndoStack] = useState<IStroke[][]>([]);
  const [redoStack, setRedoStack] = useState<IStroke[][]>([]);
  const [snapshotMode, setSnapshotMode] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

  // Tools
  const [currentTool, setCurrentTool] = useState<
    // Extend to include all shapes in your union:
    IStroke['type']
  >('pen');

  // Text style toggles
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [useBullet, setUseBullet] = useState(false);

  // Drawing style
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);

  // Snapshots & participants pagination
  const [snapPage, setSnapPage] = useState(1);
  const snapLimit = 5;
  const [partPage, setPartPage] = useState(1);
  const partLimit = 5;

  // All Users pagination
  const [allUsersPage, setAllUsersPage] = useState(1);
  const allUsersLimit = 8;

  // Fetch board data
  const {
    data: activeBoard,
    isLoading: loadingBoard,
    isError: errorActiveBoard,
    refetch: refetchActiveBoard,
  } = useGetWhiteboardQuery(boardId!, { skip: !boardId });

  // Snapshots (paginated)
  const { data: snapshotData, refetch: refetchSnapshots } = useGetBoardSnapshotsQuery(
    { id: boardId || '', page: snapPage, limit: snapLimit },
    { skip: !boardId }
  );

  // Participants (paginated)
  const { data: participantData, refetch: refetchParticipants } =
    useGetBoardParticipantsQuery(
      { id: boardId || '', page: partPage, limit: partLimit },
      { skip: !boardId }
    );

  // All Users
  const {
    data: allUsersResponse,
    isLoading: loadingAllUsers,
    isError: errorAllUsers,
  } = useFetchAllUsersQuery({ page: allUsersPage, limit: allUsersLimit });

  const allUsers = allUsersResponse?.users || [];
  const allUsersTotal = allUsersResponse?.total || 0;

  // Mutations
  const [updateWhiteboard] = useUpdateWhiteboardMutation();
  const [deleteWhiteboard] = useDeleteWhiteboardMutation();
  const [addParticipant] = useAddParticipantMutation();
  const [removeParticipant] = useRemoveParticipantMutation();
  const [revertSnapshot] = useRevertToSnapshotMutation();
  const [deleteSnapshot] = useDeleteSnapshotMutation();

  // Must be logged in
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">Please log in to view this whiteboard.</p>
      </div>
    );
  }

  // On board load, sync local strokes
  useEffect(() => {
    if (activeBoard?.strokes) {
      setLocalStrokes(activeBoard.strokes);
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [activeBoard]);

  // Save Whiteboard
  const handleSave = async () => {
    if (!boardId) return;
    try {
      await updateWhiteboard({
        id: boardId,
        data: { strokes: localStrokes, createSnapshot: snapshotMode },
      }).unwrap();
      alert('Whiteboard saved!');
      setSnapshotMode(false);
      setSelectedSnapshot(null);
      refetchActiveBoard();
      if (snapshotMode) {
        refetchSnapshots();
      }
    } catch (err) {
      console.error('Failed to update whiteboard:', err);
    }
  };

  // Delete Whiteboard
  const handleDeleteBoard = async () => {
    if (!boardId) return;
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await deleteWhiteboard(boardId).unwrap();
      navigate('/whiteboards');
    } catch (err) {
      console.error('Failed to delete whiteboard:', err);
    }
  };

  // Revert Snapshot
  const handleRevertSnapshot = async () => {
    if (!boardId || !selectedSnapshot) return;
    try {
      await revertSnapshot({ id: boardId, snapshotId: selectedSnapshot }).unwrap();
      setSelectedSnapshot(null);
      refetchActiveBoard();
      refetchSnapshots();
    } catch (err) {
      console.error('Failed to revert snapshot:', err);
    }
  };

  // Delete Snapshot
  const handleDeleteSnapshot = async (snapshotId: string) => {
    if (!boardId) return;
    if (!window.confirm('Are you sure you want to delete this snapshot?')) return;
    try {
      await deleteSnapshot({ id: boardId, snapshotId }).unwrap();
      refetchActiveBoard();
      refetchSnapshots();
    } catch (err) {
      console.error(err);
    }
  };

  // Add/Remove Participant
  const handleAddParticipant = useCallback(
    async (userId: string) => {
      if (!boardId) return;
      try {
        await addParticipant({ id: boardId, userId }).unwrap();
        refetchParticipants();
      } catch (err) {
        console.error('Failed to add participant:', err);
        alert('Failed to add participant.');
      }
    },
    [boardId, addParticipant, refetchParticipants]
  );

  const handleRemoveParticipant = useCallback(
    async (userId: string) => {
      if (!boardId) return;
      try {
        await removeParticipant({ id: boardId, userId }).unwrap();
        refetchParticipants();
      } catch (err) {
        console.error('Failed to remove participant:', err);
        alert('Failed to remove participant.');
      }
    },
    [boardId, removeParticipant, refetchParticipants]
  );

  // Undo/Redo
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

  // Pagination totals
  const snapshotTotal = snapshotData?.total || 0;
  const snapshotPages = Math.ceil(snapshotTotal / snapLimit);

  const participantTotal = participantData?.total || 0;
  const participantPages = Math.ceil(participantTotal / partLimit);

  const allUsersPages = Math.ceil(allUsersTotal / allUsersLimit);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center space-x-4">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
          onClick={handleGoBack}
        >
          <FaArrowLeft />
        </button>
        {loadingBoard ? (
          <h1 className="text-xl font-bold">Loading Board...</h1>
        ) : errorActiveBoard ? (
          <h1 className="text-xl font-bold text-red-500">Error Loading Board</h1>
        ) : (
          <h1 className="text-xl font-bold">{activeBoard?.title || 'Untitled Board'}</h1>
        )}
        <div className="flex-1" />
        {boardId && (
          <button
            onClick={handleDeleteBoard}
            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition flex items-center space-x-2"
          >
            <FaTrash />
            <span>Delete Board</span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-grow px-4 py-2">
        {activeBoard && (
          <>
            {/* Whiteboard Toolbar */}
            <WhiteboardToolbar
              snapshotMode={snapshotMode}
              setSnapshotMode={setSnapshotMode}
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              currentColor={currentColor}
              setCurrentColor={setCurrentColor}
              lineWidth={lineWidth}
              setLineWidth={setLineWidth}
              isBold={isBold}
              setIsBold={setIsBold}
              isItalic={isItalic}
              setIsItalic={setIsItalic}
              textAlign={textAlign}
              setTextAlign={setTextAlign}
              useBullet={useBullet}
              setUseBullet={setUseBullet}
              canUndo={canUndo}
              canRedo={canRedo}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              handleClear={handleClear}
            />

            {/* Layout: Sidebar + Canvas */}
            <div className="flex mb-10">
              <ShapesSidebar
                currentTool={currentTool}
                onSelectTool={(tool) => {
                  handleBeginStroke();
                  setCurrentTool(tool as IStroke['type']);
                }}
              />
              <div className="flex-1 mb-10">
                <CanvasWhiteboard
                  localStrokes={localStrokes}
                  setLocalStrokes={setLocalStrokes}
                  serverVersion={activeBoard.version}
                  whiteboardId={activeBoard._id}
                  currentTool={currentTool}
                  currentColor={currentColor}
                  lineWidth={lineWidth}
                  onBeginStroke={handleBeginStroke}
                  isBold={isBold}
                  isItalic={isItalic}
                  textAlign={textAlign}
                  useBullet={useBullet}
                />

                {/* Save Button */}
                <div className=''>
                  <button
                    className="mt- px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 transition"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Snapshots */}
            <section className="bg-white p-4 rounded shadow mt-4">
              <h3 className="font-semibold mb-2">Snapshots (page {snapPage})</h3>
              <div className="space-y-2">
                {snapshotData?.snapshots?.map((snap: any) => (
                  <div
                    key={snap._id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <p className="font-medium">Version: {snap.version}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(snap.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedSnapshot(snap._id)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(snap._id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <button
                  disabled={snapPage <= 1}
                  onClick={() => setSnapPage((p) => p - 1)}
                  className="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-700">
                  Page {snapPage} of {Math.ceil((snapshotData?.total || 0) / snapLimit)}
                </span>
                <button
                  disabled={snapPage >= (snapshotData?.total || 0) / snapLimit}
                  onClick={() => setSnapPage((p) => p + 1)}
                  className="px-2 py-1 bg-gray-200 rounded disabled:bg-gray-100"
                >
                  Next
                </button>
              </div>
              {selectedSnapshot && (
                <div className="mt-2">
                  <button
                    onClick={handleRevertSnapshot}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Revert to Selected Snapshot
                  </button>
                </div>
              )}
            </section>

            {/* Participants */}
            <section className="bg-white p-4 rounded shadow mt-4">
              <h3 className="font-semibold mb-2">Participants (page {partPage})</h3>
              <ul className="list-disc ml-6 space-y-1">
                {participantData?.participants?.map((p: any) => (
                  <li key={p._id} className="flex items-center justify-between pr-2">
                    <span>{p.name || p.email || p._id}</span>
                    <button
                      onClick={() => handleRemoveParticipant(p._id)}
                      className="text-red-500 underline hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-center space-x-3">
                <button
                  disabled={partPage <= 1}
                  onClick={() => setPartPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition duration-200"
                >
                  Prev
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page <span className="font-semibold">{partPage}</span> of{' '}
                  <span className="font-semibold">
                    {Math.ceil((participantData?.total || 0) / partLimit)}
                  </span>
                </span>
                <button
                  disabled={partPage >= Math.ceil((participantData?.total || 0) / partLimit)}
                  onClick={() => setPartPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition duration-200"
                >
                  Next
                </button>
              </div>
            </section>

            {/* Additional Non-Paginated Participants */}
            <section className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Current Board Participants
              </h3>
              {activeBoard.participants?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {activeBoard.participants.map((p: any) => (
                    <li
                      key={p._id}
                      className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 rounded-md transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">
                          {p.name || p.email || p._id}
                        </span>
                        {p.role && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                            {p.role}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Remove participant ${p.name || p.email || p._id}?`
                            )
                          ) {
                            handleRemoveParticipant(p._id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 transition-colors rounded p-2"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No participants found.</p>
              )}
            </section>

            {/* All Users (Double-Click to Add) */}
            <section className="bg-white p-4 rounded shadow mt-4">
              <h3 className="text-lg font-semibold">
                Add Participant by Double-Click (page {allUsersPage})
              </h3>
              {loadingAllUsers && <p>Loading users...</p>}
              {errorAllUsers && <p className="text-red-500">Error loading users.</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                {allUsers.map((u: IUser) => (
                  <div
                    key={u._id}
                    onDoubleClick={() => handleAddParticipant(u._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer select-none hover:bg-blue-600 transition"
                    title="Double-click to add"
                  >
                    {u.name}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center space-x-3">
                <button
                  disabled={allUsersPage <= 1}
                  onClick={() => setAllUsersPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition duration-200"
                >
                  Prev
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page <span className="font-semibold">{allUsersPage}</span> of{' '}
                  <span className="font-semibold">
                    {Math.ceil(allUsersTotal / allUsersLimit)}
                  </span>
                </span>
                <button
                  disabled={allUsersPage >= Math.ceil(allUsersTotal / allUsersLimit)}
                  onClick={() => setAllUsersPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition duration-200"
                >
                  Next
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-gray-200 py-3 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} - LogaXP Whiteboard Editor
      </footer>
    </motion.div>
  );
};

export default WhiteboardPage;
