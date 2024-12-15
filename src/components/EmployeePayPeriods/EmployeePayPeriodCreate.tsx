// src/components/EmployeePayPeriods/EmployeePayPeriodCreate.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateEmployeePayPeriodMutation } from '../../api/employeePayPeriodApiSlice';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useFetchAllPayPeriodsQuery } from '../../api/payPeriodApiSlice';
import { IEmployeePayPeriod } from '../../types/employeePayPeriod';
import EmployeePayPeriodForm from './EmployeePayPeriodForm';
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner';
import Button from '../common/Button/Button';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const EmployeePayPeriodCreate: React.FC = () => {
  const navigate = useNavigate();

  // Fetch all Users (Employees) and PayPeriods
  const {
    data: allUsers,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useFetchAllUsersQuery({ page: 1, limit: 100 });
  
  const {
    data: allPayPeriods,
    isLoading: isLoadingPayPeriods,
    error: payPeriodsError,
  } = useFetchAllPayPeriodsQuery();

  // Mutation for creating EmployeePayPeriod
  const [
    createEmployeePayPeriod,
    { isLoading: isCreating, error: createError },
  ] = useCreateEmployeePayPeriodMutation();

  // State for managing notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Handler for form submission
  const handleCreate = async (payPeriodData: Partial<IEmployeePayPeriod>) => {
    try {
      await createEmployeePayPeriod(payPeriodData).unwrap();
      setNotification({
        type: 'success',
        message: 'Employee Pay Period created successfully!',
      });
      // Redirect after a short delay to allow users to read the notification
      setTimeout(() => navigate('/dashboard/employeePayPeriods'), 1500);
    } catch (err) {
      console.error('Failed to create Employee Pay Period:', err);
      setNotification({
        type: 'error',
        message:
          'Failed to create Employee Pay Period. Please check your inputs and try again.',
      });
    }
  };

  // Handler for cancellation
  const handleCancel = () => {
    navigate('/dashboard/employeePayPeriods');
  };

  // Determine loading and error states
  const isLoading = isLoadingUsers || isLoadingPayPeriods || isCreating;
  const hasError = usersError || payPeriodsError || createError;

  // Render loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // Render error message
  if (hasError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 dark:bg-red-900">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <p className="text-red-600 dark:text-red-200 text-lg">
          Error fetching necessary data. Please try again later.
        </p>
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="mt-6"
          aria-label="Go Back"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Create Employee Pay Period
          </h1>
          <Button
            variant="secondary"
            onClick={handleCancel}
            aria-label="Cancel Creation"
          >
            Cancel
          </Button>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`flex items-center p-4 mb-6 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
            role="alert"
          >
            {notification.type === 'success' ? (
              <FaCheckCircle className="w-6 h-6 mr-3" />
            ) : (
              <FaExclamationCircle className="w-6 h-6 mr-3" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Form */}
        <EmployeePayPeriodForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          users={allUsers?.users || []}
          payPeriods={allPayPeriods || []}
        />
      </div>
    </div>
  );
};

export default EmployeePayPeriodCreate;
