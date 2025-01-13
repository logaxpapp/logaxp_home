// src/components/ReferenceList.tsx

import React, { useState } from 'react';
import {
  useListReferencesQuery,
  useSendReferenceMutation,
  useReceiveReferenceMutation,
  useCompleteReferenceMutation,
  useRejectReferenceMutation,
  useDeleteReferenceMutation,
} from '../../api/referenceApi';
import { IReference, ReferenceStatus } from '../../types/reference';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../features/Toast/ToastContext';
import { FiEdit, FiTrash2, FiEye, FiList } from'react-icons/fi';
import AuditReference from './AuditReference';
import Button from '../../components/common/Button';

/** Interface for filter parameters */
interface FilterParams {
  applicantId?: string;
  refereeId?: string;
  status?: ReferenceStatus;
  search?: string;
  page: number;
  limit: number;
}

const ReferenceList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Local State for Filters
  const [filters, setFilters] = useState<FilterParams>({
    applicantId: '',
    refereeId: '',
    status: undefined,
    search: '',
    page: 1,
    limit: 10,
  });

  // RTK Query Hooks
  const {
    data,
    error,
    isLoading,
    refetch, // For reloading data after actions
  } = useListReferencesQuery(filters);

  // Mutations
  const [sendReference, { isLoading: isSending }] = useSendReferenceMutation();
  const [receiveReference] = useReceiveReferenceMutation();
  const [completeReference] = useCompleteReferenceMutation();
  const [rejectReference] = useRejectReferenceMutation();
  const [deleteReference] = useDeleteReferenceMutation();

  // -- Action Handlers --
  const handleSend = async (id: string) => {
    if (!window.confirm('Are you sure you want to send this reference request?')) return;
    try {
      await sendReference(id).unwrap();
      showToast('Reference request sent successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to send reference.', 'error');
    }
  };

  const handleReceive = async (id: string) => {
    try {
      await receiveReference(id).unwrap();
      showToast('Reference marked as received!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to mark as received.', 'error');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeReference(id).unwrap();
      showToast('Reference marked as completed!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to mark as completed.', 'error');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) {
      showToast('Rejection reason is required.', 'error');
      return;
    }
    try {
      await rejectReference({ id, rejectionReason: reason }).unwrap();
      showToast('Reference rejected successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to reject reference.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this reference?')) return;
    try {
      await deleteReference(id).unwrap();
      showToast('Reference deleted successfully!', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to delete reference.', 'error');
    }
  };

  // -- Pagination --
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // -- Filter Changes --
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // If user clears the field, interpret as "undefined" (except for numeric page/limit).
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
      page: 1, // Reset to first page on filter change
    }));
  };
  

  return (
    <div className="text-gray-800 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Employee References
      </h2>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Seamlessly manage, track, and review all employee references in one place, ensuring a smoother verification process.
      </p>
      {/* Filter Section */}
      <div className="mb-6">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Applicant ID */}
          <div>
            <label
              htmlFor="applicantId"
              className="block text-sm font-medium text-gray-700"
            >
              Applicant ID
            </label>
            <input
              type="text"
              name="applicantId"
              id="applicantId"
              value={filters.applicantId || ''}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter Applicant ID"
            />
          </div>

          {/* Referee ID */}
          <div>
            <label
              htmlFor="refereeId"
              className="block text-sm font-medium text-gray-700"
            >
              Referee ID
            </label>
            <input
              type="text"
              name="refereeId"
              id="refereeId"
              value={filters.refereeId || ''}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter Referee ID"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={filters.status ?? ''}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="">All</option>
              {Object.values(ReferenceStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              type="text"
              name="search"
              id="search"
              value={filters.search || ''}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Search by relationship or position"
            />
          </div>
        </form>
      </div>

      {/* Create New Reference Button */}
      <div className="mb-4">
        <Button
          onClick={() => navigate('/dashboard/references/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create New Reference
        </Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                  Failed to load references.
                </td>
              </tr>
            ) : data && data.references.length > 0 ? (
              data.references.map((reference: IReference) => {
                // For display, if "applicant" is fully populated, show applicant.name. 
                // Else if it's just an ID string, show that. Same logic for "referee".
                const applicantDisplay =
                  typeof reference.applicant === 'string'
                    ? reference.applicant
                    : reference.applicant?.name || '(No Name)';
                const refereeDisplay =
                  typeof reference.referee === 'string'
                    ? reference.referee
                    : reference.referee?.name || '(No Name)';

                return (
                  <tr key={reference._id.toString()}>
                   
                    <td className="px-6 py-4 whitespace-nowrap">
                      {applicantDisplay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {refereeDisplay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reference.status === ReferenceStatus.Pending
                            ? 'bg-yellow-100 text-yellow-800'
                            : reference.status === ReferenceStatus.Sent
                            ? 'bg-blue-100 text-blue-800'
                            : reference.status === ReferenceStatus.Received
                            ? 'bg-green-100 text-green-800'
                            : reference.status === ReferenceStatus.Completed
                            ? 'bg-green-200 text-green-800'
                            : /* Rejected or other statuses */
                              'bg-red-100 text-red-800'
                        }`}
                      >
                        {reference.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* View (go to ReferenceDetail) */}
                        <button
                          onClick={() =>
                            navigate(`/dashboard/references/${reference._id}`)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>

                        {/* Send (Pending -> Sent) */}
                        {reference.status === ReferenceStatus.Pending && (
                          <button
                            onClick={() => handleSend(reference._id.toString())}
                            className={`text-blue-600 hover:text-blue-900 ${
                              isSending ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isSending}
                          >
                            {isSending ? 'Sending...' : 'Send'}
                          </button>
                        )}

                        {/* Receive (Sent -> Received) */}
                        {reference.status === ReferenceStatus.Sent && (
                          <button
                            onClick={() =>
                              handleReceive(reference._id.toString())
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Receive
                          </button>
                        )}

                        {/* Complete (Received -> Completed) */}
                        {reference.status === ReferenceStatus.Received && (
                          <button
                            onClick={() =>
                              handleComplete(reference._id.toString())
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Complete
                          </button>
                        )}

                        {/* Reject (Sent -> Rejected) */}
                        {reference.status === ReferenceStatus.Sent && (
                          <button
                            onClick={() =>
                              handleReject(reference._id.toString())
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        )}

                        <button
                        onClick={() => navigate(`/dashboard/references/audit/${reference._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiList size={20} />
                      </button>

                        {/* Delete (Any status) */}
                        <button
                          onClick={() => handleDelete(reference._id.toString())}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              // If no references
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No references found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data && data.references.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          {/* Page Size Selector */}
          <div>
            <label htmlFor="pageSize" className="mr-2 text-sm text-gray-700">
              Show
            </label>
            <select
              id="pageSize"
              value={filters.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2 text-sm text-gray-700">entries</span>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className={`px-3 py-1 border rounded-md ${
                filters.page === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {filters.page} of{' '}
              {Math.ceil((data.total || 1) / filters.limit)}
            </span>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page * filters.limit >= (data.total || 0)}
              className={`px-3 py-1 border rounded-md ${
                filters.page * filters.limit >= (data.total || 0)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
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

export default ReferenceList;
