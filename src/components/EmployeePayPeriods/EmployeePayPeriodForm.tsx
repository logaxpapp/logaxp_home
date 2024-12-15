// src/components/EmployeePayPeriods/EmployeePayPeriodForm.tsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button/Button';
import { IEmployeePayPeriod } from '../../types/employeePayPeriod';
import { IUser } from '../../types/user';
import { IPayPeriod } from '../../types/payPeriodTypes';
import { FaExclamationCircle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export interface EmployeePayPeriodFormProps {
  initialData?: Partial<IEmployeePayPeriod>;
  onSubmit: (data: Partial<IEmployeePayPeriod>) => Promise<void>;
  onCancel: () => void;
  users: IUser[];
  payPeriods: IPayPeriod[];
}

const EmployeePayPeriodForm: React.FC<EmployeePayPeriodFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  users,
  payPeriods,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Partial<IEmployeePayPeriod>>({
    defaultValues: {
      employee:
        typeof initialData?.employee === 'string'
          ? initialData.employee
          : initialData?.employee?._id || '',
      payPeriod:
        typeof initialData?.payPeriod === 'string'
          ? initialData.payPeriod
          : initialData?.payPeriod?._id || '',
      totalHours: initialData?.totalHours || 0,
      regularHours: initialData?.regularHours || 0,
      overtimeHours: initialData?.overtimeHours || 0,
      hourlyRate: initialData?.hourlyRate || 0,
      overtimeRate: initialData?.overtimeRate || 1.5,
      deductions: initialData?.deductions || 0,
      netPay: initialData?.netPay || 0,
    },
  });

  // Watch relevant fields to calculate net pay
  const [regularHours, overtimeHours, hourlyRate, overtimeRate, deductions] = watch([
    'regularHours',
    'overtimeHours',
    'hourlyRate',
    'overtimeRate',
    'deductions',
  ]);

  // Function to calculate net pay
  const calculateNetPay = () => {
    const totalPay =
      (Number(regularHours) || 0) * (Number(hourlyRate) || 0) +
      (Number(overtimeHours) || 0) *
        (Number(hourlyRate) || 0) *
        (Number(overtimeRate) || 1.5);
    return totalPay - (Number(deductions) || 0);
  };

  // Sync net pay dynamically
  useEffect(() => {
    setValue('netPay', calculateNetPay());
  }, [regularHours, overtimeHours, hourlyRate, overtimeRate, deductions, setValue]);

  // Populate initial values from props
  useEffect(() => {
    if (initialData) {
      setValue(
        'employee',
        typeof initialData.employee === 'string' ? initialData.employee : initialData.employee?._id || ''
      );
      setValue(
        'payPeriod',
        typeof initialData.payPeriod === 'string' ? initialData.payPeriod : initialData.payPeriod?._id || ''
      );
    }
  }, [initialData, setValue]);

  const onSubmitHandler = async (data: Partial<IEmployeePayPeriod>) => {
    const formattedData = {
      ...data,
      employeeId: typeof data.employee === 'object' ? data.employee?._id : data.employee,
      payPeriodId: typeof data.payPeriod === 'object' ? data.payPeriod?._id : data.payPeriod,
    };
    await onSubmit(formattedData);
  };



  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      noValidate
    >
      {/* Notification Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-center space-x-2 p-4 bg-red-100 text-red-700 rounded-md">
          <FaExclamationCircle />
          <span>Please fix the errors below.</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Selection */}
        <div>
          <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            {...register('employee', { required: 'Employee is required' })}
            id="employee"
            className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
              errors.employee ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
          >
            <option value="">Select Employee</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.employee && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.employee.message}
            </p>
          )}
        </div>

        {/* Pay Period Selection */}
        <div>
          <label htmlFor="payPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pay Period <span className="text-red-500">*</span>
          </label>
          <select
            {...register('payPeriod', { required: 'Pay Period is required' })}
            id="payPeriod"
            className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
              errors.payPeriod ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
          >
            <option value="">Select Pay Period</option>
            {payPeriods.map((period) => (
              <option key={period._id} value={period._id}>
                {new Date(period.startDate).toLocaleDateString()} -{' '}
                {new Date(period.endDate).toLocaleDateString()}
              </option>
            ))}
          </select>
          {errors.payPeriod && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.payPeriod.message}
            </p>
          )}
        </div>

        {/* Total Hours */}
        <div>
          <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Hours <span className="text-red-500">*</span>
          </label>
          <input
            {...register('totalHours', {
              required: 'Total Hours are required',
              min: { value: 0, message: 'Must be at least 0' },
            })}
            type="number"
            id="totalHours"
            className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
              errors.totalHours ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
            min={0}
            step={0.1}
            placeholder="e.g., 40"
          />
          {errors.totalHours && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.totalHours.message}
            </p>
          )}
        </div>

        {/* Regular Hours */}
        <div>
          <label htmlFor="regularHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Regular Hours <span className="text-red-500">*</span>
          </label>
          <input
            {...register('regularHours', {
              required: 'Regular Hours are required',
              min: { value: 0, message: 'Must be at least 0' },
            })}
            type="number"
            id="regularHours"
            className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
              errors.regularHours ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
            min={0}
            step={0.1}
            placeholder="e.g., 40"
          />
          {errors.regularHours && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.regularHours.message}
            </p>
          )}
        </div>

        {/* Overtime Hours */}
        <div>
          <label htmlFor="overtimeHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Overtime Hours <span className="text-red-500">*</span>
          </label>
          <input
            {...register('overtimeHours', {
              required: 'Overtime Hours are required',
              min: { value: 0, message: 'Must be at least 0' },
            })}
            type="number"
            id="overtimeHours"
            className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
              errors.overtimeHours ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
            min={0}
            step={0.1}
            placeholder="e.g., 5"
          />
          {errors.overtimeHours && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.overtimeHours.message}
            </p>
          )}
        </div>

        {/* Hourly Rate */}
        <div className="md:col-span-2">
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hourly Rate ($) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register('hourlyRate', {
                required: 'Hourly Rate is required',
                min: { value: 0, message: 'Must be at least 0' },
              })}
              type="number"
              id="hourlyRate"
              className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
                errors.hourlyRate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
              min={0}
              step={0.01}
              placeholder="e.g., 25.00"
            />
          
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaInfoCircle className="text-blue-500" />
              </div>
        
          </div>
         
            <p className="mt-1 text-xs text-blue-500 flex items-center">
              <FaInfoCircle className="mr-1" />
              Consider verifying high hourly rates with HR.
            </p>
        
          {errors.hourlyRate && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.hourlyRate.message}
            </p>
          )}
        </div>

        {/* Overtime Rate */}
        <div>
          <label htmlFor="overtimeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Overtime Rate (x) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('overtimeRate', {
              required: 'Overtime Rate is required',
              min: { value: 0, message: 'Must be at least 0' },
            })}
            type="number"
            id="overtimeRate"
            className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
              errors.overtimeRate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
            min={0}
            step={0.01}
            placeholder="e.g., 1.5"
          />
          {errors.overtimeRate && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.overtimeRate.message}
            </p>
          )}
        </div>

        {/* Deductions */}
        <div>
          <label htmlFor="deductions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Deductions ($) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('deductions', { 
              required: 'Deductions are required', 
              min: { value: 0, message: 'Deductions cannot be negative' } 
            })}
            type="number"
            id="deductions"
            className={`mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border ${
              errors.deductions ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:outline-none focus:ring-lemonGreen-light focus:border-lemonGreen-light transition-colors duration-200`}
            min={0}
            step={0.01}
            placeholder="e.g., 100.00"
          />
          {errors.deductions && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <FaExclamationCircle className="mr-1" />
              {errors.deductions.message}
            </p>
          )}
        </div>

        {/* Net Pay (Read-Only) */}
        <div className="md:col-span-2">
          <label htmlFor="netPay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Net Pay ($)
          </label>
          <input
            type="number"
            id="netPay"
            value={calculateNetPay()}
            readOnly
            className="mt-1 block w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="secondary"
          onClick={onCancel}
          aria-label="Cancel Form Submission"
          className="flex items-center space-x-2"
        >
          <FaTimesCircle className="text-red-500" />
          <span>Cancel</span>
        </Button>
        <Button
          variant="primary"
          type="submit"
          aria-label="Submit Form"
          disabled={isSubmitting}
          className="flex items-center space-x-2"
        >
          <FaCheckCircle className="text-white" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
        </Button>
      </div>
    </form>
  );
};

export default EmployeePayPeriodForm;
