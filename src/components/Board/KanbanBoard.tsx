// src/components/KanbanBoard.tsx

import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Logo from '../../assets/images/green.png'; // Keep your logo import
import {
  useFetchBoardByIdQuery,
  useUpdateListMutation,
  useUpdateBoardListsMutation,
  useUpdateBoardMutation,
  useUpdateListHeaderMutation,
  useDeleteBoardMutation, // For deleting board
} from '../../api/tasksApi';
import { useUpdateCardMutation } from '../../api/cardApi';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useToast } from '../../features/Toast/ToastContext';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { IBoard, IList, ICard } from '../../types/task';
import BoardListView from './BoardListView';
import LabelsModal from './LabelsModal';
import LikesModal from './LikesModal';
import WatchersModal from './WatchersModal';
import TeamsDropdown from './TeamsDropdown';
import AddCardForm from './Card/AddCardForm';
import CardDetailsModal from './Card/CardDetailsModal';
import EditBoardForm from './EditBoardForm';
import GanttChartView from './GanttChartView';
import Modal from './Modal'; 
import useWindowWidth from '../../hooks/useWindowWidth'; 
import { tasksApi } from '../../api/tasksApi'; 
import BoardActivities from './BoardActivities'; 
import {
  FiChevronRight,
  FiChevronLeft,
  FiActivity,
  FiPlus,
  FiSave,
  FiTrash2,
  FiEdit2,
  FiPaperclip,
  FiX,
} from 'react-icons/fi';
import { FaList, FaEllipsisV } from 'react-icons/fa';
import { Transition, Dialog, Menu } from '@headlessui/react';
import { Fragment as ReactFragment } from 'react'; // If needed for transitions
import TruncatedTitle from '../../utils/TruncatedTitle';

// type fix for 'Fragment' usage in multiple places
const FragmentWrap = Fragment;

type ViewMode = 'kanban' | 'list' | 'gantt';

