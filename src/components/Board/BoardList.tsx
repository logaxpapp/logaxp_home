import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useFetchAllBoardsQuery } from '../../api/tasksApi';
import { Link } from 'react-router-dom';
import { IBoard } from '../../types/task';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import CreateBoardModal from './CreateBoardModal';
import ComingSoon from '../../pages/ComingSoon';
import WhiteboardManager from '../../pages/Whiteboard/WhiteboardManager';
import { useParams } from 'react-router-dom';

const BoardList: React.FC = () => {
  const { data: boards, error, isLoading } = useFetchAllBoardsQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   const WhiteboardManagerWrapper = () => {
      const { id } = useParams();
      return <WhiteboardManager  />;
    };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden md:min-h-screen">
        
        {/* Tabs Section */}
        <Tabs>
          <TabList className="react-tabs__tab-list flex flex-wrap gap-2 border-b border-gray-300">
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-amber-50 hover:bg-gray-200 rounded-t-md">
              Tasks
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-blue-50 hover:bg-gray-200 rounded-t-md">
              WhiteBoard
            </Tab>
            <Tab className="react-tabs__tab cursor-pointer py-2 px-4 bg-green-50 hover:bg-gray-200 rounded-t-md">
              Analytics
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
              <div className="sidebar">
                {boards && boards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                    {boards.map((board: IBoard) => (
                      <div
                        key={board._id}
                        className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow duration-300"
                      >
                        {/* Board Header */}
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold text-gray-800">{board.name}</h2>
                          <span className="text-sm text-gray-500">{board.lists.length} Lists</span>
                        </div>

                        {/* Board Description */}
                        <p className="text-gray-600 mb-4">{board.description}</p>

                        {/* Board Actions */}
                        <div className="flex space-x-4">
                          <Link
                            to={`/dashboard/boards/${board._id}/detail`}
                            className="flex items-center text-blue-500 hover:text-blue-700"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/dashboard/boards/${board._id}/kanban`}
                            className="flex items-center text-green-500 hover:text-green-700"
                          >
                            Kanban Board
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-yellow-500">No boards available. Use the "Create New Board" button above to add a new board.</p>
                )}
              </div>
            )}
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
           
            <WhiteboardManagerWrapper />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel p-4">
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
