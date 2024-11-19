// src/pages/MyShifts.tsx

import React, { useState, useEffect } from 'react';
import { useViewScheduleQuery } from '../../api/shiftApi';
import { IShift } from '../../types/shift';
import DataTable, { Column } from '../../components/common/DataTable/DataTable';
import Loader from '../../components/Loader';
import Notification from '../../components/Notification';
import { format, parseISO, isValid } from 'date-fns';

const MyShifts: React.FC = () => {
  const { data, error, isLoading } = useViewScheduleQuery();
  const shifts = data?.shifts || [];

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (error) {
      setNotification({
        open: true,
        message: 'Failed to load your shifts.',
        severity: 'error',
      });
    }
  }, [error]);

  const columns: Column<IShift>[] = [
    {
      header: 'Shift Name',
      accessor: (item: IShift) => item.shiftType?.name || 'N/A',
      sortable: true,
    },
    {
      header: 'Date',
      accessor: (item: IShift) => {
        const date = parseISO(item.date);
        if (!isValid(date)) {
          return 'Invalid Date';
        }
        return format(date, 'PPP');
      },
    },
    {
      header: 'Start Time',
      accessor: (item: IShift) => {
        const dateOnly = item.date.split('T')[0]; // Extract 'YYYY-MM-DD'
        const dateTimeString = `${dateOnly}T${item.startTime}`;
        const dateTime = parseISO(dateTimeString);
        if (!isValid(dateTime)) {
          return 'Invalid Time';
        }
        return format(dateTime, 'PPpp');
      },
    },
    {
      header: 'End Time',
      accessor: (item: IShift) => {
        const dateOnly = item.date.split('T')[0];
        const dateTimeString = `${dateOnly}T${item.endTime}`;
        const dateTime = parseISO(dateTimeString);
        if (!isValid(dateTime)) {
          return 'Invalid Time';
        }
        return format(dateTime, 'PPpp');
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: ({ value }: { value: any }) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Open'
              ? 'bg-yellow-100 text-yellow-800'
              : value === 'Assigned'
              ? 'bg-blue-100 text-blue-800'
              : value === 'Completed'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    // Add more columns as needed
  ];

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg dark:bg-gray-600">
        <h2 className="text-3xl font-bold text-blue-800 font-primary border-gray-300 dark:text-lemonGreen-light">
          My Shifts
        </h2>
      </div>
        {/* Data Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader />
            </div>
          ) : shifts.length === 0 ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-center text-gray-500">
                You have no assigned shifts.
              </p>
            </div>
          ) : (
            <DataTable<IShift>
              data={shifts}
              columns={columns}
            />
          )}
        </div>

        {/* Notification */}
        <Notification
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        />
      </div>
  
  );
};

export default MyShifts;
