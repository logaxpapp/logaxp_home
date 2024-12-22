// src/components/Admin/Contracts/ContractEdit.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import {
  useFetchContractorsQuery,
  useUpdateContractMutation,
  useFetchContractByIdQuery,
} from '../../../api/contractApi';
import Button from '../../common/Button';
import {
  IContractor,
  PaymentTerms,
  UpdateContractRequest,
} from '../../../types/contractTypes';
import { useNavigate, useParams } from 'react-router-dom';

interface FormData {
  contractor: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  paymentTerms: PaymentTerms;
  totalCost: number;
  deliverables: string;
  attachments: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Terminated' | 'Pending';
}

const ContractEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contract, isLoading, error } = useFetchContractByIdQuery(id!);
  const { data: contractors } = useFetchContractorsQuery({ skip: 0, limit: 100 });
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  React.useEffect(() => {
    if (contract) {
      setValue('contractor', contract.contractor?._id || '');
      setValue('projectName', contract.projectName || '');
      setValue('description', contract.description || '');
      setValue('startDate', contract.startDate?.slice(0, 10) || '');
      setValue('endDate', contract.endDate?.slice(0, 10) || '');
      setValue('paymentTerms', contract.paymentTerms || PaymentTerms.Hourly);
      setValue('totalCost', contract.totalCost || 0);
      setValue(
        'deliverables',
        contract.deliverables?.join(', ') || ''
      );
      setValue(
        'attachments',
        contract.attachments?.join(', ') || ''
      );
      setValue(
        'status',
        contract.status as
          | 'Draft'
          | 'Active'
          | 'Completed'
          | 'Terminated'
          | 'Pending'
      );
    }
  }, [contract, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const updatedData: UpdateContractRequest = {
        ...data,
        deliverables: data.deliverables
          .split(',')
          .map((item) => item.trim()),
        attachments: data.attachments
          ? data.attachments.split(',').map((item) => item.trim())
          : [],
      };

      if (id) {
        await updateContract({ id, updates: updatedData }).unwrap();
        alert('Contract updated successfully!');
        navigate(`/admin/contracts/${id}`);
      }
    } catch (err) {
      console.error('Failed to update contract:', err);
      alert('Error updating contract. Please try again.');
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
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
        <span className="ml-3 text-blue-600 text-lg">Loading Contract...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error loading contract.</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Contract</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Contractor */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Contractor<span className="text-red-500">*</span>
            </label>
            <select
              {...register('contractor', {
                required: 'Contractor is required.',
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.contractor
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            >
              <option value="">Select Contractor</option>
              {contractors?.length ? (
                contractors.map((contractor: IContractor) => (
                  <option key={contractor._id} value={contractor._id}>
                    {contractor.name} ({contractor.email})
                  </option>
                ))
              ) : (
                <option disabled>No contractors available</option>
              )}
            </select>
            {errors.contractor && (
              <span className="text-red-500 text-sm mt-1">
                {errors.contractor.message}
              </span>
            )}
          </div>

          {/* Project Name */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Project Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('projectName', {
                required: 'Project name is required.',
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.projectName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter project name"
              required
            />
            {errors.projectName && (
              <span className="text-red-500 text-sm mt-1">
                {errors.projectName.message}
              </span>
            )}
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Start Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('startDate', {
                required: 'Start date is required.',
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.startDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {errors.startDate && (
              <span className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </span>
            )}
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              End Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('endDate', {
                required: 'End date is required.',
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.endDate
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            {errors.endDate && (
              <span className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </span>
            )}
          </div>

          {/* Payment Terms */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Payment Terms<span className="text-red-500">*</span>
            </label>
            <select
              {...register('paymentTerms', {
                required: 'Payment terms are required.',
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.paymentTerms
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            >
              <option value="">Select Payment Term</option>
              {Object.values(PaymentTerms).map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
            {errors.paymentTerms && (
              <span className="text-red-500 text-sm mt-1">
                {errors.paymentTerms.message}
              </span>
            )}
          </div>

          {/* Total Cost */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Total Cost (₦)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('totalCost', {
                required: 'Total cost is required.',
                min: {
                  value: 0,
                  message: 'Total cost cannot be negative.',
                },
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.totalCost
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter total cost"
              required
            />
            {errors.totalCost && (
              <span className="text-red-500 text-sm mt-1">
                {errors.totalCost.message}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              {...register('status', {
                required: 'Status is required.',
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.status
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            >
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Terminated">Terminated</option>
            </select>
            {errors.status && (
              <span className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </span>
            )}
          </div>

          {/* Description (Full Width) */}
          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="mb-2 font-medium text-gray-700">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Description is required.',
              })}
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              rows={5}
              placeholder="Enter project description"
              required
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Deliverables */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Deliverables
            </label>
            <input
              type="text"
              {...register('deliverables')}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
              placeholder="e.g., Design Mockups, Final Code"
            />
            <span className="text-sm text-gray-500 mt-1">
              Separate items with commas.
            </span>
          </div>

          {/* Attachments */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700">
              Attachments
            </label>
            <input
              type="text"
              {...register('attachments')}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
              placeholder="e.g., document.pdf, image.png"
            />
            <span className="text-sm text-gray-500 mt-1">
              Separate file names with commas.
            </span>
          </div>

          {/* Submit Button (Full Width) */}
          <div className="flex flex-col col-span-1 md:col-span-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isUpdating}
              isLoading={isUpdating}
              className="w-full py-3 mt-4 bg-gradient-to-t from-teal-600 via-cyan-900 to-gray-900 hover:from-teal-700 hover:via-cyan-800 hover:to-gray-800"
            >
              {isUpdating ? 'Updating...' : 'Update Contract'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractEdit;
