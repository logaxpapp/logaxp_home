// src/features/testCase/TestCaseCreatedOrAssignedToMe.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  useFetchPersonalTestCasesQuery,
} from '../../api/testCaseApi';
import { FetchTestCasesParams, ITestCase } from '../../types/testCase';
import { FaSort, FaSortUp, FaSortDown, FaAngleLeft, FaAngleRight, FaCode, FaServer, FaRocket } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { useAppSelector } from '../../app/hooks';
import clsx from 'clsx';

const PAGE_SIZE = 5; 

/**
 * Returns an environment icon based on the environment string.
 */
function getEnvIcon(env: string | undefined) {
  switch (env) {
    case 'development':
      return <FaCode className="text-blue-500" title="Development" />;
    case 'staging':
      return <FaServer className="text-orange-500" title="Staging" />;
    case 'production':
      return <FaRocket className="text-green-600" title="Production" />;
    default:
      return null;
  }
}

/**
 * Returns a color-coded badge for the status field.
 */
function StatusBadge({ status }: { status?: string }) {
  const fallback = status || 'UNKNOWN';
  let bg = 'bg-gray-100';
  let text = 'text-gray-700';

  // Example statuses: "Open", "In Progress", "Closed", etc.
  // Adjust as needed for your scenario:
  switch (fallback.toLowerCase()) {
    case 'open':
      bg = 'bg-blue-100';
      text = 'text-blue-800';
      break;
    case 'in progress':
      bg = 'bg-yellow-100';
      text = 'text-yellow-800';
      break;
    case 'closed':
      bg = 'bg-green-100';
      text = 'text-green-800';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2 py-0.5 rounded text-sm font-medium ${bg} ${text}`}>
      {fallback}
    </span>
  );
}

const TestCaseCreatedOrAssignedToMe: React.FC = () => {
  // 1) Retrieve the current user’s ID from store
  const currentUserId = useAppSelector((state) => state.auth.user?._id);

  // 2) Local states for toggles, search, pagination, sorting
  const [mode, setMode] = useState<'created' | 'assigned'>('assigned');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('testId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Build the query parameters
  const queryParams: FetchTestCasesParams = {
    page,
    limit: PAGE_SIZE,
    sortField,
    sortOrder,
    search: search.trim() || undefined,
    createdBy: mode === 'created' ? currentUserId : undefined,
    assignedTo: mode === 'assigned' ? currentUserId : undefined,
  };

  // 3) Execute RTK Query
  const {
    data: testData,
    isLoading,
    isError,
    refetch,
  } = useFetchPersonalTestCasesQuery(queryParams);

  // 4) Handler: toggles between 'assigned' vs. 'created'
  const handleModeChange = (newMode: 'assigned' | 'created') => {
    setMode(newMode);
    setPage(1); // Reset to page 1 for new mode
  };

  // 5) Handler: Sorting by column
  const handleSort = useCallback(
    (field: string) => {
      if (field === sortField) {
        // Toggle asc/desc
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
      } else {
        // New field, default to asc
        setSortField(field);
        setSortOrder('asc');
      }
      setPage(1);
    },
    [sortField]
  );

  // 6) Pagination handlers
  const handleNextPage = () => {
    if ((testData?.total ?? 0) > page * PAGE_SIZE) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // 7) Table columns definition
  const columns = [
    { label: 'Test ID', field: 'testId' },
    { label: 'Title', field: 'title' },
    { label: 'Application', field: 'application' },
    { label: 'Environment', field: 'environment' },
    { label: 'Status', field: 'status' },
  ];

  // 8) Derived data
  const testCases: ITestCase[] = testData?.testCases || [];
  const totalRecords = testData?.total || 0;
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      {/* --- Top Wave Divider (Rotated) --- */}
      <div className="absolute top-0 left-0 w-full rotate-180 leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,170.7C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-white to-lime-100 z-0" />

      {/* Main content container */}
      <div className="relative z-10 p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Header / Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {mode === 'assigned' ? 'Test Cases Assigned To Me' : 'Test Cases Created By Me'}
          </h2>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-lime-200 text-gray-950 hover:bg-gray-300 text-sm rounded flex items-center space-x-1"
          >
            <span>Refresh</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => handleModeChange('assigned')}
            className={clsx(
              'px-4 py-2 rounded-l font-semibold transition-colors',
              mode === 'assigned' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            )}
          >
            Assigned to Me
          </button>
          <button
            onClick={() => handleModeChange('created')}
            className={clsx(
              'px-4 py-2 rounded-r font-semibold transition-colors',
              mode === 'created' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            )}
          >
            Created by Me
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search test cases..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        ) : isError ? (
          <div className="text-red-500 font-medium">
            Error loading test cases. Try again later.
          </div>
        ) : testCases.length === 0 ? (
          <div className="text-gray-600">No test cases found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  {columns.map((col) => {
                    // For sorting icons
                    const isCurrentField = sortField === col.field;
                    let sortIcon = <FaSort className="inline-block ml-1" />;
                    if (isCurrentField) {
                      if (sortOrder === 'asc') sortIcon = <FaSortUp className="inline-block ml-1" />;
                      else sortIcon = <FaSortDown className="inline-block ml-1" />;
                    }

                    return (
                      <th
                        key={col.field}
                        className="px-4 py-2 text-left cursor-pointer text-sm font-semibold text-gray-700"
                        onClick={() => handleSort(col.field)}
                      >
                        {col.label}
                        {sortIcon}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {testCases.map((tc) => (
                  <tr key={tc._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-sm">{tc.testId}</td>
                    <td className="px-4 py-2 text-sm">{tc.title}</td>
                    <td className="px-4 py-2 text-sm">{tc.application}</td>
                    <td className="px-4 py-2 text-sm flex items-center space-x-2">
                      {getEnvIcon(tc.environment)}
                      <span>{tc.environment}</span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <StatusBadge status={tc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {testData && testCases.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages || 1}
            </div>
            <div className="space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={clsx(
                  'px-3 py-1 rounded border border-gray-300 flex items-center space-x-1',
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-200 text-gray-700'
                )}
              >
                <FaAngleLeft />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className={clsx(
                  'px-3 py-1 rounded border border-gray-300 flex items-center space-x-1',
                  page >= totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-200 text-gray-700'
                )}
              >
                <span>Next</span>
                <FaAngleRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Bottom Wave Divider --- */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3B82F6"
            fillOpacity="1"
            d="M0,64L48,85.3C96,107,192,149,288,165.3C384,181,480,171,576,154.7C672,139,768,117,864,112C960,107,1056,117,1152,122.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default TestCaseCreatedOrAssignedToMe;
