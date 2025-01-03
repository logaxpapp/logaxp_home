// src/components/SubContractor/EditSubContractor.tsx

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdateSubContractorMutation } from '../../api/usersApi';
import { FiCheck, FiX } from 'react-icons/fi';
import { ISubContractor } from '../../types/subContractor';
import { useToast } from '../../features/Toast/ToastContext';

interface EditSubContractorProps {
  subContractor: ISubContractor;
  onClose: () => void;
}

const EditSubContractor: React.FC<EditSubContractorProps> = ({ subContractor, onClose }) => {
  const [updateSubContractor, { isLoading }] = useUpdateSubContractorMutation();
  const { showToast } = useToast();

  const formik = useFormik({
    initialValues: {
      name: subContractor.name || '',
      email: subContractor.email || '',
      job_title: subContractor.job_title || '',
      phone_number: subContractor.phone_number || '',
      // Add other fields you wish to edit
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      job_title: Yup.string().required('Job Title is required'),
      phone_number: Yup.string()
        .matches(
          /^(\+\d{1,3}[- ]?)?\d{10}$/,
          'Phone number is not valid. It should contain 10 digits and can include country code.'
        )
        .required('Phone Number is required'),
      // Add other field validations
    }),
    onSubmit: async (values) => {
      try {
        await updateSubContractor({
          id: subContractor._id,
          updates: values,
        }).unwrap();
        showToast('SubContractor updated successfully!', 'success');
        onClose(); // Close the modal after successful update
      } catch (err: any) {
        console.error('Failed to update SubContractor:', err);
        if (err.data && err.data.message) {
          showToast(err.data.message, 'error');
        } else {
          showToast('Failed to update SubContractor.', 'error');
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`mt-1 block w-full border ${
            formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          aria-invalid={formik.touched.name && formik.errors.name ? 'true' : 'false'}
          aria-describedby="name-error"
        />
        {formik.touched.name && formik.errors.name ? (
          <p className="text-red-500 text-sm mt-1" id="name-error">
            {formik.errors.name}
          </p>
        ) : null}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`mt-1 block w-full border ${
            formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          aria-invalid={formik.touched.email && formik.errors.email ? 'true' : 'false'}
          aria-describedby="email-error"
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="text-red-500 text-sm mt-1" id="email-error">
            {formik.errors.email}
          </p>
        ) : null}
      </div>

      {/* Job Title */}
      <div>
        <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">
          Job Title<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="job_title"
          id="job_title"
          value={formik.values.job_title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          className={`mt-1 block w-full border ${
            formik.touched.job_title && formik.errors.job_title ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          aria-invalid={formik.touched.job_title && formik.errors.job_title ? 'true' : 'false'}
          aria-describedby="job_title-error"
        />
        {formik.touched.job_title && formik.errors.job_title ? (
          <p className="text-red-500 text-sm mt-1" id="job_title-error">
            {formik.errors.job_title}
          </p>
        ) : null}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
          Phone Number<span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone_number"
          id="phone_number"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          placeholder="e.g., +1234567890"
          className={`mt-1 block w-full border ${
            formik.touched.phone_number && formik.errors.phone_number ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          aria-invalid={formik.touched.phone_number && formik.errors.phone_number ? 'true' : 'false'}
          aria-describedby="phone_number-error"
        />
        {formik.touched.phone_number && formik.errors.phone_number ? (
          <p className="text-red-500 text-sm mt-1" id="phone_number-error">
            {formik.errors.phone_number}
          </p>
        ) : null}
      </div>

      {/* Add other necessary fields as per your User model */}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <FiX className="mr-2" /> Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FiCheck className="mr-2" /> {isLoading ? 'Updating...' : 'Update'}
        </button>
      </div>

      {/* Error Handling */}
      <div className="text-red-500">Failed to update SubContractor.</div>
    </form>
  );
};

export default EditSubContractor;
