// src/components/Admin/Contractors/ContractorEdit.tsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFetchContractorByIdQuery,
  useUpdateContractorMutation,
} from '../../../api/contractApi';
import Button from '../../common/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ContractorEditForm, contractorEditSchema } from '../../../types/contractorEditForm';

const ContractorEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch contractor data
  const {
    data: contractor,
    error: fetchError,
    isLoading: isFetching,
  } = useFetchContractorByIdQuery(id!);

  // Mutation for updating contractor
  const [
    updateContractor,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdateContractorMutation();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractorEditForm>({
    resolver: yupResolver(contractorEditSchema),
  });

  // Populate form with fetched contractor data
  useEffect(() => {
    if (contractor) {
      reset({
        name: contractor.name,
        email: contractor.email,
        phone_number: contractor.phone_number,
        role: contractor.role,
        status: contractor.status as 'Active' | 'Pending' | 'Suspended',
        employee_id: contractor.employee_id,
        address: {
          street: contractor.address.street,
          city: contractor.address.city,
          state: contractor.address.state,
          country: contractor.address.country,
        },
        hourlyRate: contractor.hourlyRate,
        overtimeRate: contractor.overtimeRate,
      });
    }
  }, [contractor, reset]);

  // Handle form submission
  const onSubmit: SubmitHandler<ContractorEditForm> = async (data) => {
    try {
      await updateContractor({
        id: contractor!._id,
        ...data,
      }).unwrap();
      alert('Contractor updated successfully!');
      navigate(`/admin/contractors/${id}`);
    } catch (err) {
      console.error('Failed to update contractor:', err);
      alert('Error updating contractor. Please try again.');
    }
  };

  if (isFetching) {
    return (
      <div className="p-4 flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-2">Loading Contractor Details...</span>
      </div>
    );
  }

  if (fetchError) {
    const errorMessage =
      (fetchError as any)?.data?.message || 'Error loading contractor details.';
    console.error('Error fetching contractor:', fetchError);
    return <div className="p-4 text-red-500">{errorMessage}</div>;
  }

  if (!contractor) {
    return <div className="p-4">Contractor not found.</div>;
  }

  return (
    <div className="p-2 bg-gray-100 min-h-screen ">
      <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-t  from-teal-600 via-cyan-900 to-gray-900 text-white px-6 py-4">
          <h2 className="text-2xl font-semibold">Edit Contractor</h2>
          <Button
            variant="primary"
            onClick={() => navigate(`/dashboard/admin/contractors/${id}`)}
          >
            Back to Details
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 font-secondary">
          {/* Personal Information */}
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                {...register('name')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter contractor name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter contractor email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                {...register('phone_number')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block mb-1 font-medium">Employee ID</label>
              <input
                type="text"
                {...register('employee_id')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.employee_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter employee ID"
                disabled
              />
              {errors.employee_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employee_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street */}
            <div>
              <label className="block mb-1 font-medium">Street</label>
              <input
                type="text"
                {...register('address.street')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.address?.street ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter street address"
              />
              {errors.address?.street && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.street.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block mb-1 font-medium">City</label>
              <input
                type="text"
                {...register('address.city')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.address?.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city"
              />
              {errors.address?.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.city.message}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block mb-1 font-medium">State</label>
              <input
                type="text"
                {...register('address.state')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.address?.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter state"
              />
              {errors.address?.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.state.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block mb-1 font-medium">Country</label>
              <input
                type="text"
                {...register('address.country')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.address?.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter country"
              />
              {errors.address?.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.country.message}
                </p>
              )}
            </div>
          </div>

          {/* Contractor Details */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Contractor Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <input
                type="text"
                {...register('role')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter role"
                disabled
              />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                {...register('status')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block mb-1 font-medium">Hourly Rate (₦)</label>
              <input
                type="number"
                step="0.01"
                {...register('hourlyRate')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter hourly rate"
              />
              {errors.hourlyRate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hourlyRate.message}
                </p>
              )}
            </div>

            {/* Overtime Rate */}
            <div>
              <label className="block mb-1 font-medium">Overtime Rate (₦ per hour)</label>
              <input
                type="number"
                step="0.01"
                {...register('overtimeRate')}
                className={`w-full border px-3 py-2 rounded ${
                  errors.overtimeRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter overtime rate"
              />
              {errors.overtimeRate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.overtimeRate.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              variant="primary"
              disabled={isUpdating}
              isLoading={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Contractor'}
            </Button>
            {updateError && (
              <p className="text-red-500 text-sm mt-2">
                {(updateError as any)?.data?.message ||
                  'Failed to update contractor.'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractorEdit;
