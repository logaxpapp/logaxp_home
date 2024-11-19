// src/components/CreateApprovalRequest.tsx

import React, { useState } from 'react';
import {  useFetchAppraisalQuestionsQuery } from '../api/appraisalQuestionApi';
import { useFetchAppraisalMetricsQuery } from '../api/appraisalMetricApi';
import { useSubmitApprovalRequestMutation } from '../api/approvalsApi';
import { useFetchAppraisalPeriodsQuery} from '../api/apiSlice';
import { useFetchAllUsersQuery } from '../api/usersApi';
import { FaPlus } from 'react-icons/fa';
import { IAppraisalQuestion } from '../types/appraisalQuestion';
import { IAppraisalMetric } from '../types/AppraisalMetric';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import SingleSelect, { OptionType } from './common/Input/SelectDropdown/SingleSelect';
import { IUser } from '../types/user';
import { ApprovalRequestType, IAppraisalPeriod, IAppraisalResponse, IApprovalRequestSubmit, IRequestData } from '../types/approval';


const CreateApprovalRequest: React.FC = () => {
  const [submitApprovalRequest, { isLoading }] = useSubmitApprovalRequestMutation();
  const { data, isLoading: isFetchingUsers, error } = useFetchAllUsersQuery({ page: 1, limit: 10 });
  const { data: appraisalPeriodsData, isLoading: isFetchingPeriods, error: periodsError } = useFetchAppraisalPeriodsQuery(); // Fetch appraisal periods
  const [appraisalResponses, setAppraisalResponses] = useState<{ [key: string]: string }>({});
  const { data: questionsData, isLoading: loadingQuestions } = useFetchAppraisalQuestionsQuery();
  const { data: metricsData, isLoading: loadingMetrics } = useFetchAppraisalMetricsQuery();
  const [additionalMetrics, setAdditionalMetrics] = useState<{ [metricId: string]: number }>({});

  const navigate = useNavigate();

  // Form state
  const [requestType, setRequestType] = useState<ApprovalRequestType>('Leave');
  const [requestDetails, setRequestDetails] = useState<string>('');
  const [approvers, setApprovers] = useState<string[]>(['']); // Array of approver IDs

  // Type-specific states
  const [leaveType, setLeaveType] = useState<string>('Sick');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [expenseCategory, setExpenseCategory] = useState<string>('Travel');

  const [appraisalPeriod, setAppraisalPeriod] = useState<string>(''); // Now string (ID)
  const [appraisalComments, setAppraisalComments] = useState<string>(''); // Added Appraisal state

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleAddApprover = () => {
    setApprovers([...approvers, '']);
  };

  const handleApproverChange = (index: number, value: string | null) => {
    const newApprovers = [...approvers];
    newApprovers[index] = value || '';
    setApprovers(newApprovers);
  };

  // Map users to dropdown options
  const approverOptions: OptionType[] = data?.users.map((user: IUser) => ({
    value: user._id,
    label: user.name,
  })) || [];

  // Map appraisal periods to dropdown options
  const appraisalPeriodOptions: OptionType[] = appraisalPeriodsData?.data.map((period: IAppraisalPeriod) => ({
    value: period._id,
    label: period.name,
  })) || [];

  type ApprovalRequestPayload = IApprovalRequestSubmit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!requestDetails) {
      setNotification({
        open: true,
        message: 'Request details are required',
        severity: 'error',
      });
      return;
    }

    // Type-specific validation
    if (requestType === 'Leave') {
      if (!startDate || !endDate || !reason) {
        setNotification({
          open: true,
          message: 'All leave fields are required',
          severity: 'error',
        });
        return;
      }
    }

    if (requestType === 'Expense') {
      if (!expenseAmount || !currency || !receipt || !expenseCategory) {
        setNotification({
          open: true,
          message: 'All expense fields are required',
          severity: 'error',
        });
        return;
      }
    }

    if (requestType === 'Appraisal') {
      if (!appraisalPeriod || !appraisalComments) {
        setNotification({
          open: true,
          message: 'All appraisal fields are required',
          severity: 'error',
        });
        return;
      }
    }

    // Prepare request_data based on request_type
    let requestData: IRequestData;

    switch (requestType) {
      case 'Leave':
        requestData = {
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason,
        };
        break;
      case 'Expense':
        // Assuming backend handles file uploads separately
        requestData = {
          amount: expenseAmount,
          currency,
          receipt: receipt ? URL.createObjectURL(receipt) : '',
          expense_category: expenseCategory,
        };
        break;
      case 'Appraisal':
        requestData = {
          period: appraisalPeriod, // Now string (ID)
          comments: appraisalComments,
          additional_metrics: Object.entries(additionalMetrics).map(([metricId, value]) => ({
            metricId,
            value,
          })),
          responses: Object.entries(appraisalResponses).map(([questionId, answer]) => ({
            questionId,
            answer,
            // _id is optional now
          })) as IAppraisalResponse[],
        };
        break;
      case 'Other':
        // Define other-specific fields
        requestData = {
          details: requestDetails,
          // Add other fields here
        };
        break;
      default:
        requestData = {
          details: requestDetails,
        };
        break;
    }

    // Prepare the workflow array using the approvers, creating a step for each approver
    const workflow = approvers.map((approver, index) => ({
      step_name: `Step ${index + 1}`,
      approver,
      status: 'Pending' as const,
    }));

    try {
      const payload: ApprovalRequestPayload = {
        request_type: requestType,
        request_details: requestDetails,
        request_data: requestData,
        workflow,
      };

      await submitApprovalRequest(payload).unwrap(); // Now accepts IApprovalRequestSubmit

      setNotification({
        open: true,
        message: 'Approval request created successfully!',
        severity: 'success',
      });

      navigate(-1);
    } catch (error: any) {
      setNotification({
        open: true,
        message: error?.data?.message || 'Failed to create approval request.',
        severity: 'error',
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceipt(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-blue-50 shadow rounded-lg">
       {/* Header Section */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-md shadow-md">
          <div className="flex items-center space-x-4">
            <FaPlus className="text-blue-600 w-6 h-6 md:w-8 md:h-8" />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 font-primary">Create Approval Request</h2>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium px-4 py-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200"
          >
            Cancel
          </button>
          </div>
       <form 
            onSubmit={handleSubmit} 
            className="p-6 bg-white rounded-lg shadow-md space-y-4 md:space-y-6 max-w-4xl mx-auto"
          >
        {/* Request Type */}
        <div className="mb-6">
          <label htmlFor="requestType" className="block text-base text-blue-700 mb-2 border-b pb-2 font-bold">
            Request Type
          </label>
          <select
            id="requestType"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value as ApprovalRequestType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
            required
          >
            <option value="Leave">Leave</option>
            <option value="Expense">Expense</option>
            <option value="Appraisal">Appraisal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Request Details */}
        <div className="mb-6">
          <label htmlFor="requestDetails" className="block text-base text-blue-700  font-medium  mb-2">
            Request Details
          </label>
          <textarea
            id="requestDetails"
            value={requestDetails}
            onChange={(e) => setRequestDetails(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
            placeholder="Provide details about your request"
            required
          />
        </div>

        {/* Type-Specific Fields */}
        {requestType === 'Leave' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Leave Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div>
                <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>
                <select
                  id="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  required
                >
                  <option value="Sick">Sick</option>
                  <option value="Casual">Casual</option>
                  <option value="Annual">Annual</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  required
                />
              </div>

              {/* Reason */}
              <div className="sm:col-span-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  placeholder="Provide a reason for your leave"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {requestType === 'Expense' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Expense Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Currency */}
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  {/* Add more currencies as needed */}
                </select>
              </div>

              {/* Expense Category */}
              <div>
                <label htmlFor="expenseCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Category
                </label>
                <select
                  id="expenseCategory"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  required
                >
                  <option value="Travel">Travel</option>
                  <option value="Meals">Meals</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Receipt */}
              <div className="sm:col-span-2">
                <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt
                </label>
                <input
                  type="file"
                  id="receipt"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-lemonGreen-light file:text-white hover:file:bg-lemonGreen-dark"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {requestType === 'Appraisal' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Appraisal Details</h3>
            
            {/* Appraisal Period and Comments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="appraisalPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                  Appraisal Period
                </label>
                <select
                  id="appraisalPeriod"
                  value={appraisalPeriod}
                  onChange={(e) => setAppraisalPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  required
                >
                  <option value="">Select Appraisal Period</option>
                  {appraisalPeriodOptions.map((period) => (
                    <option key={period.value} value={period.value}>{period.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="appraisalComments" className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  id="appraisalComments"
                  value={appraisalComments}
                  onChange={(e) => setAppraisalComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  placeholder="Provide comments or goals for the appraisal"
                  required
                />
              </div>
            </div>

            {/* Appraisal Questions */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">Questions</h4>
              {loadingQuestions ? (
                <p>Loading questions...</p>
              ) : questionsData ? (
                questionsData.map((question: IAppraisalQuestion) => (
                  <div key={question._id} className="mb-4">
                    <label className="block text-gray-700 font-medium">{question.question_text}</label>
                    {question.question_type === 'Text' && (
                      <textarea
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        placeholder="Enter your answer"
                        onChange={(e) => setAppraisalResponses({
                          ...appraisalResponses,
                          [question._id]: e.target.value,
                        })}
                        required
                      />
                    )}
                    {question.question_type === 'Rating' && (
                      <input
                        type="number"
                        min="1"
                        max={5} // adjust based on your max rating
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        onChange={(e) => setAppraisalResponses({
                          ...appraisalResponses,
                          [question._id]: e.target.value,
                        })}
                        required
                      />
                    )}
                    {question.question_type === 'Multiple Choice' && (
                      <select
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        onChange={(e) => setAppraisalResponses({
                          ...appraisalResponses,
                          [question._id]: e.target.value,
                        })}
                        required
                      >
                        <option value="">Select an option</option>
                        {question.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))
              ) : (
                <p>No questions available.</p>
              )}
            </div>

            {/* Appraisal Metrics */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">Additional Metrics</h4>
              {loadingMetrics ? (
                <p>Loading metrics...</p>
              ) : metricsData ? (
                metricsData.map((metric: IAppraisalMetric) => (
                  <div key={metric._id} className="mb-4">
                    <label className="block text-gray-700 font-medium">{metric.metric_name}</label>
                    <p className="text-sm text-gray-500">{metric.description}</p>
                    <input
                      type="number"
                      min="1"
                      max={metric.scale || 5} // Adjust based on scale
                      placeholder={`Rate from 1 to ${metric.scale || 5}`}
                      className="w-full px-3 py-2 border rounded-md shadow-sm"
                      onChange={(e) => setAdditionalMetrics({
                        ...additionalMetrics,
                        [metric._id]: Number(e.target.value),
                      })}
                      required
                    />
                  </div>
                ))
              ) : (
                <p>No metrics available.</p>
              )}
            </div>
          </div>
        )}

        {requestType === 'Other' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Other Request Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Define other-specific fields here */}
              <div className="sm:col-span-2">
                <label htmlFor="otherDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  id="otherDetails"
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lemonGreen-light focus:border-lemonGreen-light"
                  placeholder="Provide details for your request"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Approvers */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Approvers</h3>
          {approvers.map((approver, index) => (
            <div key={index} className="mb-4">
              <SingleSelect
                label={`Approver ${index + 1}`}
                options={approverOptions}
                value={approver}
                onChange={(value) => handleApproverChange(index, value)}
                placeholder="Select an approver"
                isDisabled={isFetchingUsers}
                required={true} // Passed as a prop
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddApprover}
            className="text-lemonGreen-dark hover:text-lemonGreen-light text-sm font-medium"
          >
            + Add another approver
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-lemonGreen-light text-white text-sm font-semibold rounded-md shadow hover:bg-lemonGreen-dark focus:outline-none focus:ring-2 focus:ring-lemonGreen-light disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>

      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </div>
  );
};

export default CreateApprovalRequest;
