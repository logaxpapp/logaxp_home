// src/components/EmployeePayPeriods/EmployeePayPeriodDetail.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useFetchEmployeePayPeriodByIdQuery,
} from '../../api/employeePayPeriodApiSlice';
import LoadingSpinner from '../../components/Loader';
import Button from '../common/Button/Button';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IPayPeriod } from '../../types/payPeriodTypes';

const EmployeePayPeriodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, error, isLoading } = useFetchEmployeePayPeriodByIdQuery(id || '');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500">Error fetching Employee Pay Period details.</div>;
  }

  function isIPayPeriod(payPeriod: string | IPayPeriod): payPeriod is IPayPeriod {
    return typeof payPeriod === 'object' && payPeriod !== null;
  }
  

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
      <Button
        variant="secondary"
        size="small"
        leftIcon={<FaArrowLeft />}
        onClick={() => navigate(-1)}
        className="mb-4"
        aria-label="Go Back"
      >
        Back
      </Button>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Employee Pay Period Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Employee Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Employee Information</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Name:</strong> {typeof data.employee !== 'string' ? data.employee.name : data.employee}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Email:</strong> {typeof data.employee !== 'string' ? data.employee.email : 'N/A'}
          </p>
        </div>

        {/* Pay Period Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Pay Period Information</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
          <strong>Start Date:</strong>{' '}
          {isIPayPeriod(data.payPeriod) ? new Date(data.payPeriod.startDate).toLocaleDateString() : 'N/A'}
        </p>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          <strong>End Date:</strong>{' '}
          {isIPayPeriod(data.payPeriod) ? new Date(data.payPeriod.endDate).toLocaleDateString() : 'N/A'}
        </p>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          <strong>Status:</strong>{' '}
          {isIPayPeriod(data.payPeriod) ? data.payPeriod.status : 'N/A'}
        </p>

        </div>

        {/* Hours and Rates */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Hours and Rates</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Total Hours:</strong> {data.totalHours}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Regular Hours:</strong> {data.regularHours}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Overtime Hours:</strong> {data.overtimeHours}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Hourly Rate:</strong> ${data.hourlyRate.toFixed(2)}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Overtime Rate:</strong> {data.overtimeRate}x
          </p>
        </div>

        {/* Pay Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Pay Details</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Regular Pay:</strong> ${data.regularPay.toFixed(2)}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Overtime Pay:</strong> ${data.overtimePay.toFixed(2)}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Total Pay:</strong> ${data.totalPay.toFixed(2)}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Deductions:</strong> ${data.deductions.toFixed(2)}
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            <strong>Net Pay:</strong> ${data.netPay.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayPeriodDetail;