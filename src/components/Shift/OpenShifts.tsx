// src/pages/OpenShifts.tsx

import React, { useState } from 'react';
import { useGetShiftsQuery, useGetUserShiftsQuery, useRequestShiftMutation } from '../../api/shiftApi';
import { IShift, ShiftStatus } from '../../types/shift';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Loader from '../../components/Loader';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import Notification from '../../components/Notification';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { format, parseISO } from 'date-fns';
import Button from '../../components/common/Button/Button';
import Pagination from '../../components/common/Pagination/Pagination';

const OpenShifts: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">Please log in to view open shifts.</p>
      </div>
    );
  }

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [selectedShift, setSelectedShift] = useState<IShift | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: openShiftsData,
    error: openShiftsError,
    isLoading: openShiftsLoading,
    refetch: refetchOpenShifts,
  } = useGetUserShiftsQuery({ status: ShiftStatus.Open, page: currentPage, limit: pageSize });

  const [requestShift] = useRequestShiftMutation();

  const handleRequestShift = async () => {
    if (selectedShift) {
      try {
        await requestShift({ shiftId: selectedShift._id }).unwrap();
        setNotification({
          open: true,
          message: 'Shift requested successfully!',
          severity: 'success',
        });
        refetchOpenShifts();
      } catch (error) {
        setNotification({
          open: true,
          message: 'Failed to request shift.',
          severity: 'error',
        });
      } finally {
        setSelectedShift(null);
      }
    }
  };

  const openShiftsColumns: Column<IShift>[] = [
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
      header: 'Actions',
      accessor: (item: IShift) => (
        <Button
          onClick={() => {
            setSelectedShift(item);
          }}
          variant="primary"
          className="text-white bg-blue-500 hover:bg-blue-600"
        >
          Request Shift
        </Button>
      ),
    },
  ];

  if (openShiftsLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader />
      </div>
    );
  }

  if (openShiftsError) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-500">Failed to load open shifts.</p>
      </div>
    );
  }

  const openShifts = openShiftsData?.shifts || [];
  const totalPages = openShiftsData ? Math.ceil(openShiftsData.total / pageSize) : 1;

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg dark:bg-gray-600">
      <h2 className="text-3xl font-bold text-blue-800 font-primary  border-gray-300  dark:text-lemonGreen-light">Open Shifts</h2>
      </div>
      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md p-4 dark:bg-gray-800">
        {openShifts.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-center text-gray-500">No open shifts available.</p>
          </div>
        ) : (
          <>
            <DataTable<IShift> data={openShifts} columns={openShiftsColumns} />
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
        open={Boolean(selectedShift)}
        title="Request Shift"
        message={`Are you sure you want to request the shift "${selectedShift?.shiftType?.name}" on ${
          selectedShift ? format(parseISO(selectedShift.date), 'PPP') : ''
        }?`}
        onConfirm={handleRequestShift}
        onCancel={() => {
          setSelectedShift(null);
        }}
        confirmText="Request"
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

export default OpenShifts;
