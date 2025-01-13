// src/components/KanbanBoard.tsx

import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../assets/images/green.svg';

import {
  useFetchBoardByIdQuery,
  useUpdateListMutation,
  useUpdateBoardListsMutation,
  useUpdateBoardMutation,
  useUpdateListHeaderMutation,
  useDeleteBoardMutation, // Added for deleting board
} from '../../api/tasksApi';
import { useUpdateCardMutation } from '../../api/cardApi';
import { useParams } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice'; // Removed unused import
import { IBoard, IList, ICard } from '../../types/task';
import { useToast } from '../../features/Toast/ToastContext';
import BoardListView from './BoardListView';
import LabelsModal from './LabelsModal';
import LikesModal from './LikesModal';
import WatchersModal from './WatchersModal';

import TeamsDropdown from './TeamsDropdown';

import AddCardForm from './Card/AddCardForm';
import CardDetailsModal from './Card/CardDetailsModal';
import EditBoardForm from './EditBoardForm';
import GanttChartView from './GanttChartView';
import Modal from './Modal'; // To be moved to the modal component 

import useWindowWidth from '../../hooks/useWindowWidth'; 
import { useAppDispatch } from '../../app/hooks'; 
import { tasksApi } from '../../api/tasksApi'; 

import BoardActivities from './BoardActivities'; 

import { FiChevronRight, FiChevronLeft, FiActivity, FiPlus, FiSave, FiTrash2, FiEdit2 } from 'react-icons/fi'; // Added FiTrash2 and FiEdit2
import { FaList, FaEllipsisV } from 'react-icons/fa';
import { FiPaperclip } from 'react-icons/fi'; 

import { Transition, Dialog, Menu } from '@headlessui/react';
import { FiX } from 'react-icons/fi';

import TruncatedTitle from '../../utils/TruncatedTitle';

type ViewMode = 'kanban' | 'list' | 'gantt'; 

