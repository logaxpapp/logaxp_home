// src/components/KanbanBoard.tsx

import React, { useState, useEffect, Fragment } from 'react';
import {
  useFetchBoardByIdQuery,
  useUpdateListMutation,
  useUpdateBoardListsMutation,
  useUpdateBoardMutation,
} from '../../api/tasksApi';
import { useUpdateCardMutation } from '../../api/cardApi';
import { useParams, Link } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { IBoard, IList, ICard } from '../../types/task';
import { useToast } from '../../features/Toast/ToastContext';
import BoardListView from './BoardListView';

import AddCardForm from './Card/AddCardForm';
import CardDetailsModal from './Card/CardDetailsModal';
import Modal from './Modal'; // Ensure the path is correct

import useWindowWidth from '../../hooks/useWindowWidth'; // Adjust the import path as needed
import { useAppDispatch } from '../../app/hooks'; // Import the typed dispatch hook
import { tasksApi } from '../../api/tasksApi'; // Adjust the import path based on your setup

import BoardActivities from './BoardActivities'; // Import BoardActivities component

import { FiChevronRight, FiChevronLeft, FiActivity, FiPlus } from 'react-icons/fi';

import { Transition, Dialog } from '@headlessui/react';
import { FiX } from 'react-icons/fi';


type ViewMode = 'kanban' | 'list';

const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch(); // Use the typed dispatch
  const { boardId } = useParams<{ boardId: string }>();
  const { data: board, error, isLoading } = useFetchBoardByIdQuery(boardId!);
  const [updateList] = useUpdateListMutation();
  const [updateCard] = useUpdateCardMutation();
  const [updateBoardLists] = useUpdateBoardListsMutation();
  const [updateBoard] = useUpdateBoardMutation();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const [headers, setHeaders] = useState<{ id: string; name: string }[]>([]);
  const [collapsedColumns, setCollapsedColumns] = useState<{ [key: string]: boolean }>({});

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

  useEffect(() => {
    if (board?.lists) {
      const mapped = board.lists.map((list: IList) => ({
        id: list._id,
        name: list.name,
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
    setHeaders(headers.map((header) => (header.id === id ? { ...header, name: value } : header)));
  };

  const saveHeadersToBackend = async () => {
    if (!boardId) return;
    try {
      const headerNames = headers.map((h) => h.name);
      await updateBoard({ _id: boardId, headers: headerNames }).unwrap();
      showToast('Headers updated successfully!');
    } catch (err) {
      showToast('Failed to update headers.');
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
          list: destinationList._id,
          status: destinationList.name,
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

  return (
    <div className="flex">
      {/* Main Kanban Board */}
      <div className="flex-1 p-4 bg-gray-100 min-h-screen font-serif">
        {/* Board Header */}
        <header className="p-4 bg-gray-300 text-gray-800 rounded mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white text-blue-600 p-2 rounded-full">
                <span className="font-bold">JD</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{board?.name || 'Board Name'}</h1>
                <p className="text-sm md:text-base">{board?.description || 'Board Description'}</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-4">
              <Link to="/team" className="hover:text-gray-600">
                Team
              </Link>
              <Link to="/reports" className="hover:text-gray-600">
                Reports
              </Link>
              <Link to="/settings" className="hover:text-gray-600">
                Settings
              </Link>
            </nav>
          </div>

          {/* View toggle */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded ${
                viewMode === 'kanban' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
              }`}
            >
              Kanban View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${
                viewMode === 'list' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
              }`}
            >
              List View
            </button>
          </div>
        </header>

        {/* Conditionally Render Common Actions Only in Kanban View */}
        {viewMode === 'kanban' && (
          <div className="my-4 flex flex-col sm:flex-row justify-between flex-wrap gap-2 font-secondary">
            <button onClick={handleAddHeader} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Header</span>
            </button>
            <button onClick={saveHeadersToBackend} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Headers</span>
            </button>
          </div>
        )}

        {viewMode === 'list' ? (
          <BoardListView board={board} />
        ) : (
          <>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="kanban" type="list" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex space-x-4 overflow-x-auto"
                  >
                    {headers.map((header, index) => {
                      const isCollapsed = collapsedColumns[header.id];
                      const columnWidth = isCollapsed ? 'w-12' : 'w-80';

                      return (
                        <div key={header.id} className={`flex flex-col bg-white rounded shadow-md ${columnWidth}`}>
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
                              <div className="bg-gray-200 px-4 py-2 flex justify-between items-center">
                                <input
                                  type="text"
                                  value={header.name}
                                  onChange={(e) => handleHeaderChange(header.id, e.target.value)}
                                  className="bg-transparent border-none w-full text-sm md:text-base font-medium"
                                />
                                <div className="flex items-center space-x-2">
                                     {/* Add Card Button with Icon */}
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
                                    className="text-blue-500 hover:text-blue-700"
                                    aria-label="Add Card"
                                  >
                                    <FiPlus /> Task
                                  </button>
                                  <button
                                    onClick={() => toggleCollapseColumn(header.id)}
                                    className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                    aria-label="Collapse Column"
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
                                      .filter((list) => list._id === header.id) // Match by ID
                                      .map((list) => (
                                        <div key={list._id} className="flex-1">
                                          {list.cards.map((card, cardIndex) => (
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
                                                  className="bg-white p-2 rounded mb-2 shadow cursor-pointer hover:bg-gray-50 transition-colors"
                                                  onClick={() => setSelectedCard(card)}
                                                >
                                                  <strong className="text-sm md:text-base">{card.title}</strong>
                                                  {card.description && (
                                                    <p className="text-xs md:text-sm text-gray-600">
                                                      {card.description}
                                                    </p>
                                                  )}
                                                </div>
                                              )}
                                            </Draggable>
                                          ))}
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
              className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
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
          />
        )}

        {/* Add Card Modal */}
        {isAddCardModalOpen && selectedList && (
          <Modal onClose={closeAddCardModal}>
            <AddCardForm
              listId={selectedList._id}
              status={selectedList.name}
              onClose={closeAddCardModal} // Passing the close function
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
