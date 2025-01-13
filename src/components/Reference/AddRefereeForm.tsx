// src/components/AddRefereeForm.tsx

import React, { useState } from 'react';
import { useAddRefereeMutation } from '../../api/referenceApi';
import { IReferee } from '../../types/referee';
import { useToast } from '../../features/Toast/ToastContext';
import { useNavigate } from 'react-router-dom';
import {
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineCamera,
} from 'react-icons/ai';
import {
  MdBusiness,
  MdDateRange,
  MdLocationOn,
  MdWork,
} from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SignatureModal from '../../utils/SignaturePad'; // Ensure correct import path

const AddRefereeForm: React.FC = () => {
  const [addReferee, { isLoading }] = useAddRefereeMutation();
  const navigate = useNavigate();

  // Toast Context
  const { showToast } = useToast();

  // Local State for Form Data
  const [formData, setFormData] = useState<Partial<IReferee>>({
    name: '',
    email: '',
    companyName: '',
    relationship: '',
    startDate: '',
    endDate: '',
    reasonForLeaving: '',
    address: '',
    positionHeld: '',
    userPositionHeld: '',
    userSignature: '', // NOTE: Renamed from "signature"
  });

  // Local State for Form Errors
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof IReferee, string>>>({});

  // Signature Modal State
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState<boolean>(false);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset error on change
    setFormErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  // Handle Date Change
  const handleDateChange = (field: keyof IReferee) => (date: Date | null) => {
    if (date) {
      const isoDate = date.toISOString();
      setFormData((prev) => ({
        ...prev,
        [field]: isoDate,
      }));
      setFormErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle Go Back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle Save Signature from Modal
  const handleSaveSignature = (signature: string) => {
    // Store the signature as userSignature
    setFormData((prev) => ({
      ...prev,
      userSignature: signature,
    }));
    setFormErrors((prev) => ({
      ...prev,
      userSignature: '',
    }));
  };

  // Validate Form Data
  const validate = (): boolean => {
    const errors: Partial<Record<keyof IReferee, string>> = {};

    if (!formData.name) {
      errors.name = 'Name is required.';
    }
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address.';
    }
    if (!formData.companyName) {
      errors.companyName = 'Company Name is required.';
    }
    if (!formData.relationship) {
      errors.relationship = 'Relationship is required.';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start Date is required.';
    }
    if (!formData.endDate) {
      errors.endDate = 'End Date is required.';
    }
    if (!formData.reasonForLeaving) {
      errors.reasonForLeaving = 'Reason for Leaving is required.';
    }
    if (!formData.address) {
      errors.address = 'Address is required.';
    }
    if (!formData.positionHeld) {
      errors.positionHeld = 'Position Held (Referee’s role) is required.';
    }
    if (!formData.userPositionHeld) {
      errors.userPositionHeld = 'Your (User’s) Position is required.';
    }
    if (!formData.userSignature) {
      errors.userSignature = 'Signature is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      // Cast formData to IReferee so it matches the type
      await addReferee(formData as IReferee).unwrap();
      showToast('Referee added successfully!', 'success');
      navigate('/dashboard/references');
    } catch (err: any) {
      showToast(err?.data?.message || 'Failed to add referee.', 'error');
      console.error('Failed to add referee:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex p-4">
      <div className="w-full bg-white rounded-lg shadow-lg p-8">
        {/* Go Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-4 text-blue-600 hover:underline flex items-center"
        >
          &larr; Go Back
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add New Referee
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUser className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`pl-10 pr-3 py-2 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm`}
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`pl-10 pr-3 py-2 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="relative">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdBusiness className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  className={`pl-10 pr-3 py-2 border ${
                    formErrors.companyName ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm`}
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.companyName}
                </p>
              )}
            </div>

            {/* Relationship */}
            <div className="relative">
              <label
                htmlFor="relationship"
                className="block text-sm font-medium text-gray-700"
              >
                Relationship<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdWork className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="relationship"
                  id="relationship"
                  className={`pl-10 pr-3 py-2 border ${
                    formErrors.relationship ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm`}
                  placeholder="e.g., Manager, Team Lead"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.relationship && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.relationship}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="relative">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <DatePicker
                  selected={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={handleDateChange('startDate')}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Start Date"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formErrors.startDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdDateRange className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="relative">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <DatePicker
                  selected={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={handleDateChange('endDate')}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select End Date"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formErrors.endDate ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdDateRange className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
              )}
            </div>

            {/* Reason for Leaving */}
            <div className="relative">
              <label
                htmlFor="reasonForLeaving"
                className="block text-sm font-medium text-gray-700"
              >
                Reason for Leaving<span className="text-red-500">*</span>
              </label>
              <textarea
                id="reasonForLeaving"
                name="reasonForLeaving"
                rows={3}
                className={`pl-2 pr-2 py-2 border w-full rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.reasonForLeaving ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Short explanation"
                value={formData.reasonForLeaving}
                onChange={handleChange}
              />
              {formErrors.reasonForLeaving && (
                <p className="mt-1 text-sm text-red-600">{formErrors.reasonForLeaving}</p>
              )}
            </div>

            {/* User's (Applicant's) Position */}
            <div className="relative">
              <label
                htmlFor="userPositionHeld"
                className="block text-sm font-medium text-gray-700"
              >
                Your Position<span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="userPositionHeld"
                  id="userPositionHeld"
                  className={`pl-2 pr-2 py-2 border w-full rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.userPositionHeld ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your role at the time"
                  value={formData.userPositionHeld}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.userPositionHeld && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.userPositionHeld}
                </p>
              )}
            </div>

            {/* User Signature */}
            <div className="relative">
              <label
                htmlFor="userSignature"
                className="block text-sm font-medium text-gray-700"
              >
                Your Signature<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <AiOutlineCamera className="mr-2" />
                  Adopt Signature
                </button>
                {formData.userSignature && (
                  <div className="flex items-center space-x-2">
                    {/* If userSignature is an image or typed text */}
                    {formData.userSignature.startsWith('data:image') ? (
                      <img
                        src={formData.userSignature}
                        alt="Signature Preview"
                        className="h-12 w-40 object-contain border border-gray-300 p-2 rounded-md"
                      />
                    ) : (
                      <span
                        className="text-lg font-medium text-gray-700 font-signature"
                        style={{ fontFamily: '"Dancing Script", cursive' }}
                      >
                        {formData.userSignature}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {formErrors.userSignature && (
                <p className="mt-1 text-sm text-red-600">{formErrors.userSignature}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2 relative">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address<span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute top-0 left-0 mt-3 ml-3 flex items-center pointer-events-none">
                  <MdLocationOn className="h-5 w-5 text-gray-400" />
                </span>
                <textarea
                  name="address"
                  id="address"
                  rows={3}
                  className={`pl-10 pr-3 py-2 border ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm`}
                  placeholder="Referee's Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.address && (
                <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
              )}
            </div>

            {/* Position Held (Referee's Position) */}
            <div className="relative md:col-span-2">
              <label
                htmlFor="positionHeld"
                className="block text-sm font-medium text-gray-700"
              >
                Position Held (Referee’s Role)
                <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdWork className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  name="positionHeld"
                  id="positionHeld"
                  className={`pl-10 pr-3 py-2 border ${
                    formErrors.positionHeld ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm`}
                  placeholder="Referee's Position Held"
                  value={formData.positionHeld}
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.positionHeld && (
                <p className="mt-1 text-sm text-red-600">{formErrors.positionHeld}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-3"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {isLoading ? 'Adding...' : 'Add Referee'}
            </button>
          </div>
        </form>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  );
};

export default AddRefereeForm;
