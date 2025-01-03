// src/components/Admin/Contracts/ContractCreate.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useFetchContractorsQuery,
  useCreateContractMutation,
} from '../../../api/contractApi';
import WYSIWYGEditor from '../../common/Input/WYSIWYGEditor';
import {
  useGetExchangeRatesQuery,
  useConvertCurrencyMutation,
} from '../../../api/currencyApi';
import Button from '../../common/Button';
import {
  CreateContractRequest,
  PaymentTerms,
  PaymentTermsOptions,
  IContractor,
  Currency,
  CurrencyOptions,
  IRisk,
} from '../../../types/contractTypes';
import {
  FaProjectDiagram,
  FaTimesCircle,
  FaCheckCircle,
  FaDollarSign,
  FaUpload,
} from 'react-icons/fa';
import { uploadMultipleImages } from '../../../services/cloudinaryService';
import { useToast } from '../../../features/Toast/ToastContext';
import { useCurrency } from '../../../context/CurrencyContext';

enum FormSteps {
  ContractorDetails = 1,
  PaymentDetails,
  RiskManagement,
  Attachments,
  Review,
}

const ContractCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: contractors, isLoading: isLoadingContractors, error: contractorsError } =
    useFetchContractorsQuery({ skip: 0, limit: 100 });
  const [createContract, { isLoading: isCreating }] = useCreateContractMutation();
  const { currency: selectedCurrency } = useCurrency();
  const { data: exchangeRates } = useGetExchangeRatesQuery(selectedCurrency);
  const [convertCurrency] = useConvertCurrencyMutation();
  const { showToast } = useToast();

  // Initialize form data state with riskSection as an array
  const [formData, setFormData] = useState({
    // Step 1: Contractor & Project Details
    companyName: '',
    contractor: '',
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',

    // Step 2: Payment & Currency
    paymentTerms: PaymentTerms.Hourly,
    totalCost: '',
    currency: Currency.USD,

    // Step 3: Risk Management
    riskSection: [] as IRisk[],

    // Step 4: Attachments & Deliverables
    deliverables: '',
    attachments: [] as File[],
    status: 'Draft' as 'Draft' | 'Pending' | 'Active' | 'Completed' | 'Terminated' | 'Accepted',
  });

  // Initialize form errors state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize submission status state
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  // Current Step State
  const [currentStep, setCurrentStep] = useState<FormSteps>(
    FormSteps.ContractorDetails
  );

  // Handle general form changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { name: string; value: string } // For WYSIWYGEditor
  ) => {
    if ('target' in e) {
      const { name, value, files } = e.target as HTMLInputElement;

      console.log(`Input changed: ${name} = ${value}`); // Debugging statement

      if (name === 'attachments' && files) {
        const fileNames = Array.from(files).map((file) => file.name);
        console.log('Attachments selected:', fileNames); // Debugging statement
        setFormData((prev) => ({ ...prev, attachments: Array.from(files) }));
        setFormErrors((prev) => ({ ...prev, attachments: '' }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      // Handle custom editor input
      const { name, value } = e;
      console.log(`Custom input changed: ${name} = ${value}`); // Debugging statement
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Functions to add, remove, and handle risk changes
  const addRisk = () => {
    setFormData((prev) => ({
      ...prev,
      riskSection: [
        ...prev.riskSection,
        {
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
    // Remove associated errors
    const updatedErrors = { ...formErrors };
    Object.keys(formErrors).forEach((key) => {
      if (key.startsWith(`riskName_${index}`) ||
          key.startsWith(`riskProbability_${index}`) ||
          key.startsWith(`riskSeverity_${index}`) ||
          key.startsWith(`riskImpact_${index}`) ||
          key.startsWith(`riskMitigation_${index}`) ||
          key.startsWith(`riskDescription_${index}`)) {
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
      [`${field}_${index}`]: '',
    }));
  };

  // Validation functions for each step
  const validateStep = (step: FormSteps): boolean => {
    const errors: { [key: string]: string } = {};

    switch (step) {
      case FormSteps.ContractorDetails:
        if (!formData.companyName)
          errors.companyName = 'Company name is required.';
        if (!formData.contractor)
          errors.contractor = 'Contractor is required.';
        if (!formData.projectName)
          errors.projectName = 'Project name is required.';
        if (!formData.description)
          errors.description = 'Description is required.';
        if (!formData.startDate)
          errors.startDate = 'Start date is required.';
        if (!formData.endDate) errors.endDate = 'End date is required.';
        // Additional date validations can be added
        break;

      case FormSteps.PaymentDetails:
        if (!formData.paymentTerms)
          errors.paymentTerms = 'Payment terms are required.';
        if (!formData.totalCost || isNaN(Number(formData.totalCost)))
          errors.totalCost = 'Valid total cost is required.';
        if (!formData.currency)
          errors.currency = 'Currency is required.';
        break;

      case FormSteps.RiskManagement:
        formData.riskSection.forEach((risk, index) => {
          if (!risk.riskName) {
            errors[`riskName_${index}`] = 'Risk name is required.';
          }
          if (
            risk.probability === undefined ||
            isNaN(Number(risk.probability)) ||
            Number(risk.probability) < 0 ||
            Number(risk.probability) > 1
          ) {
            errors[`riskProbability_${index}`] =
              'Probability must be a number between 0 and 1.';
          }
          // Additional validations for severity and impact if needed
          if (!risk.severity) {
            errors[`riskSeverity_${index}`] = 'Risk severity is required.';
          }
          if (!risk.impact) {
            errors[`riskImpact_${index}`] = 'Risk impact is required.';
          }
          // Mitigation Strategy is optional, but you can enforce if desired
        });
        break;

      case FormSteps.Attachments:
        // Optional step, no required fields
        break;

      case FormSteps.Review:
        // No validation needed, all previous steps have been validated
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

  // Handle Next Step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      showToast('Please fix the errors before proceeding.');
    }
  };

  // Handle Previous Step
  const handleBack = () => {
    setFormErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all steps before submission
    let isValid = true;
    for (let step = FormSteps.ContractorDetails; step <= FormSteps.Attachments; step++) {
      if (!validateStep(step)) {
        isValid = false;
        setCurrentStep(step);
        break;
      }
    }

    if (!isValid) {
      showToast('Please fix the errors before proceeding.');
      return;
    }

    try {
      let attachmentUrls: string[] = [];

      // If attachments are provided, upload them first
      if (formData.attachments.length > 0) {
        console.log('Uploading attachments:', formData.attachments); // Debugging statement
        attachmentUrls = await uploadMultipleImages(formData.attachments);
        console.log('Attachments uploaded:', attachmentUrls); // Debugging statement
      }

      // Prepare contract data
      const contractData: CreateContractRequest = {
        deliverables: formData.deliverables
          ? formData.deliverables.split(',').map((item) => item.trim())
          : [],
        attachments: attachmentUrls,
        companyName: formData.companyName,
        totalCost: Number(formData.totalCost),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        contractor: formData.contractor,
        projectName: formData.projectName,
        description: formData.description,
        paymentTerms: formData.paymentTerms,
        currency: formData.currency,
        status: formData.status,
        riskSection: formData.riskSection, // Pass the entire array
      };

      // Optionally, convert to base currency if needed
      // For demonstration, assume base currency is USD
      let baseCurrency = 'USD';
      let convertedAmount = contractData.totalCost;

      if (formData.currency !== baseCurrency && exchangeRates) {
        const rate = exchangeRates.rates[baseCurrency];
        if (rate) {
          const response = await convertCurrency({
            amount: contractData.totalCost,
            fromCurrency: formData.currency,
            toCurrency: baseCurrency,
          }).unwrap();
          convertedAmount = response.amount;
        } else {
          throw new Error(`Exchange rate not found for ${baseCurrency}`);
        }
      }

      // Create contract
      await createContract(contractData).unwrap();
      setSubmissionStatus('success');
      showToast('Contract created successfully!');
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard/admin/contracts');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to create contract:', err);
      setSubmissionStatus('error');
      showToast(err.data?.message || 'Error creating contract.');
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
          <p className="mt-4 text-red-500">
            Error loading contractors. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Render functions for each step
  const renderStep = () => {
    switch (currentStep) {
      case FormSteps.ContractorDetails:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contractor Selection */}
            <div className="relative">
              <label
                htmlFor="contractor"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.contractor}
                </p>
              )}
            </div>

            {/* Project Name */}
            <div className="relative">
              <label
                htmlFor="projectName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.projectName}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div className="relative md:col-span-2">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`mt-1 block w-full shadow-sm sm:text-sm border ${
                  formErrors.companyName ? 'border-red-500' : 'border-gray-300'
                } rounded-md p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
                placeholder="Enter company name"
                required
              />
              {formErrors.companyName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.companyName}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2 relative">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Description<span className="text-red-500">*</span>
              </label>
              <WYSIWYGEditor
                value={formData.description}
                onChange={(content) => handleChange({ name: 'description', value: content })}
              />

              {formErrors.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="relative">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="relative">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.endDate}
                </p>
              )}
            </div>
          </div>
        );

      case FormSteps.PaymentDetails:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Terms */}
            <div className="relative">
              <label
                htmlFor="paymentTerms"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                {PaymentTermsOptions.map((term) => (
                  <option key={term.value} value={term.value}>
                    {term.label}
                  </option>
                ))}
              </select>
              {formErrors.paymentTerms && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.paymentTerms}
                </p>
              )}
            </div>

            {/* Currency Selection */}
            <div className="relative">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Currency<span className="text-red-500">*</span>
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                  formErrors.currency ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white`}
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.currency}
                </p>
              )}
            </div>

            {/* Total Cost */}
            <div className="relative">
              <label
                htmlFor="totalCost"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.totalCost}
                </p>
              )}
            </div>

            {/* Deliverables */}
            <div className="relative md:col-span-2">
              <label
                htmlFor="deliverables"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separate items with commas.
              </p>
            </div>
          </div>
        );

      case FormSteps.RiskManagement:
        return (
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h2 className="text-md font-semibold mb-2">Risk Section</h2>
            {formData.riskSection.map((risk, index) => (
              <div key={index} className="border p-4 mb-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Risk {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeRisk(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Risk Name */}
                  <div>
                    <label htmlFor={`riskName_${index}`} className="block text-sm font-medium">
                      Risk Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`riskName_${index}`}
                      name={`riskName_${index}`}
                      value={risk.riskName}
                      onChange={(e) => handleRiskChange(index, 'riskName', e.target.value)}
                      className={`mt-1 p-2 border rounded w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                        formErrors[`riskName_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors[`riskName_${index}`] && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formErrors[`riskName_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Severity */}
                  <div>
                    <label htmlFor={`riskSeverity_${index}`} className="block text-sm font-medium">
                      Severity
                    </label>
                    <select
                      id={`riskSeverity_${index}`}
                      name={`riskSeverity_${index}`}
                      value={risk.severity}
                      onChange={(e) => handleRiskChange(index, 'severity', e.target.value)}
                      className={`mt-1 p-2 border rounded w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                        formErrors[`riskSeverity_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {formErrors[`riskSeverity_${index}`] && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formErrors[`riskSeverity_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Probability */}
                  <div>
                    <label htmlFor={`riskProbability_${index}`} className="block text-sm font-medium">
                      Probability (0 to 1)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id={`riskProbability_${index}`}
                      name={`riskProbability_${index}`}
                      value={risk.probability}
                      onChange={(e) => handleRiskChange(index, 'probability', parseFloat(e.target.value))}
                      className={`mt-1 p-2 border rounded w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                        formErrors[`riskProbability_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      min="0"
                      max="1"
                    />
                    {formErrors[`riskProbability_${index}`] && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formErrors[`riskProbability_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Impact */}
                  <div>
                    <label htmlFor={`riskImpact_${index}`} className="block text-sm font-medium">
                      Impact
                    </label>
                    <select
                      id={`riskImpact_${index}`}
                      name={`riskImpact_${index}`}
                      value={risk.impact}
                      onChange={(e) => handleRiskChange(index, 'impact', e.target.value)}
                      className={`mt-1 p-2 border rounded w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                        formErrors[`riskImpact_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {formErrors[`riskImpact_${index}`] && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formErrors[`riskImpact_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label htmlFor={`riskDescription_${index}`} className="block text-sm font-medium">
                      Description
                    </label>
                    <WYSIWYGEditor
                      value={risk.description}
                      onChange={(content) => handleRiskChange(index, 'description', content)}
                    />
                    {formErrors[`riskDescription_${index}`] && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formErrors[`riskDescription_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Mitigation Strategy */}
                  <div className="col-span-2">
                    <label htmlFor={`riskMitigation_${index}`} className="block text-sm font-medium">
                      Mitigation Strategy
                    </label>
                    <textarea
                      id={`riskMitigation_${index}`}
                      name={`riskMitigation_${index}`}
                      rows={2}
                      value={risk.mitigationStrategy}
                      onChange={(e) => handleRiskChange(index, 'mitigationStrategy', e.target.value)}
                      className={`mt-1 p-2 border rounded w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white ${
                        formErrors[`riskMitigation_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors[`riskMitigation_${index}`] && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {formErrors[`riskMitigation_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addRisk}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Another Risk
            </button>
          </div>
        );

      case FormSteps.Attachments:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deliverables */}
            <div className="relative md:col-span-2">
              <label
                htmlFor="deliverables"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Separate items with commas.
              </p>
            </div>

            {/* Attachments */}
            <div className="relative md:col-span-2">
              <label
                htmlFor="attachments"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                      <div
                        key={index}
                        className="flex items-center bg-gray-200 dark:bg-gray-600 rounded px-2 py-1 text-sm"
                      >
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.attachments && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formErrors.attachments}
                </p>
              )}
            </div>
          </div>
        );

      case FormSteps.Review:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contractor */}
              <div>
                <h4 className="font-medium">Contractor</h4>
                <p>
                  {contractors?.find((c) => c._id === formData.contractor)?.name} (
                  {contractors?.find((c) => c._id === formData.contractor)?.email})
                </p>
              </div>

              {/* Project Name */}
              <div>
                <h4 className="font-medium">Project Name</h4>
                <p>{formData.projectName}</p>
              </div>

              {/* Company Name */}
              <div>
                <h4 className="font-medium">Company Name</h4>
                <p>{formData.companyName}</p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <h4 className="font-medium">Description</h4>
                <p dangerouslySetInnerHTML={{ __html: formData.description }} />
              </div>

              {/* Start Date */}
              <div>
                <h4 className="font-medium">Start Date</h4>
                <p>{new Date(formData.startDate).toLocaleDateString()}</p>
              </div>

              {/* End Date */}
              <div>
                <h4 className="font-medium">End Date</h4>
                <p>{new Date(formData.endDate).toLocaleDateString()}</p>
              </div>

              {/* Payment Terms */}
              <div>
                <h4 className="font-medium">Payment Terms</h4>
                <p>
                  {PaymentTermsOptions.find(
                    (term) => term.value === formData.paymentTerms
                  )?.label || formData.paymentTerms}
                </p>
              </div>

              {/* Currency */}
              <div>
                <h4 className="font-medium">Currency</h4>
                <p>
                  {CurrencyOptions.find(
                    (curr) => curr.value === formData.currency
                  )?.label || formData.currency}
                </p>
              </div>

              {/* Total Cost */}
              <div>
                <h4 className="font-medium">Total Cost</h4>
                <p>
                  {formData.totalCost} {formData.currency}
                </p>
              </div>

              {/* Deliverables */}
              <div className="md:col-span-2">
                <h4 className="font-medium">Deliverables</h4>
                <p>
                  {formData.deliverables
                    ? formData.deliverables.split(',').map((item, idx) => (
                        <span key={idx} className="inline-block bg-gray-200 dark:bg-gray-600 rounded px-2 py-1 mr-2 mb-2">
                          {item.trim()}
                        </span>
                      ))
                    : 'None'}
                </p>
              </div>

              {/* Attachments */}
              <div className="md:col-span-2">
                <h4 className="font-medium">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.attachments.length > 0 ? (
                    formData.attachments.map((file, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-200 dark:bg-gray-600 rounded px-2 py-1"
                      >
                        {file.name}
                      </span>
                    ))
                  ) : (
                    <p>No attachments uploaded.</p>
                  )}
                </div>
              </div>

              {/* Risk Section */}
              {formData.riskSection.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="font-medium">Risk Management</h4>
                  {formData.riskSection.map((risk, index) => (
                    <div key={index} className="mb-4 p-2 bg-gray-100 dark:bg-gray-600 rounded">
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
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md"
        >
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
              <span className="font-medium">
                Failed to create contract. Please try again.
              </span>
            </div>
          )}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > FormSteps.ContractorDetails && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Back
              </Button>
            )}
            {currentStep < FormSteps.Review && (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Next
              </Button>
            )}
            {currentStep === FormSteps.Review && (
              <Button
                type="submit"
                variant="primary"
                disabled={isCreating}
                isLoading={isCreating}
                className="bg-gradient-to-t from-teal-600 via-cyan-900 to-gray-900 hover:from-teal-700 hover:via-cyan-800 hover:to-gray-800"
              >
                {isCreating ? 'Creating...' : 'Submit Contract'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractCreate;
