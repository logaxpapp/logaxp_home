import React, { useState, useMemo } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  useGetUserApprovalRequestsQuery,
  useDeleteApprovalRequestMutation,
  useProcessApprovalRequestMutation,
} from '../api/approvalsApi';
import DataTable, { Column } from './DataTable';
import {IApprovalRequest, IProcessApprovalPayload,} from '../types/approval';
import ConfirmationDialog from './ConfirmationDialog';
import Notification from './Notification';
import AddStepDialog from './AddStepModal';
import Loader from './Loader'; // Ensure correct import path
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';
import ActionsDropdown from './ActionsDropdown';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'data' in error;
}

const UserApprovalRequests: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetUserApprovalRequestsQuery();
  const approvalRequests = data?.data ?? [];

  // Mutations
  const [deleteApprovalRequest, { isLoading: isDeleting }] = useDeleteApprovalRequestMutation();
  const [processApprovalRequest, { isLoading: isProcessing }] = useProcessApprovalRequestMutation();

  // State Management
  const [isAddStepOpen, setIsAddStepOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<IApprovalRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete' | 'add_step' | null>(null);
  const [comments, setComments] = useState<string>('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Under Review' | 'Escalated'>('All');

  const currentUser = useAppSelector(selectCurrentUser);

  // Handlers for processing actions
  const handleProcess = async () => {
    if (selectedRequest && actionType) {
      try {
        const payload: IProcessApprovalPayload = {
          requestId: selectedRequest._id,
          action: 'finalize', // Both approve and reject use 'finalize' action
          status: actionType === 'approve' ? 'Approved' : 'Rejected',
          comments,
        };

        await processApprovalRequest(payload).unwrap();
        setNotification({
          open: true,
          message: `Request successfully ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
          severity: 'success',
        });
        refetch();
      } catch (err: any) {
        setNotification({
          open: true,
          message: err?.data?.message || `Failed to ${actionType} request.`,
          severity: 'error',
        });
      } finally {
        setSelectedRequest(null);
        setComments('');
        setActionType(null);
      }
    }
  };

  // Handler for deleting approval
  const handleDelete = async () => {
    if (selectedRequest) {
      try {
        await deleteApprovalRequest(selectedRequest._id).unwrap();
        setNotification({
          open: true,
          message: 'Approval request deleted successfully!',
          severity: 'success',
        });
        refetch();
      } catch (err: any) {
        setNotification({
          open: true,
          message: err?.data?.message || 'Failed to delete request.',
          severity: 'error',
        });
      } finally {
        setSelectedRequest(null);
      }
    }
  };

  // Handler for approving and adding a new step
  const handleApproveAndAddStep = async (newApproverId: string, stepName: string, comment: string) => {
    if (selectedRequest) {
      try {
        const payload: IProcessApprovalPayload = {
          requestId: selectedRequest._id,
          action: 'add_step',
          status: 'Approved',
          comments: comment, // Optional comments
          newApproverId,
          stepName,
        };
        await processApprovalRequest(payload).unwrap();
        setNotification({
          open: true,
          message: 'Request approved and new step added successfully!',
          severity: 'success',
        });
        refetch();
      } catch (err: any) {
        setNotification({
          open: true,
          message: err?.data?.message || 'Failed to approve and add step.',
          severity: 'error',
        });
      } finally {
        setSelectedRequest(null);
        setComments('');
        setIsAddStepOpen(false);
      }
    }
  };

  // Define the columns array with limited details content
  const columns: Column<IApprovalRequest>[] = [
    { id: 'request_type', label: 'Type' },
    {
      id: 'request_details',
      label: 'Details',
      renderCell: (row: IApprovalRequest) => (
        <Link
          to={`/dashboard/user-approvals/${row._id}`}
          className="text-blue-600 hover:underline"
          title={row.request_details} // Tooltip to show full details
        >
          {row.request_details.length > 20
            ? `${row.request_details.substring(0, 20)}...`
            : row.request_details}
        </Link>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      renderCell: (row: IApprovalRequest) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : row.status === 'Approved'
              ? 'bg-green-100 text-green-800'
              : row.status === 'Rejected'
              ? 'bg-red-100 text-red-800'
              : row.status === 'Under Review'
              ? 'bg-blue-100 text-blue-800'
              : row.status === 'Escalated'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      id: 'created_at',
      label: 'Submitted At',
      renderCell: (row: IApprovalRequest) => format(new Date(row.created_at), 'PPpp'),
    },
    // Actions Column
    {
      id: 'actions',
      label: '',
      renderCell: (row: IApprovalRequest) => (
        <ActionsDropdown
        request={row} 
        onApprove={() => {
          setSelectedRequest(row);
          setActionType('approve');
        }}
        onReject={() => {
          setSelectedRequest(row);
          setActionType('reject');
        }}
        onAddStep={() => {
          setSelectedRequest(row);
          setActionType('add_step');
          setIsAddStepOpen(true);
        }}
        onDelete={() => {
          setSelectedRequest(row);
          setActionType('delete');
        }}
      />
      ),
    },
  ];

  // Filtered Data based on Search and Status
  const filteredData = useMemo(() => {
    if (!Array.isArray(approvalRequests)) return [];

    return approvalRequests.filter((approval) => {
      const matchesSearch =
        approval.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.request_details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || approval.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [approvalRequests, searchTerm, statusFilter]);

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
       <h1 className="text-xl font-semibold mb-6 text-gray-800 font-primary dark:text-lemonGreen-light">My Approval Requests</h1>
      <div className=" justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 font-primary">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto">
            {/* Search Field */}
            <div className="flex items-center mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Search by Type or Details"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search approval requests"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center font-primary">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'All' | 'Pending' | 'Approved' | 'Rejected' | 'Under Review' | 'Escalated'
                  )
                }
                className="w-full sm:w-48 px-4 py-2 border  border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter approval requests by status"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
          </div>

          {/* Create Request Button */}
          <div className="flex items-center justify-end">
            <Link to="/dashboard/create-approval">
              <button
                disabled={isLoading || isDeleting}
                className="flex items-center px-4 py-2 bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900  text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
                aria-label="Create new approval request"
              >
                <FaPlusCircle className="mr-2" /> Create Request
              </button>
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto mb-20 font-secondary ">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader /> {/* Display the Loader component */}
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-center text-red-500">
                {isFetchBaseQueryError(error) && error.data && typeof error.data === 'object' && 'message' in error.data
                  ? (error.data as { message: string }).message
                  : 'Failed to load approval requests.'}
              </p>
            </div>
          ) : approvalRequests.length === 0 ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-center text-gray-500">No approval requests found.</p>
            </div>
          ) : (
            <DataTable<IApprovalRequest>
              columns={columns}
              data={filteredData}
              pagination
            />
          )}
        </div>

        {/* Confirmation Dialogs */}
        {/* Delete Confirmation */}
        <ConfirmationDialog
          open={Boolean(selectedRequest && actionType === 'delete')}
          title="Delete Approval Request"
          message="Are you sure you want to delete this approval request? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setSelectedRequest(null)}
          confirmText="Delete"
          cancelText="Cancel"
        />

        {/* Approve/Reject Confirmation */}
        <ConfirmationDialog
          open={Boolean(selectedRequest && (actionType === 'approve' || actionType === 'reject'))}
          title={actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
          message="Add comments (optional):"
          showInput
          inputLabel="Comments"
          inputValue={comments}
          onInputChange={(e) => setComments(e.target.value)}
          onConfirm={handleProcess}
          onCancel={() => {
            setSelectedRequest(null);
            setActionType(null);
            setComments('');
          }}
          confirmText={actionType === 'approve' ? 'Approve' : 'Reject'}
          cancelText="Cancel"
        />

        {/* Add Step Dialog */}
        <AddStepDialog
          isOpen={Boolean(selectedRequest && actionType === 'add_step')}
          onClose={() => {
            setSelectedRequest(null);
            setActionType(null);
            setIsAddStepOpen(false);
            setComments('');
          }}
          onSubmit={handleApproveAndAddStep}
        />

        {/* Notification */}
        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        />
      </div>
    </div>
  );
};

export default UserApprovalRequests;
