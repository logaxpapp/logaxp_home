// src/components/RefereeList.tsx

import React, { useState, useEffect } from 'react';
import { useGetRefereesQuery, useDeleteRefereeMutation } from '../../api/referenceApi';
import { ReferenceStatus } from '../../types/reference'; // Ensure this enum is defined in your types
import { useToast } from '../../features/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import useDebounce from '../../hooks/useDebounce';
import Button from '../../components/common/Button';
import AuditReference from './AuditReference';

const RefereeList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Local State for Search and Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Debounced Search Term to optimize API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch referees using RTK Query with filters and pagination
  const { data, error, isLoading, isError, refetch } = useGetRefereesQuery({
    search: debouncedSearchTerm,
    
    page,
    limit,
  });

  // Delete referee mutation
  const [deleteReferee, { isLoading: isDeleting }] = useDeleteRefereeMutation();

  // Handle Delete Action
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this referee?')) return;

    try {
      await deleteReferee(id).unwrap();
      showToast('Referee deleted successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to delete referee.', 'error');
      console.error('Delete Referee Error:', err);
    }
  };

  // Handle Edit Action
  const handleEdit = (id: string) => {
    navigate(`/dashboard/referees/edit/${id}`);
  };

  // Handle Pagination
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (data && data.total > page * limit) setPage(page + 1);
  };

  // Handle Limit Change
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Referees</h2>
        <Button
          onClick={() => navigate('/dashboard/referees/add')}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Referee
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or company"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1); // Reset to first page on filter
          }}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {Object.values(ReferenceStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {typeof error === 'string'
            ? error
            : 'An error occurred while fetching referees.'}
        </div>
      )}

      {/* Referees Table */}
      {!isLoading && !isError && data && data.referees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Company
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Relationship
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Position Held
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.referees.map((referee) => (
                <tr key={referee._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {referee.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {referee.email}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {referee.companyName}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {referee.relationship}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {referee.positionHeld}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center text-sm">
                    <div className="flex justify-center space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(referee._id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        aria-label={`Edit referee ${referee.name}`}
                      >
                        <FiEdit size={20} />
                      </button>
                      
                      {/* View Button */}
                        <button
                            onClick={() => navigate(`/dashboard/referees/${referee._id}`)}
                            className="text-green-600 hover:text-green-900"
                            aria-label={`View referee ${referee.name}`}
                           
                        >
                            <FiEye size={20} />
                        </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(referee._id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label={`Delete referee ${referee.name}`}
                        disabled={isDeleting}
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading &&
        !isError && (
          <div className="p-4 text-gray-700">
            You have not added any referees yet. Click on "Add Referee" to get started.
          </div>
        )
      )}

      {/* Pagination Controls */}
      {data && data.referees.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="pageSize" className="text-sm text-gray-700 ">
              Show
            </label>
            <select
              id="pageSize"
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 "
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md ${
                page === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {Math.ceil(data.total / limit)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page * limit >= data.total}
              className={`px-3 py-1 rounded-md ${
                page * limit >= data.total
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefereeList;
