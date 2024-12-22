// src/components/Admin/Contracts/ContractCreate.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchContractorsQuery, useCreateContractMutation } from '../../../api/contractApi';
import Button from '../../common/Button';
import { CreateContractRequest, PaymentTerms, IContractor } from '../../../types/contractTypes';
import { FaProjectDiagram, FaTimesCircle, FaCheckCircle, FaDollarSign, FaUpload } from 'react-icons/fa';
import { uploadMultipleImages } from '../../../services/cloudinaryService';

// Define TypeScript enum for Payment Terms (if not already defined in contractTypes.ts)
enum PaymentTermsEnum {
  Hourly = 'Hourly',
  Fixed = 'Fixed',
  Milestone = 'Milestone',
  Retainer = 'Retainer',
  Commission = 'Commission',
}

const ContractCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: contractors, isLoading: isLoadingContractors, error: contractorsError } = useFetchContractorsQuery({ skip: 0, limit: 100 });
  const [createContract, { isLoading: isCreating }] = useCreateContractMutation();

  // Initialize form data state
  const [formData, setFormData] = useState({
    contractor: '',
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    paymentTerms: '',
    totalCost: '',
    deliverables: '',
    attachments: [] as File[], // Changed to store files
  });

  // Initialize form errors state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize submission status state
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === 'attachments' && files) {
      setFormData((prev) => ({ ...prev, attachments: Array.from(files) }));
      setFormErrors((prev) => ({ ...prev, attachments: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.contractor) errors.contractor = 'Contractor is required.';
    if (!formData.projectName) errors.projectName = 'Project name is required.';
    if (!formData.description) errors.description = 'Description is required.';
    if (!formData.startDate) errors.startDate = 'Start date is required.';
    if (!formData.endDate) errors.endDate = 'End date is required.';
    if (!formData.paymentTerms) errors.paymentTerms = 'Payment terms are required.';
    if (!formData.totalCost || isNaN(Number(formData.totalCost))) errors.totalCost = 'Valid total cost is required.';
    // Additional validations can be added as needed
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let attachmentUrls: string[] = [];

      // If attachments are provided, upload them first
      if (formData.attachments.length > 0) {
        attachmentUrls = await uploadMultipleImages(formData.attachments);
      }

      // Prepare contract data
      const contractData: CreateContractRequest = {
        deliverables: formData.deliverables
          ? formData.deliverables.split(',').map((item) => item.trim())
          : [],
        attachments: attachmentUrls,
        totalCost: Number(formData.totalCost),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        contractor: formData.contractor,
        projectName: formData.projectName,
        description: formData.description,
        paymentTerms: formData.paymentTerms as PaymentTerms,
      };

      // Create contract
      await createContract(contractData).unwrap();
      setSubmissionStatus('success');
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard/admin/contracts');
      }, 2000);
    } catch (err) {
      console.error('Failed to create contract:', err);
      setSubmissionStatus('error');
      // Optionally, dispatch an error notification here
    }
  };

  // Loading state for contractors
  if (isLoadingContractors)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FaProjectDiagram className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <p className="mt-4 text-gray-500">Loading Contractors...</p>
        </div>
      </div>
    );

  // Error state for contractors
  if (contractorsError) {
    console.error('Error fetching contractors:', contractorsError);
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-red-500">Error loading contractors. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen font-secondary dark:bg-gray-800">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create New Contract
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Fill out the form below to create a new contract.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
          {/* Submission Status */}
          {submissionStatus === 'success' && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
              role="alert"
            >
              <FaCheckCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
              <span className="font-medium">Contract created successfully!</span>
            </div>
          )}
          {submissionStatus === 'error' && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              <FaTimesCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
              <span className="font-medium">Failed to create contract. Please try again.</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contractor Selection */}
            <div className="relative">
              <label htmlFor="contractor" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Contractor<span className="text-red-500">*</span>
              </label>
              <select
                id="contractor"
                name="contractor"
                value={formData.contractor}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  formErrors.contractor ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
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
              {formErrors.contractor && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.contractor}</p>
              )}
            </div>

            {/* Project Name */}
            <div className="relative">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Project Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="projectName"
                id="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                  formErrors.projectName ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                placeholder="Enter project name"
                required
              />
              {formErrors.projectName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.projectName}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2 relative">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                placeholder="Provide a detailed description of the project"
                required
              ></textarea>
              {formErrors.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.description}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="relative">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                  formErrors.startDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                required
              />
              {formErrors.startDate && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="relative">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                End Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                  formErrors.endDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                required
              />
              {formErrors.endDate && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.endDate}</p>
              )}
            </div>

            {/* Payment Terms */}
            <div className="relative">
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Payment Terms<span className="text-red-500">*</span>
              </label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  formErrors.paymentTerms ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                required
              >
                <option value="">Select Payment Term</option>
                {Object.values(PaymentTermsEnum).map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
              {formErrors.paymentTerms && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.paymentTerms}</p>
              )}
            </div>

            {/* Total Cost */}
            <div className="relative">
              <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Total Cost<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400 dark:text-gray-300" />
                </div>
                <input
                  type="number"
                  name="totalCost"
                  id="totalCost"
                  value={formData.totalCost}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formErrors.totalCost ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              {formErrors.totalCost && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.totalCost}</p>
              )}
            </div>

            {/* Deliverables */}
            <div className="relative">
              <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Deliverables
              </label>
              <input
                type="text"
                name="deliverables"
                id="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="e.g., Design Mockups, Final Code"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Separate items with commas.</p>
            </div>

            {/* Attachments */}
            <div className="relative">
              <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Attachments
              </label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="attachments"
                  className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaUpload className="mr-2" />
                  Upload Files
                  <input
                    type="file"
                    name="attachments"
                    id="attachments"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*,application/pdf" // Adjust as needed
                  />
                </label>
                {formData.attachments.length > 0 && (
                  <div className="ml-4 flex flex-wrap gap-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-200 dark:bg-gray-600 rounded px-2 py-1 text-sm">
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.attachments && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.attachments}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end ">
            <Button type="submit" variant="primary" disabled={isCreating} isLoading={isCreating} className='bg-gradient-to-t from-teal-600 via-cyan-900 to-gray-900 hover:from-teal-700 hover:via-cyan-800 hover:to-gray-800'>
              {isCreating ? 'Creating...' : 'Create Contract'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractCreate;
