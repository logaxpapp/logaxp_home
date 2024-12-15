// src/components/EmployeePayPeriods/EmployeePayPeriodsList.tsx

import React, { useState } from 'react';
import {
  useFetchPayPeriodEmployeeRecordsQuery,
  useFetchEmployeePayPeriodsByEmployeeQuery,
  useCreateEmployeePayPeriodMutation,
  useUpdateEmployeePayPeriodMutation,
  useDeleteEmployeePayPeriodMutation,
} from '../../api/employeePayPeriodApiSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useAppSelector } from '../../app/hooks';
import { useFetchAllPayPeriodsQuery } from '../../api/payPeriodApiSlice';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import DataTable, { Column } from './DataTable';
import Button from '../common/Button/Button';
import { IEmployeePayPeriod } from '../../types/employeePayPeriod';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Modal from '../common/Feedback/Modal';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/Loader';
import EmployeePayPeriodForm from './EmployeePayPeriodForm'; // Remove if not needed

interface EmployeePayPeriodsListProps {
  payPeriodId?: string;
  employeeId?: string;
}

const EmployeePayPeriodsList: React.FC<EmployeePayPeriodsListProps> = ({ payPeriodId, employeeId }) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  // Extract employee ID from current user if not provided
  const finalEmployeeId = employeeId || user?.employee_id;

  // Fetch all pay periods and select the first one if not provided
  const { data: allPayPeriods, isLoading: isLoadingPayPeriods, error: payPeriodsError } = useFetchAllPayPeriodsQuery();
  const finalPayPeriodId = payPeriodId || allPayPeriods?.[0]?._id;

  console.log('User Details:', user);
  console.log('Selected Pay Period ID:', finalPayPeriodId);
  console.log('Selected Employee ID:', finalEmployeeId);

  // Fetch EmployeePayPeriod data
  const { data: payPeriodEmployeeRecords, error, isLoading } = finalPayPeriodId
    ? useFetchPayPeriodEmployeeRecordsQuery(finalPayPeriodId)
    : finalEmployeeId
    ? useFetchEmployeePayPeriodsByEmployeeQuery(finalEmployeeId)
    : useFetchPayPeriodEmployeeRecordsQuery(''); // Default case

  // Fetch all Users (Employees)
  const { data: allUsers, isLoading: isLoadingUsers, error: usersError } = useFetchAllUsersQuery({ page: 1, limit: 100 });

  // Mutations
  const [createEmployeePayPeriod] = useCreateEmployeePayPeriodMutation();
  const [updateEmployeePayPeriod] = useUpdateEmployeePayPeriodMutation();
  const [deleteEmployeePayPeriod] = useDeleteEmployeePayPeriodMutation();

  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editPayPeriod, setEditPayPeriod] = useState<IEmployeePayPeriod | null>(null);

  // Handlers
  const handleCreate = async (payPeriodData: Partial<IEmployeePayPeriod>) => {
    try {
      await createEmployeePayPeriod(payPeriodData).unwrap();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create Employee Pay Period:', err);
    }
  };

  const handleEdit = async (id: string, updates: Partial<IEmployeePayPeriod>) => {
    try {
      await updateEmployeePayPeriod({ id, updates }).unwrap();
      setEditPayPeriod(null);
    } catch (err) {
      console.error('Failed to update Employee Pay Period:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Employee Pay Period?')) return;
    try {
      await deleteEmployeePayPeriod(id).unwrap();
    } catch (err) {
      console.error('Failed to delete Employee Pay Period:', err);
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/employeePayPeriods/${id}`);
  };

  // Define columns for DataTable
  const columns: Column<IEmployeePayPeriod>[] = [
    {
      id: 'employee',
      label: 'Employee Name',
      renderCell: (row: IEmployeePayPeriod) =>
        typeof row.employee !== 'string' ? row.employee.name : row.employee,
    },
    { id: 'totalHours', label: 'Total Hours' },
    { id: 'regularHours', label: 'Regular Hours' },
    { id: 'overtimeHours', label: 'Overtime Hours' },
    {
      id: 'totalPay',
      label: 'Total Pay',
      renderCell: (row: IEmployeePayPeriod) => `$${row.totalPay.toFixed(2)}`,
    },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row: IEmployeePayPeriod) => (
        <div className="flex space-x-2">
          <Button
            variant="edit"
            size="small"
            leftIcon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              setEditPayPeriod(row);
            }}
            aria-label="Edit Employee Pay Period"
          />
          <Button
            variant="delete"
            size="small"
            leftIcon={<FaTrash />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
            aria-label="Delete Employee Pay Period"
          />
          <Button
            variant="view"
            size="small"
            leftIcon={<FaEye />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(row._id);
            }}
            aria-label="View Details"
          />
        </div>
      ),
    },
  ];

  // Prepare data for DataTable
  const tableData = payPeriodEmployeeRecords || [];

  // Handle loading and error states
  if (isLoading || isLoadingUsers || isLoadingPayPeriods) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || usersError || payPeriodsError) {
    return <div className="text-red-500">Error fetching data.</div>;
  }

  // Extract Users and PayPeriods for form selections
  const users = allUsers?.users || [];
  const payPeriods = allPayPeriods || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4 mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800">Employee Pay Periods</h2>
        <Button
          variant="primary"
          size="medium"
          leftIcon={<FaPlus />}
          onClick={() => navigate('/dashboard/employeePayPeriods/create')}
          aria-label="Create Employee Pay Period"
        >
          Create
        </Button>
      </div>

      <DataTable<IEmployeePayPeriod>
        columns={columns}
        data={tableData}
        onRowClick={(row: IEmployeePayPeriod) => handleViewDetails(row._id)}
      />

      {/* Edit Modal */}
      {editPayPeriod && (
        <Modal isOpen={!!editPayPeriod} onClose={() => setEditPayPeriod(null)} title="Edit Employee Pay Period">
          <EmployeePayPeriodForm
            initialData={editPayPeriod}
            onSubmit={(updates) => handleEdit(editPayPeriod._id, updates)}
            onCancel={() => setEditPayPeriod(null)}
            users={users}
            payPeriods={payPeriods}
          />
        </Modal>
      )}
    </div>
  );
};

export default EmployeePayPeriodsList;