const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch(); 
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const currentUser = useAppSelector(selectCurrentUser);

  // API hooks
  const { data: board, error, isLoading } = useFetchBoardByIdQuery(boardId!);
  const [updateList] = useUpdateListMutation();
  const [updateCard] = useUpdateCardMutation();
  const [updateBoardLists] = useUpdateBoardListsMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [updateListHeader] = useUpdateListHeaderMutation();
  const [deleteBoard] = useDeleteBoardMutation();

  const { showToast } = useToast();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<IList | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

  // Additional modals
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isWatchersModalOpen, setIsWatchersModalOpen] = useState(false);

  // Board's lists/headers
  const [headers, setHeaders] = useState<{ id: string; name: string }[]>([]);
  const [editedHeaders, setEditedHeaders] = useState<{ [key: string]: string }>({});
  const [collapsedColumns, setCollapsedColumns] = useState<{ [key: string]: boolean }>({});

  // Access user role
  const currentUserRole = currentUser?.role || 'user';
  const isAdminOrOwner = currentUserRole === 'admin' || (board && board.owner === currentUser?._id);

  // "Show more/less" for Board Description
  const [showFullDescription, setShowFullDescription] = useState(false);
  const DESCRIPTION_LIMIT = 100; // Characters to show before "Show more"

  // For responsive columns
  const width = useWindowWidth();
  let maxOpenColumns = 1; 
  if (width >= 1536) {
    maxOpenColumns = 5; // 2xl
  } else if (width >= 1280) {
    maxOpenColumns = 4; // xl
  } else if (width >= 1024) {
    maxOpenColumns = 3; // lg
  } else if (width >= 768) {
    maxOpenColumns = 2; // md
  }

  // Load board data
  useEffect(() => {
    if (board?.lists) {
      const mapped = board.lists.map((list: IList) => ({
        id: list._id,
        name: list.header,
      }));
      setHeaders(mapped);

      const initialCollapsed: { [key: string]: boolean } = {};
      mapped.forEach((h) => {
        initialCollapsed[h.id] = false;
      });
      setCollapsedColumns(initialCollapsed);
    }
  }, [board]);

  useEffect(() => {
    if (headers.length > maxOpenColumns) {
      setCollapsedColumns((prev) => {
        const newCollapsed: { [key: string]: boolean } = { ...prev };
        headers.forEach((header, index) => {
          newCollapsed[header.id] = index >= maxOpenColumns;
        });
        return newCollapsed;
      });
    } else {
      setCollapsedColumns((prev) => {
        const newCollapsed: { [key: string]: boolean } = { ...prev };
        headers.forEach((header) => {
          newCollapsed[header.id] = false;
        });
        return newCollapsed;
      });
    }
  }, [headers, maxOpenColumns]);

  // Handle adding a new column header
  const handleAddHeader = () => {
    const newHeader = {
      id: String(headers.length + 1),
      name: `Header ${headers.length + 1}`,
    };
    setHeaders([...headers, newHeader]);
  };

  // Track changes to header text
  const handleHeaderChange = (id: string, value: string) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, name: value } : header)));
    setEditedHeaders((prev) => ({ ...prev, [id]: value }));
  };

  // Persist headers to backend
  const saveHeadersToBackend = async () => {
    if (!boardId) return;
    const headersToUpdate = Object.entries(editedHeaders);
    if (headersToUpdate.length === 0) {
      showToast('No changes to save.', 'info');
      return;
    }
    try {
      // Update the board's headers array
      const headerNames = headers.map((h) => h.name);
      await updateBoard({ _id: boardId, headers: headerNames }).unwrap();

      // Update each list's header
      const updatePromises = headersToUpdate.map(([listId, newHeader]) =>
        updateListHeader({ listId, header: newHeader }).unwrap()
      );
      await Promise.all(updatePromises);

      showToast('Headers updated successfully!', 'success');
      setEditedHeaders({});
    } catch (err: any) {
      console.error('Failed to update headers:', err);
      showToast('Error updating headers.', 'error');
    }
  };

  // Delete entire board
  const handleDeleteBoard = async () => {
    if (!boardId) return;
    try {
      await deleteBoard(boardId).unwrap();
      showToast('Board deleted successfully!', 'success');
      navigate('/dashboard/board-list');
    } catch (err: any) {
      console.error('Failed to delete board:', err);
      showToast('Error deleting board.', 'error');
    }
  };

  // Delete one list
  const handleDeleteList = async (listId: string) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    try {
      const result = await dispatch(tasksApi.endpoints.deleteList.initiate(listId));
      if (tasksApi.endpoints.deleteList.matchFulfilled(result)) {
        showToast('List deleted successfully!', 'success');
      } else if (tasksApi.endpoints.deleteList.matchRejected(result)) {
        console.error('Error deleting list:', result.error);
        showToast('Error deleting list.', 'error');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      showToast('Unexpected error while deleting list.', 'error');
    }
  };

  // On card drag end
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (type === 'card') {
      const sourceList: IList | undefined = board?.lists.find((l) => l._id === source.droppableId);
      const destinationList: IList | undefined = board?.lists.find((l) => l._id === destination.droppableId);
      if (!sourceList || !destinationList) return;

      const sourceCards = Array.from(sourceList.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      const destinationCards = Array.from(destinationList.cards);
      destinationCards.splice(destination.index, 0, movedCard);

      // Optimistic update
      dispatch(
        tasksApi.util.updateQueryData('fetchBoardById', boardId!, (draft: IBoard) => {
          const srcListDraft = draft.lists.find((l) => l._id === sourceList._id);
          const destListDraft = draft.lists.find((l) => l._id === destinationList._id);
          if (srcListDraft && destListDraft) {
            srcListDraft.cards = sourceCards;
            destListDraft.cards = destinationCards;
          }
        })
      );

      try {
        await updateList({ _id: sourceList._id, cards: sourceCards.map((c) => c._id) }).unwrap();
        await updateList({ _id: destinationList._id, cards: destinationCards.map((c) => c._id) }).unwrap();
        await updateCard({
          _id: movedCard._id,
          list: destinationList._id,
          status: destinationList.header,
          position: destination.index,
        }).unwrap();
        showToast('Card moved successfully!');
      } catch (err) {
        console.error('Drag/Drop error:', err);
        // Revert the optimistic update
        dispatch(
          tasksApi.util.updateQueryData('fetchBoardById', boardId!, (draft: IBoard) => {
            const srcListDraft = draft.lists.find((l) => l._id === sourceList._id);
            const destListDraft = draft.lists.find((l) => l._id === destinationList._id);
            if (srcListDraft && destListDraft) {
              srcListDraft.cards = sourceCards;
              destListDraft.cards = destinationCards;
            }
          })
        );
        showToast('Failed to reorder.', 'error');
      }
    }
  };

  // Add Card Modal
  const openAddCardModal = (list: IList) => {
    setSelectedList(list);
    setIsAddCardModalOpen(true);
  };
  const closeAddCardModal = () => {
    setIsAddCardModalOpen(false);
    setSelectedList(null);
  };

  // Edit Board Modal
  const openEditBoardModal = () => setIsEditBoardModalOpen(true);
  const closeEditBoardModal = () => setIsEditBoardModalOpen(false);

  // Delete Board Modal
  const confirmDeleteBoard = () => setIsDeleteBoardModalOpen(true);
  const cancelDeleteBoard = () => setIsDeleteBoardModalOpen(false);

  // Toggle column collapse
  const toggleCollapseColumn = (columnId: string) => {
    setCollapsedColumns((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
  };

  if (isLoading) return <p className="text-gray-500">Loading Kanban Board...</p>;
  if (error) return <p className="text-red-500">Error loading board.</p>;
  if (!boardId) return <p className="text-red-500">Invalid board ID.</p>;
  if (!board) return <p className="text-gray-500">Loading Board Data...</p>;

  // Prepare truncated description + show more/less logic
  const fullDesc = board.description || 'Board Description';
  const truncatedDesc = fullDesc.slice(0, DESCRIPTION_LIMIT);
  const shouldTruncate = fullDesc.length > DESCRIPTION_LIMIT;
  const displayDesc = showFullDescription ? fullDesc : truncatedDesc;

  return (
    <div className="flex flex-col md:flex-row text-gray-800 dark:text-gray-200">
      <div className="flex-1 p-4 bg-gray-100 min-h-screen font-serif dark:bg-gray-800">
        {/* ========== Revamped Header ========== */}
        <header className="p-6 rounded-md mb-4 shadow-md bg-gradient-to-b from-white via-white to-gray-50 text-black">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Left side: Logo + Name + Description */}
            <div className="flex items-start space-x-4 mb-4 md:mb-0">
              {/* Logo */}
              <div className="bg-white rounded-full p-2 flex items-center justify-center">
                <img src={Logo} alt="Securify" className="h-8 w-8" />
              </div>

              {/* Board Name + Description */}
              <div className="max-w-lg">
                <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{board.name || 'Board Name'}</h1>
                <p className="text-sm md:text-base leading-snug">
                  {displayDesc}
                  {shouldTruncate && (
                    <>
                      {!showFullDescription ? '...' : ''}
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="ml-2 text-xs text-yellow-300 underline font-semibold focus:outline-none"
                      >
                        {showFullDescription ? 'Show less' : 'Show more'}
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right side: Navigation */}
            <nav className="flex items-center space-x-3 md:space-x-4">
              <TeamsDropdown />

              <Link
                to={`/dashboard/board-reports?boardId=${boardId}&userId=${currentUser?._id}&priority=Low`}
                className="px-4 py-2 text-sm font-medium bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                Reports
              </Link>

              <a
                href="/settings"
                className="px-4 py-2 text-sm font-medium bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                Settings
              </a>

              {isAdminOrOwner && (
                <>
                  <button
                    onClick={openEditBoardModal}
                    className="flex items-center px-4 py-2 text-sm text-yellow-500  font-bold rounded hover:bg-white/30 transition-colors"
                  >
                    <FiEdit2 className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={confirmDeleteBoard}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-700 rounded hover:bg-white/30 transition-colors"
                  >
                    <FiTrash2 className="mr-1" />
                    Delete
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md transition-colors
                ${viewMode === 'kanban' ? 'bg-white text-blue-700' : 'bg-white/20 text-white'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md transition-colors
                ${viewMode === 'list' ? 'bg-white text-blue-700' : 'bg-white/20 text-white'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1 rounded-md transition-colors
                ${viewMode === 'gantt' ? 'bg-white text-blue-700' : 'bg-white/20 text-white'}`}
            >
              Progress
            </button>
          </div>
        </header>

        {/* ========== Additional Board Content ========== */}
        {viewMode === 'kanban' && (
          <div className="my-4 flex flex-col sm:flex-row justify-between flex-wrap gap-3 font-secondary">
            {isAdminOrOwner && (
              <button
                onClick={handleAddHeader}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <FiPlus className="text-xl" />
                <span className="ml-2 hidden sm:inline text-sm font-medium">Add Column</span>
              </button>
            )}
            {isAdminOrOwner && (
              <button
                onClick={saveHeadersToBackend}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                <FiSave className="text-xl" />
                <span className="ml-2 hidden sm:inline text-sm font-medium">Save Columns</span>
              </button>
            )}
          </div>
        )}

        {/* Switch between views */}
        {viewMode === 'list' ? (
          <BoardListView board={board} />
        ) : viewMode === 'gantt' ? (
          <GanttChartView board={board} />
        ) : (
          // Kanban view
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="kanban" type="list" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex space-x-2 overflow-x-auto"
                  >
                    {headers.map((header, index) => {
                      const isCollapsed = collapsedColumns[header.id];
                      const columnWidth = isCollapsed ? 'w-12' : 'w-80';

                      return (
                        <div
                          key={header.id}
                          className={`flex flex-col bg-white dark:bg-gray-700 rounded shadow-md ${columnWidth}`}
                        >
                          {isCollapsed ? (
                            <div className="flex justify-center items-center h-full">
                              <button
                                onClick={() => toggleCollapseColumn(header.id)}
                                className="text-sm bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                              >
                                <FiChevronRight />
                              </button>
                            </div>
                          ) : (
                            <>
                              {/* Column header */}
                              <div className="bg-gray-300 px-4 py-2 flex justify-between items-center shadow-sm dark:bg-gray-600">
                                <input
                                  type="text"
                                  value={header.name}
                                  onChange={(e) => handleHeaderChange(header.id, e.target.value)}
                                  placeholder="Enter column name"
                                  className="bg-transparent border-none w-full text-sm md:text-base font-medium text-gray-800 dark:text-lemonGreen-light focus:outline-none focus:ring-0"
                                />
                                <div className="flex items-center space-x-3">
                                  {isAdminOrOwner && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const listToDelete = board?.lists.find((l) => l._id === header.id);
                                        if (listToDelete) {
                                          handleDeleteList(listToDelete._id);
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  )}
                                  {isAdminOrOwner && (
                                    <button
                                      onClick={() => {
                                        const list = board?.lists.find((l) => l._id === header.id);
                                        if (list) openAddCardModal(list);
                                      }}
                                      className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                                    >
                                      <FiPlus className="mr-1" />
                                      <span className="hidden sm:inline text-gray-800">Task</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => toggleCollapseColumn(header.id)}
                                    className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                  >
                                    <FiChevronLeft />
                                  </button>
                                </div>
                              </div>

                              <Droppable droppableId={header.id} type="card">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="p-2 min-h-[250px] flex-1 flex flex-col"
                                  >
                                    {board?.lists
                                      .filter((l) => l._id === header.id)
                                      .map((list) => (
                                        <div key={list._id}>
                                          {list.cards.map((card, cardIndex) => {
                                            const dueDateVal = card.dueDate
                                              ? new Date(card.dueDate)
                                              : null;
                                            return (
                                              <Draggable
                                                key={card._id}
                                                draggableId={card._id}
                                                index={cardIndex}
                                              >
                                                {(provided) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="relative bg-gray-50 dark:bg-gray-800 p-3 rounded mb-2 shadow cursor-pointer hover:bg-gray-100"
                                                    onClick={(e) => {
                                                      if (!e.defaultPrevented) {
                                                        setSelectedCard(card);
                                                      }
                                                    }}
                                                  >
                                                    {/* Title */}
                                                    <p className="text-sm md:text-sm text-gray-700 dark:text-gray-50 font-semibold">
                                                      <TruncatedTitle text={card.title} wordLimit={5} />
                                                    </p>
                                                    {/* Due date */}
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                                                      <FaList className="inline mr-1 text-gray-500" />
                                                      <span className="text-xs">
                                                        {dueDateVal
                                                          ? new Intl.DateTimeFormat('en-US', {
                                                              year: 'numeric',
                                                              month: 'short',
                                                              day: 'numeric',
                                                            }).format(dueDateVal)
                                                          : 'No due date'}
                                                      </span>
                                                    </p>
                                                    <span className="text-xs text-blue-900">
                                                      {card.status} - {card.priority}
                                                    </span>
                                                    {card.attachments && card.attachments.length > 0 && (
                                                      <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                                                        <FiPaperclip
                                                          className="text-sm text-gray-500"
                                                          title="Attachments"
                                                        />
                                                        <span className="text-xs text-gray-500">
                                                          {card.attachments.length}
                                                        </span>
                                                      </div>
                                                    )}
                                                    {/* Dropdown (Ellipsis) */}
                                                    {/* ... omitted for brevity ... */}
                                                  </div>
                                                )}
                                              </Draggable>
                                            );
                                          })}
                                        </div>
                                      ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </>
                          )}
                        </div>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Activities Sidebar */}
            <Transition show={isSidebarOpen} as={FragmentWrap}>
              <Dialog as="div" className="relative z-40" onClose={setIsSidebarOpen}>
                <Transition.Child
                  as={FragmentWrap}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-30"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-30"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                      <Transition.Child
                        as={FragmentWrap}
                        enter="transform transition ease-in-out duration-300 sm:duration-500"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-300 sm:duration-500"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b">
                              <h2 className="text-lg font-medium">Recent Activities</h2>
                              <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <FiX size={24} />
                              </button>
                            </div>
                            <div className="flex-1 p-4">
                              <BoardActivities boardId={boardId!} />
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed bottom-4 right-20 text-red-500 bg-teal-200 p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
            >
              <FiActivity size={24} />
            </button>
          </>
        )}

        {/* Card Details Modal */}
        {selectedCard && (
          <CardDetailsModal
            isOpen={!!selectedCard}
            onRequestClose={() => setSelectedCard(null)}
            card={selectedCard}
            boardId={boardId}
          />
        )}

        {/* Add Card Modal */}
        {isAddCardModalOpen && selectedList && (
          <Modal onClose={closeAddCardModal}>
            <AddCardForm
              listId={selectedList._id}
              status={selectedList.header}
              onClose={closeAddCardModal}
              boardId={boardId}
            />
          </Modal>
        )}

        {/* Edit Board Modal */}
        {isEditBoardModalOpen && board && (
          <Modal onClose={closeEditBoardModal}>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Edit Board</h2>
              <EditBoardForm board={board} onClose={closeEditBoardModal} />
            </div>
          </Modal>
        )}

        {/* Delete Board Confirmation Modal */}
        {isDeleteBoardModalOpen && (
          <Modal onClose={cancelDeleteBoard}>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Delete Board</h2>
              <p className="mb-4">Are you sure you want to delete this board? This action cannot be undone.</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={cancelDeleteBoard}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteBoard();
                    setIsDeleteBoardModalOpen(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Labels Modal */}
        <LabelsModal
          isOpen={isLabelsModalOpen}
          onClose={() => setIsLabelsModalOpen(false)}
          labels={selectedCard ? selectedCard.labels : []}
        />
        {/* ... any other modals (LikesModal, WatchersModal) ... */}
      </div>
    </div>
  );
};

export default KanbanBoard;
