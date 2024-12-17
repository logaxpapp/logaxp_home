// src/pages/PendingApprovalShifts.tsx

import React, { useState } from 'react';
import {
  useGetShiftsQuery,
  useApproveShiftAssignmentMutation,
  useRejectShiftAssignmentMutation,
} from '../../api/shiftApi';
import { IShift, ShiftStatus } from '../../types/shift';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Loader from '../../components/Loader';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Notification from '../../components/Notification';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { format, parseISO } from 'date-fns';
import Button from '../../components/common/Button/Button';
import { UserRole } from '../../types/user';
import Pagination from '../../components/common/Pagination/Pagination';

const PendingApprovalShifts: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user || user.role !== UserRole.Admin) {
    return null;
  }

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const [selectedShift, setSelectedShift] = useState<IShift | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: pendingShiftsData,
    error: pendingShiftsError,
    isLoading: pendingShiftsLoading,
    refetch: refetchPendingShifts,
  } = useGetShiftsQuery({
    status: ShiftStatus.PendingApproval,
    page: currentPage,
    limit: pageSize,
  });

  const totalPages = pendingShiftsData ? Math.ceil(pendingShiftsData.total / pageSize) : 1;
  const pendingShifts = pendingShiftsData?.shifts || [];

  const [approveShiftAssignment] = useApproveShiftAssignmentMutation();
  const [rejectShiftAssignment] = useRejectShiftAssignmentMutation();

  const handleApproveShift = async () => {
    if (selectedShift) {
      try {
        await approveShiftAssignment(selectedShift._id).unwrap();
        setNotification({
          open: true,
          message: 'Shift assignment approved!',
          severity: 'success',
        });
        refetchPendingShifts();
      } catch (error) {
        setNotification({
          open: true,
          message: 'Failed to approve shift assignment.',
          severity: 'error',
        });
      } finally {
        setSelectedShift(null);
        setActionType(null);
      }
    }
  };

  const handleRejectShift = async () => {
    if (selectedShift) {
      try {
        await rejectShiftAssignment(selectedShift._id).unwrap();
        setNotification({
          open: true,
          message: 'Shift assignment rejected.',
          severity: 'success',
        });
        refetchPendingShifts();
      } catch (error) {
        setNotification({
          open: true,
          message: 'Failed to reject shift assignment.',
          severity: 'error',
        });
      } finally {
        setSelectedShift(null);
        setActionType(null);
      }
    }
  };

  const pendingShiftsColumns: Column<IShift>[] = [
    {
      header: 'Shift Name',
      accessor: (item: IShift) => item.shiftType?.name || 'N/A',
    },
    {
      header: 'Date',
      accessor: (item: IShift) => {
        const date = parseISO(item.date);
        return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'PPP');
      },
    },
    {
      header: 'Start Time',
      accessor: (item: IShift) => item.startTime || 'N/A',
    },
    {
      header: 'End Time',
      accessor: (item: IShift) => item.endTime || 'N/A',
    },
    {
      header: 'Requested By',
      accessor: (item: IShift) => item.assignedTo?.name || 'N/A',
    },
    {
      header: 'Actions',
      accessor: (item: IShift) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setSelectedShift(item);
              setActionType('approve');
            }}
            variant="success"
          >
            Approve
          </Button>
          <Button
            onClick={() => {
              setSelectedShift(item);
              setActionType('reject');
            }}
            variant="danger"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  if (pendingShiftsLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader />
      </div>
    );
  }

  if (pendingShiftsError) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-500">Failed to load shifts pending approval.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md p-4 dark:bg-gray-800">
        {pendingShifts.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-center text-gray-500">No shifts pending approval.</p>
          </div>
        ) : (
          <>
            <DataTable<IShift> data={pendingShifts} columns={pendingShiftsColumns} />
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmationDialog
        open={Boolean(selectedShift && actionType === 'approve')}
        title="Approve Shift Assignment"
        message={`Are you sure you want to approve the shift assignment for "${selectedShift?.assignedTo?.name}"?`}
        onConfirm={handleApproveShift}
        onCancel={() => {
          setSelectedShift(null);
          setActionType(null);
        }}
        confirmText="Approve"
        cancelText="Cancel"
      />

      <ConfirmationDialog
        open={Boolean(selectedShift && actionType === 'reject')}
        title="Reject Shift Assignment"
        message={`Are you sure you want to reject the shift assignment for "${selectedShift?.assignedTo?.name}"?`}
        onConfirm={handleRejectShift}
        onCancel={() => {
          setSelectedShift(null);
          setActionType(null);
        }}
        confirmText="Reject"
        cancelText="Cancel"
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </div>
   
  );
};

export default PendingApprovalShifts;