const KanbanBoard: React.FC = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch(); 
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const { data: board, error, isLoading } = useFetchBoardByIdQuery(boardId!);
  const [updateList] = useUpdateListMutation();
  const [updateCard] = useUpdateCardMutation();
  const [updateBoardLists] = useUpdateBoardListsMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const [updateListHeader] = useUpdateListHeaderMutation();
  const [deleteBoard] = useDeleteBoardMutation(); // Initialize deleteBoard mutation

  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const [headers, setHeaders] = useState<{ id: string; name: string }[]>([]);
  const [collapsedColumns, setCollapsedColumns] = useState<{ [key: string]: boolean }>({});

  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isWatchersModalOpen, setIsWatchersModalOpen] = useState(false);

  // Track which headers have been edited
  const [editedHeaders, setEditedHeaders] = useState<{ [key: string]: string }>({});

  const currentUserRole = currentUser?.role || 'user';

  const isAdminOrOwner = currentUserRole === 'admin' || (board && board.owner === currentUser?._id);

  console.log('currentUser role:', currentUserRole)

  const handleTeamSelect = (teamId: string) => {
    console.log('Selected Team ID:', teamId);
    showToast(`Selected team ID: ${teamId}`, 'info');
    // You can implement logic to filter the Kanban board based on the selected team
  };

  const width = useWindowWidth();
  let maxOpenColumns = 1; // Default for smallest screens

  if (width >= 1536) {
    maxOpenColumns = 5; // 2xl
  } else if (width >= 1280) {
    maxOpenColumns = 4; // xl
  } else if (width >= 1024) {
    maxOpenColumns = 3; // lg
  } else if (width >= 768) {
    maxOpenColumns = 2; // md
  } else {
    maxOpenColumns = 1; // sm and below
  }

  // For opening card details in modal
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);

  // State for Add Card Modal
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<IList | null>(null);

  // State for Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State for Edit Board Modal
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);

  // State for Delete Board Confirmation
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

  useEffect(() => {
    if (board?.lists) {
      const mapped = board.lists.map((list: IList) => ({
        id: list._id,
        name: list.header, // Use list.header instead of list.name
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
      // If number of headers decreases below maxOpenColumns, expand all
      setCollapsedColumns((prev) => {
        const newCollapsed: { [key: string]: boolean } = { ...prev };
        headers.forEach((header) => {
          newCollapsed[header.id] = false;
        });
        return newCollapsed;
      });
    }
  }, [headers, maxOpenColumns]);

  const toggleCollapseColumn = (columnId: string) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const handleAddHeader = () => {
    const newHeader = { id: String(headers.length + 1), name: `Header ${headers.length + 1}` };
    setHeaders([...headers, newHeader]);
  };

  const handleHeaderChange = (id: string, value: string) => {
    // Update headers array in the frontend
    setHeaders(headers.map((header) => (header.id === id ? { ...header, name: value } : header)));

    // Track edited headers
    setEditedHeaders((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const saveHeadersToBackend = async () => {
    if (!boardId) return;

    // Extract all edited headers
    const headersToUpdate = Object.entries(editedHeaders);

    if (headersToUpdate.length === 0) {
      showToast('No changes to save.', 'info');
      return;
    }

    try {
      // Update the Board's headers array
      const headerNames = headers.map((h) => h.name);
      await updateBoard({ _id: boardId, headers: headerNames }).unwrap();

      // Update each List's header field
      const updatePromises = headersToUpdate.map(([listId, newHeader]) =>
        updateListHeader({ listId, header: newHeader }).unwrap()
      );

      await Promise.all(updatePromises);

      showToast('Headers updated successfully!', 'success');

      // Clear edited headers tracking
      setEditedHeaders({});
    } catch (err: any) {
      console.error('Failed to update headers:', err);
      showToast('Error updating headers.', 'error');
    }
  };

  // Handler to delete the board
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

  const handleDeleteList = async (listId: string) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
  
    const dispatch = useAppDispatch(); // Access the Redux store dispatch
  
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

  if (isLoading) return <p className="text-gray-500">Loading Kanban Board...</p>;
  if (error) return <p className="text-red-500">Error loading board.</p>;
  if (!boardId) return <p className="text-red-500">Invalid board ID.</p>;

 
  

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

      // Optimistically update the cache
      dispatch(
        tasksApi.util.updateQueryData('fetchBoardById', boardId, (draft: IBoard) => {
          const sourceListDraft: IList | undefined = draft.lists.find((l) => l._id === sourceList._id);
          const destinationListDraft: IList | undefined = draft.lists.find((l) => l._id === destinationList._id);
          if (sourceListDraft && destinationListDraft) {
            sourceListDraft.cards = sourceCards; // ICard[]
            destinationListDraft.cards = destinationCards; // ICard[]
          }
        })
      );

      try {
        await updateList({ _id: sourceList._id, cards: sourceCards.map((c) => c._id) }).unwrap();
        await updateList({ _id: destinationList._id, cards: destinationCards.map((c) => c._id) }).unwrap();

        await updateCard({
          _id: movedCard._id,
          list: destinationList._id, // This is a string (List ID)
          status: destinationList.header,
          position: destination.index,
        }).unwrap();

        showToast('Card moved successfully!');
      } catch (err) {
        console.error('Drag/Drop error:', err);
        // Revert the optimistic update
        dispatch(
          tasksApi.util.updateQueryData('fetchBoardById', boardId, (draft: IBoard) => {
            const sourceListDraft: IList | undefined = draft.lists.find((l) => l._id === sourceList._id);
            const destinationListDraft: IList | undefined = draft.lists.find((l) => l._id === destinationList._id);
            if (sourceListDraft && destinationListDraft) {
              sourceListDraft.cards = sourceCards;
              destinationListDraft.cards = destinationCards;
            }
          })
        );
        showToast('Failed to reorder.', 'error');
      }
    }
  };

  // Handler to Open Add Card Modal
  const openAddCardModal = (list: IList) => {
    console.log('Opening Add Card Modal for list:', list);
    setSelectedList(list);
    setIsAddCardModalOpen(true);
  };

  // Handler to Close Add Card Modal
  const closeAddCardModal = () => {
    console.log('Closing Add Card Modal');
    setIsAddCardModalOpen(false);
    setSelectedList(null);
  };

  // Handler to Open Edit Board Modal
  const openEditBoardModal = () => {
    setIsEditBoardModalOpen(true);
  };

  // Handler to Close Edit Board Modal
  const closeEditBoardModal = () => {
    setIsEditBoardModalOpen(false);
  };

  // Handler to Confirm Delete Board
  const confirmDeleteBoard = () => {
    setIsDeleteBoardModalOpen(true);
  };

  // Handler to Cancel Delete Board
  const cancelDeleteBoard = () => {
    setIsDeleteBoardModalOpen(false);
  };
  if (isLoading) return <p className="text-gray-500">Loading Kanban Board...</p>;
  if (error) return <p className="text-red-500">Error loading board.</p>;
  if (!boardId) return <p className="text-red-500">Invalid board ID.</p>;
  if (!board) return <p className="text-gray-500">Loading Board Data...</p>; //

  return (
    <div className="flex flex-col md:flex-row text-gray-800 dark:text-gray-200">
      {/* Main Kanban Board */}
      <div className="flex-1 p-4 bg-gray-100 min-h-screen font-serif dark:bg-gray-800">
        {/* Board Header */}
        <header className="p-4 bg-gray-300 text-gray-800 rounded mb-4 dark:bg-gray-700 dark:text-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white text-blue-600 p-2 rounded-full">
                <span className="font-bold">
                  
                  <Logo className="h-8 w-8" />

             
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{board?.name || 'Board Name'}</h1>
                <p className="text-sm md:text-base">{board?.description || 'Board Description'}</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-4">
              {/* Replace Team link with TeamsDropdown */}
              <TeamsDropdown />
              <Link
                to={`/dashboard/board-reports?boardId=${boardId}&userId=${currentUser?._id}&priority=Low`}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 
                          bg-gray-200 rounded-lg shadow hover:bg-gray-300 hover:text-gray-900 
                          focus:outline-none focus:ring-2 focus:ring-gray-400 
                          focus:ring-offset-2 transition duration-150"
              >
                Reports
              </Link>
              <a
                href="/settings"
                className="relative px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150"
              >
                Settings
              </a>
              {/* Conditionally Render Edit and Delete Buttons */}
              {(isAdminOrOwner) && (
                <>
                  <button
                    onClick={openEditBoardModal}
                    className="relative px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 flex items-center"
                    aria-label="Edit Board"
                  >
                    <FiEdit2 className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={confirmDeleteBoard}
                    className="relative px-4 py-2 text-sm font-medium text-red-700 bg-red-200 rounded-lg shadow hover:bg-red-300 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition duration-150 flex items-center"
                    aria-label="Delete Board"
                  >
                    <FiTrash2 className="mr-1" />
                    Delete
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* View toggle */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded ${
                viewMode === 'kanban' ? 'bg-white text-blue-600' : 'bg-lemonGreen text-white font-bold'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${
                viewMode === 'list' ? 'bg-white text-blue-600' : 'bg-lemonGreen text-white font-bold'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1 rounded ${
                viewMode === 'gantt' ? 'bg-white text-blue-600' : 'bg-lemonGreen text-white font-bold'
              }`}
            >
              Gantt Chart
            </button>
          </div>
        </header>

        {/* Conditionally Render Common Actions Only in Kanban View */}
        {viewMode === 'kanban' && (
          <div className="my-4 flex flex-col sm:flex-row justify-between flex-wrap gap-3 font-secondary">
            {/* Add Header Button */}
            {(isAdminOrOwner) && (
              <button
                onClick={handleAddHeader}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                aria-label="Add Header"
              >
                <FiPlus className="text-xl" />
                <span className="ml-2 hidden sm:inline text-sm font-medium">Add Header</span>
              </button>
            )}

            {/* Save Headers Button */}
            {(isAdminOrOwner) && (
              <button
                onClick={saveHeadersToBackend}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200"
                aria-label="Save Headers"
              >
                <FiSave className="text-xl" />
                <span className="ml-2 hidden sm:inline text-sm font-medium">Save Headers</span>
              </button>
            )}
          </div>
        )}
      {viewMode === 'list' ? (
        <BoardListView board={board} />
      ) : viewMode === 'gantt' ? (
        <GanttChartView board={board} />
              ) : (
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
                        <div key={header.id} className={`flex flex-col bg-white dark:bg-gray-700 rounded shadow-md ${columnWidth}`}>
                          {isCollapsed ? (
                            <div className="flex justify-center items-center h-full">
                              <button
                                onClick={() => toggleCollapseColumn(header.id)}
                                className="text-sm bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                aria-label="Expand Column"
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
                                  className="bg-transparent border-none w-full text-sm md:text-base font-medium text-gray-800 dark:text-lemonGreen-light focus:outline-none focus:ring focus:ring-blue-300"
                                />
                                <div className="flex items-center space-x-4">
                                  {/* Conditionally Render Edit and Delete List Buttons */}
                                  {(isAdminOrOwner) && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent parent click
                                          const listToDelete = board?.lists.find((l) => l._id === header.id);
                                          if (listToDelete) {
                                            handleDeleteList(listToDelete._id);
                                          }
                                        }}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        aria-label="Delete List"
                                      >
                                        <FiTrash2 />
                                      </button>
                                    </>
                                  )}
                                  {/* Add Card Button with Icon */}
                                  {(isAdminOrOwner) && (
                                    <button
                                      onClick={() => {
                                        const list: IList | undefined = board?.lists.find((l) => l._id === header.id);
                                        console.log('Add Card Button clicked for list:', list);
                                        if (list) {
                                          openAddCardModal(list);
                                        } else {
                                          console.warn('List not found for header ID:', header.id);
                                        }
                                      }}
                                      className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                                      aria-label="Add Card"
                                    >
                                      <FiPlus className="mr-1" /> <span className="hidden sm:inline text-gray-800">Task</span>
                                    </button>
                                  )}

                                  {/* Collapse Button */}
                                  <button
                                    onClick={() => toggleCollapseColumn(header.id)}
                                    className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-500"
                                    aria-label="Collapse Column"
                                  >
                                    <FiChevronLeft />
                                  </button>

                                  {/* Ellipsis Button */}
                                  <Menu as="div" className="relative inline-block text-left">
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setIsLabelsModalOpen(true);
                                                  // Optionally, setSelectedCard if this dropdown corresponds to a specific card
                                                }}
                                                className={`${
                                                  active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'
                                                } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                              >
                                                Labels
                                              </button>
                                            )}
                                          </Menu.Item>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setIsLikesModalOpen(true);
                                                  // Optionally, setSelectedCard if this dropdown corresponds to a specific card
                                                }}
                                                className={`${
                                                  active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'
                                                } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                              >
                                                Likes
                                              </button>
                                            )}
                                          </Menu.Item>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setIsWatchersModalOpen(true);
                                                  // Optionally, setSelectedCard if this dropdown corresponds to a specific card
                                                }}
                                                className={`${
                                                  active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'
                                                } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                              >
                                                Watchers
                                              </button>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
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
                                    .filter((list) => list._id === header.id) // Match by ID
                                    .map((list) => (
                                      <div key={list._id} className="flex-1">
                                        {list.cards.map((card, cardIndex) => {
                                          // Safely derive dueDateVal for each card:
                                          const dueDateVal = card.dueDate
                                            ? new Date(card.dueDate) // either a string or date-like
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
                                                  className="relative bg-gray-50 dark:bg-gray-800 p-3 rounded mb-2 shadow cursor-pointer hover:bg-gray-50 transition-colors"
                                                  onClick={(e) => {
                                                    // Only open modal if not prevented by dropdown, etc.
                                                    if (!e.defaultPrevented) {
                                                      setSelectedCard(card); 
                                                    }
                                                  }}
                                                >
                                                  {/* Card Title */}
                                                  <p className="text-sm md:text-sm text-gray-700 dark:text-gray-50 font-semibold">
                                                    <TruncatedTitle text={card.title} wordLimit={5} />
                                                  </p>

                                                  {/* Due Date */}
                                                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center">
                                                    <FaList className="inline mr-1 text-gray-500 dark:text-white" />
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

                                                  {/* Status & Priority */}
                                                  <span className="text-xs text-blue-900">
                                                    {card.status} - {card.priority}
                                                  </span>

                                                  {/* Optional attachments badge */}
                                                  {card.attachments && card.attachments.length > 0 && (
                                                    <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                                                      <FiPaperclip
                                                        className="text-sm text-gray-500 dark:text-gray-300"
                                                        title="Attachments"
                                                        aria-label="Attachment"
                                                      />
                                                      <span className="text-xs text-gray-500 dark:text-gray-300">
                                                        {card.attachments.length}
                                                      </span>
                                                    </div>
                                                  )}

                                                  {/* Dropdown Menu inside Card */}
                                                  <Menu as="div" className="absolute top-2 right-2">
                                                    <div>
                                                      <Menu.Button
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex justify-center w-full p-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                                                      >
                                                        <FaEllipsisV className="dark:text-gray-400 dark:hover:text-white" />
                                                      </Menu.Button>
                                                    </div>
                                                    <Transition
                                                      as={Fragment}
                                                      enter="transition ease-out duration-100"
                                                      enterFrom="transform opacity-0 scale-95"
                                                      enterTo="transform opacity-100 scale-100"
                                                      leave="transition ease-in duration-75"
                                                      leaveFrom="opacity-100 scale-100"
                                                      leaveTo="opacity-0 scale-95"
                                                    >
                                                      <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                        <div className="py-1">
                                                          <Menu.Item>
                                                            {({ active }) => (
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  setIsLabelsModalOpen(true);
                                                                  // or setSelectedCard(card) if needed
                                                                }}
                                                                className={`${
                                                                  active
                                                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                                    : 'text-gray-700 dark:text-gray-200'
                                                                } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                                              >
                                                                Labels
                                                              </button>
                                                            )}
                                                          </Menu.Item>
                                                          <Menu.Item>
                                                            {({ active }) => (
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  setIsLikesModalOpen(true);
                                                                }}
                                                                className={`${
                                                                  active
                                                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                                    : 'text-gray-700 dark:text-gray-200'
                                                                } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                                              >
                                                                Likes
                                                              </button>
                                                            )}
                                                          </Menu.Item>
                                                          <Menu.Item>
                                                            {({ active }) => (
                                                              <button
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  setIsWatchersModalOpen(true);
                                                                }}
                                                                className={`${
                                                                  active
                                                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                                    : 'text-gray-700 dark:text-gray-200'
                                                                } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                                              >
                                                                Watchers
                                                              </button>
                                                            )}
                                                          </Menu.Item>
                                                        </div>
                                                      </Menu.Items>
                                                    </Transition>
                                                  </Menu>
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

            {/* Board Activities Sidebar */}
            <Transition show={isSidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-40"
                onClose={setIsSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
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
                        as={Fragment}
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
                                aria-label="Close Activities Sidebar"
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

            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed bottom-4 right-20 text-red-500 bg-teal-200 p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
              aria-label="Open Activities Sidebar"
            >
              <FiActivity size={24} />
            </button>
          </>
        )}

        {/* Card Details Modal if user clicks a card */}
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
              status={selectedList.header} // Use header instead of name
              onClose={closeAddCardModal} // Passing the close function
              boardId={boardId} // Pass the boardId to AddCardForm
            />
          </Modal>
        )}

        {/* Edit Board Modal */}
        {isEditBoardModalOpen && board && (
          <Modal onClose={closeEditBoardModal}>
            {/* Implement your EditBoardForm component here */}
            {/* For demonstration, we'll create a simple form */}
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

       
      </div>
    </div>
  );
};

export default KanbanBoard;
