// src/components/Card/ViewList.tsx

import React, { useState, useMemo } from 'react';
import { useFetchListByIdQuery } from '../../api/tasksApi';
import { useParams } from 'react-router-dom';
import {
  FiEdit,
  FiTrash2,
  FiClock,
  FiTag,
  FiUsers,
  FiMessageSquare,
  FiPaperclip,
  FiHeart,
  FiCheckSquare,
  FiCalendar,
  FiLayers,
} from 'react-icons/fi';
import { ICard, ICustomField, ITimeLog, ISubTask } from '../../types/task';
import Pagination from '../common/Pagination/Pagination'; // Adjust the path as necessary

const ViewList: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const { data: list, error, isLoading } = useFetchListByIdQuery(listId!);

  // State for search
  const [searchTerm, setSearchTerm] = useState<string>('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Adjust as needed

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Compute filtered cards based on search term
  const filteredCards = useMemo(() => {
    if (!list?.cards) return [];

    return list.cards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [list, searchTerm]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredCards.length / itemsPerPage);
  }, [filteredCards.length, itemsPerPage]);

  // Get current page cards
  const currentCards = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCards.slice(startIndex, endIndex);
  }, [filteredCards, currentPage, itemsPerPage]);

  // Render loading, error, or no data states
  if (isLoading) return <p className="text-gray-500">Loading list details...</p>;
  if (error) return <p className="text-red-500">Error loading list details.</p>;
  if (!list) return <p className="text-yellow-500">No list data available.</p>;

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg mx-auto space-y-6">
      {/* List Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{list.header}</h1>
          <p className="text-gray-600">Position: {list.position}</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Cards Section */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Cards</h2>

      {currentCards.length === 0 ? (
        <p className="text-gray-500">No cards match your search criteria.</p>
      ) : (
        <div className="space-y-6">
          {currentCards.map((card) => (
            <div key={card._id} className="p-6 bg-gray-100 rounded-lg shadow space-y-6">
              {/* Card Details */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{card.title}</h2>
                  <p className="text-gray-600">{card.description || 'No description available.'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800" aria-label="Edit Card">
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800" aria-label="Delete Card">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Card Additional Details */}
              <div className="p-4 border rounded-md shadow-sm bg-gray-50">
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="flex items-center gap-2">
                    <FiLayers className="text-gray-500" />
                    <strong>Status:</strong> {card.status}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiCalendar className="text-gray-500" />
                    <strong>Created At:</strong>{' '}
                    {new Date(card.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiUsers className="text-gray-500" />
                    <strong>Assignees:</strong>{' '}
                    {card.assignees.length > 0 ? card.assignees.join(', ') : 'No assignees'}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Priority:</strong> {card.priority}
                  </p>
                </div>
              </div>

              {/* Detailed Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Labels */}
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiTag />
                    Labels
                  </h3>
                  {card.labels.length > 0 ? (
                    <ul className="mt-2">
                      {card.labels.map((label, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                        {label.name} ({label.color})
                    </li>
                    ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No labels assigned.</p>
                  )}
                </div>

                {/* Subtasks */}
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiCheckSquare />
                    Subtasks
                  </h3>
                  {card.subTasks && card.subTasks.length > 0 ? (
                    <ul className="mt-2">
                      {card.subTasks.map((sub: ISubTask) => (
                        <li key={sub.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.completed}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className={`${sub.completed ? 'line-through text-gray-400' : ''}`}>
                            {sub.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No subtasks available.</p>
                  )}
                </div>

                {/* Time Logs */}
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiClock />
                    Time Logs
                  </h3>
                  {card.timeLogs && card.timeLogs.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {card.timeLogs.map((log: ITimeLog) => (
                        <li key={log.id} className="text-sm text-gray-700">
                          <p>
                            <strong>Start:</strong> {log.start ? new Date(log.start).toLocaleString() : 'N/A'}
                          </p>
                          <p>
                            <strong>End:</strong> {log.end ? new Date(log.end).toLocaleString() : 'N/A'}
                          </p>
                          <p>
                            <strong>Duration:</strong> {log.duration ? `${log.duration} minutes` : 'N/A'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No time logs available.</p>
                  )}
                </div>

                {/* Custom Fields */}
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold">Custom Fields</h3>
                  {card.customFields && card.customFields.length > 0 ? (
                    <ul className="mt-2">
                      {card.customFields.map((field: ICustomField, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          <strong>{field.key}:</strong> {field.value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No custom fields available.</p>
                  )}
                </div>

                {/* Comments */}
                <div className="p-4 bg-white rounded shadow">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiMessageSquare />
                    Comments
                </h3>
                {card.comments && card.comments.length > 0 ? (
                    <ul className="mt-2">
                    {card.comments.map((comment, idx) => (
                      <li key={idx} className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Author:</strong> {comment.author ? comment.author.email : 'N/A'}
                        </p>
                        <p>
                          <strong>Content:</strong> {comment.content || 'No content'}
                        </p>
                        <p>
                          <strong>Likes:</strong> {comment.likes?.length || 0}
                        </p>
                      </li>
                    ))}
                  </ul>
                  
                ) : (
                    <p className="text-gray-500">No comments available.</p>
                )}
                </div>
                {/* Attachments */}
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiPaperclip />
                    Attachments
                  </h3>
                  {card.attachments && card.attachments.length > 0 ? (
                    <ul className="mt-2">
                      {card.attachments.map((attachment, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                        {attachment.filename} - {attachment.url}
                    </li>
                    ))}

                    </ul>
                  ) : (
                    <p className="text-gray-500">No attachments available.</p>
                  )}
                </div>

                {/* Watchers */}
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiUsers />
                    Watchers
                  </h3>
                  {card.watchers && card.watchers.length > 0 ? (
                    <ul className="mt-2">
                      {card.watchers.map((watcher, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {watcher}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No watchers available.</p>
                  )}
                </div>

                {/* Likes */}
                <div className="p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiHeart />
                    Likes
                  </h3>
                  <p className="text-sm text-gray-700">{card.likes.length} likes</p>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(pageNumber: number) => setCurrentPage(pageNumber)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewList;
