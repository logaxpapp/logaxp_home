// src/components/Admin/Contracts/ContractEdit.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useFetchContractByIdQuery,
  useUpdateContractMutation,
  useFetchContractorsQuery,
} from '../../../api/contractApi';
import Button from '../../common/Button';
import WYSIWYGEditor from '../../common/Input/WYSIWYGEditor';
import {
  IContractor,
  PaymentTerms,
  Currency,
  CurrencyOptions,
  PaymentTermsOptions,
  IRisk,
  IFrontendRisk, // New interface with _id
  UpdateContractRequest,
  IContract, // Ensure this interface is correctly imported
} from '../../../types/contractTypes';
import { FaDollarSign, FaUpload, FaTimesCircle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { uploadMultipleImages } from '../../../services/cloudinaryService';
import { useToast } from '../../../features/Toast/ToastContext';
import { v4 as uuidv4 } from 'uuid'; // For unique keys

// Enum for form steps
enum FormSteps {
  ContractorDetails = 1,
  PaymentDetails,
  RiskManagement,
  Attachments,
  Review,
}

interface FormData {
  // Step 1: Contractor & Project Details
  companyName: string;
  contractor: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;

  // Step 2: Payment & Currency
  paymentTerms: PaymentTerms;
  currency: Currency;
  totalCost: number;

  // Step 3: Risk Management
  riskSection: IFrontendRisk[]; // Changed from single risk fields to an array

  // Step 4: Attachments & Deliverables
  deliverables: string;
  attachments: FileList | null;

  // Status
  status: 'Draft' | 'Pending' | 'Active' | 'Completed' | 'Terminated' | 'Accepted';
}

const ContractEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch contract details
  const { data: contract, isLoading, error } = useFetchContractByIdQuery(id!);
  const { data: contractors, isLoading: isLoadingContractors, error: contractorsError } = useFetchContractorsQuery({ skip: 0, limit: 100 });
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation();
  const { showToast } = useToast();

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      riskSection: [], // Initialize as empty array
    },
  });

  // Local state for multi-step form
  const [currentStep, setCurrentStep] = useState<FormSteps>(FormSteps.ContractorDetails);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [attachmentsPreview, setAttachmentsPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contractor: '',
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    paymentTerms: PaymentTerms.Hourly,
    currency: Currency.USD,
    totalCost: 0,
    riskSection: [],
    deliverables: '',
    attachments: null,
    status: 'Draft',
  });

  // Populate form with existing contract data
  useEffect(() => {
    if (contract) {
      console.log('Contract Data:', contract); // Debugging
      setFormData({
        companyName: contract.companyName || '',
        contractor: contract.contractor?._id || '',
        projectName: contract.projectName || '',
        description: contract.description || '',
        startDate: contract.startDate ? contract.startDate.slice(0, 10) : '',
        endDate: contract.endDate ? contract.endDate.slice(0, 10) : '',
        paymentTerms: contract.paymentTerms || PaymentTerms.Hourly,
        currency: contract.currency || Currency.USD,
        totalCost: contract.totalCost || 0,
        riskSection: contract.riskSection && contract.riskSection.length
          ? contract.riskSection.map((risk) => ({
              _id: uuidv4(), // Assign unique ID for frontend handling
              riskName: risk.riskName || '',
              description: risk.description || '',
              severity: risk.severity || 'Low',
              probability: risk.probability || 0.1,
              impact: risk.impact || 'Low',
              mitigationStrategy: risk.mitigationStrategy || '',
            }))
          : [],
        deliverables: contract.deliverables?.join(', ') || '',
        attachments: null, // Handle existing attachments separately if needed
        status: contract.status as
          | 'Draft'
          | 'Pending'
          | 'Active'
          | 'Completed'
          | 'Terminated'
          | 'Accepted',
      });

      // If there are existing attachments, you might want to handle them here
      // For simplicity, we're not handling existing attachments in this example
    }
  }, [contract]);

  // Handle file attachments preview
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.attachments && value.attachments.length > 0) {
        const filesArray = Array.from(value.attachments);
        const previews = filesArray.map((file) => URL.createObjectURL(file));
        setAttachmentsPreview(previews);
      } else {
        setAttachmentsPreview([]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Functions to add, remove, and handle risk changes
  const addRisk = () => {
    setFormData((prev) => ({
      ...prev,
      riskSection: [
        ...prev.riskSection,
        {
          _id: uuidv4(),
          riskName: '',
          description: '',
          severity: 'Low',
          probability: 0.1,
          impact: 'Low',
          mitigationStrategy: '',
        },
      ],
    }));
  };

  const removeRisk = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      riskSection: prev.riskSection.filter((_, i) => i !== index),
    }));
    // Remove associated errors if any
    const updatedErrors = { ...formErrors };
    Object.keys(formErrors).forEach((key) => {
      if (key.startsWith(`risk_${index}_`)) {
        delete updatedErrors[key];
      }
    });
    setFormErrors(updatedErrors);
  };

  const handleRiskChange = (
    index: number,
    field: keyof IRisk,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      riskSection: prev.riskSection.map((risk, i) =>
        i === index ? { ...risk, [field]: value } : risk
      ),
    }));
    // Clear errors for the specific field
    setFormErrors((prev) => ({
      ...prev,
      [`risk_${index}_${field}`]: '',
    }));
  };

  // Validation functions for each step
  const validateStep = (step: FormSteps): boolean => {
    const errors: { [key: string]: string } = {};

    switch (step) {
      case FormSteps.ContractorDetails:
        if (!formData.companyName) errors.companyName = 'Company name is required.';
        if (!formData.contractor) errors.contractor = 'Contractor is required.';
        if (!formData.projectName) errors.projectName = 'Project name is required.';
        if (!formData.description) errors.description = 'Description is required.';
        if (!formData.startDate) errors.startDate = 'Start date is required.';
        if (!formData.endDate) errors.endDate = 'End date is required.';
        // Additional date validations can be added here
        break;

      case FormSteps.PaymentDetails:
        if (!formData.paymentTerms) errors.paymentTerms = 'Payment terms are required.';
        if (formData.totalCost === undefined || formData.totalCost < 0)
          errors.totalCost = 'Total cost must be a positive number.';
        if (!formData.currency) errors.currency = 'Currency is required.';
        break;

      case FormSteps.RiskManagement:
        formData.riskSection.forEach((risk, index) => {
          if (!risk.riskName) {
            errors[`risk_${index}_riskName`] = 'Risk name is required.';
          }
          if (
            risk.probability === undefined ||
            isNaN(Number(risk.probability)) ||
            Number(risk.probability) < 0 ||
            Number(risk.probability) > 1
          ) {
            errors[`risk_${index}_probability`] =
              'Probability must be a number between 0 and 1.';
          }
          if (!risk.severity) {
            errors[`risk_${index}_severity`] = 'Risk severity is required.';
          }
          if (!risk.impact) {
            errors[`risk_${index}_impact`] = 'Risk impact is required.';
          }
          if (!risk.description) {
            errors[`risk_${index}_description`] = 'Risk description is required.';
          }
          if (!risk.mitigationStrategy) {
            errors[`risk_${index}_mitigationStrategy`] = 'Mitigation strategy is required.';
          }
        });
        break;

      case FormSteps.Attachments:
        // Optional step; no required fields
        break;

      case FormSteps.Review:
        // No validation needed
        break;

      default:
        break;
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast('Please fix the errors before proceeding.');
    }
    return Object.keys(errors).length === 0;
  };

  // Navigation Handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setFormErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Prepare Risk Section
      const riskSection: IRisk[] = formData.riskSection.map((risk) => ({
        riskName: risk.riskName,
        description: risk.description,
        severity: risk.severity || 'Low',
        probability: risk.probability || 0.1,
        impact: risk.impact || 'Low',
        mitigationStrategy: risk.mitigationStrategy,
      }));

      // Handle Attachments
      const attachmentUrls = data.attachments?.length
        ? await uploadMultipleImages(Array.from(data.attachments))
        : contract?.attachments || []; // Retain existing attachments if no new ones uploaded

      // Prepare Update Data
      const updatedData: UpdateContractRequest = {
        companyName: data.companyName,
        contractor: data.contractor,
        projectName: data.projectName,
        description: data.description,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        paymentTerms: data.paymentTerms,
        currency: data.currency,
        totalCost: data.totalCost,
        deliverables: data.deliverables?.split(',').map((item) => item.trim()) || [],
        attachments: attachmentUrls,
        status: data.status,
        riskSection, // Updated to include multiple risks
      };

      // Call API to update contract
      await updateContract({ id: id!, updates: updatedData }).unwrap();
      console.log('Contract updated successfully:', updatedData);
      showToast('Contract updated successfully!', 'success');
      navigate(`/admin/contracts/${id}`);
    } catch (err: any) {
      console.error('Failed to update contract:', err);
      showToast('Error updating contract. Please try again.', 'error');
    }
  };

  // Render Form Steps
  const renderStep = () => {
    switch (currentStep) {
      case FormSteps.ContractorDetails:
        return (
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('companyName', { required: 'Company name is required.' })}
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className={`mt-1 block w-full p-3 border ${
                  formErrors.companyName ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter company name"
                required
              />
              {formErrors.companyName && (
                <p className="mt-2 text-sm text-red-600">{formErrors.companyName}</p>
              )}
            </div>

            {/* Contractor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contractor<span className="text-red-500">*</span>
              </label>
              <select
                {...register('contractor', { required: 'Contractor is required.' })}
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                className={`mt-1 block w-full p-3 border ${
                  formErrors.contractor ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
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
                <p className="mt-2 text-sm text-red-600">{formErrors.contractor}</p>
              )}
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('projectName', { required: 'Project name is required.' })}
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className={`mt-1 block w-full p-3 border ${
                  formErrors.projectName ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter project name"
                required
              />
              {formErrors.projectName && (
                <p className="mt-2 text-sm text-red-600">{formErrors.projectName}</p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description<span className="text-red-500">*</span>
              </label>
              <WYSIWYGEditor
                value={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
              />
              {formErrors.description && (
                <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('startDate', { required: 'Start date is required.' })}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`mt-1 block w-full p-3 border ${
                  formErrors.startDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {formErrors.startDate && (
                <p className="mt-2 text-sm text-red-600">{formErrors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('endDate', { required: 'End date is required.' })}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`mt-1 block w-full p-3 border ${
                  formErrors.endDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {formErrors.endDate && (
                <p className="mt-2 text-sm text-red-600">{formErrors.endDate}</p>
              )}
            </div>
          </div>
        );

      case FormSteps.PaymentDetails:
        return (
          <div className="space-y-6">
            {/* Payment Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Terms<span className="text-red-500">*</span>
              </label>
              <select
                {...register('paymentTerms', { required: 'Payment terms are required.' })}
                value={formData.paymentTerms}
                onChange={(e) =>
                  setFormData({ ...formData, paymentTerms: e.target.value as PaymentTerms })
                }
                className={`mt-1 block w-full p-3 border ${
                  formErrors.paymentTerms ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="">Select Payment Term</option>
                {PaymentTermsOptions.map((term) => (
                  <option key={term.value} value={term.value}>
                    {term.label}
                  </option>
                ))}
              </select>
              {formErrors.paymentTerms && (
                <p className="mt-2 text-sm text-red-600">{formErrors.paymentTerms}</p>
              )}
            </div>

            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency<span className="text-red-500">*</span>
              </label>
              <select
                {...register('currency', { required: 'Currency is required.' })}
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value as Currency })
                }
                className={`mt-1 block w-full p-3 border ${
                  formErrors.currency ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="">Select Currency</option>
                {CurrencyOptions.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
              {formErrors.currency && (
                <p className="mt-2 text-sm text-red-600">{formErrors.currency}</p>
              )}
            </div>

            {/* Total Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Cost<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('totalCost', {
                    required: 'Total cost is required.',
                    min: { value: 0, message: 'Total cost cannot be negative.' },
                  })}
                  value={formData.totalCost}
                  onChange={(e) =>
                    setFormData({ ...formData, totalCost: parseFloat(e.target.value) })
                  }
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    formErrors.totalCost ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                  placeholder="0.00"
                  required
                />
              </div>
              {formErrors.totalCost && (
                <p className="mt-2 text-sm text-red-600">{formErrors.totalCost}</p>
              )}
            </div>
          </div>
        );

      case FormSteps.RiskManagement:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700">Risk Management</h2>
            {formData.riskSection.map((risk, index) => (
              <div key={risk._id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Risk {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeRisk(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                {/* Risk Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Risk Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={risk.riskName}
                    onChange={(e) => handleRiskChange(index, 'riskName', e.target.value)}
                    className={`mt-1 block w-full p-3 border ${
                      formErrors[`risk_${index}_riskName`] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter risk name"
                    required
                  />
                  {formErrors[`risk_${index}_riskName`] && (
                    <p className="mt-2 text-sm text-red-600">{formErrors[`risk_${index}_riskName`]}</p>
                  )}
                </div>

                {/* Severity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Severity<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={risk.severity}
                    onChange={(e) => handleRiskChange(index, 'severity', e.target.value)}
                    className={`mt-1 block w-full p-3 border ${
                      formErrors[`risk_${index}_severity`] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {formErrors[`risk_${index}_severity`] && (
                    <p className="mt-2 text-sm text-red-600">{formErrors[`risk_${index}_severity`]}</p>
                  )}
                </div>

                {/* Probability */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Probability (0 to 1)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={risk.probability}
                    onChange={(e) => handleRiskChange(index, 'probability', parseFloat(e.target.value))}
                    className={`mt-1 block w-full p-3 border ${
                      formErrors[`risk_${index}_probability`] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="e.g., 0.25"
                    min="0"
                    max="1"
                    required
                  />
                  {formErrors[`risk_${index}_probability`] && (
                    <p className="mt-2 text-sm text-red-600">{formErrors[`risk_${index}_probability`]}</p>
                  )}
                </div>

                {/* Impact */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Impact<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={risk.impact}
                    onChange={(e) => handleRiskChange(index, 'impact', e.target.value)}
                    className={`mt-1 block w-full p-3 border ${
                      formErrors[`risk_${index}_impact`] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {formErrors[`risk_${index}_impact`] && (
                    <p className="mt-2 text-sm text-red-600">{formErrors[`risk_${index}_impact`]}</p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <WYSIWYGEditor
                    value={risk.description}
                    onChange={(content) => handleRiskChange(index, 'description', content)}
                  />
                  {formErrors[`risk_${index}_description`] && (
                    <p className="mt-2 text-sm text-red-600">{formErrors[`risk_${index}_description`]}</p>
                  )}
                </div>

                {/* Mitigation Strategy */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Mitigation Strategy<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={risk.mitigationStrategy}
                    onChange={(e) => handleRiskChange(index, 'mitigationStrategy', e.target.value)}
                    className={`mt-1 block w-full p-3 border ${
                      formErrors[`risk_${index}_mitigationStrategy`] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    rows={3}
                    placeholder="Describe how to mitigate the risk"
                    required
                  ></textarea>
                  {formErrors[`risk_${index}_mitigationStrategy`] && (
                    <p className="mt-2 text-sm text-red-600">
                      {formErrors[`risk_${index}_mitigationStrategy`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRisk}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Add Another Risk
            </button>
          </div>
        );

      case FormSteps.Attachments:
        return (
          <div className="space-y-6">
            {/* Deliverables */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deliverables
              </label>
              <input
                type="text"
                {...register('deliverables')}
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                className={`mt-1 block w-full p-3 border ${
                  formErrors.deliverables ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="e.g., Design Mockups, Final Code"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate items with commas.
              </p>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
                    {...register('attachments')}
                    id="attachments"
                    multiple
                    className="hidden"
                    accept="image/*,application/pdf" // Adjust as needed
                  />
                </label>
                {attachmentsPreview.length > 0 && (
                  <div className="ml-4 flex flex-wrap gap-2">
                    {attachmentsPreview.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Attachment ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
              </div>
              {formErrors.attachments && (
                <p className="mt-2 text-sm text-red-600">{formErrors.attachments}</p>
              )}
            </div>
          </div>
        );

      case FormSteps.Review:
        // Prepare data for review
        const deliverables = formData.deliverables
          ? formData.deliverables.split(',').map((item) => item.trim())
          : [];
        const attachments = attachmentsPreview;

        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700">Review Your Details</h2>
            {/* Contractor & Project Details */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium">Contractor & Project Details</h3>
              <p><strong>Company Name:</strong> {formData.companyName}</p>
              <p>
                <strong>Contractor:</strong>{' '}
                {contractors?.find((c) => c._id === formData.contractor)?.name} (
                {contractors?.find((c) => c._id === formData.contractor)?.email})
              </p>
              <p><strong>Project Name:</strong> {formData.projectName}</p>
              <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: formData.description }} /></p>
              <p><strong>Start Date:</strong> {new Date(formData.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(formData.endDate).toLocaleDateString()}</p>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium">Payment Details</h3>
              <p><strong>Payment Terms:</strong> {PaymentTermsOptions.find(pt => pt.value === formData.paymentTerms)?.label || formData.paymentTerms}</p>
              <p><strong>Currency:</strong> {CurrencyOptions.find(c => c.value === formData.currency)?.label || formData.currency}</p>
              <p><strong>Total Cost:</strong> {formData.totalCost} {formData.currency}</p>
              <p><strong>Status:</strong> {formData.status}</p>
            </div>

            {/* Risk Management */}
            {formData.riskSection.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium">Risk Management</h3>
                {formData.riskSection.map((risk, index) => (
                  <div key={risk._id} className="mb-4 p-2 bg-gray-100 dark:bg-gray-600 rounded">
                    <p><strong>Risk {index + 1}:</strong> {risk.riskName}</p>
                    <p><strong>Severity:</strong> {risk.severity}</p>
                    <p><strong>Probability:</strong> {risk.probability}</p>
                    <p><strong>Impact:</strong> {risk.impact}</p>
                    <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: risk.description || 'N/A' }} /></p>
                    <p><strong>Mitigation Strategy:</strong> {risk.mitigationStrategy || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Deliverables */}
            {deliverables.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium">Deliverables</h3>
                <ul className="list-disc pl-5">
                  {deliverables.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium">Attachments</h3>
                <ul className="list-disc pl-5">
                  {attachments.map((src, idx) => (
                    <li key={idx}>
                      <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Attachment {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Handle form submission with react-hook-form
  const onSubmitForm = handleSubmit(onSubmit);

  // Handle form step validation before proceeding
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setFormErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  // Display loading state
  if (isLoading || isLoadingContractors) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-gray-400"
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
          <span className="ml-3 text-gray-500 text-lg">Loading Contract...</span>
        </div>
      </div>
    );
  }

  // Display error state
  if (error || contractorsError || !contract) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-red-500 text-xl">Error loading contract.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen font-secondary dark:bg-gray-800">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Edit Contract
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Update the contract details below.
          </p>
        </div>
        <form
          onSubmit={onSubmitForm}
          className="mt-8 space-y-6 bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md"
        >
          {/* Submission Status */}
          {Object.keys(formErrors).length > 0 && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              <FaTimesCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
              <span className="font-medium">Please fix the errors before proceeding.</span>
            </div>
          )}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > FormSteps.ContractorDetails && (
              <Button
                type="button"
                variant="secondary"
                onClick={handlePreviousStep}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Back
              </Button>
            )}
            {currentStep < FormSteps.Review && (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Next
              </Button>
            )}
            {currentStep === FormSteps.Review && (
              <Button
                type="submit"
                variant="primary"
                disabled={isUpdating}
                isLoading={isUpdating}
                className="bg-gradient-to-t from-teal-600 via-cyan-900 to-gray-900 hover:from-teal-700 hover:via-cyan-800 hover:to-gray-800"
              >
                {isUpdating ? 'Updating...' : 'Update Contract'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractEdit;
