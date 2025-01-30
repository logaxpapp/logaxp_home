// src/components/Board/GanttChartView.tsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

import { IBoard, ICard } from "../../types/task";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { useToast } from "../../features/Toast/ToastContext";

// RTK Query Hooks
import {
  useFetchCardsByBoardIdQuery,
  useFetchCardByIdQuery,
  useUpdateGantCardMutation,
} from "../../api/cardApi";

// Existing modals
import AddCardModal from "./Card/AddCardModal";
import EditCardModal from "./Card/EditCardModal";

// Gantt filters + pagination
import GanttFilters from "./GanttFilters";
import ReactPaginate from "react-paginate";

// Framer Motion for the sidebar
import { motion, AnimatePresence } from "framer-motion";
import useWindowWidth from "../../hooks/useWindowWidth";

interface GanttChartViewProps {
  board: IBoard;
}

const GanttChartView: React.FC<GanttChartViewProps> = ({ board }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { showToast } = useToast();

  // Update Gantt data via RTK Query
  const [updateGantCard] = useUpdateGantCardMutation();

  // Local state for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // If we fetch a single card (for edit), skip if none selected
  const { data: selectedCard } = useFetchCardByIdQuery(selectedCardId!, {
    skip: !selectedCardId,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProgress, setFilterProgress] = useState<number | "All">("All");
  const [filterStartDateFrom, setFilterStartDateFrom] = useState("");
  const [filterStartDateTo, setFilterStartDateTo] = useState("");
  const [filterDueDateFrom, setFilterDueDateFrom] = useState("");
  const [filterDueDateTo, setFilterDueDateTo] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const tasksPerPage = 10;

  // Zoom (Day/Week/Month) state
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

  // Track if the user is dragging a bar (to block onSelect from opening the modal)
  const dragInProgress = useRef(false);

  // Fetch tasks with RTK Query
  const {
    data: fetchedCards,
    isLoading,
    isError,
    refetch,
  } = useFetchCardsByBoardIdQuery({
    boardId: board._id.toString(),
    search: searchQuery,
    progress: filterProgress !== "All" ? filterProgress : undefined,
    startDateFrom: filterStartDateFrom,
    startDateTo: filterStartDateTo,
    dueDateFrom: filterDueDateFrom,
    dueDateTo: filterDueDateTo,
    page: currentPage + 1,
    limit: tasksPerPage,
  });

  // Convert to Gantt Tasks
  const ganttTasks: Task[] = useMemo(() => {
    if (!fetchedCards) return [];
    
    const taskIds = new Set(fetchedCards.data.map((card: ICard) => card._id.toString()));
    
    return fetchedCards.data.map((card: ICard) => {
      const startDate = card.startDate ? new Date(card.startDate) : new Date();
      const endDate = card.dueDate
        ? new Date(card.dueDate)
        : new Date(Date.now() + 86400000);
  
      const progressVal = card.progress ?? 0;
      let barColor = "#3366cc";
      if (progressVal >= 100) {
        barColor = "#66cc66"; // completed
      } else if (card.priority === "High") {
        barColor = "#cc3333"; // high priority
      }else if (card.priority === "Medium") {
        barColor = "#ffcc66"; // medium priority
      }else if (card.priority === "Low") {
        barColor = "#99dd99"; // low priority
      }

  
      const validDependencies = (card.dependencies || []).filter(dep => taskIds.has(dep));
  
      if (validDependencies.length !== (card.dependencies || []).length) {
        console.warn(`Some dependencies for task ${card._id} are missing in the loaded tasks.`);
      }
  
      return {
        id: card._id.toString(),
        name: card.title || "Untitled Task",
        start: startDate,
        end: endDate,
        progress: progressVal,
        type: "task",
        dependencies: validDependencies,
        styles: {
          backgroundColor: barColor,
          progressColor: "#99dd99",
          backgroundSelectedColor: "#0057ff",
          progressSelectedColor: "#33ff33",
        },
      };
    });
  }, [fetchedCards]);
  

  // Number of pages
  const pageCount = fetchedCards ? fetchedCards.totalPages : 0;

  // Handle page change
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterProgress("All");
    setFilterStartDateFrom("");
    setFilterStartDateTo("");
    setFilterDueDateFrom("");
    setFilterDueDateTo("");
    setCurrentPage(0);
  };

  // Refetch when filters change
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

  // Gantt event handlers
  const handleSelectTask = (task: Task) => {
    // If user is currently dragging, skip opening the modal
    if (dragInProgress.current) return;
    setSelectedCardId(task.id);
    setIsEditModalOpen(true);
  };

  const handleDateChange = async (task: Task) => {
    dragInProgress.current = true;
    try {
      if (task.end.getTime() < task.start.getTime()) {
        showToast("End date cannot be before start date.", "error");
        // revert it visually
        refetch();
      } else {
        // Attempt update
        await updateGantCard({
          _id: task.id,
          startDate: task.start.toISOString(),
          dueDate: task.end.toISOString(),
          progress: task.progress,
        }).unwrap();
        showToast(`Updated dates for: ${task.name}`, "success");
      }
    } catch (err) {
      console.error("Date change error:", err);
      showToast("Error updating date.", "error");
      // revert
      refetch();
    } finally {
      // small delay so onSelect won't fire
      setTimeout(() => {
        dragInProgress.current = false;
      }, 150);
    }
  };

  const handleProgressChange = async (task: Task) => {
    dragInProgress.current = true;
    const confirmed = window.confirm(
      `Update progress of "${task.name}" to ${task.progress}%?`
    );
    if (!confirmed) {
      refetch(); // revert
      dragInProgress.current = false;
      return;
    }

    try {
      await updateGantCard({
        _id: task.id,
        progress: task.progress,
      }).unwrap();
      showToast(`Progress updated: ${task.name} => ${task.progress}%`, "success");
    } catch (err) {
      console.error("Progress update error:", err);
      showToast("Error updating progress.", "error");
      // revert
      refetch();
    } finally {
      setTimeout(() => {
        dragInProgress.current = false;
      }, 150);
    }
  };

  // Sidebar open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const width = useWindowWidth();
  const isMobile = width ? width < 768 : false;

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // Framer Motion variants
  const sidebarVariants = {
    open: {
      width: isMobile ? "80%" : "25%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      width: "0%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };
  const mainVariants = {
    open: {
      width: isMobile ? "100%" : "75%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      width: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };
  const overlayVariants = {
    visible: { opacity: 0.5, transition: { duration: 0.3 } },
    hidden: { opacity: 0, transition: { duration: 0.3 } },
  };

  // Zoom controls
  const handleZoom = (mode: ViewMode) => {
    setViewMode(mode);
  };

  if (!board) return <p className="text-gray-500">Loading Board Data...</p>;

  return (
    <div className="w-full px-2 md:px-4 py-4 md:py-6 bg-gray-100 dark:bg-neutral-900 min-h-screen transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* HEADER */}
        <div className="mb-4 md:mb-6 rounded bg-white dark:bg-gray-800 shadow-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-bold text-gray-700 dark:text-gray-200">
            Gantt for {board.name}
          </h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Zoom Buttons */}
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => handleZoom(ViewMode.Day)}
                className={`px-2 py-1 text-sm rounded ${
                  viewMode === ViewMode.Day
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => handleZoom(ViewMode.Week)}
                className={`px-2 py-1 text-sm rounded ${
                  viewMode === ViewMode.Week
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => handleZoom(ViewMode.Month)}
                className={`px-2 py-1 text-sm rounded ${
                  viewMode === ViewMode.Month
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Month
              </button>
            </div>

            {/* Add Task */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              + Add Task
            </button>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md"
            >
              {isSidebarOpen ? (
                // Close icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 
                    0L10 8.586l4.293-4.293a1 1 0 
                    011.414 1.414L11.414 
                    10l4.293 4.293a1 1 0 
                    01-1.414 1.414L10 
                    11.414l-4.293 4.293a1 
                    1 0 01-1.414-1.414L8.586 
                    10 4.293 5.707a1 1 0 
                    010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Filter icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 
                    1 0 110 2H4a1 1 0 
                    01-1-1zm4 5a1 1 0 
                    011-1h6a1 1 0 
                    110 2H8a1 1 0 
                    01-1-1zm-2 
                    4a1 1 0 011-1h10a1 1 0 110 
                    2H6a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT: SIDEBAR + GANTT */}
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
                  className={`fixed lg:relative z-20 bg-white dark:bg-gray-800 shadow-lg h-full ${
                    isMobile ? "top-0 left-0" : ""
                  }`}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sidebarVariants}
                >
                  <div className="p-4 max-h-full overflow-y-auto">
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

          {/* Gantt Panel */}
          <motion.div
            className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow 
                       px-3 md:px-4 py-4 md:py-6 gantt-container 
                       overflow-hidden transition-colors duration-300"
            animate={isSidebarOpen && !isMobile ? "open" : "closed"}
            variants={mainVariants}
          >
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 
                       018-8v8H4z"
                  />
                </svg>
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Loading tasks...
                </span>
              </div>
            ) : isError ? (
              <div className="text-red-600 text-center mt-4">
                <p>Failed to fetch tasks. Please try again.</p>
              </div>
            ) : ganttTasks.length === 0 ? (
              <div className="text-gray-600 dark:text-gray-300 text-center mt-4">
                <p>No tasks found. Try adding or adjusting filters.</p>
              </div>
            ) : (
              <div className="p-2 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <div style={{ minHeight: 500 }}>
                  <Gantt
                    tasks={ganttTasks}
                    viewMode={viewMode}
                    onSelect={handleSelectTask}
                    //onDateChange={handleDateChange}
                    //onProgressChange={handleProgressChange}
                    locale="en-GB"
                    ganttHeight={600}
                    columnWidth={viewMode === ViewMode.Month ? 300 : 65}
                    barCornerRadius={4}
                    arrowColor="#999"
                    arrowIndent={40}
                    todayColor="#f5ebe0"
                    
                    
                  />
                </div>
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-6 flex justify-center">
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={
                    "flex items-center space-x-2 text-sm font-medium"
                  }
                  pageClassName={"px-3 py-1 border rounded-md"}
                  pageLinkClassName={
                    "text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-700"
                  }
                  previousClassName={"px-3 py-1 border rounded-md"}
                  nextClassName={"px-3 py-1 border rounded-md"}
                  previousLinkClassName={
                    "text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-700"
                  }
                  nextLinkClassName={
                    "text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-700"
                  }
                  breakClassName={"px-3 py-1 border rounded-md"}
                  breakLinkClassName={
                    "text-blue-600 hover:bg-blue-200 dark:text-blue-400 dark:hover:bg-blue-700"
                  }
                  activeClassName={"bg-blue-500 text-white"}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        boardId={board._id.toString()}
      />

      {/* Edit Task Modal */}
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
