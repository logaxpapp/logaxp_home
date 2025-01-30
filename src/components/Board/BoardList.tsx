import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useFetchAllBoardsQuery } from '../../api/tasksApi';
import { Link, useParams } from 'react-router-dom';
import { IBoard } from '../../types/task';
import { 
  PlusCircleIcon,
  ClipboardIcon,
  PencilSquareIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
  Squares2X2Icon
} from '@heroicons/react/24/solid';
import CreateBoardModal from './CreateBoardModal';
import ComingSoon from '../../pages/ComingSoon';
import WhiteboardManager from '../../pages/Whiteboard/WhiteboardManager';

const BoardList: React.FC = () => {
  const { data: boards, error, isLoading } = useFetchAllBoardsQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // This wrapper ensures we can use the `id` param inside WhiteboardManager if needed
  const WhiteboardManagerWrapper = () => {
    const { id } = useParams();
    return <WhiteboardManager />;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Top Bar: Title + "Create Board" Button */}
      <div className="flex items-center justify-between bg-white rounded-md shadow p-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Board Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors duration-200"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Create New Board
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300 p-2">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-amber-50 hover:bg-gray-200 rounded-t-md flex items-center space-x-2">
              <ClipboardIcon className="w-5 h-5 text-gray-700" />
              <span>Tasks</span>
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md flex items-center space-x-2">
              <PencilSquareIcon className="w-5 h-5 text-gray-700" />
              <span>WhiteBoard</span>
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md flex items-center space-x-2">
              <ChartBarIcon className="w-5 h-5 text-gray-700" />
              <span>Analytics</span>
            </Tab>
          </TabList>

          {/* Tab Panels */}
          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Tasks Panel */}
            {isLoading ? (
              <p className="text-gray-500">Loading boards...</p>
            ) : error ? (
              <p className="text-red-500">Error loading boards.</p>
            ) : (
              <div className="mt-4">
                {boards && boards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {boards.map((board: IBoard) => (
                      <div
                        key={board._id}
                        className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow duration-300"
                      >
                        {/* Board Header */}
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {board.name}
                          </h2>
                          <span className="text-sm text-gray-500">
                            {board.lists.length} Lists
                          </span>
                        </div>

                        {/* Board Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {board.description}
                        </p>

                        {/* Board Actions */}
                        <div className="flex flex-col space-y-2 mt-2">
                          <Link
                            to={`/dashboard/boards/${board._id}/detail`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                            View Details
                          </Link>
                          <Link
                            to={`/dashboard/boards/${board._id}/kanban`}
                            className="inline-flex items-center text-green-600 hover:text-green-800"
                          >
                            <Squares2X2Icon className="w-4 h-4 mr-1" />
                            Kanban Board
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-yellow-500">
                    No boards available. Use the "Create New Board" button above
                    to add a new board.
                  </p>
                )}
              </div>
            )}
          </TabPanel>

          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Whiteboard Panel */}
            <WhiteboardManagerWrapper />
          </TabPanel>

          <TabPanel className="react-tabs__tab-panel p-4">
            {/* Analytics Panel */}
            <h2 className="text-xl font-semibold text-gray-800">View Analytics</h2>
            <ComingSoon />
          </TabPanel>
        </Tabs>
      </div>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default BoardList;
