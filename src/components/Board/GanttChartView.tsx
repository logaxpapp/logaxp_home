// src/components/Board/GanttChartView.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { FrappeGantt, GanttTask } from 'frappe-gantt-react';
import { IBoard, ICard } from '../../types/task';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useToast } from '../../features/Toast/ToastContext';

// RTK Query Hooks
import {
  useFetchCardsByBoardIdQuery,
  useFetchCardByIdQuery,
  useUpdateGantCardMutation,
} from '../../api/cardApi';

// Modals
import AddCardModal from './Card/AddCardModal';
import EditCardModal from './Card/EditCardModal';

// Import custom CSS for Gantt chart styling
import '../../assets/styles/gantt-overrides.css';

// Pagination library
import ReactPaginate from 'react-paginate';

// Import the GanttFilters component
import GanttFilters from './GanttFilters';

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook to detect window width
import useWindowWidth from '../../hooks/useWindowWidth';

interface GanttChartViewProps {
  board: IBoard;
}

const GanttChartView: React.FC<GanttChartViewProps> = ({ board }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { showToast } = useToast();

  // RTK Mutation for updating Gantt card
  const [updateGantCard] = useUpdateGantCardMutation();

  // Local state for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Fetch selected card data
  const { data: selectedCard } = useFetchCardByIdQuery(selectedCardId!, {
    skip: !selectedCardId,
  });

  /**
   * Search and Filter States
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgress, setFilterProgress] = useState<number | 'All'>('All');
  const [filterStartDateFrom, setFilterStartDateFrom] = useState<string>('');
  const [filterStartDateTo, setFilterStartDateTo] = useState<string>('');
  const [filterDueDateFrom, setFilterDueDateFrom] = useState<string>('');
  const [filterDueDateTo, setFilterDueDateTo] = useState<string>('');

  /**
   * Pagination State
   */
  const [currentPage, setCurrentPage] = useState(0);
  const tasksPerPage = 10;

  /**
   * Fetch Cards Based on Search, Filter, and Pagination
   */
  const { data: fetchedCards, isLoading, isError, refetch } = useFetchCardsByBoardIdQuery({
    boardId: board._id.toString(),
    search: searchQuery,
    progress: filterProgress !== 'All' ? filterProgress : undefined,
    startDateFrom: filterStartDateFrom,
    startDateTo: filterStartDateTo,
    dueDateFrom: filterDueDateFrom,
    dueDateTo: filterDueDateTo,
    page: currentPage + 1, // ReactPaginate is 0-based
    limit: tasksPerPage,
  });

  /**
   * Transform Fetched Cards to Gantt Tasks
   */
  const transformedTasks = useMemo(() => {
    if (!fetchedCards) return [];

    return fetchedCards.data.map((card: ICard) => {
      const isMilestone = card.startDate === card.dueDate;
      let custom_class = '';

      // Determine custom class based on priority
      switch (card.priority) {
        case 'High':
          custom_class = 'gantt-priority-high';
          break;
        case 'Medium':
          custom_class = 'gantt-priority-medium';
          break;
        case 'Low':
          custom_class = 'gantt-priority-low';
          break;
        default:
          custom_class = '';
      }

      return {
        id: card._id.toString(),
        name: card.title || 'Untitled Task',
        start: card.startDate
          ? new Date(card.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        end: card.dueDate
          ? new Date(card.dueDate).toISOString().split('T')[0]
          : new Date(Date.now() + 86400000).toISOString().split('T')[0],
        progress: card.progress ?? 0,
        dependencies: card.dependencies?.join(',') || '',
        custom_class: isMilestone ? 'gantt-milestone' : custom_class,
      } as GanttTask;
    });
  }, [fetchedCards]);

  /**
   * Total Pages for Pagination
   */
  const pageCount = fetchedCards ? fetchedCards.totalPages : 0;

  /**
   * Handle Page Change
   */
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  /**
   * Handle Task Click
   */
  const handleTaskClick = (task: GanttTask) => {
    setSelectedCardId(task.id);
    setIsEditModalOpen(true);
  };

  /**
   * Handle Date or Progress Change
   */
  const handleDateOrProgressChange = async (task: GanttTask) => {
    // Assign a default value if task.progress is undefined
    const progress = task.progress ?? 0;

    // Fetch the existing card's progress
    const existingCard = fetchedCards?.data.find(
      (card) => card._id.toString() === task.id
    );
    const previousProgress = existingCard?.progress ?? 0;

    // Prevent decreasing progress
    if (progress < previousProgress) {
      showToast('Progress cannot be decreased.', 'error');
      return;
    }

    // Prevent setting end date before start date
    if (new Date(task.end) < new Date(task.start)) {
      showToast('End date cannot be before start date.', 'error');
      return;
    }

    try {
      await updateGantCard({
        _id: task.id,
        startDate: task.start,
        dueDate: task.end,
        progress: progress,
      }).unwrap();
      showToast(`Updated Gantt for: ${task.name}`, 'success');
      refetch(); // Refetch to get updated data
    } catch (err) {
      console.error('Failed to update Gantt data:', err);
      showToast('Error updating Gantt data.', 'error');
    }
  };

  /**
   * Reset Filters and Search
   */
  const resetFilters = () => {
    setSearchQuery('');
    setFilterProgress('All');
    setFilterStartDateFrom('');
    setFilterStartDateTo('');
    setFilterDueDateFrom('');
    setFilterDueDateTo('');
    setCurrentPage(0);
  };

  /**
   * Refetch data when filters change
   */
  useEffect(() => {
    setCurrentPage(0);
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    filterProgress,
    filterStartDateFrom,
    filterStartDateTo,
    filterDueDateFrom,
    filterDueDateTo,
  ]);

  /**
   * Sidebar Toggle State & Mobile Check
   */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== undefined ? windowWidth < 768 : false;

  // Close sidebar when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  /**
   * Framer Motion Variants
   */
  const sidebarVariants = {
    open: {
      width: isMobile ? '80%' : '25%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      width: '0%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };
  const mainVariants = {
    open: {
      width: isMobile ? '100%' : '75%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: {
      width: '100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };
  const overlayVariants = {
    visible: { opacity: 0.5, transition: { duration: 0.3 } },
    hidden: { opacity: 0, transition: { duration: 0.3 } },
  };

  if (!board) return <p className="text-gray-500">Loading Board Data...</p>;

  console.log('transformedTasks', transformedTasks);

  return (
    <div className="w-full px-2 md:px-4 py-4 md:py-6 bg-gray-100 min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6 rounded bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold text-gray-700">
            Gantt Chart for {board.name}
          </h2>
          <div className="flex items-center space-x-4">
            {/* Add Task Button */}
          

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md"
              aria-label={isSidebarOpen ? 'Close Filters' : 'Open Filters'}
            >
              {isSidebarOpen ? (
                // Close Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 
                    1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 
                    1.414L10 11.414l-4.293 4.293a1 1 0 
                    01-1.414-1.414L8.586 10 4.293 5.707a1 
                    1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Filter Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 
                    1 0 110 2H4a1 1 0 01-1-1zm4 
                    5a1 1 0 011-1h6a1 1 0 110 
                    2H8a1 1 0 01-1-1zm-2 
                    4a1 1 0 011-1h10a1 1 0 110 
                    2H6a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Content Area: Sidebar and Main Content */}
        <div className="flex flex-row relative">
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Overlay for Mobile */}
                {isMobile && (
                  <motion.div
                    className="fixed inset-0 bg-black z-10"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                {/* Sidebar */}
                <motion.div
                  className={`fixed lg:relative z-20 bg-white shadow-lg h-full ${
                    isMobile ? 'top-0 left-0' : ''
                  }`}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sidebarVariants}
                >
                  <div className="px-4 py-4 max-h-full overflow-y-auto">
                    <GanttFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      filterProgress={filterProgress}
                      setFilterProgress={setFilterProgress}
                      filterStartDateFrom={filterStartDateFrom}
                      setFilterStartDateFrom={setFilterStartDateFrom}
                      filterStartDateTo={filterStartDateTo}
                      setFilterStartDateTo={setFilterStartDateTo}
                      filterDueDateFrom={filterDueDateFrom}
                      setFilterDueDateFrom={setFilterDueDateFrom}
                      filterDueDateTo={filterDueDateTo}
                      setFilterDueDateTo={setFilterDueDateTo}
                      resetFilters={resetFilters}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.div
            className="flex-1 bg-white rounded-lg shadow px-3 md:px-4 py-4 md:py-6 gantt-container overflow-hidden"
            animate={isSidebarOpen && !isMobile ? 'open' : 'closed'}
            variants={mainVariants}
          >
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 
                      018-8v8H4z"
                    ></path>
                  </svg>
                  <span className="ml-2 text-gray-700">Loading tasks...</span>
                </div>
              ) : isError ? (
                <div className="text-red-600 text-center">
                  <p>Error fetching tasks. Please try again later.</p>
                </div>
              ) : transformedTasks.length === 0 ? (
                <div className="text-gray-600 text-center">
                  <p>No tasks found.</p>
                </div>
              ) : (
                <FrappeGantt
                  tasks={transformedTasks}
                  viewMode="Day"
                  onClick={handleTaskClick}
                  onDateChange={handleDateOrProgressChange}
                  onProgressChange={handleDateOrProgressChange}
                  onTasksChange={() => {}}
                  barBackgroundColor="#d3d3d3"
                  barProgressColor="#4caf50"
                  milestoneBackgroundColor="#ff9800"
                  todayColor="#2196f3"
                />
              )}
            </div>

            {/* Pagination Controls */}
            {pageCount > 1 && (
              <div className="mt-4 flex justify-center">
                <ReactPaginate
                  previousLabel={'← Previous'}
                  nextLabel={'Next →'}
                  breakLabel={'...'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName={'flex space-x-2'}
                  pageClassName={'px-3 py-1 border rounded-md'}
                  pageLinkClassName={'text-blue-600 hover:bg-blue-200'}
                  previousClassName={'px-3 py-1 border rounded-md'}
                  nextClassName={'px-3 py-1 border rounded-md'}
                  previousLinkClassName={'text-blue-600 hover:bg-blue-200'}
                  nextLinkClassName={'text-blue-600 hover:bg-blue-200'}
                  breakClassName={'px-3 py-1 border rounded-md'}
                  breakLinkClassName={'text-blue-600 hover:bg-blue-200'}
                  activeClassName={'bg-blue-500 text-white'}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* --------------- Add Card Modal --------------- */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* --------------- Edit Card Modal --------------- */}
      {selectedCard && (
        <EditCardModal
          isOpen={isEditModalOpen}
          onRequestClose={() => {
            setIsEditModalOpen(false);
            setSelectedCardId(null);
          }}
          card={selectedCard}
          boardId={board._id.toString()}
        />
      )}
    </div>
  );
};

export default GanttChartView;
