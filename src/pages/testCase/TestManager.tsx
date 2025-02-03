// "I want the vital message at all time."
// src/features/testManager/TestManager.tsx

import React, { useState } from 'react';
import {
  useFetchAllTestCasesQuery,
  useDeleteTestCaseMutation
} from '../../api/testCaseApi';
import { motion, AnimatePresence } from 'framer-motion';
import { ITestCase } from '../../types/testCase';
import CreateTestCaseModal from './CreateTestCaseModal';
import TestCaseModal from './TestCaseModal';
import { FaPlus, FaEye, FaTrash, FaFilter, FaSort } from 'react-icons/fa';

interface TestManagerProps {
  application?: string;
  environment?: 'development' | 'staging' | 'production';
}

const TestManager: React.FC<TestManagerProps> = ({ application, environment }) => {
  // State for search, pagination, sorting, and filters
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState('testId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<{ status?: string; feature?: string }>({});

  // Expandable row state (store the ID of the row currently expanded)
  const [expandedTestCaseId, setExpandedTestCaseId] = useState<string | null>(null);

  // Fetch data with filters, search, pagination, and sorting
  const { data, isLoading, isError, refetch } = useFetchAllTestCasesQuery({
    application,
    environment,
    search,
    page,
    limit,
    sortField,
    sortOrder,
    ...filters,
  });

  const [deleteTestCase] = useDeleteTestCaseMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<ITestCase | null>(null);

  // Toggle function for row expansion
  const toggleExpandRow = (id: string) => {
    setExpandedTestCaseId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading test cases...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading test cases
      </div>
    );
  }

  const testCases = data?.testCases || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Deletion handler
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this test case?')) return;
    try {
      await deleteTestCase(id).unwrap();
      refetch(); // Refetch data after deletion
    } catch (err) {
      console.error('Error deleting test case:', err);
      alert('Failed to delete test case');
    }
  };

  // Handlers for search, filter, sorting, pagination
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Header */}
          {(application || environment) && (
            <div className="mb-4 text-sm text-gray-500">
              <span className="text-lg font-bold text-blue-700 border-b-4 border-teal-400 px-2 transition-all duration-300 hover:border-teal-600 flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-teal-500 animate-pulse"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Application</span>{' '}
                {application && <span>{application}</span>}{' '}
                {environment && <span>({environment})</span>}
              </span>
            </div>
          )}

          {/* Title & Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
              Test Manager
            </h2>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <FaPlus /> Create Test Case
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Search test cases..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <select
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Not Run">Not Run</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-600" />
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                value={sortField}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 px-10"
              >
                <option value="testId">Test ID</option>
                <option value="createdAt">Created Date</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-gray-50 text-lemonGreen-light text-2xl font-extrabold p-2 rounded-md focus:outline-none"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">S/N</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Test ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Test Case
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    CreatedBy
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testCases.map((tc, index) => {
                  const isExpanded = expandedTestCaseId === tc._id;
                  return (
                    <React.Fragment key={tc._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1 + (page - 1) * limit}
                        </td>

                        {/* Clicking this cell toggles expansion */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer font-semibold text-blue-800 hover:underline"
                          onClick={() => toggleExpandRow(tc._id)}
                          title="Click to show/hide more details"
                        >
                          {tc.testId}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tc.feature}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tc.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tc.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof tc.assignedTo === 'object' && tc.assignedTo !== null
                            ? (tc.assignedTo as any).name
                            : tc.assignedTo || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof tc.createdBy === 'object' && tc.createdBy !== null
                            ? (tc.createdBy as any).name
                            : tc.createdBy}
                        </td>

                        {/* Actions cell (unchanged) */}
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-4">
                          <button
                            onClick={() => setSelectedTestCase(tc)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDelete(tc._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Test Case"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Detail Row */}
                      {isExpanded && (
                        <tr className='bg-gray-100'>
                          <td colSpan={8} className=" border-b border-gray-300 p-4">
                            {/* Additional fields or details displayed here */}
                            <div className="space-y-2 text-sm text-gray-700">
                              <div>
                                <strong>Priority:</strong> {tc.priority || '-'}
                              </div>
                              <div>
                                <strong>Severity:</strong> {tc.severity || '-'}
                              </div>
                              <div>
                                <strong>Tags:</strong>{' '}
                                {tc.tags?.length ? tc.tags.join(', ') : 'No tags'}
                              </div>
                              <div>
                                <strong>Comments:</strong> {tc.comments || 'No comments'}
                              </div>
                              <div>
                                <strong>Last Updated:</strong>{' '}
                                {new Date(tc.updatedAt).toLocaleString()}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {testCases.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-4">
                      No test cases found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-500 text-green-50 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create Test Case Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateTestCaseModal
            onClose={() => setShowCreateModal(false)}
            defaultApplication={application}
            defaultEnvironment={environment}
          />
        )}
      </AnimatePresence>

      {/* View/Edit Test Case Modal */}
      <AnimatePresence>
        {selectedTestCase && (
          <TestCaseModal
            testCase={selectedTestCase}
            onClose={() => setSelectedTestCase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestManager;
