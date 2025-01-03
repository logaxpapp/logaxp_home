// src/components/BoardList.tsx

import React, { useState } from 'react';
import { useFetchAllBoardsQuery } from '../../api/tasksApi';
import { Link } from 'react-router-dom';
import { IBoard } from '../../types/task';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import CreateBoardModal from './CreateBoardModal';

const BoardList: React.FC = () => {
  const { data: boards, error, isLoading } = useFetchAllBoardsQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Management Boards</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New Board
        </button>
      </div>

      {/* Boards Grid */}
      {isLoading ? (
        <p className="text-gray-500">Loading boards...</p>
      ) : error ? (
        <p className="text-red-500">Error loading boards.</p>
      ) : (
        <div>
          {boards && boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {boards.map((board: IBoard) => (
                <div
                  key={board._id}
                  className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default BoardList;
