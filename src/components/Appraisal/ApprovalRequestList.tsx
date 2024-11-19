// src/pages/ApprovalRequestList.tsx

import React from 'react';
import { 
  useProcessApprovalRequestMutation, 
  useDeleteApprovalRequestMutation, 
  useGetUserApprovalRequestsQuery 
} from '../../api/approvalsApi';
import { IApprovalRequest } from '../../types/approval';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Loader from '../../components/Loader';
import IconButton from '../../components/common/IconButton';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// Check if error is a FetchBaseQueryError and has data
const isFetchBaseQueryError = (error: any): error is { data: { message: string } } => {
  return error && typeof error === 'object' && 'data' in error && 'message' in error.data;
};

const ApprovalRequestList: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetUserApprovalRequestsQuery();
  const approvalRequests = data?.data || [];

  const [processApprovalRequest] = useProcessApprovalRequestMutation();
  const [deleteApprovalRequest] = useDeleteApprovalRequestMutation(); 

  const handleApprove = async (id: string) => {
    try {
      await processApprovalRequest({
        requestId: id,
        action: 'finalize',
        status: 'Approved',
        comments: 'Approved by admin.',
      }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to approve request:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await processApprovalRequest({
        requestId: id,
        action: 'finalize',
        status: 'Rejected',
        comments: 'Rejected by admin.',
      }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this approval request?')) {
      try {
        await deleteApprovalRequest(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete approval request:', err);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <p className="text-red-500">
        {isFetchBaseQueryError(error) && error.data?.message
          ? error.data.message
          : 'Failed to load approval requests.'}
      </p>
    );
  }

  const columns: Array<Column<IApprovalRequest>> = [
    { 
      header: 'User', 
      accessor: (item: IApprovalRequest) => item.user.name,
      sortable: true,
    },
    { 
      header: 'Type', 
      accessor: 'request_type', 
      sortable: true,
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      sortable: true,
      Cell: ({ value }) => (
        <span 
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Approved' ? 'bg-green-100 text-green-800' :
            value === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    { 
      header: 'Current Step', 
      accessor: 'current_step', 
      sortable: true,
    },
    { 
      header: 'Actions', 
      accessor: (item: IApprovalRequest) => (
        <div className="flex space-x-2">
          <Tippy content="Approve" placement="top" delay={100}>
            <IconButton 
              variant="success" 
              icon={<FaCheck />} 
              tooltip="Approve" 
              ariaLabel="Approve Request"
              onClick={() => handleApprove(item._id)}
            />
          </Tippy>
          <Tippy content="Reject" placement="top" delay={100}>
            <IconButton 
              variant="warning" 
              icon={<FaTimes />} 
              tooltip="Reject" 
              ariaLabel="Reject Request"
              onClick={() => handleReject(item._id)}
            />
          </Tippy>
          <Tippy content="Delete" placement="top" delay={100}>
            <IconButton 
              variant="danger" 
              icon={<FaTrash />} 
              tooltip="Delete" 
              ariaLabel="Delete Request"
              onClick={() => handleDelete(item._id)}
            />
          </Tippy>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="bg-blue-50 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-2xl font-bold font-primary">Approval Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <DataTable 
          data={approvalRequests}
          columns={columns}
          sortColumn="status"
          sortDirection="asc"
          onSort={(column) => {
            console.log(`Sorting by ${column}`);
          }}
        />
      </div>
    </div>
  );
};

export default ApprovalRequestList;
