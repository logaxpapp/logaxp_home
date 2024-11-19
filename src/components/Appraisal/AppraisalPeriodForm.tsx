// src/components/AppraisalPeriodForm.tsx

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IAppraisalPeriod } from '../../types/AppraisalPeriod';
import {
 
  useCreateAppraisalPeriodMutation,
  useUpdateAppraisalPeriodMutation,
} from '../../api/apiSlice';
import Button from '../../components/common/Button';

interface AppraisalPeriodFormProps {
  initialData?: IAppraisalPeriod;
  onSuccess: () => void;
}

const AppraisalPeriodForm: React.FC<AppraisalPeriodFormProps> = ({ initialData, onSuccess }) => {
  const [createAppraisalPeriod] = useCreateAppraisalPeriodMutation();
  const [updateAppraisalPeriod] = useUpdateAppraisalPeriodMutation();

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      startDate: initialData?.startDate.slice(0, 10) || '', // Format for input[type="date"]
      endDate: initialData?.endDate.slice(0, 10) || '',
      submissionDeadline: initialData?.submissionDeadline.slice(0, 10) || '',
      reviewDeadline: initialData?.reviewDeadline.slice(0, 10) || '',
      isActive: initialData?.isActive || false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      startDate: Yup.date().required('Start Date is required'),
      endDate: Yup.date()
        .required('End Date is required')
        .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
      submissionDeadline: Yup.date()
        .required('Submission Deadline is required')
        .min(Yup.ref('startDate'), 'Submission Deadline must be after Start Date'),
      reviewDeadline: Yup.date()
        .required('Review Deadline is required')
        .min(Yup.ref('submissionDeadline'), 'Review Deadline must be after Submission Deadline'),
      isActive: Yup.boolean(),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        if (initialData) {
          // Update existing appraisal period
          await updateAppraisalPeriod({ id: initialData._id, data: values }).unwrap();
        } else {
          // Create new appraisal period
          await createAppraisalPeriod(values).unwrap();
        }
        setSubmitting(false);
        onSuccess();
      } catch (error: any) {
        setSubmitting(false);
        if (error.data && error.data.error) {
          setErrors({ name: error.data.error });
        } else {
          setErrors({ name: 'An unexpected error occurred' });
        }
      }
    },
  });

  return (
    <div className="max-w-md mx-auto bg-blue-50 p-4 shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 font-primary">{initialData ? 'Update' : 'Create'} Appraisal Period</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Q1 2024"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
          ) : null}
        </div>

        {/* Start Date Field */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700">
            Start Date<span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startDate}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.startDate && formik.errors.startDate ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.startDate && formik.errors.startDate ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.startDate}</div>
          ) : null}
        </div>

        {/* End Date Field */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700">
            End Date<span className="text-red-500">*</span>
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endDate}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.endDate && formik.errors.endDate ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.endDate && formik.errors.endDate ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.endDate}</div>
          ) : null}
        </div>

        {/* Submission Deadline Field */}
        <div className="mb-4">
          <label htmlFor="submissionDeadline" className="block text-gray-700">
            Submission Deadline<span className="text-red-500">*</span>
          </label>
          <input
            id="submissionDeadline"
            name="submissionDeadline"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.submissionDeadline}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.submissionDeadline && formik.errors.submissionDeadline
                ? 'border-red-500'
                : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.submissionDeadline && formik.errors.submissionDeadline ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.submissionDeadline}</div>
          ) : null}
        </div>

        {/* Review Deadline Field */}
        <div className="mb-4">
          <label htmlFor="reviewDeadline" className="block text-gray-700">
            Review Deadline<span className="text-red-500">*</span>
          </label>
          <input
            id="reviewDeadline"
            name="reviewDeadline"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.reviewDeadline}
            className={`mt-1 block w-full p-2 border ${
              formik.touched.reviewDeadline && formik.errors.reviewDeadline ? 'border-red-500' : 'border-gray-300'
            } rounded-md`}
          />
          {formik.touched.reviewDeadline && formik.errors.reviewDeadline ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.reviewDeadline}</div>
          ) : null}
        </div>

        {/* Active Status Toggle */}
        <div className="mb-4 flex items-center">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            onChange={formik.handleChange}
            checked={formik.values.isActive}
            className="h-4 w-4 text-lemonGreen-dark focus:ring-lemonGreen-light border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-gray-700">
            Active Period
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            variant="primary"
            className="w-full"
          >
            {formik.isSubmitting ? 'Submitting...' : initialData ? 'Update Period' : 'Create Period'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppraisalPeriodForm;